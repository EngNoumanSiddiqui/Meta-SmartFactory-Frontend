import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {UIChart} from 'primeng';
import * as moment from 'moment';


@Component({
  selector: 'equipment-monitoring-analysis',
  template: `
    <p-chart type="line" [data]="chartData" [height]="height"  [options]="options" #chart  id="chart"></p-chart>`
})
export class EquipmentMonitoringTemplateComponent implements OnInit {
  @ViewChild('chart') chart: UIChart;

  chartData: any;
  options: any;
  // injected: any;
  @Input() height = '40vh';

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
      this.chartTitle = injected.equipmentName;
      this.currentValueDataSet.push(injected.currentValue);
      this.minValueDataSet.push(injected.minValue);
      this.maxValueDataSet.push(injected.maxValue);
      this.minThresholdDataSet.push(injected.minThreshold);
      this.maxThresholdDataSet.push(injected.maxThreshold);
      this.labels.push(moment(injected.recordDate).format('DD-MM-yyyy HH:mm:ss'));

      if (this.minValueDataSet.length < 2) {
        // for fixed line
        this.minValueDataSet.push(injected.minValue);
        this.maxValueDataSet.push(injected.maxValue);
        this.minThresholdDataSet.push(injected.minThreshold);
        this.maxThresholdDataSet.push(injected.maxThreshold);
      }

      if (this.currentValueDataSet.length > 30) {
        this.currentValueDataSet.splice(0, 1);
        this.minValueDataSet.splice(0, 1);
        this.maxValueDataSet.splice(0, 1);
        this.minThresholdDataSet.splice(0, 1);
        this.maxThresholdDataSet.splice(0, 1);
        this.labels.splice(0, 1);
      }

      if (this.chart) {
        this.chart.chart.update();
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
        }, {
          label: 'Current Value',
          fill: false,
          pointBorderWidth: 1,
          pointStyle: 'rect',
          borderColor: '#51c6ff',
          data: this.currentValueDataSet
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
          display: false,
          ticks: {
            autoSkip: false,
            maxRotation: 90,
            minRotation: 30
          },
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
            labelString: 'Value',
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
            label += tooltipItem.yLabel;
            return label;
          }
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
}
