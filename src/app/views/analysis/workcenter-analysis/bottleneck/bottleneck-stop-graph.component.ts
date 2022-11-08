import {Component, OnInit, Input, ViewChild} from '@angular/core';
import {StopStateList, StopStateTotalDurationList, WorkCenterAnalysisDash} from 'app/dto/workcenter/workcenter.model';
import {UIChart} from 'primeng/chart';
import {TranslateService} from '@ngx-translate/core';
import {ConvertUtil} from '../../../../util/convert-util';
import { WorkstationService } from 'app/services/dto-services/workstation/workstation.service';

@Component({
  selector: 'bottleneck-stop-state-graph',
  template: `
    <p-chart #chart type="bar" [data]="barData" [options]="options" [height]="height"></p-chart>
    <div class="d-flex flex-row-reverse">

      <p-checkbox class="mx-2" [(ngModel)]="showStarvation" binary="true" (onChange)="onShowStarvation($event)" label="{{'show-starving'|translate}}"></p-checkbox>
      <p-checkbox class="mx-2" [(ngModel)]="showBlockage" binary="true" (onChange)="onShowBlockage($event)" label="{{'show-blocking'|translate}}"></p-checkbox>
    </div>
  `
})

export class BottleneckStopGraphComponent implements OnInit {

  @ViewChild('chart') chart: UIChart;

  barData: any;

  showBlockage = true;
  showStarvation = true;
  options: any;
  height = '50vh';
  @Input() barWidth = false;

  workCenterAnalysis: any;
  colorMap = new Map<string, Object>();

  @Input('workCenterAnalysis') set f(workCenterAnalysis) {
    // this.loadData(filterModel);
    this.colorMap = new Map<string, Object>()
    if (workCenterAnalysis) {
      this.workCenterAnalysis = workCenterAnalysis;
      this.initChart(workCenterAnalysis)
    }
  }

  @Input('height') set h(height) {
    this.height = height;
  }

  constructor(private translateSvc: TranslateService) {

  }

  onShowStarvation(event) {

    if (this.workCenterAnalysis) {
      this.initChart(this.workCenterAnalysis);
    }
  }

  onShowBlockage(event) {
    if (this.workCenterAnalysis) {
      this.initChart(this.workCenterAnalysis)
    }
  }


  ngOnInit() {
    

  }


