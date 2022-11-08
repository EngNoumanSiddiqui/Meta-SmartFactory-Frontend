import {Component, Input, OnInit} from '@angular/core';
import {StopCauseGroupTotalDurationDto} from '../../../../dto/workstation/workstation.model';

@Component({
  selector: 'workstation-status-graph',
  templateUrl: './workstation-status-graph.html'
})

export class WorkStationStatusGraphComponent implements OnInit {

  machineData: StopCauseGroupTotalDurationDto[];
  data: any;
  options: any;

  @Input('machineStatus') set x(machineStatus) {
    this.machineData = JSON.parse(JSON.stringify(machineStatus));
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

    }
  }

  getBackgroundColor(data: StopCauseGroupTotalDurationDto) {
    const status = data.name;
    let backgroundColor = '';

    switch (status) {
      case 'CLOSED':
        backgroundColor = 'black';
        break;
      case 'WAITING_FOR_JOB':
        backgroundColor = '#fbe55f';
        break;
      case 'WAITING_FOR_LABOR':
        backgroundColor = '#8b8872';
        break;
      case 'WAITING_FOR_MAINTENANCE':
        backgroundColor = '#5c3c64';
        break;
      case 'WAITING_FOR_QUALITY':
        backgroundColor = '#e9c4a7';
        break;       
      case 'STOPPED':
        backgroundColor = '#b70b00';
        break;
      case 'PRODUCTION':
        backgroundColor = '#3ab54a';
        break;
      case 'MAINTENANCE':
        backgroundColor = '#f7941d';
        break;
      case 'SETUP':
        backgroundColor = '#20a8d8';
        break;
      case 'SETUP_OVERTIME':
        backgroundColor = '#806bf8';
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
