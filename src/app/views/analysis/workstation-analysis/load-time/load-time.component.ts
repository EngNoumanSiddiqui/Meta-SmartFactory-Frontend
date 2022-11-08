import {Component, Input, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {WorkstationStopItemDto} from '../../../../dto/analysis/workstation/workstation-stop-item';


@Component({
  selector: 'load-time-anlyz',
  templateUrl: './load-time.component.html'
})
export class LoadTimeAnlyzComponent implements OnInit {
  barData: any;
  options: any;
  sitems: Array<WorkstationStopItemDto>;

  @Input('items') set x(items) {
    this.resetChartS();
    this.initializeChart(items);
    this.sitems = items;
  }

  constructor(private _translateSvc: TranslateService) {


  }


  ngOnInit(): void {

  }

  private resetChartS() {
    this.barData = null;
    this.options = {

      fill: false,
      responsive: true,
      scales: {
        xAxes: [{
          display: false,
          scaleLabel: {
            display: false,
            labelString: '',
          }
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true,
          },
          display: false,
          scaleLabel: {
            display: true,
            labelString: ' ',
          }
        }]
      }
    };
  }


  initializeChart(items: WorkstationStopItemDto[]) {

    if (!items || items.length === 0) {
      return;
    }

    const newLabels = [];
    const newBarData = [];

    items.forEach(item => {
      newLabels.push(item.shiftDate);
      newBarData.push(item.jobLoadedTimeAsMin);
    });


    this.barData = {
      labels: newLabels,
      datasets: [
        {
          label: 'Production (Job Loaded) Time',
          backgroundColor: 'rgba(255, 105, 75, 0.6)',
          borderColor: '#ff694b',
          borderWidth: 1,
          data: newBarData
        },
      ]
    };


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
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true,
          },
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Production (Job Loaded) Time (min)',
          }
        }]
      },
      tooltips: {
        enabled: true
      },
      hover: {
        animationDuration: 1
      },
      scaleValuePaddingX: 10,
      scaleValuePaddingY: 10,
      animation: {
        duration: 1,
        onComplete: function () {
          const chartInstance = this.chart,
            ctx = chartInstance.ctx;
          ctx.textAlign = 'center';
          ctx.fillStyle = '#000000';
          ctx.fontSize = '1em';
          ctx.textBaseline = 'middle';
          this.data.datasets.forEach(function (dataset, i) {
            const meta = chartInstance.controller.getDatasetMeta(i);
            meta.data.forEach(function (bar, index) {
              const percent = items[index].jobLoadedTime;
              ctx.fillText(percent, bar._model.x, bar._model.y - 4);

            });
          });
        }
      }
    };


  }

}
