import {Component, Input, OnInit, ViewChild} from '@angular/core';
import { UIChart } from 'primeng';
import { WorkCenterAnalysisDash } from 'app/dto/workcenter/workcenter.model';
import { ConvertUtil } from 'app/util/convert-util';

@Component({
  selector: 'workstation-status-item',
  template: `
  <p-chart #chart type="bar" [data]="barData" [options]="options" [height]="height" ></p-chart>
  `
})

// tslint:disable-next-line: component-class-suffix
export class WorkstationStatusItemChart implements OnInit {
  @ViewChild('chart') chart: UIChart;

  barData: any;

  options: any;
  height = '50vh';
  width = 'auto';
  @Input() barWidth = false;

  @Input('workstations') set f(workstations) {
    // this.loadData(filterModel);
    this.initChart(workstations)
  }

  @Input('height') set h(height) {
    this.height = height;
  }

  constructor() {

  }

//   loadData(filterModel) {
//     this.barData = null;
//     if (filterModel) {

//       const tempFilter = Object.assign({}, filterModel, {pageNumber: 1, pageSize: 50})
//       this.workDashSvc.getOeeOfWorkstations(tempFilter).then(res => {
//         if(res['content'].length > 13 && this.barWidth){
//           this.width = '600px';
//         }else{
//           this.width = 'auto';
//         }
//         this.initChart(res['content']);
//       }).catch(err => {
//         this.utilities.showErrorToast(err);
//       });
//     }
//   }
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
            let label = data.datasets[tooltipItem.datasetIndex].label || '';

            if (label) {
              label += ': ';
            }
            
              return label + ConvertUtil.minuteDuration2StrTime(tooltipItem.yLabel);
            
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
            suggestedMax: 100,
          },
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
    const datasets = [];
    if (!item || !item.workstationAnalysisList || item.workstationAnalysisList.length < 1) {
      return;
    }
    if (item.workstationAnalysisList.length > 13 && this.barWidth) {
        this.width = '600px';
    } else {
        this.width = '550px';
    }

    const labels = [];
    const standBydata = [];
    const Runningdata = [];
    const Closeddata = [];
    item.workstationAnalysisList.forEach(ws => {
      labels.push(ws.workstationName);
      // I Just guess the rest service will return oee value between 0-1;
      if (!ws.machineStatesTotalDurationList) {
        standBydata.push(0);
        Runningdata.push(0);
        Closeddata.push(0);
        return 0;
      };
      ws.machineStatesTotalDurationList.forEach(tt => {
        if (tt.name === 'StandBy') {
          standBydata.push(this.seconds2Min(tt.duration).toFixed(0));
        } else if (tt.name === 'Running') {
          Runningdata.push(this.seconds2Min(tt.duration).toFixed(0));

        } else if (tt.name === 'Closed') {
          Closeddata.push(this.seconds2Min(tt.duration).toFixed(0));
        }
        // data.push(this.seconds2Min(tt.duration).toFixed(0));
      });
      // const time = ConvertUtil.longDuration2DHHMMSSTime(item.duration);
    // //  ws.machineStatesTotalDurationList.forEach(mchine => {
    // //   const dataset = {
    // //     backgroundColor: this.getBackgroundColor(mchine),
    // //     borderColor: this.getBackgroundColor(mchine),
    // //     data: [this.seconds2Min(mchine.duration).toFixed(0)],
    // //     label: mchine.name
    // //   }
    // //   datasets.push(dataset);
    //  });
    });
    this.barData = {
      labels: labels,
      datasets: [
        {
          label: 'StandBy',
          backgroundColor: '#ffd48f',
          borderColor: '#ffd48f',
          data: standBydata
        },
        {
          label: 'Running',
          backgroundColor: '#76F110',
          borderColor: '#76F110',
          data: Runningdata
        },
        {
          label: 'Closed',
          backgroundColor: '#333333',
          borderColor: '#333333',
          data: Closeddata
        }

      ],
    };
  }


  seconds2Min(seconds) {
    if (seconds) {
      return seconds / 60;
    }
    return 0;
  }
}
