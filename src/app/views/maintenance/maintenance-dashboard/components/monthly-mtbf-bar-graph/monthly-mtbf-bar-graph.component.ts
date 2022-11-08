import {Component, Input, OnInit} from '@angular/core';
import {ConvertUtil} from '../../../../../util/convert-util';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-monthly-mtbf-bar-graph',
  templateUrl: './monthly-mtbf-bar-graph.component.html',
  styleUrls: ['./monthly-mtbf-bar-graph.component.scss']
})
export class MonthlyMtbfBarGraphComponent implements OnInit {

  barData: any;

  options: any;

  mtbfInfo: any;
  monthlyMTBFList = [];

  @Input('mtbfInfo') set setMTBFInfo(mtbfInfo) {
    if (mtbfInfo) {
      this.mtbfInfo = mtbfInfo;
      this.initChart(mtbfInfo);
    }
  }

  constructor(private _translateSvc: TranslateService) {
  }

  ngOnInit() {
    this.options = {
      title: {
        display: true,
        text: this._translateSvc.instant('maintenance-dashboard-mtbf-in-hours')
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

    this.initChart(this.mtbfInfo);
  }


  private initChart(mtbfInfo) {
    if (!mtbfInfo) {
      return;
    }

    const me = this;
    this.monthlyMTBFList = mtbfInfo.monthlyMTBFList;
    this.barData = null;

    const labels = [];
    const firstData = [];
    const mtbf = 'MTBF';

    this.monthlyMTBFList.forEach(item => {
      // labels.push(item.yearMonth.year + '-' + item.yearMonth.monthValue);
      labels.push(item.yearMonth);
      firstData.push(this.convertSecondsToHours(item.mtbfInSeconds));
    });
    this.barData = {
      labels: labels,
      datasets: [
        {
          label: mtbf,
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
