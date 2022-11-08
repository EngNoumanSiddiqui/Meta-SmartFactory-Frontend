import {Component, Input, OnInit} from '@angular/core';
import {LoaderService} from '../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../services/utilities.service';
import {TranslateService} from '@ngx-translate/core';
import {StopService} from '../../../../services/dto-services/stop/stop.service';
import {ConvertUtil} from '../../../../util/convert-util';
import {WorkstationService} from '../../../../services/dto-services/workstation/workstation.service';
import {RequestWorkstationReportDetailDto, ResponseWorkstationReportAvgDto, ResponseWorkstationReportLogDetailDto} from '../../../../dto/analysis/daily-report/workstation-order-report';
import {DatePipe} from '@angular/common';


@Component({
  selector: 'workstation-report-chart',
  templateUrl: './workstation-report-chart.component.html'
})
export class WorkstationReportChartComponent implements OnInit {
  capacityEfficiencyData: any;
  timeEfficiencyData: any;
  linePowerCostData: any;
  linePowerConsumpData: any;
  lineNetWorkingTimeData: any;
  lineJobWaitingTimeData: any;
  efficiencyOptions: any;
  costOptions: any;
  consumpOptions: any;
  timeOptions: any;
  averageValues;

  @Input('data') set x(data: RequestWorkstationReportDetailDto) {
    this.resetChartS();
    this.getWorkstationReportDetail(data);
    this.getWorkstationStops(data);
    this.getMachineStateStops(data);
  }

  @Input('averageValues') set a(averageValues: Array<ResponseWorkstationReportAvgDto>) {
    this.averageValues = averageValues;
  }

  stops;
  capacityEfficiency = 'Capacity Eff.';
  timeEfficiency = 'Time Eff.';
  netWorkingTime = 'Net Working Time';
  jobWaitingTime = 'Job Waiting Time';
  powerConsumption = 'Power Consumption';
  powerCost = 'Power Cost';


  cols = [
    {field: 'shiftId', header: 'shift-id'},
    {field: 'shiftStartDate', header: 'shift-start'},
    {field: 'recordStartDate', header: 'range-start'},
    {field: 'recordFinishDate', header: 'range-end'},
    {field: 'jobWaitingTime', header: 'job-waiting-time'},
    {field: 'netWorkingTime', header: 'net-working-time'},
    {field: 'powerConsumption', header: 'power-consumption'},
    {field: 'powerCost', header: 'power-cost'},
    {field: 'timeEfficiency', header: 'time-efficiency'},
    {field: 'capacityEfficiency', header: 'capacity-efficiency'},
    {field: 'machineOccupancy', header: 'machine-occupancy'}
  ];

  machineStops;
  detailItems: Array<ResponseWorkstationReportLogDetailDto> = [];
  selectedRowData = [];

  constructor(private jobSvc: WorkstationService, private loaderService: LoaderService,
              private stopService: StopService, private datePipe: DatePipe,
              private utilities: UtilitiesService, private translate: TranslateService) {


  }

  getWorkstationReportDetail(data) {
    if (!data) {
      return;
    }

    this.loaderService.showLoader();
    this.jobSvc.getWorkstationReportDetail(data).then(res => {
      const items = res as ResponseWorkstationReportLogDetailDto[];
      this.normalizeValues(items);
      this.detailItems = items.map(obj => ({...obj}));
      console.log('detailItems', this.detailItems);
      this.initializeChart(items);
      this.loaderService.hideLoader();
      console.log('Method Bitti');
    }).catch(err => {
      const items = [];
      this.initializeChart(items);
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(err);
    });
  }


  normalizeValues(res: ResponseWorkstationReportLogDetailDto[]) {
    const me = this;
    res.map(item => {

      // item.recordStartDate = ConvertUtil.localDate2UTC(item.recordStartDate);
      // item.recordFinishDate = ConvertUtil.localDate2UTC(item.recordFinishDate);
      item.capacityEfficiency = me.getPercentage(item.capacityEfficiency);
      item.timeEfficiency = me.getPercentage(item.timeEfficiency);
      item.netWorkingTime = me.seconds2Min(item.netWorkingTime);
      item.jobWaitingTime = me.seconds2Min(item.jobWaitingTime);
      item.powerCost = ConvertUtil.fix(item.powerCost, 2);
      item.powerConsumption = ConvertUtil.fix(item.powerConsumption, 4);
    });

  }


  getPercentage(val) {
    if (val) {
      return (val * 100).toFixed(2);
    }
    return 0;
  }

  seconds2Min(val) {
    if (val) {
      return (val / 60).toFixed();
    }
    return 0;
  }


