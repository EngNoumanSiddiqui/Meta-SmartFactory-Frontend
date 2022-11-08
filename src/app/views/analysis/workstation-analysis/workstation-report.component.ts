import {Component, OnInit, OnDestroy} from '@angular/core';
import {StopService} from '../../../services/dto-services/stop/stop.service';
import {UtilitiesService} from '../../../services/utilities.service';
import {LoaderService} from '../../../services/shared/loader.service';
import {WorkstationService} from '../../../services/dto-services/workstation/workstation.service';
import {RequestWorkstationReportDetailDto, ResponseWorkstationReportAvgDto, ResponseWorkstationReportDto} from '../../../dto/analysis/daily-report/workstation-order-report';
import {ConvertUtil} from '../../../util/convert-util';
import * as moment from 'moment';
import { AppStateService } from 'app/services/dto-services/app-state.service';

import { Subscription } from 'rxjs';

@Component({
  templateUrl: './workstation-report.html',
  styleUrls: ['./workstation-report.component.scss']
})
export class WorkstationReportComponent implements OnInit, OnDestroy {

  myItems: Array<ResponseWorkstationReportDto>;
  myAvgItems: Array<ResponseWorkstationReportAvgDto> = [];
  myAvgOriginalItems: Array<ResponseWorkstationReportAvgDto> = [];
  myOriginalItems: Array<ResponseWorkstationReportDto>;
  myStops;
  firstLoad = true;
  chartModal = {
    active: false,
    data: null
  };

  filterCon = {
    workstationId: null,
    startDate: null,
    endDate: null,
  }

  selectedWorkStations = [];

  colsAvg = [
    {field: 'workstationId', header: 'workstation-id'},
    {field: 'type', header: 'type'},
    {field: 'netWorkingTimeAvg', header: 'net-working-time'},
    {field: 'runningTimeAvg', header: 'running-time'},
    {field: 'preparingTimeAvg', header: 'preparing-time'},
    {field: 'timeEfficiencyAvg', header: 'time-efficiency'},
    {field: 'powerConsumptionAvg', header: 'power-consumption'},
    {field: 'powerCostAvg', header: 'power-cost'},
    {field: 'jobWaitingTimeAvg', header: 'job-waiting-time'},
    {field: 'capacityEfficiencyAvg', header: 'capacity-efficiency'},
    {field: 'machineOccupancyAvg', header: 'machine-occupancy'}
  ];

  cols = [
    {field: 'workstationId', header: 'workstation-id'},
    {field: 'shiftId', header: 'shift-id'},
    {field: 'shiftStartDate', header: 'shift-start'},
    {field: 'shiftEndDate', header: 'shift-end'},
    {field: 'jobWaitingTime', header: 'job-waiting-time'},
    {field: 'netWorkingTime', header: 'net-working-time'},
    {field: 'powerConsumption', header: 'power-consumption'},
    {field: 'powerCost', header: 'power-cost'},
    {field: 'timeEfficiency', header: 'time-efficiency'},
    {field: 'capacityEfficiency', header: 'capacity-efficiency'},
    {field: 'machineOccupancy', header: 'machine-occupancy'}
  ];
  plantId: any;
  sub: Subscription;


