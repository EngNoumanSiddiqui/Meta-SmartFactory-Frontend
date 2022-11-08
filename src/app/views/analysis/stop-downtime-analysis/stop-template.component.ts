import {Component, Input, OnInit, ViewChild} from '@angular/core';
import { UIChart } from 'primeng';
import {StopPercentage} from '../../../dto/analysis/stop-down-time/stop-percentage';
import {ConvertUtil} from '../../../util/convert-util';

@Component({
  selector: 'stop-analysis',
  template: `
   <div class="row col-md-12">
        <p-multiSelect [options]="optionList" [(ngModel)]="selectedOptionList" 
            defaultLabel="{{'select-option' | translate}}" [style]="{minWidth: '200px'}" optionLabel="label" 
            (ngModelChange)="onSelectOptions($event)"></p-multiSelect>
    </div>
    <p-chart *ngIf="injected && !widthExtendable" type="bar" #chart2 [data]="barData" [options]="options"></p-chart>
    <p-chart *ngIf="injected && widthExtendable" type="bar" #chart2 [data]="barData" [width]="width" [options]="options"></p-chart>`
})
export class StopTemplateComponent implements OnInit {
  barData: any;
  options: any;
  injected: any;
  height = 300;
  @ViewChild('chart2') chart2: UIChart;

  optionList = [];
  selectedOptionList = [];

  @Input() labelY = 'minutes';


  @Input() widthExtendable = false;
  width: string;
  @Input('injected')
  set in(injected) {
    this.injected = injected;
    
    this.optionList = [];
    this.selectedOptionList = [];
    this.initializeCharts(this.injected);
  }

  constructor() {

  }

  ngOnInit(): void {
  }

  onSelectOptions(event) {
      this.chart2.data.datasets = [...this.selectedOptionList];
      this.chart2.chart.update();
  }


  private initializeCharts(injected: Array<StopPercentage>) {
    const me = this;

    if (injected == null) {
      return;
    }
    const newLabels = [];
    injected.forEach((item, index) => {

      let borderColor = ConvertUtil.getUniqueColor(index);
      let backColor = ConvertUtil.dynamicRGBColors(0.5);

      if (item.color) {
        borderColor = ConvertUtil.hexToRGB(item.color)
        backColor = ConvertUtil.hexToRGB(item.color, 0.5)
      }

      // if(item['workStation']) {
      //   newLabels.push(item['workStation'].workStationName);
      // }

      this.optionList.push({
        label: item.stopCause,
        borderColor: borderColor,
        borderWidth: 1,
        data: [item.stopDurationAsMinutes],
        backgroundColor: backColor
      });
      this.selectedOptionList = [...this.optionList];
    });

    this.barData = {
      labels: newLabels,
      datasets: [...this.optionList]
    };

    if (this.optionList.length > 8) {
      this.height = this.height + (this.optionList.length * 15);
    } else if (this.optionList.length > 4) {
      this.height = this.height + (this.optionList.length * 10);
    } else if (this.optionList.length > 2) {
      this.height = this.height + (this.optionList.length * 5);
    }
    if(this.widthExtendable && this.optionList.length > 8) {
      this.width = '600px';
    } else {
      this.width = '400px';
    }
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
      legend: {
          display: false,
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
          // const fontSize = 18;
          ctx.font = 'lighter 11px "Arial"';
          ctx.textBaseline = 'middle';
          this.data.datasets.forEach(function (dataset, i) {
            const meta = chartInstance.controller.getDatasetMeta(i);
            if (!meta.hidden) {
              meta.data.forEach(function (bar, index) {

               if(injected && injected.length > 0 && injected[i]) {
                const percent = injected[i].stopPercent;
                const cost = (injected[i].actualCost ? injected[i].actualCost : '') + ' ' + (injected[i].currency ? injected[i].currency : '');
                // const padding = 6;
                // const offset = Math.abs(bar._model.base - bar._model.y) / 2;
                const position = bar.tooltipPosition();
                ctx.font = '10px regular';
                ctx.fillText(percent + '%', position.x, position.y - 5);


                const offset = Math.abs(bar._model.base - bar._model.y) / 2;
                ctx.font = '12px regular';

                ctx.fillText(cost, bar._model.x, bar._model.y + offset);
               }
              });
            }
          });
        }
      }
    };

  }




}