  getWorkstationStops(data) {

    this.stopService.workstationShiftStop(data).then(res => {
      this.stops = res;
    }).catch(err => {
      this.utilities.showErrorToast(err);
    });
  }

  getMachineStateStops(data) {

    this.stopService.getMachineStateStops(data).then(res => {
      this.machineStops = res;
    }).catch(err => {
      this.utilities.showErrorToast(err);
    });
  }


  ngOnInit() {

    const me = this;
    me.detailItems = []; // reset detail items.
    this.translate.get('capacity-efficiency').subscribe(res => {
      me.capacityEfficiency = res;
    });
    this.translate.get('time-efficiency').subscribe(res => {
      me.timeEfficiency = res;
    });
    this.translate.get('net-working-time').subscribe(res => {
      me.netWorkingTime = res;
    });
    this.translate.get('job-waiting-time').subscribe(res => {
      me.jobWaitingTime = res;
    });
    this.translate.get('power-cost').subscribe(res => {
      me.powerCost = res;
    });
    this.translate.get('power-consumption').subscribe(res => {
      me.powerConsumption = res;
    });
  }

  private resetChartS() {
    this.capacityEfficiencyData = null;
    this.timeEfficiencyData = null;
    this.lineNetWorkingTimeData = null;
    this.lineJobWaitingTimeData = null;
    this.linePowerConsumpData = null;
    this.linePowerCostData = null;
    this.efficiencyOptions = this.createOptions('Efficiency (%)');
    this.costOptions = this.createOptions('Power Cost');
    this.consumpOptions = this.createOptions('Power Consumption');
    this.timeOptions = this.createTimeOptions();
  }