  constructor(private _stopSvc: StopService, private workstationSvc: WorkstationService,
    private appStateService: AppStateService,
              private utilities: UtilitiesService, private loaderService: LoaderService) {
               this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
                  if (!(res)) {
                   this.plantId = null;
                  } else {
                    this.plantId = res.plantId;
                  }
                });

  }


  ngOnInit() {
    // this.filterCon.endDate = new Date();
  }

  ngOnDestroy() {
    this.sub.unsubscribe()
  }

  exportAsPng(printSectionId: string) {
    this.utilities.exportAsPng(printSectionId);
  }


  setSelectedWorkStation(event) {
    if (event && event.hasOwnProperty('workStationId')) {
      this.filterCon.workstationId = event.workStationId;
    } else {
      this.filterCon.workstationId = null;
    }

  }

  analyze() {
    this.firstLoad = false;
    this.loaderService.showLoader();
    const temp = Object.assign({}, this.filterCon);
    temp.startDate = ConvertUtil.localDateShiftAsUTC(this.filterCon.startDate);
    temp.endDate = moment(this.filterCon.endDate).endOf('day').toDate()
    temp.endDate = ConvertUtil.localDateShiftAsUTC(temp.endDate);

    this.myAvgItems = [];
    this.myAvgOriginalItems = [];

    this.workstationSvc.filterWorkstationReport(temp).then(res => {
      this.myOriginalItems = res as ResponseWorkstationReportDto[];
      this.normalizeValues(this.myOriginalItems);
      this.loaderService.hideLoader();
    }).catch(error => {
      this.myOriginalItems = [];
      this.myItems = [];
      this.myAvgItems = [];
      this.myAvgOriginalItems = [];
      this.utilities.showErrorToast(error);
      this.loaderService.hideLoader();
    });
    this._stopSvc.customsStops(temp).then(res => {
      this.myStops = res;
    }).catch(err => {
      this.myStops = [];
      this.utilities.showErrorToast(err);
    });

    {
      // get Avg. Curr Ws Report Between Dates.
      const tempRequestCurrentWsBetweenDates = Object.assign({}, this.filterCon);

      this.workstationSvc.getWorkstationReportAvg(tempRequestCurrentWsBetweenDates).then(res => {
        const avgItem = res as ResponseWorkstationReportAvgDto;
        avgItem.type = 'Avg. Curr. Ws BetWeen Dates';
        this.myAvgOriginalItems.push(Object.assign({}, avgItem));
        this.normalizeAvgValues(avgItem);
        this.myAvgItems.push(avgItem);
      }).catch(err => {
        const myAvgItems = [];
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(err);
      });
    }

    // current ws average from beginnin to now.
    {
      const tempRequesCurrentWsTillEnd = Object.assign({}, this.filterCon);
      tempRequesCurrentWsTillEnd.endDate = moment(moment.now()).endOf('day').toDate();
      this.workstationSvc.getWorkstationReportAvg(tempRequesCurrentWsTillEnd).then(res => {
        const avgItem = res as ResponseWorkstationReportAvgDto;
        avgItem.type = 'Avg. Curr. Ws Till Now';
        this.myAvgOriginalItems.push(Object.assign({}, avgItem));
        this.normalizeAvgValues(avgItem);
        this.myAvgItems.push(avgItem);
      }).catch(err => {
        const myAvgItems = [];
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(err);
      });
    }

    {
      const tempRequesAllWsBetweenDates = Object.assign({}, this.filterCon);
      tempRequesAllWsBetweenDates.workstationId = null;
      this.workstationSvc.getWorkstationReportAvg(tempRequesAllWsBetweenDates).then(res => {
        const avgItem = res as ResponseWorkstationReportAvgDto;
        avgItem.type = 'Avg. All Ws BetWeen Dates';
        this.myAvgOriginalItems.push(Object.assign({}, avgItem));
        this.normalizeAvgValues(avgItem);
        this.myAvgItems.push(avgItem);
      }).catch(err => {
        const myAvgItems = [];
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(err);
      });
    }
    {
      const tempRequesAllWsTillEnd = Object.assign({}, this.filterCon);
      tempRequesAllWsTillEnd.workstationId = null;
      tempRequesAllWsTillEnd.endDate = moment(moment.now()).endOf('day').toDate();
      this.workstationSvc.getWorkstationReportAvg(tempRequesAllWsTillEnd).then(res => {
        const avgItem = res as ResponseWorkstationReportAvgDto;
        avgItem.type = 'Avg. All Ws. Till Now';
        this.myAvgOriginalItems.push(Object.assign({}, avgItem));
        this.normalizeAvgValues(avgItem);
        this.myAvgItems.push(avgItem);
      }).catch(err => {
        const myAvgItems = [];
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(err);
      });
    }
  }

  normalizeAvgValues(res: ResponseWorkstationReportAvgDto) {

    const ofset = moment().utcOffset();

    // item.shiftStartDate = ConvertUtil.localDate2UTC(item.shiftStartDate);
    // item.shiftEndDate = ConvertUtil.localDate2UTC(item.shiftEndDate);
    res.netWorkingTimeAvg = this.getReadableTime(res.netWorkingTimeAvg * 1000);
    res.runningTimeAvg = this.getReadableTime(res.runningTimeAvg * 1000);
    res.preparingTimeAvg = this.getReadableTime(res.preparingTimeAvg * 1000);
    res.timeEfficiencyAvg = this.getPercentage(res.timeEfficiencyAvg);
    res.powerConsumptionAvg = ConvertUtil.fix(res.powerConsumptionAvg, 4);
    res.powerCostAvg = ConvertUtil.fix(res.powerCostAvg, 2);
    res.jobWaitingTimeAvg = this.getReadableTime(res.jobWaitingTimeAvg * 1000);
    res.capacityEfficiencyAvg = this.getPercentage(res.capacityEfficiencyAvg);
    res.machineOccupancyAvg = this.getPercentage(res.machineOccupancyAvg);
  }

  normalizeValues(res: ResponseWorkstationReportDto[]) {
    this.myItems = res.map(obj => ({...obj}));
    const me = this;
    this.myItems.map(item => {
      //item.shiftStartDate = ConvertUtil.localDateShiftAsUTC(item.shiftStartDate);
      // item.shiftEndDate = ConvertUtil.localDate2UTC(item.shiftEndDate);
      item.netWorkingTime = me.getReadableTime(item.netWorkingTime * 1000);
      item.jobWaitingTime = me.getReadableTime(item.jobWaitingTime * 1000);
      item.capacityEfficiency = me.getPercentage(item.capacityEfficiency);
      item.timeEfficiency = me.getPercentage(item.timeEfficiency);
      item.powerCost = ConvertUtil.fix(item.powerCost, 2);
      item.machineOccupancy = me.getPercentage(item.machineOccupancy);
      item.powerConsumption = ConvertUtil.fix(item.powerConsumption, 4);
    });
  }

  getReadableTime(time) {
    return ConvertUtil.longDuration2DHHMMSSTime(time)
  }

  getPercentage(val) {
    if (val) {
      return (val * 100).toFixed(2) + '%';
    }
    return '';
  }

  isLoading() {
    return this.loaderService.isLoading();
  }

  showWorkstationReportDetail(data: ResponseWorkstationReportDto) {

    const filt: RequestWorkstationReportDetailDto = Object.assign({}, data);
    this.chartModal.active = true;
    this.chartModal.data = filt;

  }

}
