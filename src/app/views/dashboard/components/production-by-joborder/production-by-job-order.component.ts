import {Component, Input, OnInit} from '@angular/core';
import {WorkstationDashboardService} from '../../../../services/dto-services/workstation/workstation-dashboard.service';
import {UtilitiesService} from '../../../../services/utilities.service';
import { TranslateService } from '@ngx-translate/core';
import { LoaderService } from 'app/services/shared/loader.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { JobOrderServiceStatic } from 'app/services/dto-services/job-order/job-order-static.service';

@Component({
  selector: 'app-production-by-job-order',
  templateUrl: './production-by-job-order.component.html',
  styleUrls: ['./production-by-job-order.component.scss']
})
export class ProductionByJobOrderComponent implements OnInit {

  barData: any;

  options: any;
  height: string = '50vh';
  filterModel: any = {};

  @Input('filterModel') set f(filterModel) {

    this.filterModel = filterModel;
    this.loadData(filterModel);

  }

  @Input('height') set h(height: string){
    this.height = height;
  }


  constructor(
    private workDashSvc: WorkstationDashboardService, 
    private utilities: UtilitiesService,
    private _loaderService: LoaderService,
    private _translateSvc: TranslateService) {

  }

  private initChart(items) {

    this.barData = null;

    if (!items || items.length < 1) {
      return;
    }
    const labels = [];
    const goodCount = [];
    const scrapCount = [];

    items.forEach(item => {
      if(this.filterModel.workstationId) {
        if(item.referenceId) {
          labels.push(['JO' + item.jobOrderId, 'R' + item.referenceId]);
        } else {
          labels.push('JO' + item.jobOrderId);
        }
      } else {
        labels.push('JO' + item.jobOrderId);
      }
     
      // I Just guess the rest service will return oee value between 0-1;
      goodCount.push(item.goodCount);
      scrapCount.push(item.scrapCount);
    });
    this.barData = {
      labels: labels,
      datasets: [
        {
          label: this._translateSvc.instant('Scrap'),
          backgroundColor: '#f5712f',
          borderColor: '#e06729',

          data: scrapCount
        },
        {
          label: this._translateSvc.instant('good_quantity'),
          backgroundColor: '#6af544',
          borderColor: '#36dd35',
          data: goodCount
        },

      ]
    };
  }

  loadData(filterModel) {
    if (filterModel) {
      const tempFilter = Object.assign({}, filterModel, {pageNumber: 1, pageSize: 50})
      this.workDashSvc.getJobOrderQantities(tempFilter).then(res => {
        this.initChart(res['content']);
      });
    }
  }


  showJOModal(jobOrderId) {
    this._loaderService.showDetailDialog(DialogTypeEnum.JOBORDER, jobOrderId);
  }


  ngOnInit() {

    // this.barData = {
    //   labels: ['JO1', 'JO2', 'JO3', 'JO4', 'JO5', 'JO6', 'JO7', 'JO8'],
    //   datasets: [
    //     {
    //       label: 'Scrap',
    //       backgroundColor: '#f5712f',
    //       borderColor: '#e06729',

    //       data: [10, 5, 10, 30, 20, 5, 5, 5]
    //     },
    //     {
    //       label: 'Good Count',
    //       backgroundColor: '#6af544',
    //       borderColor: '#36dd35',
    //       data: [10, 20, 30, 10, 20, 20, 20, 10]
    //     },
    //   ]
    // };


    this.options = {
      title: {
        display: true,
        text: this._translateSvc.instant('production_by_job_order')
      },
      tooltips: {
        mode: 'index',
        intersect: false
      },
      onClick: function(e) {
        var xLabel = this.scales['x-axis-0'].getValueForPixel(e.offsetX);
        var value = this.data.labels[xLabel];
        if(typeof(value) == 'string') {
          JobOrderServiceStatic.showJobOrderDetails(value.substr(2))
        } else if(typeof(value) == 'object') {
          JobOrderServiceStatic.showJobOrderDetails(value[0].substr(2))
        }

        // console.log(xLabel.format('MMM YYYY'));

        // alert("clicked x-axis area: " + xLabel.format('MMM YYYY'));
      },
      // onClick : function(event, array) {
      //   let element = this.getElementAtEvent(event);
      //     if (element.length > 0) {
      //         // var series= element[0]._model.datasetLabel;
      //         var label = element[0]._model.label;
      //         JobOrderServiceStatic.showJobOrderDetails(label.substr(2))
      //         // var value = this.data.datasets[element[0]._datasetIndex].data[element[0]._index];
      //     }
      // },
      responsive: true,
      // onClick: function(e) {
      //   var xLabel = this.scales['x-axis-0'].getElementsAtEvent(e);
      //   console.log(xLabel.format('MMM YYYY'));
      //   alert("clicked x-axis area: " + xLabel.format('MMM YYYY'));
      // },
      scales: {
        xAxes: [{
          stacked: true,
        }],
        yAxes: [
          {
            stacked: true
          }
        ]
      },

    }

  }

}
