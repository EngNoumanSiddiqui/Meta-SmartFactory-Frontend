import {Component, OnInit} from '@angular/core';
import {OeeService} from '../../../services/dto-services/oee/oee-service';
import {UtilitiesService} from '../../../services/utilities.service';
import {LoaderService} from '../../../services/shared/loader.service';
import {TranslateService} from '@ngx-translate/core';
import * as moment from 'moment';
import {OeeAverageReport, RequestOeeDateIntervalDto, ResponseOeeDataIntervalDto} from '../../../dto/oee/oee.model';
import {ConvertUtil} from '../../../util/convert-util';
import {DatePipe} from '@angular/common';
import { AppStateService } from 'app/services/dto-services/app-state.service';


@Component({
  templateUrl: './oee-analysis.html',
  styleUrls: ['./oee.scss']
})
export class OeeAnalysisComponent implements OnInit {
  oee1Data: any;
  oee2Data: any;
  teepData: any;
  qualityData: any;
  availabilityData: any;
  actualPerformanceData: any;
  workPerformanceData: any;
  options: any;
  qualityOptions:any;
  myItems: Array<ResponseOeeDataIntervalDto>;
  avgItems: Array<OeeAverageReport>;
  myOriginalItems: Array<ResponseOeeDataIntervalDto>;
  selectedWorkStationName;

  averageCurntWsOeeBetweenDate: OeeAverageReport;
  averageCurntWsOeeTillEndDate: OeeAverageReport;
  averageAllWsOeeBetweenDate: OeeAverageReport;
  averageAllWsOeeTillEndDate: OeeAverageReport;
  // workstation for result returned
  validWorkstation: any;

  display = false;
  filterCon: RequestOeeDateIntervalDto = {
    rangeStart: ConvertUtil.date2StartOfDay(new Date()),
    rangeEnd: new Date(),
    workstationId: null,
    pageNumber: 1,
    pageSize: 90,

  };

  availability = 'Availability';
  performance = 'Performance';
  quality = 'Quality';
  actualPerformance = 'Actual Performance';
  workPerformance = 'Work Performance';

  chartModal = {
    active: false,
    data: null
  };

  selectedOees = [];
  selectedOeeAvgs = [];
  cols = [
    // {field: 'recordDate', header: 'record-date'},
    {field: 'workstationId', header: 'workstation-id'},
    {field: 'shiftId', header: 'shift-id'},
    {field: 'shiftStartDate', header: 'shift-start'},
    {field: 'availability', header: 'availability'},
    {field: 'quality', header: 'quality'},
    {field: 'actualPerformance', header: 'actual-performance'},
    {field: 'workPerformance', header: 'worked-performance'},
    {field: 'oee1', header: 'OEE1'},
    {field: 'oee2', header: 'OEE2'},
    {field: 'teep', header: 'TEEP'},
    {field: 'hiddenFactory', header: 'hidden-factory'},
    {field: 'utilization', header: 'utilization'},
    {field: 'fullyProductiveTime', header: 'fully-productive-time'},
  ];


  avgCols = [
    {field: 'workstationId', header: 'workstation-id'},
    // {field: 'shiftStartDate', header: 'shift-start'},
    {field: 'type', header: 'type'},
    {field: 'availability', header: 'availability'},
    {field: 'quality', header: 'quality'},
    {field: 'oee1', header: 'OEE1'},
    {field: 'oee2', header: 'OEE2'},
    {field: 'teep', header: 'TEEP'},
    {field: 'hiddenFactory', header: 'hidden-factory'},
    {field: 'utilization', header: 'utilization'},
    {field: 'fullyProductiveTime', header: 'fully-productive-time'},
    {field: 'actualPerformance', header: 'actual-performance'},
    {field: 'workPerformance', header: 'worked-performance'}
  ];
  plantId: any;

