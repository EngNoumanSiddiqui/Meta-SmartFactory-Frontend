import {Component, Input, OnInit} from '@angular/core';
import {ConvertUtil} from '../../../../util/convert-util';
import {DashboardService} from '../../../../services/dto-services/dashboard/dashboard.service';
import {UtilitiesService} from '../../../../services/utilities.service';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-daily-scrap-graph',
  templateUrl: './dail-scrap-graph.component.html',
  styleUrls: ['./daily-scrap-graph.component.scss']
})
export class DailyScrapGraphComponent implements OnInit {

  barData: any;

  options: any;

  dailyPercentageList = [
    // {day: '11-01-2011', percentage: 0.1},
    // {day: '12-01-2011', percentage: 0.4},
    // {day: '13-01-2011', percentage: 0.2},
    // {day: '14-01-2011', percentage: 0.1},
  ];

  @Input('filterModel') set f(filterModel) {
    if (filterModel && filterModel.startDate && filterModel.finishDate) {
      this.loadScrapCause(filterModel);
    }

  }

  constructor(private dashboardService: DashboardService, private utilities: UtilitiesService, private datePipe: DatePipe) {

  }

  loadScrapCause(filterModel) {

    this.dashboardService.getDailyScrapPercentageList(filterModel).then(res => {
      this.initChart(res);
    }).catch(err => {
      this.utilities.showErrorToast(err);
    })

  }

  ngOnInit() {
    this.options = {
      title: {
        display: true,
        text: 'Daily Scrap Percentage'
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
        yAxes: [
          {
            position: 'left',
            id: 'y-axis-1',
            ticks: {
              beginAtZero: true,
              suggestedMin: 0,
            },
            display: 'auto',
            scaleLabel: {
              display: true,
              labelString: 'Counts',
            }
          },
          {
            position: 'right',
            id: 'y-axis-2',
            ticks: {
              beginAtZero: true,
              min: 0,
              max: 100
            },
            display: 'auto',
            scaleLabel: {
              display: true,
              labelString: 'Percentage',
            }
          }
        ]
      },
      animation: {
        duration: 0,
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
              if(percent) {
                ctx.fillText(percent, bar._model.x, bar._model.y + offset);
              }

            });
          });
        }
      }
    };

    this.initChart(this.dailyPercentageList);

  }

  repaint() {
    this.initChart(this.dailyPercentageList);
  }


  private initChart(items) {
    const me = this;
    this.dailyPercentageList = items;
    this.barData = null;

    if (!items) {
      return;
    }
    const labels = [];
    const scrapCountData = [];
    const goodCountData = [];
    const percentageData = [];
    const scrapCount = 'Scrap Count';
    const goodCount = 'Good Count';
    const percentage = 'Per. %';

    items.forEach(item => {
      let day = this.datePipe.transform(ConvertUtil.localDate2UTC(item.day), 'dd.MM.yyyy');
      labels.push(day);
      percentageData.push(this.getPercentageVal(item.percentage));
      scrapCountData.push(item.scrapCount);
      goodCountData.push(item.goodCount);
    });
    this.barData = {
      labels: labels,
      datasets: [
        {
          label: scrapCount,
          borderColor: '#f56e38',
          yAxisID: 'y-axis-1',
          backgroundColor: ConvertUtil.hexToRGB('#f56e38', 0.5),
          data: scrapCountData,
          order:2,
          borderWidth: 1
        },
        {
          label: goodCount,
          yAxisID: 'y-axis-1',
          backgroundColor: ConvertUtil.hexToRGB('#12a9f5', 0.5),
          borderColor: '#12a9f5',
          data: goodCountData,
          order:2,
          borderWidth: 1
        },
        {
          label: percentage,
          yAxisID: 'y-axis-2',
          borderColor: '#f56e38',
          backgroundColor: ConvertUtil.hexToRGB('#f56e38', 0.5),
          data: percentageData,
          fill: false,
          type: 'line',
          order:1,
          lineTension: 0,
          // borderWidth: 1
        },

      ]
    };
  }
  getPercentageVal(val) {
    if (val) {
      return (val * 100).toFixed();
    }
    return 0;
  }
}
