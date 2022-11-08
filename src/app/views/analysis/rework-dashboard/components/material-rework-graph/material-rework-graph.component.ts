import {Component, Input, OnInit} from '@angular/core';
import { DashboardService } from 'app/services/dto-services/dashboard/dashboard.service';
import { UtilitiesService } from 'app/services/utilities.service';

@Component({
  selector: 'app-material-rework-graph',
  templateUrl: './material-rework-graph.component.html',
  styleUrls: ['./material-rework-graph.component.scss']
})
export class MaterialReworkGraphComponent implements OnInit {

  barData: any;

  options: any;


  // fakeData = [
  //   {
  //     materialName: 'Material 1', percentage: 0.5
  //   },
  //   {
  //     materialName: 'Material 2', percentage: 0.4
  //   },
  //   {
  //     materialName: 'Material 3', percentage: 0.3
  //   },
  //   {
  //     materialName: 'Material 3', percentage: 0.2
  //   },
  // ];

  @Input('filterModel') set f(filterModel) {
    if (filterModel && filterModel.startDate && filterModel.finishDate) {
      this.loadMaterialScrapList(filterModel);
    }

  }

  constructor(private dashboardService: DashboardService, private utilities: UtilitiesService) {

  }

  loadMaterialScrapList(filterModel) {
    this.dashboardService.getMaterialWithReworkPercentageList(filterModel).then(res => {
      this.initChart(res);
    }).catch(err => {
      this.utilities.showErrorToast(err);
    })
  }


  ngOnInit() {
    this.options = {
      title: {
        display: true,
        text: 'Rework Percentage'
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
        xAxes: [{
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
              const percent = dataset.data[index] + '%';
              const offset = -10;

              ctx.fillText(percent, bar._model.x + offset, bar._model.y);

            });
          });
        }
      }
    };

    // this.initChart(this.fakeData);
  }


  private initChart(items) {
    const me = this;

    this.barData = null;

    if (!items || items.length < 1) {
      return;
    }
    const labels = [];
    const data = [];

    items.forEach(item => {
      labels.push(item.materialName);
      // I Just guess the rest service will return scrap percentage value between 0-1;
      data.push(me.getPercentageVal(item.percentage));
    });
    this.barData = {
      labels: labels,
      datasets: [
        {
          label: 'Rework',
          backgroundColor: '#f5542d',
          borderColor: '#f5452e',
          data: data
        }
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
