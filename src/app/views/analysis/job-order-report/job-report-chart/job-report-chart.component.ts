import {Component, Input, OnInit} from '@angular/core';
import {ResponseJobOrderLogDetailDto} from '../../../../dto/analysis/daily-report/job-order-report';
import {JobOrderService} from '../../../../services/dto-services/job-order/job-order.service';
import {LoaderService} from '../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../services/utilities.service';
import {TranslateService} from '@ngx-translate/core';
import {StopService} from '../../../../services/dto-services/stop/stop.service';
import {ConvertUtil} from '../../../../util/convert-util';
import {DatePipe} from '@angular/common';


@Component({
  selector: 'job-report-chart',
  templateUrl: './job-report-chart.component.html'
})
export class JObReportChartComponent implements OnInit {
  lineEfficiencyData: any;
  linePowerData: any;
  linePowerConsData: any;
  lineQuantityData: any;
  efficiencyOptions: any;
  costOptions: any;
  consumpOptions: any;
  quantityOptions: any;
  lineCycleTimeData: any;
  cycleTimeOptions: any;
  items: ResponseJobOrderLogDetailDto[] = [];
  //   = [
  //   {
  //     jobOrderId: 1,
  //     recordStartDate: '2019-04-16 07:00:00',
  //     recordFinishDate: '2019-04-16 07:00:00',
  //     netWorkingTime: 13,
  //     powerConsumptions: 13,
  //     powerCost: 1313,
  //     jobWaitingTime: 123,
  //     timeEfficiency: 0.2,
  //     capacityEfficiency: 0.1,
  //     quantityEfficiency: 0.6,
  //     quantityPerformance: 0.5,
  //     qualityPerformance: 0.3,
  //     singleProductCycleTimeExpected: 13,
  //     singleProductCycleTimeActual: 12,
  //     singleProductPowerConsumption: 123,
  //     singleProductPowerCost: 12,
  //     productionNormalQuantity: 12
  //   },
  //   {
  //     jobOrderId: 1,
  //     recordStartDate: '2019-04-16 08:00:00',
  //     recordFinishDate: '2019-04-16 08:00:00',
  //     netWorkingTime: 13,
  //     powerConsumptions: 13,
  //     powerCost: 1313,
  //     jobWaitingTime: 123,
  //     timeEfficiency: 0.2,
  //     capacityEfficiency: 0.3,
  //     quantityEfficiency: 0.5,
  //     quantityPerformance: 0.1,
  //     qualityPerformance: 0.4,
  //     singleProductCycleTimeExpected: 13,
  //     singleProductCycleTimeActual: 12,
  //     singleProductPowerConsumption: 123,
  //     singleProductPowerCost: 12,
  //     productionNormalQuantity: 12
  //   }
  // ];

  @Input('data') set x(data) {
    this.resetChartS();
    this.getJObOrderDetail(data.jobOrderId);
    this.getJobOrderStops(data);
    this.getJobOrderMachineStatesStops(data);
  }

  stops;
  capacityEfficiency = 'Capacity Eff.';
  quantityEfficiency = 'Quantity Eff.';
  quantityPerformance = 'Quantity Perf.';
  qualityPerformance = 'Quality Perf.';
  singleProductPowerCost = 'Sing. Prod. Pw. Cost';
  powerCost = 'Power Cost';
  powerConsump = 'Power Consump.';
  singleProductPowerConsumption = 'Sing. Prod. Power Cons.';
  productionQuantity = 'Production Quantity';
  machineStates;
  expectedCycleTime = 'Expected Cycle Time';
  actualCycleTime = 'Actual Cycle Time';
  actualCycleTimeAverageLabel = 'Actual Cycle Time Average';
  actualCycleTimeAverage = 0;

  constructor(private jobSvc: JobOrderService, private loaderService: LoaderService,
              private stopService: StopService, private dateFormatPipe: DatePipe,
              private utilities: UtilitiesService, private translate: TranslateService) {


  }

  getJObOrderDetail(jobOrderId) {
    if (!jobOrderId) {
      return;
    }

    this.loaderService.showLoader();
    this.jobSvc.getJObOrderReportDetail(jobOrderId).then((res: any) => {
      this.items = res.jobOrderLogDetailList as ResponseJobOrderLogDetailDto[];
      this.actualCycleTimeAverage = ConvertUtil.fix(res.actualCycleTimeAverage / 1000 / 60, 2);
      this.normalizeValues(this.items);
      this.initializeChart(this.items);
      this.loaderService.hideLoader();
    }).catch(err => {
      const items = [];
      this.initializeChart(items);
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(err);
    });
  }


