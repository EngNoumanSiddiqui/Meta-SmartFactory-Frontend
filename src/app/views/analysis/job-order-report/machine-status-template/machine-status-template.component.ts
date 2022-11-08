import {Component, Input, OnInit} from '@angular/core';
import {StopPercentage} from '../../../../dto/analysis/stop-down-time/stop-percentage';
import {ConvertUtil} from '../../../../util/convert-util';


@Component({
  selector: 'machine-status-analysis',
  template: `
    <p-chart *ngIf="injected" type="bar" [data]="barData" [options]="options"></p-chart>`
})
export class MachineStatusTemplateComponent implements OnInit {
  barData: any;
  options: any;
  injected: any;


  @Input() labelY = 'minutes';


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
    const me = this;

    if (injected == null) {
      return;
    }
    const newLabels = [];
    const newBardatasets = [];
    injected.forEach(item => {

      const color = this.dynamicColors(item.stopCause);
      newBardatasets.push({
        label: item.stopCause,
        borderColor: 'rgb(' + color + ')',
        borderWidth: 1,
        data: [item.stopDurationAsMinutes],
        backgroundColor: 'rgba(' + color + ',0.5)'
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
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true,
          },
          display: true,
          scaleLabel: {
            display: true,
            labelString: me.labelY,
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
        onComplete: function () {
          const chartInstance = this.chart,
            ctx = chartInstance.ctx;
          ctx.textAlign = 'center';
          ctx.fillStyle = '#000000';
          const fontSize = 18;
          ctx.fontSize = fontSize;
          ctx.textBaseline = 'middle';
          this.data.datasets.forEach(function (dataset, i) {
            const meta = chartInstance.controller.getDatasetMeta(i);
            if (!meta.hidden) {
              meta.data.forEach(function (bar, index) {

                const percent = injected[i].stopPercent;
                const padding = 4;
                const position = bar.tooltipPosition();
                ctx.fillText(percent + '%', position.x, position.y - (fontSize / 2) + padding);

              });
            }
          });
        }
      }
    };

  }

  machineStateColors = {
    Closed: '#393939',
    StandBy: '#FFDB9B',
    Running: '#76F110',
    Stopped: '#EE452F',
    Setup: '#ee8354'
  };

  dynamicColors(item) {

    if (item && this.machineStateColors[item]) {
      return this.hexToColorNum(this.machineStateColors[item]);
    }

    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return '' + r + ',' + g + ',' + b;
  };

  private hexToColorNum(hex) {
    const r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);
    return '' + r + ', ' + g + ', ' + b;
  }
}
