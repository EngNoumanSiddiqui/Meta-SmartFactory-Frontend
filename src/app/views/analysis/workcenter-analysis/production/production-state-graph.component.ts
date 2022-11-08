import {Component, Input, OnInit, ViewChild} from '@angular/core';
import { UIChart } from 'primeng';
import { WorkCenterAnalysisDash } from 'app/dto/workcenter/workcenter.model';
import {ConvertUtil} from '../../../../util/convert-util';

@Component({
  selector: 'production-state-graph',
  template: `
  <p-chart #chart type="bar" [data]="barData" [options]="options" [height]="height" ></p-chart>
  `
})

// tslint:disable-next-line: component-class-suffix
export class ProductionStateGraphComponent implements OnInit {
  @ViewChild('chart') chart: UIChart;

  barData: any;

  options: any;
  height = '60vh';
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
        this.width = '900px';
    } else {
        this.width = '800px';
    }

    const labels = [];
    const Stoppeddata = [];
    const UnKnownStopped = [];
    const Productiondata = [];
    const Closeddata = [];
    const Waitingdata = [];
    const WaitingLabordata= [];
    const WaitingMaintenancedata= [];
    const WaitingQualitydata= [];
    const Setupdata = [];
    item.workstationAnalysisList.forEach(ws => {
      labels.push(ws.workstationName);
      // I Just guess the rest service will return oee value between 0-1;
      if (!ws.productionStatesTotalDurationList) {
        Stoppeddata.push(0);
        Productiondata.push(0);
        Closeddata.push(0);
        Waitingdata.push(0);
        WaitingLabordata.push(0);
        WaitingMaintenancedata.push(0);
        WaitingQualitydata.push(0);
        Setupdata.push(0);
        UnKnownStopped.push(0);
        return 0;
      };
      ws.productionStatesTotalDurationList.forEach(tt => {
        if (tt.name === 'STOPPED') {
          Stoppeddata.push(this.seconds2Min(tt.duration));
        } else if (tt.name === 'PRODUCTION') {
          Productiondata.push(this.seconds2Min(tt.duration));
        } else if (tt.name === 'CLOSED') {
          Closeddata.push(this.seconds2Min(tt.duration));
        } else if (tt.name === 'WAITING_FOR_JOB') {
            Waitingdata.push(this.seconds2Min(tt.duration));
        } else if (tt.name === 'WAITING_FOR_LABOR') {
          WaitingLabordata.push(this.seconds2Min(tt.duration));
        } else if (tt.name === 'WAITING_FOR_MAINTENANCE') {
          WaitingMaintenancedata.push(this.seconds2Min(tt.duration));
        } else if (tt.name === 'WAITING_FOR_QUALITY') {
          WaitingQualitydata.push(this.seconds2Min(tt.duration));
        } 
        else if (tt.name === 'SETUP') {
            Setupdata.push(this.seconds2Min(tt.duration));
        } else if (tt.name === 'UNKNOWN_STOPPED') {
          UnKnownStopped.push(this.seconds2Min(tt.duration));
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
          label: 'STOPPED',
          backgroundColor: '#b70b00',
          borderColor: '#b70b00',
          data: Stoppeddata
        },
        {
          label: 'PRODUCTION',
          backgroundColor: '#3ab54a',
          borderColor: '#3ab54a',
          data: Productiondata
        },
        {
          label: 'CLOSED',
          backgroundColor: '#333333',
          borderColor: '#333333',
          data: Closeddata
        },
        {
          label: 'WAITING_FOR_JOB',
          backgroundColor: '#4c4b4b',
          borderColor: '#4c4b4b',
          data: Waitingdata
        }
        ,
        {
          label: 'WAITING_FOR_LABOR',
          backgroundColor: '#8b8872',
          borderColor: '#8b8872',
          data: Waitingdata
        }
        ,
        {
          label: 'WAITING_FOR_MAINTENANCE',
          backgroundColor: '#5c3c64',
          borderColor: '#5c3c64',
          data: Waitingdata
        }
        ,
        {
          label: 'WAITING_FOR_QUALITY',
          backgroundColor: '#e9c4a7',
          borderColor: '#e9c4a7',
          data: Waitingdata
        }
        ,
        {
          label: 'SETUP',
          backgroundColor: '#20a8d8',
          borderColor: '#20a8d8',
          data: Setupdata
        },
        {
          label: 'UNKNOWN_STOPPED',
          backgroundColor: '#fb1809',
          borderColor: '#fb1809',
          data: UnKnownStopped
        }

      ],
    };
  }

  seconds2Min(seconds) {
    if (seconds) {
      return  ConvertUtil.fix(seconds / 60,1);
    }
    return 0;
  }
}