  private initChart(item: WorkCenterAnalysisDash) {
    if (!item || !item.workstationAnalysisList || item.workstationAnalysisList.length < 1) {
      return;
    }
    // if (item.workstationAnalysisList.length > 13 && this.barWidth) {
    //   this.width = '600px';
    // } else {
    //   this.width = '550px';
    // }

    const totalThroughputs = [];
    const activeThroughputs = [];
    const labels = [];

    let multipleFactor = 1;

    if (this.showBlockage && this.showStarvation) {
      multipleFactor = 2;
    }

    const map = new Map<string, Object>();
    item.workstationAnalysisList.forEach(ws => {
      const s = [...new Array(item.workstationAnalysisList.length * multipleFactor)].fill(0);
      const b = [...new Array(item.workstationAnalysisList.length * multipleFactor)].fill(0);

      const starvedOne = 'STARVED_BY_' + ws.workstationName;
      const blockedOne = 'BLOCKED_BY_' + ws.workstationName;

      let sc = this.colorMap.get(starvedOne);
      let sb = this.colorMap.get(blockedOne);
      if (!sc || !sb) {
        const color = ConvertUtil.dynamicHEXColors();
        sc = ConvertUtil.colorShade(color, 10); // to ensure get a bit lighter color
        sb = ConvertUtil.colorShade(color, 30);
        sb = ConvertUtil.hexToRGB(sb, 0.6);
        this.colorMap.set(starvedOne, sc);
        this.colorMap.set(blockedOne, sb);
      }

      if (this.showStarvation) {
        map.set(starvedOne, {list: s, color: sc});
      }
      if (this.showBlockage) {
        map.set(blockedOne, {list: b, color: sb});
      }

    });

    item.workstationAnalysisList.forEach((ws, index) => {
      if (this.showStarvation) {
        labels.push('S;' + ws.workstationName);
      }
      if (this.showBlockage) {
        labels.push('B;' + ws.workstationName);
      }
      if(!this.showStarvation && !this.showBlockage){
        labels.push(ws.workstationName);
      }
      if (ws.bottleneckStateTotalDurationList) {
        ws.bottleneckStateTotalDurationList.forEach(it => {
          const arr = map.get(it.name);
          const bIn = (index * multipleFactor) + 1;
          const sIn = (index * multipleFactor);
          if (arr) {
            if (it.name.indexOf('STARVED_BY_') === 0) {
              if (this.showStarvation) {
                arr['list'][sIn] = this.seconds2Min(it.duration);
              }
            } else {
              if (this.showBlockage) {
                arr['list'][bIn] = this.seconds2Min(it.duration);
              }
            }
          }
        });
      }
      for (let i = 0; i < multipleFactor; i++) {
        totalThroughputs.push(ConvertUtil.fix(ws.totalThroughput, 1));
        activeThroughputs.push(ConvertUtil.fix(ws.activeThroughput, 1));
      }


    });
    const datas = [];
    map.forEach((value, key) => {
      const dt = {
        label: key,
        backgroundColor: value['color'],
        borderColor: value['color'],
        data: value['list'],
        order: 2,
        yAxisID: 'y-axis-1',
        xAxisID: 'xAxis1',
      };
      datas.push(dt);
    });

    const totalThroughput = {
      label: this.translateSvc.instant('active-throughput'),
      backgroundColor: '#f56642',
      borderColor: '#f56642',
      data: activeThroughputs,
      type: 'line',
      order: 1,
      fill: false,
      lineTension: 0,
      yAxisID: 'y-axis-2',
      // xAxisID: 'xAxis2',
    };

    const activeThroughput = {
      label: this.translateSvc.instant('total-throughput'),
      backgroundColor: '#42A5F5',
      borderColor: '#1E88E5',
      data: totalThroughputs,
      type: 'line',
      order: 1,
      fill: false,
      lineTension: 0,
      yAxisID: 'y-axis-2',
      // xAxisID: 'xAxis2',
    };
    datas.push(totalThroughput);
    datas.push(activeThroughput);

    this.barData = {
      labels: labels,
      datasets: datas
    };

    this.options = {
      title: {
        display: true,
        text: this.translateSvc.instant('blockage-and-starvation-graph')
      },
      tooltips: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function (tooltipItem, data) {
            if(tooltipItem.yLabel)
              return data.datasets[tooltipItem.datasetIndex].label + " : " + ConvertUtil.minuteDuration2StrTime(tooltipItem.yLabel);
          }
        }
      },
      responsive: true,
      hover: {
        animationDuration: 1
      },
      onClick: function(e) {
        var xLabel = this.scales['xAxis1'].getValueForPixel(e.offsetX);
        var value = this.data.labels[xLabel];
        value = value.split(";")[1];
        const id = item.workstationAnalysisList.find(x => x.workstationName ===value)?.workstationId
        if(id) { 
          WorkstationService.showWorkstationDetailDialog(id);
        }
        
        // console.log(xLabel.format('MMM YYYY'));

        // alert("clicked x-axis area: " + xLabel.format('MMM YYYY'));
      },
      scales: {
        xAxes: [
          {
            stacked: true,
            id: 'xAxis1',
            type: 'category',
            ticks: {
              callback: function (label) {
                const bt = label.split(';')[0];
                const ws = label.split(';')[1];
                return label;
              }
            }
          },
          // {
          //   stacked: true,
          //   id: 'xAxis2',
          //   type: 'category',
          //   gridLines: {
          //     drawOnChartArea: false, // only want the grid lines for one axis to show up
          //   },
          //   ticks: {
          //     callback: function (label) {
          //       const bt = label.split(';')[0];
          //       const ws = label.split(';')[1];
          //       if (bt === 'S') {
          //         return '';
          //       }
          //       return ws;
          //     }
          //   }
          // },
        ],
        yAxes: [
          {
            stacked: true,
            position: 'left',
            id: 'y-axis-1',
            ticks: {
              beginAtZero: true,
            },
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Times (minutes) ',
            }
          },
          {
            position: 'right',
            id: 'y-axis-2',
            ticks: {
              beginAtZero: true,
            },
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Throughput (count/minutes) ',
            }
          }
        ]
      },
      animation: {
        duration: 1000,
        onComplete: function () {
          const chartInstance = this.chart,
            ctx = chartInstance.ctx;
          ctx.textAlign = 'center';
          ctx.fillStyle = '#181818';
          ctx.font = 'lighter 0.75rem "Arial"';
          // ctx.fontSize = '0.8rem';
          ctx.textBaseline = 'middle';
          this.data.datasets.forEach(function (dataset, i) {
            const meta = chartInstance.controller.getDatasetMeta(i);
            if (meta.hidden) {
              return;
            }
            meta.data.forEach(function (bar, index) {
              let percent = dataset.data[index];
              if (percent === 0) {
                percent = '';
              }
              const offset = Math.abs(bar._model.base - bar._model.y) / 2;
              ctx.font = '12px regular';
              ctx.fillText(percent, bar._model.x, bar._model.y + offset);

            });
          });
        }
      }
      // legend: {
      //   onClick: function(e, legendItem) {
      //     const index = legendItem.datasetIndex;
      //     const ci = this.chart;
      //     const meta = ci.getDatasetMeta(index);
      //
      //     // See controller.isDatasetVisible comment
      //     meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;
      //
      //     // We hid a dataset ... rerender the chart
      //     ci.update();
      //   }
      // }
    };
  }


  seconds2Min(seconds) {
    if (seconds) {
      return ConvertUtil.fix(seconds / 60, 1);
    }
    return 0;
  }
}


