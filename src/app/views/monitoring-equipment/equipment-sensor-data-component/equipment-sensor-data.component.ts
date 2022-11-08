import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {UIChart} from 'primeng';
import * as moment from 'moment';


@Component({
  selector: 'equipment-sensor-data',
  template: `
    <p-chart type="line" [data]="chartData" [options]="options" #chart [height]="'350px'" id="chart"></p-chart>`
})
export class EquipmentSensorDataComponent implements OnInit {
  @ViewChild('chart') chart: UIChart;

  chartData: any;
  options: any;
  // injected: any;

  currentValueDataSet = [];
  minValueDataSet = [];
  maxValueDataSet = [];
  minThresholdDataSet = [];
  maxThresholdDataSet = [];
  labels = [];
  chartTitle: any;

  @Input('injected')
  set in(injected) {
    if (injected) {
      if (injected.length > 0) {
        this.currentValueDataSet = [];
        this.labels = [];
        this.chartTitle = injected[0].equipmentName;
        injected.forEach(item => {
          this.currentValueDataSet.push(item.currentValue);
          this.minValueDataSet.push(item.minValue);
          this.maxValueDataSet.push(item.maxValue);
          this.minThresholdDataSet.push(item.minThreshold);
          this.maxThresholdDataSet.push(item.maxThreshold);
          this.labels.push(moment(item.recordDate).format('DD.MM.yy HH:mm:ss'));
        });

        if (this.currentValueDataSet.length < 2) {
          // for fixed line
          this.currentValueDataSet.push(injected[0].currentValue);
          this.minValueDataSet.push(injected[0].minValue);
          this.maxValueDataSet.push(injected[0].maxValue);
          this.minThresholdDataSet.push(injected[0].minThreshold);
          this.maxThresholdDataSet.push(injected[0].maxThreshold);
        }
        this.initializeChart();
      }
    }
  }

  constructor() {
  }

  ngOnInit(): void {
    this.initializeChart();
  }

  private initializeChart() {

    this.chartData = {
      labels: this.labels,
      datasets: [
        {
          label: 'Sensor Value',
          fill: false,
          pointBorderWidth: 1,
          pointStyle: 'rect',
          borderColor: '#51c6ff',
          data: this.currentValueDataSet
        },
        {
          label: `Min Value`,
          data: this.minValueDataSet,
          fill: false,
          borderColor: '#17b625'
        },
        {
          label: `Max Value`,
          data: this.maxValueDataSet,
          fill: false,
          borderColor: '#9c9f42'
        },
        {
          label: 'Min Threshold',
          fill: false,
          pointBorderWidth: 1,
          borderColor: '#ff9c3d',
          data: this.minThresholdDataSet
        },
        {
          label: 'Max Threshold',
          fill: false,
          pointBorderWidth: 1,
          borderColor: '#9e76ff',
          data: this.maxThresholdDataSet
        }
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
      title: {
        display: true,
        text: this.chartTitle
      },
      scales: {
        xAxes: [{
          display: true,
          ticks: {
            display: true,
            autoSkip: true,
            maxRotation: 30,
            minRotation: 30,
            // Include a dollar sign in the ticks
            // callback: function(value, index, values) {
            //   return '$' + value;
            // },
            autoSkipPadding: 50
          },
          gridLines: {
            display: false
          },
          scaleLabel: {
            display: true,
            labelString: 'Time',
          }
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true,
            fontColor: 'rgba(0,0,0,0.8)'
          },
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Value',
            fontColor: 'rgba(0,0,0,0.8)',
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
            label += tooltipItem.yLabel;
            return label;
          }
        }
      },
      legend: {
        display: true,
        position: 'top',
        labels: {
          fontColor: '#000000',
          fontSize: 10,
          boxWidth: 25,
        }
      },
    };
  }
}
