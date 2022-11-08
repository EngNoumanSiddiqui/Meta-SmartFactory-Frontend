import { Component, Input, OnInit } from '@angular/core';
import { JobOrderService } from '../../../../services/dto-services/job-order/job-order.service';
import { LoaderService } from '../../../../services/shared/loader.service';
import { UtilitiesService } from '../../../../services/utilities.service';
import { TranslateService } from '@ngx-translate/core';
import { StopService } from '../../../../services/dto-services/stop/stop.service';
import { ConvertUtil } from '../../../../util/convert-util';
import { DatePipe } from '@angular/common';
import { ProductionOrderService } from 'app/services/dto-services/production-order/production-order.service';
import { ProdOrderJobOperationList, ResponseProdOrderReportDto } from 'app/dto/analysis/prod-order-report/production-order-report';


@Component({
  selector: 'prod-order-report-chart',
  templateUrl: './prod-order-report-chart.component.html'
})
export class ProdOrderReportChartComponent implements OnInit {

  barEfficiencyData: any;
  linePowerData: any;
  stopPORData: any;
  stopPOROptions: any;
  linePowerConsData: any;
  lineQuantityData: any;
  efficiencyOptions: any;
  quantityOptions: any;

  @Input('data') set x(data) {
    this.resetChartS();
    const dt = JSON.parse(JSON.stringify(data));
    dt.finishDate = null;
    dt.startDate = null;
    dt.prodOrderStatus = null;
    this.getProdOrderDetail(dt);
    // this.getProdOrderStops(data);
    // this.getProdOrderMachineStops(data);
  }

  // @Input('stopReasonData') set setstopReasonData(data) {
  //   if(data) {
    
  //     this.setStopReasonDataGraph(data);
  //     // this.setProdOrderDetail(data);
  //   }
  // }

  @Input("jobOrderOperationData") set setjobOrderOperationData(jobOrderOperationData) {
    if(jobOrderOperationData) {
      const jobOrderOperationDt = JSON.parse(JSON.stringify(jobOrderOperationData));
      // this.normalizeValues(jobOrderOperationDt);
      this.setStopReasonDataGraph(jobOrderOperationDt);
      // this.initializeChart(jobOrderOperationDt);
      
      
    }
  }

  stops = [];
  capacityEfficiency = 'Capacity Eff.';
  quantityEfficiency = 'Quantity Eff.';
  quantityPerformance = 'Quantity Perf.';
  qualityPerformance = 'Quality Perf.';
  singleProductPowerCost = 'Sing. Prod. Pw. Cost';
  powerCost = 'Power Cost';
  powerConsump = 'Power Consump.';
  singleProductPowerConsumption = 'Sing. Prod. Power Cons.';
  goodQuantity = 'Good Quantity';
  machineStates;

  constructor(
    private jobSvc: JobOrderService, 
    private loaderService: LoaderService,
    private stopService: StopService, 
    private dateFormatPipe: DatePipe,
    private utilities: UtilitiesService, 
    private translate: TranslateService,
    private _prodOrderSvc: ProductionOrderService) {


  }

  getProdOrderDetail(data) {
    if (!data) {
      return;
    }

    this.loaderService.showLoader();
    this._prodOrderSvc.prodOrderReport(data).then(res => {
      if(res['content'] && res['content'].length > 0){
        const items = res['content'] as ResponseProdOrderReportDto[];
        this.normalizeValues(items[0].jobOrderOperationList);
        this.initializeChart(items[0].jobOrderOperationList);
      }
      this.loaderService.hideLoader();
    }).catch(err => {
      const items = [];
      this.initializeChart(items);
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(err);
    });
  }

  setProdOrderDetail(data) {
    this.normalizeValues(data);
    this.initializeChart(data);
  }


  normalizeValues(res: ProdOrderJobOperationList[]) {
    const me = this;
    res.map((item:any) => {
      item.capacityEfficiency = me.getPercentage(item.capacityEfficiency);
      item.quantityEfficiency = me.getPercentage(item.quantityEfficiency);
      // item.qualityEfficiency = me.getPercentage(item.qualityEfficiency);
      item.quantityPerformance = me.getPercentage(item.quantityPerformance);
      item.qualityPerformance = me.getPercentage(item.qualityPerformance);
      item.timeEfficiency = me.getPercentage(item.timeEfficiency);
      item.powerCost = ConvertUtil.fix(item.powerCost, 2);
      item.powerConsumptions = ConvertUtil.fix(item.powerConsumptions, 4);
      item.singleProductPowerConsumption = ConvertUtil.fix(item.singleProductPowerConsumption, 4);
      item.singleProductPowerCost = ConvertUtil.fix(item.singleProductPowerCost, 2);
    });

  }