// import {Component, OnInit, Input, ViewChild} from '@angular/core';
// import {StopStateList, StopStateTotalDurationList, WorkCenterAnalysisDash} from 'app/dto/workcenter/workcenter.model';
// import {UIChart} from 'primeng/chart';
// import {TranslateService} from '@ngx-translate/core';
// import {ConvertUtil} from '../../../util/convert-util';
//
// @Component({
//   selector: 'bottleneck-stop-state-graph',
//   template: `
//     <p-chart #chart type="bar" [data]="barData" [options]="options" [height]="height" ></p-chart>
//   `
// })
//
// export class BottleneckStopGraphComponent implements OnInit {
//
//   @ViewChild('chart') chart: UIChart;
//
//   barData: any;
//
//   options: any;
//   height = '50vh';
//   @Input() barWidth = false;
//
//   workCenterAnalysis: any;
//
//   @Input('workCenterAnalysis') set f(workCenterAnalysis) {
//     // this.loadData(filterModel);
//     if (workCenterAnalysis) {
//       this.workCenterAnalysis = workCenterAnalysis;
//       this.initChart(workCenterAnalysis)
//     }
//   }
//
//   @Input('height') set h(height) {
//     this.height = height;
//   }
//
//   constructor(private translateSvc: TranslateService) {
//
//   }
//
//
//   ngOnInit() {
//     this.options = {
//       title: {
//         display: true,
//         text: this.translateSvc.instant('throughput-and-capacity')
//       },
//       tooltips: {
//         mode: 'index',
//         intersect: false
//       },
//       responsive: true,
//       hover: {
//         animationDuration: 1
//       },
//       scales: {
//         xAxes: [
//           {
//             stacked: true,
//             id: 'xAxis1',
//             type: 'category',
//             ticks: {
//               callback: function (label) {
//                 const bt = label.split(';')[0];
//                 const ws = label.split(';')[1];
//                 return label;
//               }
//             }
//           },
//
//         ],
//         yAxes: [
//           {
//             stacked: true,
//             position: 'left',
//             id: 'y-axis-1',
//             ticks: {
//               beginAtZero: true,
//             },
//             display: true,
//             scaleLabel: {
//               display: true,
//               labelString: 'Times (minutes) ',
//             }
//           },
//           {
//             position: 'right',
//             id: 'y-axis-2',
//             ticks: {
//               beginAtZero: true,
//             },
//             display: true,
//             scaleLabel: {
//               display: true,
//               labelString: 'Throughput (count/minutes) ',
//             }
//           }
//         ]
//       },
//       animation: {
//         duration: 1000,
//         onComplete: function () {
//           const chartInstance = this.chart,
//             ctx = chartInstance.ctx;
//           ctx.textAlign = 'center';
//           ctx.fillStyle = '#181818';
//           ctx.font = 'lighter 0.75rem "Arial"';
//           // ctx.fontSize = '0.8rem';
//           ctx.textBaseline = 'middle';
//           this.data.datasets.forEach(function (dataset, i) {
//             const meta = chartInstance.controller.getDatasetMeta(i);
//             if (meta.hidden) {
//               return;
//             }
//             meta.data.forEach(function (bar, index) {
//               let percent = dataset.data[index];
//               if (percent === 0) {
//                 percent = '';
//               }
//               const offset = Math.abs(bar._model.base - bar._model.y) / 2;
//               ctx.font = '12px regular';
//               ctx.fillText(percent, bar._model.x, bar._model.y + offset);
//
//             });
//           });
//         }
//       }
//       // legend: {
//       //   onClick: function(e, legendItem) {
//       //     const index = legendItem.datasetIndex;
//       //     const ci = this.chart;
//       //     const meta = ci.getDatasetMeta(index);
//       //
//       //     // See controller.isDatasetVisible comment
//       //     meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;
//       //
//       //     // We hid a dataset ... rerender the chart
//       //     ci.update();
//       //   }
//       // }
//     };
//
//   }
//
//
//   private initChart(item: WorkCenterAnalysisDash) {
//     if (!item || !item.workstationAnalysisList || item.workstationAnalysisList.length < 1) {
//       return;
//     }
//     // if (item.workstationAnalysisList.length > 13 && this.barWidth) {
//     //   this.width = '600px';
//     // } else {
//     //   this.width = '550px';
//     // }
//
//     // const totalThroughputs = [];
//     // const activeThroughputs = [];
//     const labels = [];
//
//     const map = new Map<string, Object>();
//     item.workstationAnalysisList.forEach(ws => {
//       const s = [...new Array(item.workstationAnalysisList.length*2)].fill(2);
//       const b = [...new Array(item.workstationAnalysisList.length*2)].fill(2);
//       map.set('STARVED_BY_' + ws.workstationName, s);
//       map.set('BLOCKED_BY_' + ws.workstationName, b);
//
//     });
//
//     item.workstationAnalysisList.forEach((ws, index) => {
//       labels.push('S;' + ws.workstationName);
//       labels.push('B;' + ws.workstationName);
//
//       ws.bottleneckStateTotalDurationList.forEach(it => {
//         const arr = map.get(it.name);
//         if (arr) {
//           arr[index] = it.duration;
//         }
//       });
//       // totalThroughputs.push(ConvertUtil.fix(ws.totalThroughput, 1));
//       // activeThroughputs.push(ConvertUtil.fix(ws.activeThroughput, 1));
//     });
//     const datas = [];
//     map.forEach((value, key) => {
//       const dt = {
//         label: key,
//         backgroundColor: ConvertUtil.dynamicRGBColors(),
//         borderColor: '#a09997',
//         data: value,
//         yAxisID: 'y-axis-1',
//         xAxisID: 'xAxis1',
//       };
//       datas.push(dt);
//     });
//
//     this.barData = {
//       labels: labels,
//       datasets: datas
//     };
//   }
//
//
//   seconds2Min(seconds) {
//     if (seconds) {
//       return ConvertUtil.fix(seconds / 60, 1);
//     }
//     return 0;
//   }
// }
