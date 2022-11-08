import {Component, Input, OnInit} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import {WorkstationDashboardService} from '../../../../services/dto-services/workstation/workstation-dashboard.service';
import {UtilitiesService} from '../../../../services/utilities.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-oee-looses-by-shift',
  templateUrl: './oee-looses-by-shift.component.html',
  styleUrls: ['./oee-looses-by-shift.component.scss'],
  providers: [DecimalPipe]
})
export class OeeLoosesByShiftComponent implements OnInit {

  barData: any;

  options: any;
  
  height: string = '35vh';

  @Input('data') set d(data){
    if(data){
     this.initChart(data);
    }
  }

  @Input('height') set h(height: string){
    this.height = height;
  }

  constructor(
    private workDashSvc: WorkstationDashboardService, 
    private utilities: UtilitiesService,
    private _decimalPipe: DecimalPipe,
    private _translateSvc: TranslateService) {
      
    }

  ngOnInit() {
    this.options = {
      title: {
        display: true,
        text: this._translateSvc.instant('oee_by_shift')
      },
      tooltips: {
        mode: 'index',
        intersect: false
      },
      responsive: true,
      scales: {
        xAxes: [{
          stacked: true,
        }],
        yAxes: [{
          stacked: true
        }]
      },
      hover: {
        animationDuration: 1
      },
      animation: {
        duration: 1000,
        onComplete: function () {
          const chartInstance = this.chart,
            ctx = chartInstance.ctx;
          ctx.textAlign = 'center';
          ctx.fillStyle = '#181818';
          ctx.font = 'lighter 10px "Arial"';
          // ctx.fontSize = '0.8rem';
          ctx.textBaseline = 'middle';
          this.data.datasets.forEach(function (dataset, i) {
            const meta = chartInstance.controller.getDatasetMeta(i);
            if (meta.hidden) {
              return;
            }
            meta.data.forEach(function (bar, index) {
              if(dataset.data[index] != 0){
                const percent = dataset.data[index] + '%';
                const offset = Math.abs(bar._model.base - bar._model.y) / 2;
                ctx.font = '12px regular';
                if(dataset.data[index] <0){
                  ctx.fillText(percent, bar._model.x, bar._model.y - 12 + offset);

                }else{
                ctx.fillText(percent, bar._model.x, bar._model.y + offset);

                }
              }
            });
          });
        }
      }
    };

  }


  initChart(data) {

    const labels = [];
    const availabilityData = [];
    const performanceData = [];
    const qualityData = [];

    data.forEach(item => {
      if(item.innerList.length > 0){
        // let firstShift = item.innerList[0];  
        let firstShift = item.innerList;
        firstShift.forEach(fShift => {
          let shift = labels.some((item)=> item === fShift.dimension);
          if(!shift){
            labels.push(fShift.dimension);
            availabilityData.push(this._decimalPipe.transform(fShift.overAllAvailabilityLoss * 100, '0.2-2'));
            performanceData.push(this._decimalPipe.transform(fShift.overAllPerformanceLoss* 100, '0.2-2'));
            qualityData.push(this._decimalPipe.transform(fShift.overAllQuantityLoss * 100, '0.2-2'));
          }
        });  
      }
    });

    this.barData = {
      labels: labels,
      datasets: [
        {
          label: this._translateSvc.instant('availability_loss'),
          backgroundColor: '#f5712f',
          borderColor: '#e06729',
          data: availabilityData
        }, {
          label: this._translateSvc.instant('performance_loss'),
          backgroundColor: '#6af544',
          borderColor: '#36dd35',
          data: performanceData
        }, {
          label: this._translateSvc.instant('quality_loss'),
          backgroundColor: '#42A5F5',
          borderColor: '#1E88E5',
          data: qualityData
        },
      ]
    };
  }

}