  constructor(private utilities: UtilitiesService, private loader: LoaderService,
     private datePipe: DatePipe, private appStateService: AppStateService,
              private _oeeSvc: OeeService, private translate: TranslateService) {
                this.appStateService.plantAnnounced$.subscribe(res => {
                  if (!(res)) {
                   this.plantId = null;
                  } else {
                    this.plantId = res.plantId;
                  }
                });
    const me = this;
    this.translate.get('availability').subscribe(res => {
      me.availability = res;
    });
    this.translate.get('performance').subscribe(res => {
      me.performance = res;
    });
    this.translate.get('quality').subscribe(res => {
      me.quality = res;
    })

  }

  exportAsPng(printSectionId: string) {
    this.utilities.exportAsPng(printSectionId);
  }

  ngOnInit(): void {
    this.resetChart();
    this.defaultGraphOptions();
    this.qualityGraphOptions();
  }

  defaultGraphOptions(){
    this.options = {
      elements: {
        line: {
          tension: 0 // disables bezier curves
        }
      },
      fill: false,
      responsive: true,
      scales: {
        xAxes: [{
          display: true,
          ticks: {
            autoSkip: false,
            maxRotation: 90,
            minRotation: 30
          },

        }],
        yAxes: [
          {
            position: "left",
            id: "y-axis-1",
            ticks: {
              beginAtZero: true,
            },
            display: true,
            scaleLabel: {
              display: true,
              labelString: '%',
            }
          }
      ]
      },
      legend: {
        display: true,
        position: 'top',
        labels: {
          fontColor: '#000000',
        }
      },

    };
  }

  qualityGraphOptions(){
    this.qualityOptions = {
      elements: {
        line: {
          tension: 0 // disables bezier curves
        }
      },
      fill: false,
      responsive: true,
      scales: {
        xAxes: [{
          display: true,
          ticks: {
            autoSkip: false,
            maxRotation: 90,
            minRotation: 30
          },

        }],
        yAxes: [
          {
            position: "left",
            id: "y-axis-1",
            ticks: {
              beginAtZero: true,
            },
            display: true,
            scaleLabel: {
              display: true,
              labelString: '%',
            }
          },
          {
            position: "right",
            id: "y-axis-2",
            ticks: {
              beginAtZero: true,
            },
            display: true,
            scaleLabel: {
              display: true,
              labelString: '%',
            }
          }
      ]
      },
      legend: {
        display: true,
        position: 'top',
        labels: {
          fontColor: '#000000',
        }
      },

    };
  }

  private resetChart() {
    this.myOriginalItems = null;
    this.averageCurntWsOeeBetweenDate = null;
    this.averageCurntWsOeeTillEndDate = null;
    this.averageAllWsOeeBetweenDate = null;
    this.averageAllWsOeeTillEndDate = null;
    this.oee1Data = null;
    this.oee2Data = null;
    this.qualityData = null;
    this.availabilityData = null;
    this.actualPerformanceData = null;
    this.workPerformanceData = null;
    this.teepData = null;
    this.myItems = [];
    this.avgItems = [];
  }

  isLoading() {
    return this.loader.isLoading();
  }

