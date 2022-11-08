import {Component, OnInit} from '@angular/core';
import {RequestPowerWorkStationDto, ResponseWorkStationPowerAnaliseWithDate, WorkStationPowerDto} from '../../../../dto/analysis/power-consumption/power-consumption-anal';
import {PowerConsumptionService} from '../../../../services/dto-services/power-consumption/power-consumption-service';
import {UtilitiesService} from '../../../../services/utilities.service';
import {LoaderService} from '../../../../services/shared/loader.service';
import * as moment from 'moment';
import {ConvertUtil} from '../../../../util/convert-util';
import { AppStateService } from 'app/services/dto-services/app-state.service';

@Component({
  templateUrl: './workstation-power-analysis.html'
})
export class WorkstationPowerAnalysisComponent implements OnInit {

  myItems: Array<WorkStationPowerDto>;

  item: ResponseWorkStationPowerAnaliseWithDate;
  filterCon = new RequestPowerWorkStationDto();


  selectedWorkStations = [];
  cols = [
    {field: 'date', header: 'date'},
    {field: 'power', header: 'power'},
    {field: 'cost', header: 'cost'}
  ];
  plantId: any;


  constructor(private powerService: PowerConsumptionService, private appStateService: AppStateService,
     private utilities: UtilitiesService, private loaderService: LoaderService) {
    this.appStateService.plantAnnounced$.subscribe(res => {
      if (!(res)) {
       this.plantId = null;
      } else {
        this.plantId = res.plantId;
      }
    });
  }

  exportAsPng(printSectionId: string) {
    this.utilities.exportAsPng(printSectionId);
  }


  setSelectedWorkStation(event) {
    if (event && event.hasOwnProperty('workStationId')) {
      this.filterCon.workStationId = event.workStationId;
    } else {
      this.filterCon.workStationId = null;
    }

  }

  analyze() {
    this.loaderService.showLoader();
    const temp = Object.assign({}, this.filterCon);

    const ofset = moment().utcOffset();

    temp.startDate = moment(this.filterCon.startDate).add(ofset, 'minutes').toDate();
    temp.endDate = moment(this.filterCon.endDate).add(ofset, 'minutes').toDate();

    this.powerService.filterWorkStationPowerConsumption(temp).then(res => {
      this.myItems = res['workStationPowerDtos'] as WorkStationPowerDto[];
      if (this.myItems && this.myItems.length > 0) {

        this.normalize(this.myItems);

        this.myItems.push({date: 'TOTAL', cost:  ConvertUtil.fix(res['totalCost'], 2), power: ConvertUtil.fix(res['totalPower'], 2)});
      }
      this.loaderService.hideLoader();
    }).catch(error => {
      this.myItems = [];
      this.utilities.showErrorToast(error);
      this.loaderService.hideLoader();
    });
  }

  ngOnInit(): void {
    // this.filterCon.endDate = new Date();
  }

  normalize(myItems) {
    if (!myItems) {
      return;
    }
    myItems.forEach(item => {
      item.power = ConvertUtil.fix(item.power, 2);
      item.cost = ConvertUtil.fix(item.cost, 2);
    });
  }


}
