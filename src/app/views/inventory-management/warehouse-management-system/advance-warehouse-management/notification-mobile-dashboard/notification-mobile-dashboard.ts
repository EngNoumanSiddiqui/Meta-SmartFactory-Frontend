import { Component, OnInit, OnDestroy, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Subscription, interval as ObservableInterval} from 'rxjs';
import { AppStateService } from 'app/services/dto-services/app-state.service';

import { LoaderService } from 'app/services/shared/loader.service';
import { DashboardService } from 'app/services/dto-services/dashboard/dashboard.service';
import { ConvertUtil } from 'app/util/convert-util';
import { StockTransferNotificationService } from 'app/services/dto-services/stock-transfer-notification/stock-transfer-notification.service';
import { PreviousRouteService } from 'app/services/shared/previous-page.service';
import { EmployeeService } from 'app/services/dto-services/employee/employee.service';
import { GoodsMovementDocumentTypeEnum } from 'app/dto/stock/stock-transfer-receipt.model';

@Component({
  selector: 'notification-mobile-dashboard',
  templateUrl: './notification-mobile-dashboard.html',
  styleUrls: ['./notification-mobile-dashboard.css'],
  encapsulation: ViewEncapsulation.None
})

export class NotificationMobileDashboardComponent implements OnInit, AfterViewInit, OnDestroy {

  cols: any[];

  sub: Subscription[] = [];

  pageFilter = {
    startDate: null,
    endDate: null,
    dispatcherId: null,
    plantId: null
  };

  notificationInfo: any = {};

  classListForSalesSummary = ['sales', 'views', 'users', 'checkins'];

  height = '60vh';

  confirmedNotifications1 = [];

  confirmedNotifications2 = [];

  modal = {
    active: null,
    status: null,
    activityType: null,
    goodsMovementStatus: null,
    type: null
  };
  
  constructor(
    private _loaderSvc: LoaderService,
    private _appStateSvc: AppStateService,
    private _stockNotificationSvc: StockTransferNotificationService,
    private previouUrlSvr: PreviousRouteService,
    private _empSvc: EmployeeService,
    private _dashboardSvc: DashboardService) {
    this.sub.push( this._appStateSvc.plantAnnounced$.subscribe(res => {
      if (!(res)) {
        this.pageFilter.plantId = null;
      } else {
        this.pageFilter.plantId = res.plantId;
      }
      if (!this._dashboardSvc.stockTransferListDash) {
        this._empSvc.getProfileDetail().then((emp) => {
          this.pageFilter.dispatcherId = emp['employeeId'];
          // this.filter(this.pageFilter);
          this.filter(this.pageFilter);
        })
        
      }
    }));
  }