  initializeChart(items: ProdOrderJobOperationList[]) {

    if (!items || items.length === 0) {
      return;
    }

    const me = this;
    //Efficiency & Performance Datasets
    const capacityEfficiency = [];
    const quantityEfficiency = [];
    const quantityPerformance = [];
    const qualityPerformance = [];

    //Quantity Tab Datasets
    const goodQuantity = [];
    const scrapQuantity = [];
    const reworkQuantity = [];
    // const qualityEfficiency = [];

    const powerCost = [];
    const powerConsumption = [];
    const singleProductPowerConsumption = [];
    const singleProductPowerCost = [];
    const lineLabels = [];
    const operationlineLabels = [];

    const stopDataSet = [];

    items.forEach(item => {
      const multilinelabel = [];
      multilinelabel.push('JOO: ' +item.jobOrderOperationId);  
      if(item.referenceId) {
        multilinelabel.push('Ref: '+item.referenceId);  
      }
      multilinelabel.push('WS: ' + item.workstationName);
      multilinelabel.push('OP: '+item.operationName);
      multilinelabel.push(item.jobOrderStatus);
      operationlineLabels.push({operationName: item.operationName,
        jobOrderStatus: item.jobOrderStatus,
        jobOrderOperationId: item.jobOrderOperationId,
         workstationName: item.workstationName});
      lineLabels.push(multilinelabel);

      capacityEfficiency.push(item.capacityEfficiency);
      quantityEfficiency.push(item.quantityEfficiency);
      quantityPerformance.push(item.quantityPerformance);
      qualityPerformance.push(item.qualityPerformance);

      goodQuantity.push(item.productNormalQuantity);
      scrapQuantity.push(item.productScrapQuantity);
      reworkQuantity.push(item.setupReworkQuantity);
      // qualityEfficiency.push(0); // no property found for quality efficiency

      powerCost.push(item.powerCost);
      powerConsumption.push(item.powerConsumption);
      singleProductPowerConsumption.push(item.singleProductPowerConsumption);
      singleProductPowerCost.push(item.singleProductPowerCost);

      // const stpreasonValue = [];
      // item.stopReasonList.forEach(storsn => {
      //   stpreasonValue.push(storsn.actualStopDuration);
      // });
      // stopDataSet.push({
      //     label: item.capacityEfficiency,
      //     backgroundColor: '#0fb41d',
      //     data: capacityEfficiency
      //   })
    });

    this.stops.forEach(stp => {
      const stopdata = [];
      operationlineLabels.forEach(itm => {
        if((itm.operationName === stp.operationName) 
        && (itm.workstationName === stp.workstationName)
        &&(itm.jobOrderOperationId === stp.jobOrderOperationId)
        && (itm.jobOrderStatus === stp.jobOrderStatus)) {
          stopdata.push((stp.actualStopDuration/60).toFixed(2));
        } else {
          stopdata.push(0);
        }
      });
      let color = ConvertUtil.dynamicRGBColors();
      stopDataSet.push({
          label: stp.stopCauseName,
          backgroundColor: color,
          data: stopdata
      });
    });

    // operationlineLabels.forEach(label => {
    //   const operationdata = this.stops.filter(itm => itm.operationName === label);
    //   if(operationdata && operationdata.length > 0) {
        
    //   }
    // })

    this.barEfficiencyData = {
      labels: lineLabels,
      datasets: [
        {
          label: me.capacityEfficiency,
          backgroundColor: '#0fb41d',
          data: capacityEfficiency
        }, {
          label: me.quantityEfficiency,
          backgroundColor: '#ff9c3d',
          data: quantityEfficiency
        }, {
          label: me.quantityPerformance,
          backgroundColor: '#3a53c0',
          data: quantityPerformance
        }, {
          label: me.qualityPerformance,
          backgroundColor: '#4bc0c0',
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
          label: me.goodQuantity,
         
          backgroundColor: '#0fb41d',

          data: goodQuantity
        },
        {
          label: 'Scrap Quantity',
          
          backgroundColor: '#ff9c3d',
          
          data: scrapQuantity
        },
        {
          label: 'Rework Quanity',
         
          backgroundColor: '#3a53c0',
          
          data: reworkQuantity
        },
        // {
        //   label: 'Quality Efficiency',
        //   // fill: false,
        //   // pointStyle: 'rect',
        //   backgroundColor: '#4bc0c0',
        //   // pointBorderWidth: 3,
        //   data: qualityEfficiency
        // }

      ]
    };

    this.stopPORData = {
      labels: lineLabels,
      datasets: stopDataSet
    }

    // this.stopPOROptions = {
    //   fill: false,
    //   responsive: true,
    //   scales: {
    //     xAxes: [{
    //       // type: 'time',
    //       display: true,
    //       ticks: {
    //         autoSkip: false,
    //         maxRotation: 90,
    //         minRotation: 0
    //       },

    //       // time: {
    //       //   unit: 'hour',
    //       // },
    //       scaleLabel: {
    //         display: true,
    //         // labelString: 'Time',
    //       }
    //     }],
    //     yAxes: [{
    //       ticks: {
    //         beginAtZero: true,
    //       },
    //       display: true,
    //       scaleLabel: {
    //         display: true,
    //         labelString: "Minutes",
    //       }
    //     }]
    //   },
    //   tooltips: {
    //     enable: true,
    //     callbacks: {
    //       label: function (tooltipItem, data) {
    //         let label = data.datasets[tooltipItem.datasetIndex].label || '';

    //         if (label) {
    //           label += ': ';
    //         }
    //         label += ConvertUtil.minuteDuration2StrTime(tooltipItem.yLabel);
    //         return label;
    //       }
    //     }
    //   },
    //   hover: {
    //     animationDuration: 1
    //   },
    //   scaleValuePaddingX: 10,
    //   scaleValuePaddingY: 10,
    //   animation: {
    //     duration: 1000,
    //     onComplete: function () {
    //       const chartInstance = this.chart,
    //         ctx = chartInstance.ctx;
    //       ctx.textAlign = 'center';
    //       ctx.fillStyle = '#000000';
    //       // const fontSize = 18;
    //       ctx.font = 'lighter 11px "Arial"';
    //       ctx.textBaseline = 'middle';
    //       this.data.datasets.forEach(function (dataset, i) {
    //         const meta = chartInstance.controller.getDatasetMeta(i);
    //         if (!meta.hidden) {
    //           meta.data.forEach(function (bar, index) {

    //             const b = stopDataSet
    //             const percent = "20"
    //             // const padding = 6;
    //             // const offset = Math.abs(bar._model.base - bar._model.y) / 2;
    //             const position = bar.tooltipPosition();
    //             ctx.font = '10px regular';
    //             ctx.fillText(percent + '%', position.x, position.y - 5);

    //           });
    //         }
    //       });
    //     }
    //   }
    // };

  }

