import {Component, Input, OnInit, ViewChild, SimpleChanges, OnChanges} from '@angular/core';
import {WorkstationDashboardService} from '../../../../services/dto-services/workstation/workstation-dashboard.service';
import {UtilitiesService} from '../../../../services/utilities.service';
import { UIChart } from 'primeng';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-oee-by-workstation',
  templateUrl: './oee-by-workstation.component.html',
  styleUrls: ['./oee-by-workstation.component.scss']
})

export class OeeByWorkstationComponent implements OnInit {
  @ViewChild('chart') chart: UIChart;

  barData: any;

  options: any;
  height: string = '50vh';
  width: string = 'auto';
  @Input() barWidth: boolean = false;

  @Input('filterModel') set f(filterModel) {
    this.initChart(filterModel);
  }

  @Input('height') set h(height){
    this.height = height;
  }

  constructor(
    private workDashSvc: WorkstationDashboardService, 
    private utilities: UtilitiesService,
    private _translateSvc: TranslateService) {

  }

  loadData(filterModel) {
    this.barData = null;
    if (filterModel) {

      const tempFilter = Object.assign({}, filterModel, {pageNumber: 1, pageSize: 50})
      this.workDashSvc.getOeeOfWorkstations(tempFilter).then(res => {
        if(res['content'].length > 13 && this.barWidth){
          this.width = '600px';
        }else{
          this.width = 'auto';
        }
        this.initChart(res['content']);
      }).catch(err => {
        this.utilities.showErrorToast(err);
      });
    }
  }
  ngOnInit() {
    this.options = {
      title: {
        display: true,
        text: this._translateSvc.instant('oee_by_workstation')
      },
      tooltips: {
        mode: 'index',
        intersect: false,
        callbacks: {
          title: function(tooltipItems, data) {
            let label = data.tempLabels[tooltipItems[0].index];
            return label;
          }
        },
      },
      responsive: true,
      hover: {
        animationDuration: 1
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            suggestedMin: 0,
            suggestedMax: 100
          }
        }]
      },
      animation: {
        duration: 1000,
        onComplete: function () {
          const chartInstance = this.chart,
            ctx = chartInstance.ctx;
          ctx.textAlign = 'center';
          ctx.fillStyle = '#000000';
          ctx.font = 'lighter 11px "Arial"';
          // ctx.fontSize = '1em';
          ctx.textBaseline = 'middle';
          this.data.datasets.forEach(function (dataset, i) {
            const meta = chartInstance.controller.getDatasetMeta(i);
            if (meta.hidden) {
              return;
            }
            meta.data.forEach(function (bar, index) {
              var percent = '';
              if(dataset.data[index] > 0){
                percent = dataset.data[index] + '%';
              }
              const offset = -3;

              // ctx.fillText(percent, bar._model.x, bar._model.y + offset);

            });
          });
        }
      }
    };

  }


  private initChart(items) {
    const me = this;

    // this.barData = null;

    if (!items || items.length < 1) {
      return;
    }
    const labels = [];
    const tempLabels = [];
    const data = [];
    var overallOEE = [];
  
    items.forEach(item => {
      let workstationName = item.workstationName;
      tempLabels.push(workstationName);
      
      if(workstationName.length > 15) {
        workstationName = workstationName.substr(workstationName, 15) + '...';
      }
      labels.push(workstationName);
      // I Just guess the rest service will return oee value between 0-1;
      data.push(me.getPercentageVal(item.oee));
      overallOEE.push(me.getPercentageVal(items[0].overAllOee));

    });

    this.barData = {
      labels: labels,
      tempLabels: tempLabels,
      datasets: [
        {
          label: this._translateSvc.instant('oee'),
          backgroundColor: '#4188f5',
          borderColor: '#2c63f5',
          data: data
        },
        {
          label: this._translateSvc.instant('overall_oee'),
          backgroundColor: 'green',
          borderColor: 'green',
          data: overallOEE,
          type:'line',
          fill: false
        }
      ]
    };
  }


  getPercentageVal(val) {
    if (val) {
      return (val * 100).toFixed(2);
    }
    return 0;
  }



}
