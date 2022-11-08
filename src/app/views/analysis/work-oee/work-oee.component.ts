import {Component, Input, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';


@Component({
  selector: 'job-order-stops',
  templateUrl: './work-oee.component.html',
  styleUrls: ['./work-oee.component.scss']
})
export class WorkOeeComponent implements OnInit {
  barData: any;
  options: any;

  @Input('workStationId') set x(workStationId) {
    this.resetChartS();
  }

  constructor(private _translateSvc: TranslateService) {

  }


  ngOnInit(): void {
    this.resetChartS();
    this.barData = {
      labels: [''],
      datasets: [
        {
          label: 'Oee',
          backgroundColor: 'rgba(30,136,229,0.8)',
          borderColor: '#132f5c',
          data: [65]
        },
        {
          label: 'Availability',
          backgroundColor: 'rgba(180,126,58,0.8)',
          borderColor: '#4b3826',
          data: [28]
        }, {
          label: 'Performance',
          backgroundColor: 'rgba(21,44,204,0.8)',
          borderColor: '#132496',
          data: [28]
        }, {
          label: 'Quality',
          backgroundColor: 'rgba(106,179,58,0.8)',
          borderColor: '#223415',
          data: [28]
        }
      ]
    }
  }


  private resetChartS() {
    this.barData = null;
    this.options = {

      fill: false,
      responsive: true,
      scales: {
        xAxes: [{
          display: true,
          barPercentage: 0.8,
          categoryPercentage: 0.5,
          scaleLabel: {
            display: true,
            labelString: '',
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
          gridLines: {
            color: 'rgba(200,200,200,0.4)',
            lineWidth: 1
          },
          scaleLabel: {
            display: true,
            labelString: ' ',
          }
        }]
      },
      legend: {
        display: true,
        position: 'right',
        labels: {
          fontColor: '#e9e9e0',
          fontSize: 10,
          boxWidth: 25,

        }
      },
    };
  }

}
