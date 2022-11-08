import { Component, OnInit, OnDestroy } from '@angular/core';
import { SalesDashboardService } from 'app/services/dto-services/sales-dash/sales-dash.service';
import { Subscription, Subject } from 'rxjs';
import { AppStateService } from 'app/services/dto-services/app-state.service';

import { debounceTime, switchMap } from 'rxjs/operators';
import { LoaderService } from 'app/services/shared/loader.service';
import { TranslateService } from '@ngx-translate/core';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
@Component({
  selector: 'sales-dashboard',
  templateUrl: './sales-dash.component.html',
  styles: [`
    :host .layout-dashboard .my-table .ui-panel-content-wrapper .ui-panel-content p-table .ui-table th,td {
       background-color: #33bd9c;
       border: none;
       color: black;
    }
    :host .layout-dashboard .stats-box:hover{
     text-shadow:none;
     line-height:20px;
    }
    :host .layout-dashboard .stats-box:hover .statistics{
      color:red;
      cursor: pointer;
     }.sales-link{
      font-size: 1em;
      color: #780000;
     }
     .card-content-red .ui-card{
       height:80px
     }
  `]
})

// tslint:disable-next-line: component-class-suffix
export class SalesDashboardComponent implements OnInit, OnDestroy {

  cols: any[];

  selectedCity: any;

  sub: Subscription;

  pageFilter = {
    plantId: null
  };

  salesInfo: any = {};

  classListForSalesSummary = ['sales', 'views', 'users', 'checkins'];

  private searchTerms = new Subject<any>();

  barData: any;

  options: any;

  height = '60vh';

  modal = {
    active: null,
    status: null,
    type: null
  };

  constructor(
    private saleDashService: SalesDashboardService,
    private loaderService: LoaderService,
    private appStateService: AppStateService,
    private _translateSvc: TranslateService) {

   

  }