  normalizeValues(res: ResponseJobOrderLogDetailDto[]) {
    const me = this;
    res.map(item => {
      // console.log('Record Finish Date', item.recordFinishDate);
      item.recordStartDate = new Date(item.recordStartDate);
      item.recordFinishDate = new Date(item.recordFinishDate);
      item.recordFinishDate = this.dateFormatPipe.transform(item.recordStartDate, 'dd/MM/yyyy HH:mm') + ' - ' + this.dateFormatPipe.transform(item.recordFinishDate, 'dd/MM/yyyy HH:mm');
      // console.log('Record Finish Date', item.recordFinishDate);
      item.capacityEfficiency = me.getPercentage(item.capacityEfficiency);
      item.quantityEfficiency = me.getPercentage(item.quantityEfficiency);
      item.timeEfficiency = me.getPercentage(item.timeEfficiency);
      item.quantityPerformance = me.getPercentage(item.quantityPerformance);
      item.qualityPerformance = me.getPercentage(item.qualityPerformance);
      item.powerCost = ConvertUtil.fix(item.powerCost, 2);
      item.powerConsumptions = ConvertUtil.fix(item.powerConsumptions, 4);
      item.singleProductPowerConsumption = ConvertUtil.fix(item.singleProductPowerConsumption, 4);
      item.singleProductPowerCost = ConvertUtil.fix(item.singleProductPowerCost, 2);
      item.singleProductCycleTimeActual = ConvertUtil.fix(item.singleProductCycleTimeActual / 1000 / 60, 2);
      item.singleProductCycleTimeExpected = ConvertUtil.fix(item.singleProductCycleTimeExpected / 1000 / 60, 2);
    });

  }


  getPercentage(val) {
    if (val) {
      return (val * 100).toFixed(2);
    }
    return 0;
  }


  getJobOrderStops(data) {
    const temp = Object.assign({}, data);
    delete temp.jobOrderId;
    delete temp.startDate;
    delete temp.endDate;
    this.stopService.customsStops(temp).then(res => {
      this.stops = res;
    }).catch(err => {
      this.utilities.showErrorToast(err);
    });
  }

  getJobOrderMachineStatesStops(data) {
    this.stopService.getMachineStateStops(data).then(res => {
      this.machineStates = res;
    }).catch(err => {
      this.utilities.showErrorToast(err);
    });
  }


  ngOnInit() {

    const me = this;
    this.translate.get('capacity-efficiency').subscribe(res => {
      me.capacityEfficiency = res;
    });
    this.translate.get('quantity-efficiency').subscribe(res => {
      me.quantityEfficiency = res;
    });
    this.translate.get('quantity-performance').subscribe(res => {
      me.quantityPerformance = res;
    });
    this.translate.get('quality-performance').subscribe(res => {
      me.qualityPerformance = res;
    });
    this.translate.get('power-consumption').subscribe(res => {
      me.powerConsump = res;
    });
  }

  private resetChartS() {
    this.lineEfficiencyData = null;
    this.linePowerData = null;
    this.linePowerConsData = null;
    this.lineQuantityData = null;
    this.efficiencyOptions = this.createOptions('Efficiency (%)');
    this.costOptions = this.createOptions('Cost');
    this.consumpOptions = this.createOptions('Consumption (khw)');
    this.quantityOptions = this.createOptions('Quantity');

    this.lineCycleTimeData = null;
    this.cycleTimeOptions = this.createOptions('minutes');
  }