  analyze() {
    this.loader.showLoader();
    this.resetChart();
    this.validWorkstation = this.selectedWorkStationName;

    const temp = Object.assign({}, this.filterCon);
    // //set end time to 23:59:59 of selected day.
    // temp.rangeEnd = moment(temp.rangeEnd).endOf('day').toDate();
    // temp.rangeStart = ConvertUtil.localDateShiftAsUTC(temp.rangeStart);
    // temp.rangeEnd = ConvertUtil.localDateShiftAsUTC(temp.rangeEnd);
    let count = 0;

    // ******************** Get  oee log report  of Selected Workstation between selected Date***********/
    this._oeeSvc.getOeeBetweenDate(temp).then(result => {
      this.myOriginalItems = result['content'] as ResponseOeeDataIntervalDto[];
      count++;
      if ((count >= 5)) {
        this.initializeItems(this.myOriginalItems, this.averageCurntWsOeeBetweenDate, this.averageCurntWsOeeTillEndDate, this.averageAllWsOeeBetweenDate, this.averageAllWsOeeTillEndDate);
      }
    }).catch(error => {
      count++;
      this.myOriginalItems = [];
      this.myItems = [];
      this.loader.hideLoader();
      this.utilities.showErrorToast(error)
    });
    // ********************************************************************************/

    // ******************** Get Average of Selected Workstation between selected Date/
    this._oeeSvc.getAverageOeeReport(temp).then(result => {
      this.averageCurntWsOeeBetweenDate = result as OeeAverageReport;
      // set overall tab values.
      const clone = Object.assign({}, this.averageCurntWsOeeBetweenDate);
      this.normalizeAvgValues(clone);
      clone['type'] = 'Avg. Curr. Ws';
      clone.workstationId = this.filterCon.workstationId;

      this.avgItems.push(clone);

      count++;
      if ((count >= 5)) {
        this.initializeItems(this.myOriginalItems, this.averageCurntWsOeeBetweenDate, this.averageCurntWsOeeTillEndDate, this.averageAllWsOeeBetweenDate, this.averageAllWsOeeTillEndDate);
      }
    }).catch(error => {
      count++;
      this.averageCurntWsOeeBetweenDate = null;
      this.loader.hideLoader();
      this.utilities.showErrorToast(error)
    });
    /********************************************************************************/

    // ******************** Get Average of Selected Workstation From Beginning to Till EndDate/
    const filterAverageCurntWsOeeTillEndDate = Object.assign({}, temp);
    filterAverageCurntWsOeeTillEndDate.workstationId = null;
    this._oeeSvc.getAverageOeeReport(filterAverageCurntWsOeeTillEndDate).then(result => {
      this.averageCurntWsOeeTillEndDate = result as OeeAverageReport;
      // set overall tab values.
      const clone = Object.assign({}, this.averageCurntWsOeeTillEndDate);
      this.normalizeAvgValues(clone);
      clone['type'] = 'Avg. Curr. Ws Till End';
      clone.workstationId = this.filterCon.workstationId;
      this.avgItems.push(clone);

      count++;
      if ((count >= 5)) {
        this.initializeItems(this.myOriginalItems, this.averageCurntWsOeeBetweenDate, this.averageCurntWsOeeTillEndDate, this.averageAllWsOeeBetweenDate, this.averageAllWsOeeTillEndDate);
      }
    }).catch(error => {
      count++;
      this.averageCurntWsOeeTillEndDate = null;
      this.loader.hideLoader();
      this.utilities.showErrorToast(error)
    });
    /********************************************************************************/

    // ******************** Get Average of all Workstation between selected Date/
    const filterAverageAllWsOeeBetweenDate = Object.assign({}, temp);
    filterAverageAllWsOeeBetweenDate.workstationId = null;

    this._oeeSvc.getAverageOeeReport(filterAverageAllWsOeeBetweenDate).then(result => {
      this.averageAllWsOeeBetweenDate = result as OeeAverageReport;
      const clone = Object.assign({}, this.averageAllWsOeeBetweenDate);
      this.normalizeAvgValues(clone);
      clone['type'] = 'Avg. All. Ws Between Dates';
      this.avgItems.push(clone);
      count++;
      if (count >= 5) {
        this.initializeItems(this.myOriginalItems, this.averageCurntWsOeeBetweenDate, this.averageCurntWsOeeTillEndDate, this.averageAllWsOeeBetweenDate, this.averageAllWsOeeTillEndDate);
      }
    }).catch(error => {
      count++;
      this.averageAllWsOeeBetweenDate = null;
      this.loader.hideLoader();
      this.utilities.showErrorToast(error)
    });
    /**********************************************************************/

    // ******************** Get Average of all Workstation from beginning to till selected End Date/
    const filterAverageAllWsOeeTillEndDate = Object.assign({}, temp);
    filterAverageAllWsOeeTillEndDate.workstationId = null;
    filterAverageAllWsOeeTillEndDate.rangeStart = null;

    this._oeeSvc.getAverageOeeReport(filterAverageAllWsOeeTillEndDate).then(result => {
      this.averageAllWsOeeTillEndDate = result as OeeAverageReport;

      const clone = Object.assign({}, this.averageAllWsOeeTillEndDate);
      this.normalizeAvgValues(clone);
      clone['type'] = 'Avg. All. Ws Till End';
      this.avgItems.push(clone);

      count++;
      if (count >= 5) {
        this.initializeItems(this.myOriginalItems, this.averageCurntWsOeeBetweenDate, this.averageCurntWsOeeTillEndDate, this.averageAllWsOeeBetweenDate, this.averageAllWsOeeTillEndDate);
      }
    }).catch(error => {
      count++;
      this.averageAllWsOeeTillEndDate = null;
      this.loader.hideLoader();
      this.utilities.showErrorToast(error)
    });
    /**********************************************************************/

  }