  getPercentage(val) {
    if (val) {
      return (val * 100).toFixed(2);
    }
    return 0;
  }


  getProdOrderStops(data) {
    const temp = Object.assign({}, data);
    delete temp.jobOrderId;
    delete temp.startDate;
    delete temp.endDate;
    this.stopService.customsStops(temp).then((res: any) => {
      this.stops = res;
    }).catch(err => {
      this.utilities.showErrorToast(err);
    });
  }

  setStopReasonDataGraph(data) {
    this.stops = data.map(itm => {
      return itm.stopReasonList.map(stp => ({...stp, workstationName: itm.workstationName,
        jobOrderOperationId: itm.jobOrderOperationId,
        jobOrderStatus: itm.jobOrderStatus, operationName: itm.operationName}))
    });
    this.stops = [].concat.apply([], this.stops);

  }

  getProdOrderMachineStops(data) {
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
    this.barEfficiencyData = null;
    this.linePowerData = null;
    this.linePowerConsData = null;
    this.lineQuantityData = null;
    this.stopPORData = null;
    this.efficiencyOptions = {
      fill: false,
      responsive: true,
      scales: {
        xAxes: [{
          // type: 'time',
          display: true,
          ticks: {
            autoSkip: false,
            maxRotation: 90,
            minRotation: 0
          },

          // time: {
          //   unit: 'hour',
          // },
          scaleLabel: {
            display: true,
            // labelString: 'Time',
          }
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true,
          },
          display: true,
          scaleLabel: {
            display: true,
            labelString: "Percentage (%)",
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
            label += tooltipItem.value;
            return label;
          }
        }
      },
      hover: {
        animationDuration: 1
      }
    };
    this.quantityOptions = {
      fill: false,
      responsive: true,
      scales: {
        xAxes: [{
          // type: 'time',
          display: true,
          ticks: {
            autoSkip: false,
            maxRotation: 90,
            minRotation: 0
          },

          // time: {
          //   unit: 'hour',
          // },
          scaleLabel: {
            display: true,
            // labelString: 'Time',
          }
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true,
          },
          display: true,
          scaleLabel: {
            display: true,
            labelString: "Quantity",
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
            label += tooltipItem.yLabel;
            return label;
          }
        }
      },
      hover: {
        animationDuration: 1
      }
     
    };
    this.stopPOROptions = {
      fill: false,
      responsive: true,
      scales: {
        xAxes: [{
          // type: 'time',
          display: true,
          ticks: {
            autoSkip: false,
            maxRotation: 90,
            minRotation: 0
          },

          // time: {
          //   unit: 'hour',
          // },
          scaleLabel: {
            display: true,
            // labelString: 'Time',
          }
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true,
          },
          display: true,
          scaleLabel: {
            display: true,
            labelString: "Minutes",
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
      scaleValuePaddingX: 10,
      scaleValuePaddingY: 10,
      animation: {
        duration: 1000,
        // onComplete: function () {
        //   const chartInstance = this.chart,
        //     ctx = chartInstance.ctx;
        //   ctx.textAlign = 'center';
        //   ctx.fillStyle = '#000000';
        //   // const fontSize = 18;
        //   ctx.font = 'lighter 11px "Arial"';
        //   ctx.textBaseline = 'middle';
        //   this.data.datasets.forEach(function (dataset, i) {
        //     const meta = chartInstance.controller.getDatasetMeta(i);
        //     if (!meta.hidden) {
        //       meta.data.forEach(function (bar, index) {

        //         const b = stopDataSet
        //         const percent = "20"
        //         // const padding = 6;
        //         // const offset = Math.abs(bar._model.base - bar._model.y) / 2;
        //         const position = bar.tooltipPosition();
        //         ctx.font = '10px regular';
        //         ctx.fillText(percent + '%', position.x, position.y - 5);

        //       });
        //     }
        //   });
        // }
      }
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
            minRotation: 0
          },

          // time: {
          //   unit: 'hour',
          // },
          scaleLabel: {
            display: true,
            // labelString: 'Time',
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
      tooltips: {
        enable: true,
        callbacks: {
          label: function (tooltipItem, data) {
            let label = data.datasets[tooltipItem.datasetIndex].label || '';
            if (label) {
              label += ': ';
            }
            label += tooltipItem.value;
            return label;
          }
        }
      },
      // legend: {
      //   display: true,
      //   position: 'top',
      //   labels: {
      //     fontColor: '#000000',
      //   }
      // },
      hover: {
        animationDuration: 1
      },
      scaleValuePaddingX: 10,
      scaleValuePaddingY: 10,
      animation: {
        duration: 1000,
        // onComplete: function () {
        //   const chartInstance = this.chart,
        //     ctx = chartInstance.ctx;
        //   ctx.textAlign = 'center';
        //   ctx.fillStyle = '#000000';
        //   // const fontSize = 18;
        //   ctx.font = 'lighter 11px "Arial"';
        //   ctx.textBaseline = 'middle';
        //   this.data.datasets.forEach(function (dataset, i) {
        //     const meta = chartInstance.controller.getDatasetMeta(i);
        //     if (!meta.hidden) {
        //       meta.data.forEach(function (bar, index) {

        //         const b = stopDataSet
        //         const percent = "20"
        //         // const padding = 6;
        //         // const offset = Math.abs(bar._model.base - bar._model.y) / 2;
        //         const position = bar.tooltipPosition();
        //         ctx.font = '10px regular';
        //         ctx.fillText(percent + '%', position.x, position.y - 5);

        //       });
        //     }
        //   });
        // }
      }
    };
  }

}
