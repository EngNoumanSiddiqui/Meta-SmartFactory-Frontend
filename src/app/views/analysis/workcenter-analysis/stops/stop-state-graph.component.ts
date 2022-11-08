import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { StopStateList, StopStateTotalDurationList, WorkCenterAnalysisDash } from 'app/dto/workcenter/workcenter.model';
import { UIChart } from 'primeng/chart';
import {ConvertUtil} from '../../../../util/convert-util';

@Component({
    selector: 'stop-state-graph',
    template: `
    <p-chart #chart type="bar" [data]="barData" [options]="options" [height]="height" ></p-chart>
    `
})

export class StopStateGraphComponent implements OnInit {

  @ViewChild('chart') chart: UIChart;

  barData: any;

  options: any;
  height = '50vh';
  width = 'auto';
  @Input() barWidth = false;

  workCenterAnalysis: any;
  @Input('workCenterAnalysis') set f(workCenterAnalysis) {
    // this.loadData(filterModel);
    if (workCenterAnalysis) {
      this.workCenterAnalysis = workCenterAnalysis;
    }
    // this.initChart(workCenterAnalysis)
  }
  stoplist = [];
  @Input('stopList') set setstops(stopList) {
    // this.loadData(filterModel);
    if (stopList) {
      this.stoplist = stopList;
      this.initChart(this.workCenterAnalysis)
    }
  }

  @Input('height') set h(height) {
    this.height = height;
  }

  constructor() {

  }

  ngOnInit() {
    this.options = {
    //   title: {
    //     display: true,
    //     text: 'Oee By Workstation'
    //   },
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
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            suggestedMin: 0,
            suggestedMax: 100
          } ,
          scaleLabel: {
            display: true,
            labelString: 'Times (minutes) ',
          }
        }]
      },
      animation: {
        duration: 1000,
        onComplete: function () {
          const chartInstance = this.chart,
            ctx = chartInstance.ctx;
          ctx.textAlign = 'center';
          ctx.fillStyle = '#000000';
          ctx.font = 'lighter 0.75rem "Arial"';
          // ctx.fontSize = '1em';
          ctx.textBaseline = 'middle';
          this.data.datasets.forEach(function (dataset, i) {
            const meta = chartInstance.controller.getDatasetMeta(i);
            if (meta.hidden) {
              return;
            }
            meta.data.forEach(function (bar, index) {
              let percent = '';
              if (dataset.data[index] > 0) {
                percent = dataset.data[index];
              }
              const offset = -3;

              ctx.fillText(percent, bar._model.x, bar._model.y + offset);

            });
          });
        }
      }
    };

  }


  private initChart(item: WorkCenterAnalysisDash) {
    if (!item || !item.workstationAnalysisList || item.workstationAnalysisList.length < 1) {
      return;
    }
    if (item.workstationAnalysisList.length > 13 && this.barWidth) {
        this.width = '600px';
    } else {
        this.width = '550px';
    }
    const labels = [];
    item.workstationAnalysisList.forEach(ws => {
      labels.push(ws.workstationName);
    });
    this.barData = {
      labels: labels,
      datasets: []
    };
const me  = this;
    this.stoplist.forEach(stopitem => {
      const Basedata = [];
      item.workstationAnalysisList.forEach(ws => {
        if (!ws.stopStateTotalDurationList || ws.stopStateTotalDurationList.length === 0) {
          Basedata.push(0);
        } else {
          const founditem  = ws.stopStateTotalDurationList.find(tt => stopitem.name === tt.name);
          if (founditem) {
            Basedata.push(me.seconds2Min(founditem.duration));
          } else {
            Basedata.push(0);
          }
        }
      });
      this.barData.datasets.push({
              label: stopitem.name,
              backgroundColor: stopitem.color,
              borderColor: stopitem.color,
              data: Basedata
      });

    });


  }

  seconds2Min(seconds) {
    if (seconds) {
     return  ConvertUtil.fix(seconds / 60,1);
    }
    return 0;
  }
}