  private normalizeAvgValues(res: any) {
    res.availability = this.getPercentage(res.availability);
    res.quality = this.getPercentage(res.quality);
    res.oee1 = this.getPercentage(res.oee1);
    res.oee2 = this.getPercentage(res.oee2);
    res.actualPerformance = this.getPercentage(res.actualPerformance);
    res.workPerformance = this.getPercentage(res.workPerformance);
    res.teep = this.getPercentage(res.teep);
    res.utilization = this.getPercentage(res.utilization);
    res.fullyProductiveTime = this.getReadableTime(res.fullyProductiveTime * 1000); // server returns in millisecond format.
    res.hiddenFactory = this.getReadableTime(res.hiddenFactory);
  }

  initializeItems(items: Array<ResponseOeeDataIntervalDto>, averageCurntWsOeeBetweenDate: OeeAverageReport,
                  averageCurntWsOeeTillEndDate: OeeAverageReport, averageAllWsOeeBetweenDate: OeeAverageReport,
                  averageAllWsOeeTillEndDate: OeeAverageReport) {
    this.loader.hideLoader();
    if (!items || items.length === 0) {
      this.utilities.showInfoToast('OEE-NOT-FOUND');
      return;
    }
    this.myItems = this.normalizeValues(items);
    this.initializeChart(items, averageCurntWsOeeBetweenDate, averageCurntWsOeeTillEndDate, averageAllWsOeeBetweenDate, averageAllWsOeeTillEndDate);
  }

  normalizeValues(res: ResponseOeeDataIntervalDto[]) {
    const myItems = res.map(obj => ({...obj}));

    const me = this;
    myItems.map(item => {
      item.plannedProductionTime = me.getReadableTime(item.plannedProductionTime * 1000);
      item.fullyProductiveTime = me.getReadableTime(item.fullyProductiveTime * 1000);
      item.standByTime = me.getReadableTime(item.standByTime * 1000);
      item.plannedStopDurationInStandby = me.getReadableTime(item.plannedStopDurationInStandby * 1000);
      item.runningTime = me.getReadableTime(item.runningTime * 1000);
      item.unplannedStopDurationInStandby = me.getReadableTime(item.unplannedStopDurationInStandby * 1000);

      item.workPerformance = me.getPercentage(item.workPerformance);
      item.actualPerformance = me.getPercentage(item.actualPerformance);
      item.availability = me.getPercentage(item.availability);
      item.quality = me.getPercentage(item.quality);
      item.teep = me.getPercentage(item.teep);
      item.oee1 = me.getPercentage(item.oee1);
      item.oee2 = me.getPercentage(item.oee2);
      item.utilization = me.getPercentage(item.utilization);
      item.hiddenFactory = me.getReadableTime(item.hiddenFactory);
    });
    return myItems;
  }

  getPercentage(val) {
    if (val) {
      return (val * 100).toFixed(2) + '%';
    }
    return '';
  }

  getPercentageVal(val) {
    if (val) {
      return (val * 100).toFixed(2);
    }
    return 0;
  }

