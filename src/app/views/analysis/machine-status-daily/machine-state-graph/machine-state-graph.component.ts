import {Component, Input, OnInit} from '@angular/core';
import {StopCauseGroupTotalDurationDto} from '../../../../dto/workstation/workstation.model';

@Component({
  selector: 'machine-state-graph',
  templateUrl: './machine-state-graph.html'
})

export class MachineStateGraphComponent implements OnInit {

  machineData: StopCauseGroupTotalDurationDto[];
  data: any;
  options: any;

  @Input('machineState') set x(machineState) {
    this.machineData = JSON.parse(JSON.stringify(machineState));
    this.drawGraph();
  }

  constructor() {
    this.setGraphOptions();
  }

  ngOnInit() {

  }

  setGraphOptions() {
    this.options = {
      legend: {
        display: false,
      },
      tooltips: {
        callbacks: {
          title: () => null,
        }
      },
      scales: {
        xAxes: [{
          display: false
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true,
          },
          scaleLabel: {
            display: true,
            labelString: 'Minutes',
          }
        }]
      }

    }
  }

  drawGraph() {
    const datasets = [];
    this.machineData.forEach((element: StopCauseGroupTotalDurationDto) => {
      const dataset = {
        backgroundColor: this.getBackgroundColor(element),
        borderColor: this.getBackgroundColor(element),
        data: [parseFloat(this.seconds2Min(element.duration).toFixed(2))],
        label: element.name
      }
      datasets.push(dataset);
    });
    this.data = {
      labels: [],
      datasets: datasets,
      legend: {
        display: false,
      },

    };
    this.setGraphOptions();
  }

  getBackgroundColor(data: StopCauseGroupTotalDurationDto) {
    const status = data.name;
    let backgroundColor = '';

    switch (status) {
      case 'Running':
        backgroundColor = '#76F110';
        break;
      case 'StandBy':
        backgroundColor = '#ffd48f';
        break;
      case 'Closed':
        backgroundColor = '#333333';
        break;
      case 'Stopped':
        backgroundColor = '#f5183b';
        break;
      case 'Setup':
        backgroundColor = '#20a8d8';
        break;
    }

    return backgroundColor;
  }

  seconds2Min(seconds) {
    if (seconds) {
      return seconds / 60;
    }
    return 0;
  }

}