  ngOnInit() {
    this.sub.push(ObservableInterval( 10 * 1000).subscribe(res => {
      this.search(this.pageFilter);
    }))
    if(this.previouUrlSvr.getCurrentUrl() == "/inventory-management/warehouse-management-system/advance/notification-dashboard-dispatcher-mobile"
      && ((this.previouUrlSvr.getPreviousUrl() !== "/inventory-management/warehouse-management-system/advance/notification-management-dispatcher/dispatcher") || 
      (this.previouUrlSvr.getPreviousUrl() !== "/inventory-management/warehouse-management-system/advance/notification-dashboard-dispatcher/dispatcher"))
      ) {
        this._stockNotificationSvc.stockTransferPageOpenFirstTime = false;
        this._stockNotificationSvc.resetFilter();
        this._empSvc.getProfileDetail().then((emp) => {
          this.pageFilter.dispatcherId = emp['employeeId'];
          // this.filter(this.pageFilter);
          this.search(this.pageFilter);
        })
        
      }
  }
  ngAfterViewInit() {
    this.sub.push( this._dashboardSvc.stockTransferListDash.subscribe(
      (res: any) => {
        if (res) {
          const result = JSON.parse(JSON.stringify(res));
          let awaitingConfirmation = [];
          
          // Awaiting Confirmation 
          if (result.documentTypeAwaitingConfirmationList && result.documentTypeAwaitingConfirmationList.length > 0) {
            awaitingConfirmation[0] = result.documentTypeAwaitingConfirmationList.find((item) => item.type === 'PURCHASE_ORDER');
            awaitingConfirmation[1] = result.documentTypeAwaitingConfirmationList.find((item) => item.type === 'SALES_ORDER');
            awaitingConfirmation[2] = result.documentTypeAwaitingConfirmationList.find((item) => item.type === 'PRODUCTION_ORDER');
            awaitingConfirmation[3] = result.documentTypeAwaitingConfirmationList.find((item) => item.type === 'ON_SITE');
            awaitingConfirmation[4] = result.documentTypeAwaitingConfirmationList.find((item) => item.type === 'WORKSTATION');
            awaitingConfirmation[5] = result.documentTypeAwaitingConfirmationList.find((item) => item.type === 'MAINTENANCE_ORDER');
            awaitingConfirmation[6] = result.documentTypeAwaitingConfirmationList.find((item) => item.type === 'QUALITY_INSPECTION_LOT');
            awaitingConfirmation[7] = result.documentTypeAwaitingConfirmationList.find((item) => item.type === GoodsMovementDocumentTypeEnum.OUTSOURCE_ISSUE);
            awaitingConfirmation[8] = result.documentTypeAwaitingConfirmationList.find((item) => item.type === GoodsMovementDocumentTypeEnum.TRUCK_TRANSFER);
            awaitingConfirmation[9] = {
              type: 'TOTAL_ACTIVE_NOTIFICATIONS',
              count:  awaitingConfirmation[0].count + awaitingConfirmation[1].count + awaitingConfirmation[2].count +
              awaitingConfirmation[3].count + awaitingConfirmation[4].count + awaitingConfirmation[5].count + 
              awaitingConfirmation[6].count + awaitingConfirmation[7].count + awaitingConfirmation[8].count
            };

            result.documentTypeAwaitingConfirmationList = awaitingConfirmation;
            // console.log('documentTypeAwaitingConfirmationList', result.documentTypeAwaitingConfirmationList)
          }
          // Confirmed Notifications 1
          if (result.confirmedNotificationList && result.confirmedNotificationList.length > 0) {
            this.confirmedNotifications1[0] = result.confirmedNotificationList.find((item) => {
              if (item.type === 'PURCHASE_ORDER') {
                item.typeName = 'Purchase Order Notifications';
                return item;
              }
            });

            this.confirmedNotifications1[1] = result.confirmedNotificationList.find((item) => {
              if (item.type === 'PRODUCTION_ORDER') {
                item.typeName = 'Production Order Notifications';
                return item;
              }
            });

            this.confirmedNotifications1[2] = result.confirmedNotificationList.find((item) => {
              if (item.type === 'SALES_ORDER') {
                item.typeName = 'Sales Order Notifications';
                return item;
              }
            });

            this.confirmedNotifications1[3] = result.confirmedNotificationList.find((item) => {
              if (item.type === 'ON_SITE') {
                item.typeName = 'On Site Order Notifications';
                return item;
              }
            });
          }
          // Confirmed Notifications 2
          if (result.confirmedNotificationList && result.confirmedNotificationList.length > 0) {
            this.confirmedNotifications2[0] = result.confirmedNotificationList.find((item) => {
              if (item.type === 'WORKSTATION') {
                item.typeName = 'Workstation Notifications';
                return item;
              }
            });

            this.confirmedNotifications2[1] = result.confirmedNotificationList.find((item) => {
              if (item.type === 'MAINTENANCE_ORDER') {
                item.typeName = 'Maintenance Notifications';
                return item;
              }
            });

            this.confirmedNotifications2[2] = result.confirmedNotificationList.find((item) => {
              if (item.type === 'QUALITY_INSPECTION_LOT') {
                item.typeName = 'Quality Inspection Notifications';
                return item;
              }
            });
            this.confirmedNotifications2[3] = result.confirmedNotificationList.find((item) => {
              if (item.type === GoodsMovementDocumentTypeEnum.OUTSOURCE_ISSUE) {
                item.typeName = 'Outsource Issue Notifications';
                return item;
              }
            });
            this.confirmedNotifications2[4] = result.confirmedNotificationList.find((item) => {
              if (item.type === GoodsMovementDocumentTypeEnum.TRUCK_TRANSFER) {
                item.typeName = 'Truck Transfer Notifications';
                return item;
              }
            });

          }

          this.notificationInfo = result;
          this._loaderSvc.hideLoader();
          
        } else {
          this.filter(this.pageFilter);
        }
        this._dashboardSvc.stockTransferDashboardPageOpenFirstTime = false;
      },
      error => {
        this._loaderSvc.hideLoader();
        this.notificationInfo = [];
      }
    ));
  }
  ngOnDestroy() {
    this._dashboardSvc.stockTransferDashboardPageOpenFirstTime = true;
    this.sub.forEach(s => s.unsubscribe());
    this.notificationInfo = [];
    this.confirmedNotifications1 = [];
    this.confirmedNotifications2 = [];
  }