  getReadableTime(time) {
    return ConvertUtil.longDuration2DHHMMSSTime(time)
  }

  initializeChart(items: Array<ResponseOeeDataIntervalDto>, averageCurntWsOeeBetweenDate: OeeAverageReport,
                  averageCurntWsOeeTillEndDate: OeeAverageReport, averageAllWsOeeBetweenDate: OeeAverageReport,
                  averageAllWsOeeTillEndDate: OeeAverageReport) {

    const me = this;

    const quality = [];
    const qualityAvgCurntWsBetweenDate = [];
    const qualityAvgCurntWsTillEndDate = [];
    const qualityAvgAllWsBetweenDate = [];
    const qualityAvgAllWsTillEndDate = [];
    const qualityProducedQuantiy = [];
    const qualityScrapQuantity = [];

    const actualPerformance = [];
    const actualPerformanceAvgCurntWsBetweenDate = [];
    const actualPerformanceAvgCurntWsTillEndDate = [];
    const actualPerformanceAvgAllWsTillEndDate = [];
    const actualPerforamnceAvgAllWsBetweenDate = [];

    const availability = [];
    const avaibilityAvgCurntWsBetweenDate = [];
    const avaibilityAvgCurntWsTillEndDate = [];
    const avaibilityAvgAllWsBetweenDate = [];
    const avaibilityAvgAllWsTillEndDate = [];

    const workPerformance = [];
    const workPerformanceAvgCurntWsBetweenDate = [];
    const workPerformanceAvgCurntWsTillEndDate = [];
    const workPerformanceAvgAllWsBetweenDate = [];
    const workPerformanceAvgAllWsTillEndDate = [];

    const teep = [];
    const teepAvgCurntWsBetweenDate = [];
    const teepAvgCurntWsTillEndDate = [];
    const teepAvgAllWsBetweenDate = [];
    const teepAvgAllWsTillEndDate = [];

    const oee1 = [];
    const oee1AvgCurntWsBetweenDate = [];
    const oee1AvgCurntWsTillEndDate = [];
    const oee1AvgAllWsBetweenDate = [];
    const oee1AvgAllWsTillEndDate = [];

    const oee2 = [];
    const oee2AvgCurntWsBetweenDate = [];
    const oee2AvgCurntWsTillEndDate = [];
    const oee2AvgAllWsBetweenDate = [];
    const oee2AvgAllWsTillEndDate = [];

    const lineLabels = [];

    items.forEach(item => {

      const formattedTime = this.datePipe.transform(new Date(item.rangeStart), 'dd.MM.yyyy HH:mm') + ' - '
        + this.datePipe.transform(new Date(item.rangeEnd), 'dd.MM.yyyy HH:mm')


      lineLabels.push(formattedTime);

      qualityProducedQuantiy.push(item.totaluantity);
      qualityScrapQuantity.push(item.scrapQuantity);

      me.assignValueToArray(item, quality, availability, oee1, oee2, teep, actualPerformance, workPerformance);

      me.assignValueToArray(averageCurntWsOeeBetweenDate, qualityAvgCurntWsBetweenDate, avaibilityAvgCurntWsBetweenDate,
        oee1AvgCurntWsBetweenDate, oee2AvgCurntWsBetweenDate, teepAvgCurntWsBetweenDate, actualPerformanceAvgCurntWsBetweenDate,workPerformanceAvgCurntWsBetweenDate );

      me.assignValueToArray(averageCurntWsOeeTillEndDate, qualityAvgCurntWsTillEndDate, avaibilityAvgCurntWsTillEndDate,
        oee1AvgCurntWsTillEndDate, oee2AvgCurntWsTillEndDate, teepAvgCurntWsTillEndDate, actualPerformanceAvgCurntWsTillEndDate,workPerformanceAvgCurntWsTillEndDate );

      me.assignValueToArray(averageAllWsOeeBetweenDate, qualityAvgAllWsBetweenDate, avaibilityAvgAllWsBetweenDate,
        oee1AvgAllWsBetweenDate, oee2AvgAllWsBetweenDate, teepAvgAllWsBetweenDate, actualPerforamnceAvgAllWsBetweenDate,workPerformanceAvgAllWsBetweenDate );

      me.assignValueToArray(averageAllWsOeeTillEndDate, qualityAvgAllWsTillEndDate, avaibilityAvgAllWsTillEndDate, oee1AvgAllWsTillEndDate,
        oee2AvgAllWsTillEndDate, teepAvgAllWsTillEndDate,actualPerformanceAvgAllWsTillEndDate, workPerformanceAvgAllWsTillEndDate);

    });

    this.qualityData = this.getDataSetItem(lineLabels, me.quality, quality, qualityAvgCurntWsBetweenDate, qualityAvgCurntWsTillEndDate,
      qualityAvgAllWsBetweenDate, qualityAvgAllWsTillEndDate, qualityProducedQuantiy, qualityScrapQuantity);

    this.availabilityData = this.getDataSetItem(lineLabels, me.availability, availability, avaibilityAvgCurntWsBetweenDate,
      avaibilityAvgCurntWsTillEndDate, avaibilityAvgAllWsBetweenDate, avaibilityAvgAllWsTillEndDate);

    this.actualPerformanceData = this.getDataSetItem(lineLabels, me.actualPerformance, actualPerformance, actualPerformanceAvgCurntWsBetweenDate,
      actualPerformanceAvgCurntWsTillEndDate, actualPerforamnceAvgAllWsBetweenDate, actualPerformanceAvgAllWsTillEndDate);
    this.workPerformanceData = this.getDataSetItem(lineLabels, me.workPerformance, workPerformance, workPerformanceAvgCurntWsBetweenDate,
      workPerformanceAvgCurntWsTillEndDate, workPerformanceAvgAllWsBetweenDate, workPerformanceAvgAllWsTillEndDate);

    this.oee1Data = this.getDataSetItem(lineLabels, 'OEE1', oee1, oee1AvgCurntWsBetweenDate, oee1AvgCurntWsTillEndDate, oee1AvgAllWsBetweenDate, oee1AvgAllWsTillEndDate);
    this.oee2Data = this.getDataSetItem(lineLabels, 'OEE2', oee2, oee2AvgCurntWsBetweenDate, oee2AvgCurntWsTillEndDate, oee2AvgAllWsBetweenDate, oee2AvgAllWsTillEndDate);
    this.teepData = this.getDataSetItem(lineLabels, 'TEEP', teep, teepAvgCurntWsBetweenDate, teepAvgCurntWsTillEndDate, teepAvgAllWsBetweenDate, teepAvgAllWsTillEndDate);

  }

