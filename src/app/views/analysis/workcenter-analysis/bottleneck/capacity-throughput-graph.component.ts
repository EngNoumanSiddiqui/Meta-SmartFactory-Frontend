import {Component, OnInit, Input, ViewChild} from '@angular/core';
import { WorkCenterAnalysisDash} from 'app/dto/workcenter/workcenter.model';
import {UIChart} from 'primeng/chart';
import {TranslateService} from '@ngx-translate/core';
import {ConvertUtil} from '../../../../util/convert-util';
import { WorkstationService } from 'app/services/dto-services/workstation/workstation.service';

@Component({
  selector: 'capacity-throughput-graph',
  template: `
    <p-chart #chart type="bar" [data]="barData" [options]="options" [height]="height" ></p-chart>
  `
})

export class CapacityThroughputGraphComponent implements OnInit {

  @ViewChild('chart') chart: UIChart;

  barData: any;

  options: any;
  height = '50vh';
  @Input() barWidth = false;

  workCenterAnalysis: any;

  @Input('workCenterAnalysis') set f(workCenterAnalysis) {
    // this.loadData(filterModel);
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

    const productionTimes = [];
    const stopTimes = [];
    const totalThroughputs = [];
    const activeThroughputs = [];
    const labels = [];
    item.workstationAnalysisList.forEach(ws => {
      labels.push(ws.workstationName);
      stopTimes.push(this.seconds2Min(ws.stopTime));
      productionTimes.push(this.seconds2Min(ws.productionTime));
      totalThroughputs.push(ConvertUtil.fix(ws.totalThroughput, 1));
      activeThroughputs.push(ConvertUtil.fix(ws.activeThroughput, 1));
    });
    this.barData = {
      labels: labels,
      datasets: [
        {
          label: this.translateSvc.instant('production-time'),
          backgroundColor: '#a09997',
          borderColor: '#a09997',
          order: 2,
          data: productionTimes,
          yAxisID: 'y-axis-1',

        }, {
          label: this.translateSvc.instant('stop-time'),
          backgroundColor: '#f5ca72',
          borderColor: '#f5ca72',
          data: stopTimes,
          order: 2,
          yAxisID: 'y-axis-1',
        }, {
          label: this.translateSvc.instant('active-throughput'),
          backgroundColor: '#f56642',
          borderColor: '#f56642',
          data: activeThroughputs,
          type: 'line',
          fill: false,
          order: 1,
          lineTension: 0,
          yAxisID: 'y-axis-2',
        }, {
          label: this.translateSvc.instant('total-throughput'),
          backgroundColor: '#42A5F5',
          borderColor: '#1E88E5',
          data: totalThroughputs,
          type: 'line',
          order: 1,
          fill: false,
          lineTension: 0,
          yAxisID: 'y-axis-2',
        },
      ]
    };

    this.options = {
      title: {
        display: true,
        text: this.translateSvc.instant('throughput-and-capacity')
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
      onClick: function(e) {
        var xLabel = this.scales['x-axis-0'].getValueForPixel(e.offsetX);
        const id = item.workstationAnalysisList[xLabel].workstationId
        // var value = this.data.labels[xLabel];
        WorkstationService.showWorkstationDetailDialog(id);
        // console.log(xLabel.format('MMM YYYY'));

        // alert("clicked x-axis area: " + xLabel.format('MMM YYYY'));
      },
      responsive: true,
      hover: {
        animationDuration: 1
      },
      scales: {
        xAxes: [
          {
            stacked: true,
          }
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
              let percent = dataset.data[index] ;
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
      return  ConvertUtil.fix(seconds / 60,1);
    }
    return 0;
  }
}