  filter(data) {
    this._loaderSvc.showLoader();
    this.search(data);
  }
  search(data) {
    const temp = Object.assign({}, data);
    if (temp.documentDate) {
      temp.documentDate = ConvertUtil.localDate2UTC(temp.documentDate);
    }
    this._dashboardSvc.searchstockTransferDashTerms.next(data);
  }

  randomColors(status) {
    let colorclass = 'status';
    switch (status) {
      case 'PURCHASE_ORDER':
        colorclass = 'completed'
        break;
      case 'SALES_ORDER':
        colorclass = 'inprogress'
        break;
      case 'PRODUCTION_ORDER':
        colorclass = 'request'
        break;
      case 'ON_SITE':
        colorclass = 'deleted'
        break;
      case 'WORKSTATION':
        colorclass = 'confirmed'
        break;
      case 'MAINTENANCE_ORDER':
        colorclass = 'inprogress'
        break;
      case GoodsMovementDocumentTypeEnum.OUTSOURCE_ISSUE:
        colorclass = 'outsourceissue'
        break;
      case GoodsMovementDocumentTypeEnum.TRUCK_TRANSFER:
        colorclass = 'trucktransfer'
        break;
      case 'QUALITY_INSPECTION_LOT':
        colorclass = 'request'
        break;
      case 'TOTAL_ACTIVE_NOTIFICATIONS':
        colorclass = 'totalactive'
        break;
      default:
        break;
    }

    return colorclass;
  }


  openModal(status, type, count) {
    if(count <= 0) return;

    if(type === 'DOCUMENT_TYPE'){
      this.modal.active = true;
        this.modal.status = status;
        this.modal.type = type;
        this.modal.goodsMovementStatus = 'REQUESTED';
        this.modal.activityType = null;
    }else if(type === 'CONFIRMED_NOTIFICATIONS'){
      this.modal.status = status; 
      this.modal.active = true; 
      this.modal.type = type;
      this.modal.goodsMovementStatus = 'COMPLETED';
      this.modal.activityType = null;
    }else if(type === 'ACTIVITY_TYPE'){
      this.modal.status = status; 
      this.modal.active = true; 
      this.modal.type = type;
      this.modal.goodsMovementStatus = 'REQUESTED';
      this.modal.activityType = null;
    }
    // if (type !== 'TOTAL_ACTIVE_NOTIFICATIONS') {
    //   this.modal.active = true;
    //   this.modal.status = status;
    //   this.modal.type = type;
    // } else {
    //   this.modal.active = true;
    //   this.modal.status = null;
    //   this.modal.type = type;
    //   this.modal.goodsMovementStatus = 'REQUESTED';
    // }
  }
}
