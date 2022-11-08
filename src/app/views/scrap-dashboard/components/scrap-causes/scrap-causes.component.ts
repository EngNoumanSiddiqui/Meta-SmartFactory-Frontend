import {Component, Input, OnInit} from '@angular/core';
import {ConvertUtil} from '../../../../util/convert-util';
import {DashboardService} from '../../../../services/dto-services/dashboard/dashboard.service';
import {UtilitiesService} from '../../../../services/utilities.service';

@Component({
  selector: 'app-scrap-causes',
  templateUrl: './scrap-causes.component.html',
  styleUrls: ['./scrap-causes.component.scss']
})
export class ScrapCausesComponent implements OnInit {

  barData: any;

  options: any;


  // fakeData =
  //   {
  //
  //     scrapQuantityList: [
  //       {scrapCauseName: 'Cause 1', currentQuantity: 14, prevQuantity: 15},
  //       {scrapCauseName: 'Cause 2', currentQuantity: 13, prevQuantity: 15},
  //       {scrapCauseName: 'Cause 3', currentQuantity: 12, prevQuantity: 14},
  //       {scrapCauseName: 'Cause 4', currentQuantity: 11, prevQuantity: 11},
  //       {scrapCauseName: 'Cause 5', currentQuantity: 11, prevQuantity: 11},
  //     ]
  //   }
  // ;

  @Input('filterModel') set f(filterModel) {
    if (filterModel && filterModel.startDate && filterModel.finishDate) {
      this.loadScrapCause(filterModel);
    }

  }

  constructor(private dashboardService: DashboardService, private utilities: UtilitiesService) {

  }

  loadScrapCause(filterModel) {
    this.dashboardService.getMainScrapCauseList(filterModel).then(res => {
      this.initChart(res);
    }).catch(err => {
      this.utilities.showErrorToast(err);
    })
  }


  ngOnInit() {
    this.options = {
      title: {
        display: true,
        text: 'Top 5 Scrap Causes'
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

    // this.initChart(this.fakeData);
  }


  private initChart(items) {

    this.barData = null;

    if (!items) {
      return;
    }
    const labels = [];
    const firstData = [];
    const secondData = [];
    const currentWeek = 'Current';
    const lastWeek = 'Previous' ;

    items.scrapQuantityList.forEach(item => {
      labels.push(item.scrapCauseName);
      firstData.push(item.currentQuantity);
      secondData.push(item.prevQuantity);
    });
    this.barData = {
      labels: labels,
      datasets: [
        {
          label: lastWeek,
          borderColor: '#f56e38',
          backgroundColor: ConvertUtil.hexToRGB('#f56e38', 0.5),
          data: secondData,
          fill: false,
          type: 'line',
          lineTension: 0,
          // borderWidth: 1
        },
        {
          label: currentWeek,
          backgroundColor: ConvertUtil.hexToRGB('#12a9f5', 0.5),
          borderColor: '#12a9f5',
          data: firstData,
          borderWidth: 1
        }

      ]
    };
  }

}
