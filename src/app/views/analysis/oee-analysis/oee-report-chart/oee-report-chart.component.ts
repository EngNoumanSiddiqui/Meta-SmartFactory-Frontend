import {Component, Input, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {LoaderService} from '../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../services/utilities.service';
import {TranslateService} from '@ngx-translate/core';
import {OeeAverageReport, RequestOeeDateIntervalDto, ResponseOeeDataIntervalDto} from '../../../../dto/oee/oee.model';
import {OeeService} from '../../../../services/dto-services/oee/oee-service';
import {ConvertUtil} from '../../../../util/convert-util';


@Component({
  selector: 'oee-report-chart',
  templateUrl: './oee-report-chart.component.html'
})
export class OeeReportChartComponent implements OnInit {
  oee1Data: any;
  oee2Data: any;
  teepData: any;
  qualityData: any;
  availabilityData: any;
  options: any;
  actualPerformanceData: any;
  workPerformanceData: any;
  myItems: Array<ResponseOeeDataIntervalDto>;
  myOriginalItems: Array<ResponseOeeDataIntervalDto>;
  averageCurntWsOeeBetweenDate: OeeAverageReport;
  averageCurntWsOeeTillEndDate: OeeAverageReport;
  averageAllWsOeeBetweenDate: OeeAverageReport;
  averageAllWsOeeTillEndDate: OeeAverageReport;

  cols = [
    // {field: 'recordDate', header: 'record-date'},
    {field: 'workstationId', header: 'workstation-id'},
    {field: 'shiftId', header: 'shift-id'},
    {field: 'shiftStartDate', header: 'shift-start'},
    {field: 'rangeStart', header: 'range-start'},
    {field: 'rangeEnd', header: 'range-end'},
    {field: 'availability', header: 'availability'},
    {field: 'quality', header: 'quality'},
    {field: 'actualPerformance', header: 'actual-performance'},
    {field: 'workPerformance', header: 'worked-performance'},
    {field: 'oee1', header: 'OEE1'},
    {field: 'oee2', header: 'OEE2'},
    {field: 'teep', header: 'TEEP'},
    {field: 'hiddenFactory', header: 'hidden-factory'},
    {field: 'teep', header: 'utilization'},
    {field: 'fullyProductiveTime', header: 'fully-productive-time'},
  ];

  availability = 'Availability';
  performance = 'Performance';
  quality = 'Quality';
  actualPerformance = 'Actual Performance';
  workPerformance = 'Work Performance';

  selectedOees = [];

  @Input('data') set x(data: RequestOeeDateIntervalDto) {
    this.resetChart();
    this.getWorkstationReportDetail(data);
  }


  constructor(private _oeeSvc: OeeService, private loader: LoaderService, private dateFormatPipe: DatePipe,
              private utilities: UtilitiesService, private translate: TranslateService) {

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

  private resetChart() {
    this.myOriginalItems = null;
    this.averageCurntWsOeeBetweenDate = null;
    this.averageCurntWsOeeTillEndDate = null;
    this.averageAllWsOeeBetweenDate = null;
    this.averageAllWsOeeTillEndDate = null;
    this.actualPerformanceData = null;
    this.workPerformanceData = null;
    this.oee1Data = null;
    this.oee2Data = null;
    this.qualityData = null;
    this.availabilityData = null;
    this.teepData = null;
    this.myItems = [];
  }

  getWorkstationReportDetail(data: RequestOeeDateIntervalDto) {
    if (!data) {
      return;
    }
    let count = 0;
    this.loader.showLoader();
    this.resetChart();

    // ******************** Get hourly oee log report  of Selected Workstation between selected Date***********/
    this._oeeSvc.getOeeLogBetweenDate(data).then(result => {
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
    this._oeeSvc.getAverageOeeReport(data).then(result => {
      this.averageCurntWsOeeBetweenDate = result as OeeAverageReport;
      count++;
      if (count >= 5) {
        this.initializeItems(this.myOriginalItems, this.averageCurntWsOeeBetweenDate, this.averageCurntWsOeeTillEndDate, this.averageAllWsOeeBetweenDate, this.averageAllWsOeeTillEndDate);
      }
    }).catch(error => {
      count++;
      this.averageCurntWsOeeBetweenDate = null;
      this.loader.hideLoader();
      this.utilities.showErrorToast(error)
    });
    /********************************************************************************/

    // ******************** Get Average of Selected Workstation From Beginning to Till  selected End Date/
    const filterAverageCurntWsOeeTillEndDate = Object.assign({}, data);
    filterAverageCurntWsOeeTillEndDate.workstationId = null;

    this._oeeSvc.getAverageOeeReport(filterAverageCurntWsOeeTillEndDate).then(result => {
      this.averageCurntWsOeeTillEndDate = result as OeeAverageReport;
      count++;
      if (count >= 5) {
        this.initializeItems(this.myOriginalItems, this.averageCurntWsOeeBetweenDate, this.averageCurntWsOeeTillEndDate, this.averageAllWsOeeBetweenDate, this.averageAllWsOeeTillEndDate);
      }
    }).catch(error => {
      count++;
      this.averageCurntWsOeeBetweenDate = null;
      this.loader.hideLoader();
      this.utilities.showErrorToast(error)
    });
    /********************************************************************************/

    // ******************** Get Average of all Workstation between selected Date/
    const filterAverageAllWsOeeBetweenDate = Object.assign({}, data);
    filterAverageAllWsOeeBetweenDate.workstationId = null;
    filterAverageAllWsOeeBetweenDate.shiftId = null;

    this._oeeSvc.getAverageOeeReport(filterAverageAllWsOeeBetweenDate).then(result => {
      this.averageAllWsOeeBetweenDate = result as OeeAverageReport;
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
    const filterAverageAllWsOeeTillEndDate = Object.assign({}, data);
    filterAverageAllWsOeeTillEndDate.workstationId = null;
    filterAverageAllWsOeeTillEndDate.rangeStart = null;
    filterAverageAllWsOeeBetweenDate.shiftId = null;

    this._oeeSvc.getAverageOeeReport(filterAverageAllWsOeeTillEndDate).then(result => {
      this.averageAllWsOeeTillEndDate = result as OeeAverageReport;
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


  isLoading() {
    return this.loader.isLoading();
  }


  ngOnInit() {

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
        yAxes: [{
          ticks: {
            beginAtZero: true,
          },
          display: true,
          scaleLabel: {
            display: true,
            labelString: '%',
          }
        }]
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

  getPercentageVal(val) {
    if (val) {
      return (val * 100).toFixed(2);
    }
    return 0;
  }

  getPercentage(val) {
    if (val) {
      return (val * 100).toFixed(2) + '%';
    }
    return '';
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
      item.hiddenFactory = me.getPercentage(item.hiddenFactory);
    });
    return myItems;
  }

  getReadableTime(time) {
    return ConvertUtil.longDuration2DHHMMSSTime(time)
  }

  initializeChart(items: Array<ResponseOeeDataIntervalDto>, averageCurntWsOeeBetweenDate: OeeAverageReport,
                  averageCurntWsOeeTillEndDate: OeeAverageReport, averageAllWsOeeBetweenDate: OeeAverageReport,
                  averageAllWsOeeTillEndDate: OeeAverageReport) {

    const me = this;
    const quality = [];
    const availability = [];
    const teep = [];
    const oee1 = [];
    const oee2 = [];
    const actualPerformance = [];
    const workPerformance = [];

    const oee1AvgCurntWsBetweenDate = [];
    const qualityAvgCurntWsBetweenDate = [];
    const avaibilityAvgCurntWsBetweenDate = [];
    const teepAvgCurntWsBetweenDate = [];
    const oee2AvgCurntWsBetweenDate = [];
    const actualPerformanceAvgCurntWsBetweenDate = [];
    const workPerformanceAvgCurntWsBetweenDate = [];

    const qualityAvgCurntWsTillEndDate = [];
    const avaibilityAvgCurntWsTillEndDate = [];
    const oee1AvgCurntWsTillEndDate = [];
    const oee2AvgCurntWsTillEndDate = [];
    const teepAvgCurntWsTillEndDate = [];
    const actualPerformanceAvgCurntWsTillEndDate = [];
    const workPerformanceAvgCurntWsTillEndDate = [];

    const oee1AvgAllWsBetweenDate = [];
    const qualityAvgAllWsBetweenDate = [];
    const avaibilityAvgAllWsBetweenDate = [];
    const teepAvgAllWsBetweenDate = [];
    const oee2AvgAllWsBetweenDate = [];
    const actualPerforamnceAvgAllWsBetweenDate = [];
    const workPerformanceAvgAllWsBetweenDate = [];

    const oee1AvgAllWsTillEndDate = [];
    const qualityAvgAllWsTillEndDate = [];
    const avaibilityAvgAllWsTillEndDate = [];
    const teepAvgAllWsTillEndDate = [];
    const oee2AvgAllWsTillEndDate = [];
    const actualPerformanceAvgAllWsTillEndDate = [];
    const workPerformanceAvgAllWsTillEndDate = [];


    const lineLabels = [];

    items.forEach(item => {
      console.log('this.dateFormatPipe: ', this.dateFormatPipe);
      //const formattedTime = this.dateFormatPipe.transform(item.recordDate, 'YYYY-MM-DD HH:mm');
      // const formattedTime = this.dateFormatPipe.transform(ConvertUtil.localDate2UTC(new Date(item.recordDate)), 'YYYY-MM-DD HH:mm');
      const formattedTime = this.dateFormatPipe.transform(new Date(item.rangeStart), 'dd.MM.yyyy HH:mm') + ' - '
        + this.dateFormatPipe.transform(new Date(item.rangeEnd), 'dd.MM.yyyy HH:mm');

      lineLabels.push(formattedTime);

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
      qualityAvgAllWsBetweenDate, qualityAvgAllWsTillEndDate);
    this.availabilityData = this.getDataSetItem(lineLabels, me.availability, availability, avaibilityAvgCurntWsBetweenDate, avaibilityAvgCurntWsTillEndDate, avaibilityAvgAllWsBetweenDate, avaibilityAvgAllWsTillEndDate);

    this.actualPerformanceData = this.getDataSetItem(lineLabels, me.actualPerformance, actualPerformance, actualPerformanceAvgCurntWsBetweenDate,
      actualPerformanceAvgCurntWsTillEndDate, actualPerforamnceAvgAllWsBetweenDate, actualPerformanceAvgAllWsTillEndDate);
    this.workPerformanceData = this.getDataSetItem(lineLabels, me.workPerformance, workPerformance, workPerformanceAvgCurntWsBetweenDate,
      workPerformanceAvgCurntWsTillEndDate, workPerformanceAvgAllWsBetweenDate, workPerformanceAvgAllWsTillEndDate);

    this.oee1Data = this.getDataSetItem(lineLabels, 'OEE1', oee1, oee1AvgCurntWsBetweenDate, oee1AvgCurntWsTillEndDate, oee1AvgAllWsBetweenDate, oee1AvgAllWsTillEndDate);
    this.oee2Data = this.getDataSetItem(lineLabels, 'OEE2', oee2, oee2AvgCurntWsBetweenDate, oee2AvgCurntWsTillEndDate, oee2AvgAllWsBetweenDate, oee2AvgAllWsTillEndDate);
    this.teepData = this.getDataSetItem(lineLabels, 'TEEP', teep, teepAvgCurntWsBetweenDate, teepAvgCurntWsTillEndDate, teepAvgAllWsBetweenDate, teepAvgAllWsTillEndDate);

  }
  assignValueToArray(data: OeeAverageReport, qualityArray, availabilityArray, oee1Array, oe2Array, teepArray, actualPeformanceArray, workPerformanceArray) {
    if (data) {
      qualityArray.push(this.getPercentageVal(data.quality));
      availabilityArray.push(this.getPercentageVal(data.availability));
      oee1Array.push(this.getPercentageVal(data.oee1));
      oe2Array.push(this.getPercentageVal(data.oee2));
      teepArray.push(this.getPercentageVal(data.teep));
      actualPeformanceArray.push(this.getPercentageVal(data.actualPerformance));
      workPerformanceArray.push(this.getPercentageVal(data.workPerformance));
    }
  }

  private getDataSetItem(lineLabels, label1, data1, avgCurntWsDataBetweenDate,avgCurntWsDataTillEndDate, avgAllWsDataBetweenDate, avgAllWsDataTillEndDate) {

    return {
      labels: lineLabels,
      datasets: [
        {
          label: label1,
          fill: false,
          pointStyle: 'triangle',
          borderColor: '#0fb41d',
          pointBorderWidth: 3,
          data: data1
        }, {
          label: 'AVG Curnt. Ws. Btw. Date',
          pointStyle: 'rect',
          fill: false,
          pointBorderWidth: 1,
          borderColor: '#ff9c3d',
          data: avgCurntWsDataBetweenDate
        }, {
          label: 'AVG Curnt. Ws. Till End Date',
          pointStyle: 'rect',
          fill: false,
          pointBorderWidth: 1,
          borderColor: '#9e76ff',
          data: avgCurntWsDataTillEndDate
        }, {
          label: 'AVG All Ws Btw. Date.',
          pointStyle: 'rect',
          fill: false,
          pointBorderWidth: 1,
          borderColor: '#51c6ff',
          data: avgAllWsDataBetweenDate
        }, {
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



}