  assignValueToArray(data: OeeAverageReport, qualityArray, avaibilityArray, oee1Array, oe2Array, teepArray, actualPeformanceArray, workPerformanceArray) {
    if (data) {
      qualityArray.push(this.getPercentageVal(data.quality));
      avaibilityArray.push(this.getPercentageVal(data.availability));
      oee1Array.push(this.getPercentageVal(data.oee1));
      oe2Array.push(this.getPercentageVal(data.oee2));
      teepArray.push(this.getPercentageVal(data.teep));
      actualPeformanceArray.push(this.getPercentageVal(data.actualPerformance));
      workPerformanceArray.push(this.getPercentageVal(data.workPerformance));
    }
  }

  setSelectedWorkStation(event) {
    if (event && event.hasOwnProperty('workStationId')) {
      this.filterCon.workstationId = event.workStationId;
      this.selectedWorkStationName = event.workStationName;
    } else {
      this.selectedWorkStationName = null;
    }
  }


  showWorkstationReportDetail(data: ResponseOeeDataIntervalDto) {

    const filt: RequestOeeDateIntervalDto = {
      workstationId: data.workstationId,
      rangeEnd: data.rangeEnd,
      rangeStart: data.rangeStart,
      shiftId: data.shiftId,
      pageNumber: 1,
      pageSize: 30,
    }
    this.chartModal.active = true;
    this.chartModal.data = filt;

  }

