import {Component, Input, OnInit} from '@angular/core';
import {StopPercentage} from '../../../dto/analysis/stop-down-time/stop-percentage';
import {ConvertUtil} from '../../../util/convert-util';


@Component({
  selector: 'monitoring-stop-analysis',
  template: `
    <p-chart *ngIf="injected" type="bar" [height]="'350px'" [data]="barData" [options]="options"></p-chart>`
})
export class MonitoringStopTemplateComponent implements OnInit {
  barData: any;
  options: any;
  injected: any;


  @Input('injected')
  set in(injected) {
    this.injected = injected;
    this.initializeCharts(this.injected);
  }


  constructor() {

  }

  ngOnInit(): void {
  }


  private initializeCharts(injected: Array<StopPercentage>) {
    this.barData = null;

    if (injected == null) {
      return;
    }
    const newLabels = [];
    const newBardatasets = [];
    injected.forEach(item => {

      let borderColor = ConvertUtil.dynamicRGBColors();
      let backColor = ConvertUtil.dynamicRGBColors(0.5);

      if (item.color) {
        borderColor = ConvertUtil.hexToRGB(item.color)
        backColor = ConvertUtil.hexToRGB(item.color, 0.5)
      }

      newBardatasets.push({
        label: item.stopCause,
        borderColor: borderColor,
        borderWidth: 1,
        data: [item.stopDurationAsMinutes],
        backgroundColor: backColor
      })

      ;
    });

    this.barData = {
      labels: newLabels,
      datasets: newBardatasets
    };
    this.options = {
      fill: false,
      responsive: true,
      scales: {
        xAxes: [{
          display: false,
          gridLines: {
            display: false
          },
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true,
            fontColor: 'rgba(255,255,255,0.8)'
          },
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Stop minutes',
            fontColor: 'rgba(255,255,255,0.8)',
          },
          gridLines: {
            color: 'rgba(200,200,200,0.4)',
            lineWidth: 1
          },
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
        onComplete: function () {
          const chartInstance = this.chart,
            ctx = chartInstance.ctx;
          ctx.textAlign = 'center';
          ctx.fillStyle = '#d6d6d6';
          const fontSize = 18;

          ctx.fontSize = fontSize;
          ctx.textBaseline = 'middle';
          this.data.datasets.forEach(function (dataset, i) {
            const meta = chartInstance.controller.getDatasetMeta(i);
            if (!meta.hidden) {
              meta.data.forEach(function (bar, index) {

                const percent = injected[i]?.stopPercent;
                const padding = 4;
                const position = bar.tooltipPosition();
                ctx.fillText(percent + '%', position.x, position.y - (fontSize / 2) + padding);

              });
            }
          });
        }
      },
      legend: {
        display: true,
        position: 'top',
        labels: {
          fontColor: '#e9e9e0',
          fontSize: 10,
          boxWidth: 25,

        }
      },
    };

  }

  dynamicColors() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return '' + r + ',' + g + ',' + b;
  };


}