  initializeChart(items: ResponseWorkstationReportLogDetailDto[]) {

    if (!items || items.length === 0) {
      return;
    }

    const me = this;
    const capacityEfficiency = [];
    const timeEfficiency = [];

    const powerCost = [];
    const powerConsumption = [];
    const netWorkingTime = [];
    const jobWaitingTime = [];
    const lineLabels = [];

    const capacityEfficiencyAvgCurrWsBetweenDates = [];
    const capacityEfficiencyAvgCurrWsTillNow = [];
    const capacityEfficiencyAvgAllWsBetweenDates = [];
    const capacityEfficiencyAvgAllWsTillNow = [];

    const timeEfficiencyAvgCurrWsBetweenDates = [];
    const timeEfficiencyAvgCurrWsTillNow = [];
    const timeEfficiencyAvgAllWsBetweenDates = [];
    const timeEfficiencyAvgAllWsTillNow = [];

    const jobWaitingTimeAvgCurrWsBetweenDates = [];
    const jobWaitingTimeAvgCurrWsTillNow = [];
    const jobWaitingTimeAvgAllWsBetweenDates = [];
    const jobWaitingTimeAvgAllWsTillNow = [];

    const powerCostAvgCurrWsBetweenDates = [];
    const powerCostAvgCurrWsTillNow = [];
    const powerCostAvgAllWsBetweenDates = [];
    const powerCostAvgAllWsTillNow = [];

    const powerConsumptionAvgCurrWsBetweenDates = [];
    const powerConsumptionAvgCurrWsTillNow = [];
    const powerConsumptionAvgAllWsBetweenDates = [];
    const powerConsumptionAvgAllWsTillNow = [];

    const netWorkingTimeAvgCurrWsBetweenDates = [];
    const netWorkingTimeAvgCurrWsTillNow = [];
    const netWorkingTimeAvgAllWsBetweenDates = [];
    const netWorkingTimeAvgAllWsTillNow = [];

    let avgCurrWsBetweenDates: ResponseWorkstationReportAvgDto;
    let avgCurrWsTillNow: ResponseWorkstationReportAvgDto;
    let avgAllWsBetweenDates: ResponseWorkstationReportAvgDto;
    let avgAllWsTillNow: ResponseWorkstationReportAvgDto;

    this.averageValues.forEach(item => {
      console.log('Item Type:', item.type);
      switch (item.type) {
        case 'Avg. Curr. Ws BetWeen Dates':
          avgCurrWsBetweenDates = item;
          break;
        case 'Avg. Curr. Ws Till Now':
          avgCurrWsTillNow = item;
          break;
        case 'Avg. All Ws BetWeen Dates':
          avgAllWsBetweenDates = item;
          break;
        case 'Avg. All Ws. Till Now':
          avgAllWsTillNow = item;
          break;

      }
      console.log('Item :', item);

    });


    items.forEach(item => {
      const xAxisLabels = this.datePipe.transform(item.recordStartDate, 'dd/MM/yyyy HH:mm') + '-' + this.datePipe.transform(item.recordFinishDate, 'HH:mm')
      lineLabels.push(xAxisLabels);
      capacityEfficiency.push(item.capacityEfficiency);
      capacityEfficiencyAvgCurrWsBetweenDates.push(this.getPercentage(avgCurrWsBetweenDates.capacityEfficiencyAvg));
      capacityEfficiencyAvgCurrWsTillNow.push(this.getPercentage(avgCurrWsTillNow.capacityEfficiencyAvg));
      capacityEfficiencyAvgAllWsBetweenDates.push(this.getPercentage(avgAllWsBetweenDates.capacityEfficiencyAvg));
      capacityEfficiencyAvgAllWsTillNow.push(this.getPercentage(avgAllWsTillNow.capacityEfficiencyAvg));


      timeEfficiency.push(item.timeEfficiency);
      timeEfficiencyAvgCurrWsBetweenDates.push(this.getPercentage(avgCurrWsBetweenDates.timeEfficiencyAvg));
      timeEfficiencyAvgCurrWsTillNow.push(this.getPercentage(avgCurrWsTillNow.timeEfficiencyAvg));
      timeEfficiencyAvgAllWsBetweenDates.push(this.getPercentage(avgAllWsBetweenDates.timeEfficiencyAvg));
      timeEfficiencyAvgAllWsTillNow.push(this.getPercentage(avgAllWsTillNow.timeEfficiencyAvg));

      netWorkingTime.push(item.netWorkingTime);
      netWorkingTimeAvgCurrWsBetweenDates.push(this.seconds2Min(avgCurrWsBetweenDates.netWorkingTimeAvg));
      netWorkingTimeAvgCurrWsTillNow.push(this.seconds2Min(avgCurrWsTillNow.netWorkingTimeAvg));
      netWorkingTimeAvgAllWsBetweenDates.push(this.seconds2Min(avgAllWsBetweenDates.netWorkingTimeAvg));
      netWorkingTimeAvgAllWsTillNow.push(this.seconds2Min(avgAllWsTillNow.netWorkingTimeAvg));

      jobWaitingTime.push(item.jobWaitingTime);
      jobWaitingTimeAvgCurrWsBetweenDates.push(this.seconds2Min(avgCurrWsBetweenDates.jobWaitingTimeAvg));
      jobWaitingTimeAvgCurrWsTillNow.push(this.seconds2Min(avgCurrWsTillNow.jobWaitingTimeAvg));
      jobWaitingTimeAvgAllWsBetweenDates.push(this.seconds2Min(avgAllWsBetweenDates.jobWaitingTimeAvg));
      jobWaitingTimeAvgAllWsTillNow.push(this.seconds2Min(avgAllWsTillNow.jobWaitingTimeAvg));

      powerCost.push(item.powerCost);
      powerCostAvgCurrWsBetweenDates.push(ConvertUtil.fix(avgCurrWsBetweenDates.powerCostAvg, 2));
      powerCostAvgCurrWsTillNow.push(ConvertUtil.fix(avgCurrWsTillNow.powerCostAvg, 2));
      powerCostAvgAllWsBetweenDates.push(ConvertUtil.fix(avgAllWsBetweenDates.powerCostAvg, 2));
      powerCostAvgAllWsTillNow.push(ConvertUtil.fix(avgAllWsTillNow.powerCostAvg, 2));

      powerConsumption.push(item.powerConsumption);
      powerConsumptionAvgCurrWsBetweenDates.push(ConvertUtil.fix(avgCurrWsBetweenDates.powerConsumptionAvg, 4));
      powerConsumptionAvgCurrWsTillNow.push(ConvertUtil.fix(avgCurrWsTillNow.powerConsumptionAvg, 4));
      powerConsumptionAvgAllWsBetweenDates.push(ConvertUtil.fix(avgAllWsBetweenDates.powerConsumptionAvg, 4));
      powerConsumptionAvgAllWsTillNow.push(ConvertUtil.fix(avgAllWsTillNow.powerConsumptionAvg, 4));

    });

    this.capacityEfficiencyData = this.getChartData(lineLabels, me.capacityEfficiency, capacityEfficiency, capacityEfficiencyAvgCurrWsBetweenDates, capacityEfficiencyAvgCurrWsTillNow, capacityEfficiencyAvgAllWsBetweenDates, capacityEfficiencyAvgAllWsTillNow);
    this.timeEfficiencyData = this.getChartData(lineLabels, me.timeEfficiency, timeEfficiency, timeEfficiencyAvgCurrWsBetweenDates, timeEfficiencyAvgCurrWsTillNow, timeEfficiencyAvgAllWsBetweenDates, timeEfficiencyAvgAllWsTillNow);
    this.linePowerCostData = this.getChartData(lineLabels, me.powerCost, powerCost, powerCostAvgCurrWsBetweenDates, powerCostAvgCurrWsTillNow, timeEfficiencyAvgAllWsBetweenDates, timeEfficiencyAvgAllWsTillNow);
    this.linePowerConsumpData = this.getChartData(lineLabels, me.powerConsumption, powerConsumption, powerConsumptionAvgCurrWsBetweenDates, powerConsumptionAvgCurrWsTillNow, powerConsumptionAvgAllWsBetweenDates, powerConsumptionAvgAllWsTillNow);
    this.lineNetWorkingTimeData = this.getChartData(lineLabels, me.netWorkingTime, netWorkingTime, netWorkingTimeAvgCurrWsBetweenDates, netWorkingTimeAvgCurrWsTillNow, netWorkingTimeAvgAllWsBetweenDates, netWorkingTimeAvgAllWsTillNow);
    this.lineJobWaitingTimeData = this.getChartData(lineLabels, me.jobWaitingTime,  jobWaitingTime,  jobWaitingTimeAvgCurrWsBetweenDates,  jobWaitingTimeAvgCurrWsTillNow,  jobWaitingTimeAvgAllWsBetweenDates,  jobWaitingTimeAvgAllWsTillNow);

  }