  private getDataSetItem(lineLabels, label1, data1, avgCurntWsDataBetweenDate, avgCurntWsDataTillEndDate, avgAllWsDataBetweenDate, avgAllWsDataTillEndDate, qualityProducedQuantiy=null, qualityScrapQuantity=null) {

    let data: any;

    if(label1 === 'Quality'){
      data =  {
        labels: lineLabels,
        datasets: [
          {
            yAxisID: "y-axis-1",
            label: label1,
            fill: false,
            pointStyle: 'triangle',
            borderColor: '#0fb41d',
            pointBorderWidth: 3,
            data: data1
          }, {
            yAxisID: "y-axis-1",
            label: 'AVG Curnt. Ws. Btw. Date',
            pointStyle: 'rect',
            fill: false,
            pointBorderWidth: 1,
            borderColor: '#ff9c3d',
            data: avgCurntWsDataBetweenDate
          }, {
            yAxisID: "y-axis-1",
            label: 'AVG Curnt. Ws. Till End Date',
            pointStyle: 'rect',
            fill: false,
            pointBorderWidth: 1,
            borderColor: '#9e76ff',
            data: avgCurntWsDataTillEndDate
          }, {
            yAxisID: "y-axis-1",
            label: 'AVG All Ws Btw. Date.',
            pointStyle: 'rect',
            fill: false,
            pointBorderWidth: 1,
            borderColor: '#51c6ff',
            data: avgAllWsDataBetweenDate
          }, {
            yAxisID: "y-axis-1",
            label: 'AVG All Ws. Till End Date',
            pointStyle: 'rect',
            fill: false,
            pointBorderWidth: 1,
            borderColor: '#ff7b6a',
            data: avgAllWsDataTillEndDate
          }, {
            yAxisID: "y-axis-2",
            label: 'Produced Quantity',
            pointStyle: 'rect',
            fill: false,
            pointBorderWidth: 1,
            borderColor: '#6f42c1',
            data: qualityProducedQuantiy
          }, {
            yAxisID: "y-axis-2",
            label: 'Scrap Quantity',
            pointStyle: 'rect',
            fill: false,
            pointBorderWidth: 1,
            borderColor: '#11316a',
            data: qualityScrapQuantity
          }
        ]
      }
    }else{
      data =  {
        labels: lineLabels,
        datasets: [
          {
            yAxisID: "y-axis-1",
            label: label1,
            fill: false,
            pointStyle: 'triangle',
            borderColor: '#0fb41d',
            pointBorderWidth: 3,
            data: data1
          }, {
            yAxisID: "y-axis-1",
            label: 'AVG Curnt. Ws. Btw. Date',
            pointStyle: 'rect',
            fill: false,
            pointBorderWidth: 1,
            borderColor: '#ff9c3d',
            data: avgCurntWsDataBetweenDate
          }, {
            yAxisID: "y-axis-1",
            label: 'AVG Curnt. Ws. Till End Date',
            pointStyle: 'rect',
            fill: false,
            pointBorderWidth: 1,
            borderColor: '#9e76ff',
            data: avgCurntWsDataTillEndDate
          }, {
            yAxisID: "y-axis-1",
            label: 'AVG All Ws Btw. Date.',
            pointStyle: 'rect',
            fill: false,
            pointBorderWidth: 1,
            borderColor: '#51c6ff',
            data: avgAllWsDataBetweenDate
          }, {
            yAxisID: "y-axis-1",
            label: 'AVG All Ws. Till End Date',
            pointStyle: 'rect',
            fill: false,
            pointBorderWidth: 1,
            borderColor: '#ff7b6a',
            data: avgAllWsDataTillEndDate
          }
        ]
      }
    }

    console.log('avgAllwsdata', data1)
    return data;
  }


}