  ngOnInit() {
    this.options = {
      title: {
        display: false,
        text: this._translateSvc.instant('lead-time-of-sale-order-items')
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
        yAxes: [
          {
            stacked: true
          }
        ]
      },

    }
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.saleDashService.getSalesInfo(term))).subscribe(
        result => {
          this.salesInfo = result;
          this.loaderService.hideLoader();

          if (this.salesInfo.saleOrderStatusList && this.salesInfo.saleOrderStatusList.length > 0) {
            const statusIndex = [
              { status: 'DOCUMENT_CONFIRMED', count: ((this.salesInfo.saleOrderStatusList.find(itm => itm.status === 'DOCUMENT_CONFIRMED')) ? this.salesInfo.saleOrderStatusList.find(itm => itm.status === 'DOCUMENT_CONFIRMED').count : null) },
              { status: 'ORDER_IN_HOUSE', count: ((this.salesInfo.saleOrderStatusList.find(itm => itm.status === 'ORDER_IN_HOUSE')) ? this.salesInfo.saleOrderStatusList.find(itm => itm.status === 'ORDER_IN_HOUSE').count : null) },
              { status: 'DOCUMENT_READY', count: ((this.salesInfo.saleOrderStatusList.find(itm => itm.status === 'DOCUMENT_READY')) ? this.salesInfo.saleOrderStatusList.find(itm => itm.status === 'DOCUMENT_READY').count : null) },
              { status: 'READY_FOR_PLANNING', count: ((this.salesInfo.saleOrderStatusList.find(itm => itm.status === 'READY_FOR_PLANNING')) ? this.salesInfo.saleOrderStatusList.find(itm => itm.status === 'READY_FOR_PLANNING').count : null) },
              { status: 'IN_PROCESS', count: ((this.salesInfo.saleOrderStatusList.find(itm => itm.status === 'IN_PROCESS')) ? this.salesInfo.saleOrderStatusList.find(itm => itm.status === 'IN_PROCESS').count : null) },
              { status: 'PARTIAL_COMPLETED', count: ((this.salesInfo.saleOrderStatusList.find(itm => itm.status === 'PARTIAL_COMPLETED')) ? this.salesInfo.saleOrderStatusList.find(itm => itm.status === 'PARTIAL_COMPLETED').count : null) },
              { status: 'COMPLETED', count: ((this.salesInfo.saleOrderStatusList.find(itm => itm.status === 'COMPLETED')) ? this.salesInfo.saleOrderStatusList.find(itm => itm.status === 'COMPLETED').count : null) },
              { status: 'PARTIAL_DELIVERED', count: ((this.salesInfo.saleOrderStatusList.find(itm => itm.status === 'PARTIAL_DELIVERED')) ? this.salesInfo.saleOrderStatusList.find(itm => itm.status === 'PARTIAL_DELIVERED').count : null) },
              { status: 'DELIVERED', count: ((this.salesInfo.saleOrderStatusList.find(itm => itm.status === 'DELIVERED')) ? this.salesInfo.saleOrderStatusList.find(itm => itm.status === 'DELIVERED').count : null) },
              { status: 'CANCELED', count: ((this.salesInfo.saleOrderStatusList.find(itm => itm.status === 'CANCELED')) ? this.salesInfo.saleOrderStatusList.find(itm => itm.status === 'CANCELED').count : null) },
            ];
            this.salesInfo.saleOrderStatusList = statusIndex;

          }

          this.barData = null;

          if (!this.salesInfo.saleOrderCompletionLeadTimes ||
            this.salesInfo.saleOrderCompletionLeadTimes.saleOrderItemList.length < 1) {
            return;
          }
          const labels = [];
          const completionTimes = [];
          const leadTimes = [];

          this.salesInfo.saleOrderCompletionLeadTimes.saleOrderItemList.forEach(item => {
            labels.push(item.stockName);
            // I Just guess the rest service will return oee value between 0-1;
            completionTimes.push(item.completionTime);
            leadTimes.push(item.leadTime);
          });

          this.barData = {
            labels: labels,
            datasets: [
              {
                label: this._translateSvc.instant('completion_time'),
                backgroundColor: '#6af544',
                borderColor: '#36dd35',
                data: completionTimes
              },
              {
                label: this._translateSvc.instant('sale_lead_time'),
                backgroundColor: '#f5712f',
                borderColor: '#e06729',

                data: leadTimes
              },

            ]
          };
        },
        error => {
          this.loaderService.hideLoader();
          this.salesInfo = [];
        }
      );
    // this.filter(this.pageFilter);


    this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
      if (!(res)) {
        this.pageFilter.plantId = null;
      } else {
        this.pageFilter.plantId = res.plantId;
        this.filter(this.pageFilter);
      }
      
    });
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  filter(data) {
    this.loaderService.showLoader();
    this.searchTerms.next(data);
  }

  randomColors(status) {
    let colorclass = 'status';
    switch (status) {
      case 'COMPLETED':
        colorclass = 'completed'
        break;
      case 'ORDER_IN_HOUSE':
        colorclass = 'waiting'
        break;
      case 'DELIVERED':
        colorclass = 'delivered'
        break;
      case 'DOCUMENT_CONFIRMED':
        colorclass = 'request'
        break;
      case 'DOCUMENT_READY':
        colorclass = 'confirmed'
        break;
      case 'IN_PROCESS':
        colorclass = 'inprogress'
        break;
      case 'DELETED':
        colorclass = 'deleted'
        break;
      case 'CANCELED':
        colorclass = 'canceled'
        break;
      case 'PARTIAL_COMPLETED':
        colorclass = 'partialcompleted'
        break;
      case 'PARTIAL_DELIVERED':
        colorclass = 'partialdelivered'
        break;
      case 'READY_FOR_PLANNING':
        colorclass = 'readyforplanning'
        break;
      default:
        break;
    }

    return colorclass;
  }
  getData() {
    const data = [];
    data.push({ statusOfPO: 'Completed', today: 0, week: 0, month: 0 });
    data.push({
      statusOfPO: 'Partially Completed',
      today: 0,
      week: 0,
      month: 0
    });
    data.push({ statusOfPO: 'Modified', today: 0, week: 0, month: 0 });

    return data;
  }

  showDetailModal(modal:string, orderStatus = null){
    if(modal === 'SALES'){
      this.modal.active = true;
      this.modal.status = orderStatus;
      this.modal.type = modal;
    }else if(modal === 'PRODUCTIONORDER'){
      this.modal.active = true;
      this.modal.status = orderStatus;
      this.modal.type = modal;
    }
  }
}
