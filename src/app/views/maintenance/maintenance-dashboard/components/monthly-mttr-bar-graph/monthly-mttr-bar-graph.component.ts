import {Component, Input, OnInit} from '@angular/core';
import {ConvertUtil} from '../../../../../util/convert-util';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-monthly-mttr-bar-graph',
  templateUrl: './monthly-mttr-bar-graph.component.html',
  styleUrls: ['./monthly-mttr-bar-graph.component.scss']
})
export class MonthlyMttrBarGraphComponent implements OnInit {

  barData: any;

  options: any;

  mttrInfo: any;
  monthlyMTTRList = [];

  @Input('mttrInfo') set setMTTRInfo(mttrInfo) {
    if (mttrInfo) {
      this.mttrInfo = mttrInfo;
      this.initChart(mttrInfo);
    }
  }

  constructor(private _translateSvc: TranslateService) {
  }

  ngOnInit() {
    this.options = {
      title: {
        display: true,
        text: this._translateSvc.instant('maintenance-dashboard-mttr-in-hours')
      },
      tooltips: {
        mode: 'index',
        intersect: false
      },
      responsive: true,
      hover: {
        animationDuration: 1
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      },
      animation: {
        duration: 1000,
        onComplete: function () {
          const chartInstance = this.chart,
            ctx = chartInstance.ctx;
          ctx.textAlign = 'center';
          ctx.fillStyle = '#181818';
          ctx.font = 'lighter 0.75rem "Arial"';
          ctx.textBaseline = 'middle';
          this.data.datasets.forEach(function (dataset, i) {
            const meta = chartInstance.controller.getDatasetMeta(i);
            if (meta.hidden) {
              return;
            }
            meta.data.forEach(function (bar, index) {
              const percent = dataset.data[index];
              const offset = -5;

              ctx.fillText(percent, bar._model.x, bar._model.y + offset);

            });
          });
        }
      }
    };

    this.initChart(this.mttrInfo);
  }


  private initChart(mttrInfo) {
    if (!mttrInfo) {
      return;
    }

    const me = this;
    this.monthlyMTTRList = mttrInfo.monthlyMTTRList;
    this.barData = null;

    const labels = [];
    const firstData = [];
    const mttr = 'MTTR';

    this.monthlyMTTRList.forEach(item => {
      // labels.push(item.yearMonth.year + '-' + item.yearMonth.monthValue);
      labels.push(item.yearMonth);
      firstData.push(this.convertSecondsToHours(item.mttrInSeconds));
    });
    this.barData = {
      labels: labels,
      datasets: [
        {
          label: mttr,
          backgroundColor: ConvertUtil.hexToRGB('#12a9f5', 0.5),
          borderColor: '#12a9f5',
          data: firstData,
          borderWidth: 1
        }

      ]
    };
  }

  convertSecondsToHours(value) {
    const diffInHours: number = value / 60 / 60;
    // if (diffInHours < 0 || diffInHours === 0) {
    //   diffInHours += 24;
    // }
    return diffInHours.toFixed(2);
  }

}