  initializeChart(items: ResponseJobOrderLogDetailDto[]) {

    if (!items || items.length === 0) {
      return;
    }

    const me = this;
    const capacityEfficiency = [];
    const quantityEfficiency = [];
    const quantityPerformance = [];
    const qualityPerformance = [];
    const powerCost = [];
    const powerConsumption = [];
    const singleProductPowerConsumption = [];
    const productionQuantity = [];
    const singleProductPowerCost = [];
    const lineLabels = [];
    const expectedCycleTime = [];
    const actualCycleTime = [];
    const actualCycleTimeAverage = [];

    items.forEach(item => {
      // if(item.jobOrderOperationId) {
      //   lineLabels.push(item.jobOrderOperationId);  
      // }  
      // if(item.referenceId) {
      //   lineLabels.push(item.referenceId);  
      // }
      lineLabels.push(item.recordFinishDate);
      capacityEfficiency.push(item.capacityEfficiency >= 0 ? item.capacityEfficiency : null);
      quantityEfficiency.push(item.quantityEfficiency >= 0 ? item.quantityEfficiency : null);
      quantityPerformance.push(item.quantityPerformance >= 0 ? item.quantityPerformance : null);
      qualityPerformance.push(item.qualityPerformance >= 0 ? item.qualityPerformance : null);
      powerCost.push(item.powerCost);
      powerConsumption.push(item.powerConsumptions);
      singleProductPowerConsumption.push(item.singleProductPowerConsumption);
      productionQuantity.push(item.productionNormalQuantity >= 0 ? item.productionNormalQuantity : null);
      singleProductPowerCost.push(item.singleProductPowerCost);
      expectedCycleTime.push(item.singleProductCycleTimeExpected >=0 ? item.singleProductCycleTimeExpected : null);
      actualCycleTime.push(item.singleProductCycleTimeActual >=0 ? item.singleProductCycleTimeActual : null);
      actualCycleTimeAverage.push(me.actualCycleTimeAverage >=0 ? me.actualCycleTimeAverage : null);
    });


    this.lineEfficiencyData = {
      labels: lineLabels,
      datasets: [
        {
          label: me.capacityEfficiency,
          fill: false,
          pointStyle: 'triangle',
          borderColor: '#0fb41d',
          pointBorderWidth: 3,
          data: capacityEfficiency
        }, {
          label: me.quantityEfficiency,
          pointStyle: 'rect',
          fill: false,
          pointBorderWidth: 3,
          borderColor: '#ff9c3d',
          data: quantityEfficiency
        }, {
          label: me.quantityPerformance,
          fill: false,
          pointBorderWidth: 3,
          borderColor: '#3a53c0',
          data: quantityPerformance
        }, {
          label: me.qualityPerformance,
          fill: false,
          pointBorderWidth: 3,
          borderColor: '#4bc0c0',
          data: qualityPerformance
        },
      ]
    };

    this.linePowerData = {
      labels: lineLabels,
      datasets: [
        {
          label: me.powerCost,
          fill: false,
          pointStyle: 'triangle',
          borderColor: '#0fb41d',
          pointBorderWidth: 3,
          data: powerCost
        }, {
          label: me.singleProductPowerCost,
          pointStyle: 'rect',
          fill: false,
          pointBorderWidth: 3,
          borderColor: '#ff9c3d',
          data: singleProductPowerCost
        }
      ]
    };
    this.linePowerConsData = {
      labels: lineLabels,
      datasets: [
        {
          label: me.powerConsump,
          fill: false,
          pointStyle: 'triangle',
          borderColor: '#0fb41d',
          pointBorderWidth: 3,
          data: powerConsumption
        }, {
          label: me.singleProductPowerConsumption,
          pointStyle: 'rect',
          fill: false,
          pointBorderWidth: 3,
          borderColor: '#ff9c3d',
          data: singleProductPowerConsumption
        }
      ]
    };

    this.lineQuantityData = {
      labels: lineLabels,
      datasets: [
        {
          label: me.productionQuantity,
          fill: false,
          pointStyle: 'rect',
          borderColor: '#0fb41d',
          pointBorderWidth: 3,
          data: productionQuantity
        }
      ]
    };

    this.lineCycleTimeData = {
      labels: lineLabels,
      datasets: [
        {
          label: me.expectedCycleTime,
          fill: false,
          pointStyle: 'triangle',
          borderColor: '#0fb41d',
          pointBorderWidth: 3,
          data: expectedCycleTime
        }, {
          label: me.actualCycleTime,
          pointStyle: 'rect',
          fill: false,
          pointBorderWidth: 3,
          borderColor: '#ff9c3d',
          data: actualCycleTime
        }, {
          label: me.actualCycleTimeAverageLabel,
          fill: false,
          pointBorderWidth: 3,
          borderColor: '#3a53c0',
          data: actualCycleTimeAverage
        }
      ]
    };

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
          // type: 'time',
          display: true,
          ticks: {
            autoSkip: false,
            maxRotation: 90,
            minRotation: 30
          },

          // time: {
          //   unit: 'hour',
          // },
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
      // animation: {
      //   onComplete: function () {

      //     var scale = window.devicePixelRatio;                       

      //     var sourceCanvas = this.chart.canvas;
      //     var copyWidth = this.scales['y-axis-0'].width - 10;
      //     var copyHeight = this.scales['y-axis-0'].height + this.scales['y-axis-0'].top + 10;

      //     var targetCtx = this.chart.canvas.getContext("2d");

      //     targetCtx.scale(scale, scale);
      //     targetCtx.canvas.width = copyWidth * scale;
      //     targetCtx.canvas.height = copyHeight * scale;

      //     targetCtx.canvas.style.width = `${copyWidth}px`;
      //     targetCtx.canvas.style.height = `${copyHeight}px`;
      //     targetCtx.drawImage(sourceCanvas, 0, 0, copyWidth * scale, copyHeight * scale, 0, 0, copyWidth * scale, copyHeight * scale);

      //     var sourceCtx = sourceCanvas.getContext('2d');

      //     // Normalize coordinate system to use css pixels.

      //     sourceCtx.clearRect(0, 0, copyWidth * scale, copyHeight * scale);

      //   },
      //   onProgress: function () {
      //     var copyWidth = this.scales['y-axis-0'].width;
      //     var copyHeight = this.scales['y-axis-0'].height + this.scales['y-axis-0'].top + 10;
      //     var sourceCtx = this.chart.canvas.getContext('2d');
      //     sourceCtx.clearRect(0, 0, copyWidth, copyHeight);
      //   }
      // },

    };
  }

}