  getChartData(lineLabels: any[], yLabel: string, mainData: number[], avgCurrWsBetweenDates: number[], avgCurrWsTillNow: number[], avgAllWsBetweenDates: number[], avgAllWsTillNow: number[]) {
    return {
      labels: lineLabels,
      datasets: [
        {
          label: yLabel,
          fill: false,
          pointStyle: 'triangle',
          borderColor: '#0fb41d',
          pointBorderWidth: 3,
          data: mainData
        },
        {
          label: 'AVG Curnt. Ws. Btw. Date',
          pointStyle: 'rect',
          fill: false,
          pointBorderWidth: 1,
          borderColor: '#ff9c3d',
          data: avgCurrWsBetweenDates
        },
        {
          label: 'AVG Curnt. Ws. Till End Date',
          pointStyle: 'rect',
          fill: false,
          pointBorderWidth: 1,
          borderColor: '#9e76ff',
          data: avgCurrWsTillNow
        },
        {
          label: 'AVG All Ws Btw. Date.',
          pointStyle: 'rect',
          fill: false,
          pointBorderWidth: 1,
          borderColor: '#51c6ff',
          data: avgAllWsBetweenDates
        },
        {
          label: 'AVG All Ws. Till End Date',
          pointStyle: 'rect',
          fill: false,
          pointBorderWidth: 1,
          borderColor: '#ff7b6a',
          data: avgAllWsTillNow
        },
      ]
    }

  }

  createOptions(yLabel) {
    return {
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
          scaleLabel: {
            display: true,
            labelString: 'Time',
          }
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true,
          },
          display: true,
          scaleLabel: {
            display: true,
            labelString: yLabel,
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

  createTimeOptions() {
    return {
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
            labelString: 'Time (minute)',
          }
        }]
      },
      tooltips: {
        enable: true,
        callbacks: {
          label: function (tooltipItem, data) {
            let label = data.datasets[tooltipItem.datasetIndex].label || '';

            if (label) {
              label += ': ';
            }
            label += ConvertUtil.minuteDuration2StrTime(tooltipItem.yLabel);
            return label;
          }
        }
      },
      hover: {
        animationDuration: 1
      },

      animation: {
        duration: 2000,
        // onComplete: function () {
        //   const chartInstance = this.chart,
        //     ctx = chartInstance.ctx;
        //   ctx.textAlign = 'center';
        //   ctx.fillStyle = '#000000';
        //   ctx.fontSize = '1em';
        //   ctx.textBaseline = 'middle';
        //   this.data.datasets.forEach(function (dataset, i) {
        //     const meta = chartInstance.controller.getDatasetMeta(i);
        //     if (meta.hidden) {
        //       return;
        //     }
        //     meta.data.forEach(function (bar, index) {
        //       let percent = '';
        //       switch (i) {
        //         case 0: // job load time
        //           percent = items[index].jobLoadedTime;
        //           break;
        //         case 1: // stop duration
        //           percent = items[index].stopDuration;
        //           break;
        //         case 2: // net working time
        //           percent = items[index].netWorkingTime;
        //           break;
        //       }
        //       ctx.fillText(percent, bar._model.x, bar._model.y - 4);
        //
        //     });
        //   });
        // }
      }
    };
  }


}
