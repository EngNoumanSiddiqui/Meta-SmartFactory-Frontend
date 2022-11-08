import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { environment } from 'environments/environment';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { QualityNotificationService } from 'app/services/dto-services/quality-notification/quality-notification.service';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
import { PorderService } from 'app/services/dto-services/porder/porder.service';
import { ActService } from 'app/services/dto-services/act/act.service';
import { WorkcenterService } from 'app/services/dto-services/workcenter/workcenter.service';
import { StockTransferReceiptService } from 'app/services/dto-services/stock-transfer-receipt/stock-transfer-receipt.service';
import { QualityNotificationReportTypeService } from 'app/services/dto-services/quality-notification-report-type/quality-notification-report-type.service';
import { AppStateService } from 'app/services/dto-services/app-state.service';

import { Subscription } from 'rxjs';
@Component({
  selector: 'new-quality-notification',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewQualityNotification implements OnInit, OnDestroy {

  @Input() fromAutoComplete = false;

  @Input('selectedInspectionLot') selectedInspectionLot;

  @Output() saveAction = new EventEmitter<any>();

  qualityNotification = {
    qualityNotificationId: null,
    qualityNotificationCode: null,
    qualityNotificationPriority: null,
    qualityNotificationType: null,
    stockId: null,
    plantId: null,
    plantName: null,
    qualityInspectionLotId: null,
    purchaseOrderId: null,
    qualityDefectRecordingId: null,
    qualityNotificationReportTypeId: null,
    notificationStatus: 'OUTSTANDING',
    documentNoId: null,
    batchId: null,
    vendorId: null,
    vendorAddress: null,
    complaintQuantity: null,
    quantityUnit: null,
    description: null,
    longText: null,
    workCenterId: null,
    saleOrder: null,
    customer: null,
    customerAddress: null,
  };

  materialsList = [];

  inspectionLotList = [];

  priorityList = [];

  reportTypeList = []

  statusList = [];

  pOrders = [];

  workCenters = [];

  activeTab: number;

  vendors = [];

  documents = [];

  actFilter = {
    pageNumber: 1,
    pageSize: 1000,
    orderByProperty: null,
    orderByDirection: 'desc'
  };
  selectedPlant: any;

  sub: Subscription;

  notificationTypes = [];

  constructor(
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _qualityNotification: QualityNotificationService,
    private _enumSvc: EnumService,
    private _pOrderSvc: PorderService,
    private _actSvc: ActService,
    private _workcenterSvc: WorkcenterService,
    private _stockReceiptSvc: StockTransferReceiptService,
    private appStateService: AppStateService,
    private _qualityNotificationReportTypeSvc: QualityNotificationReportTypeService
  ) { 
    this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
      if ((res) && res.plantId) {
        this.selectedPlant = res;
        this.qualityNotification.plantId = this.selectedPlant.plantId;
        this.qualityNotification.plantName = this.selectedPlant.plantName;
      } else {
        this.selectedPlant = null;
      }
    });
  }

  ngOnInit() {
    this._enumSvc.getQualityNoificationStatusEnum().then((res: any) => this.statusList = res);
    this._enumSvc.getQualityNotificationPriorityEnum().then((res: any) => this.priorityList = res);
    this._actSvc.filter(this.actFilter).then((res: any) => this.vendors = res['content']);
    this._qualityNotificationReportTypeSvc.filter({ pageNumber: 1, pageSize: 10000, orderByProperty: 'qualityNotificationReportTypeShortText', orderByDirection: 'desc'}).then((res: any) => this.reportTypeList = res['content']);
    this._enumSvc.getQualityNotificationTypeEnum().then((res: any) => { this.notificationTypes = res; });
    this._pOrderSvc.filter({ pageNumber: 1, pageSize: 10000, orderByProperty: 'porderId', orderByDirection: 'desc', plantId: this.qualityNotification.plantId }).then((res: any) => this.pOrders = res['content']);
    this._stockReceiptSvc.filter({ pageNumber: 1, pageSize: 10000, orderByProperty: 'porderId', orderByDirection: 'desc', plantId: this.qualityNotification.plantId }).then((res: any) => this.documents  = res['content']);
    this._workcenterSvc.filter({ pageNumber: 1, pageSize: 10000, plantId: this.qualityNotification.plantId, orderByDirection: 'desc' }).then((res: any) => this.workCenters = res['content']);

  }
  ngOnDestroy () {
    this.sub.unsubscribe();
  }

  // onChangeNotificationType(event) {
  //   console.log('@onChangeNotificationType', event)
  //   if (event) {
  //     // this.qualityNotification.qualityNotificationType = event.qualityNotificationTypeId;
  //     this._pOrderSvc.filter({ pageNumber: 1, pageSize: 10000, orderByProperty: 'porderId', orderByDirection: 'desc', plantId: this.qualityNotification.plantId }).then((res: any) => this.pOrders = res['content']);
  //     this._stockReceiptSvc.filter({ pageNumber: 1, pageSize: 10000, orderByProperty: 'porderId', orderByDirection: 'desc', plantId: this.qualityNotification.plantId }).then((res: any) => this.documents  = res['content']);
  //     if (event.target.value === 'INTERNAL_PROBLEM_REPORT') {
  //       this._workcenterSvc.filter({ pageNumber: 1, pageSize: 10000, plantId: this.qualityNotification.plantId, orderByDirection: 'desc' }).then((res: any) => this.workCenters = res['content']);
  //     }
  //   }
  // }

  setInspectionLot(event) {
    if (event) {
      this.qualityNotification.qualityInspectionLotId = event.inspectionLotId;
    } else {
      this.qualityNotification.qualityInspectionLotId = null;
    }
  }
  setPurchaseOrder(event) {
    if (event) {
      this.qualityNotification.purchaseOrderId = event.porderId;
    } else {
      this.qualityNotification.purchaseOrderId = null;
    }
  }

  setSelectedMaterial(event) {
    if (event) {
      this.qualityNotification.stockId = event.stockId;
    } else {
      this.qualityNotification.stockId = null;
    }
  }
  searchReadyJobsForOrderDetail(event) {
    if (event) {
      this.qualityNotification.saleOrder = event.orderId;
      this.qualityNotification.documentNoId = event.documentNoId;
    } else {
      this.qualityNotification.saleOrder = event.orderId;
      this.qualityNotification.documentNoId = event.documentNoId;
    }
  }
  setSelectedBatch(batch) {

    if (batch) {
      this.qualityNotification.batchId = batch.batchId;
    } else {
      this.qualityNotification.batchId = null;
    }
  }
  selectQuantityUnit(quantityUnit) {
    this.qualityNotification.quantityUnit = quantityUnit
  }

  setSelectedVendor(act) {
    if (act) {
      this.qualityNotification.vendorId = act.actId;
      this.qualityNotification.vendorAddress = act.address1;
    } else {
      this.qualityNotification.vendorId = null;
      this.qualityNotification.vendorAddress = null;
    }
  }

  setSelectedCustomer(act) {
    if (act) {
      this.qualityNotification.customer = act.actId;
      this.qualityNotification.customerAddress = act.address1;
    } else {
      this.qualityNotification.customer = null;
      this.qualityNotification.customerAddress = null;
    }
  }

  setDocumentNo (document){
    if(document){
      this.qualityNotification.documentNoId = document.documentNoId;
    }else{
      this.qualityNotification.documentNoId =  null;
    }
  }
  setWorkCenter(workCenter) {
    if(workCenter){
      this.qualityNotification.workCenterId = workCenter.workCenterId;
    }else{
      this.qualityNotification.workCenterId = null;
    }
  }

  setReportType(reportType){
    if(reportType){
      this.qualityNotification.qualityNotificationReportTypeId = reportType.qualityNotificationReportTypeId;
    }else{
      this.qualityNotification.qualityNotificationReportTypeId = null;
    }
  }

  reset() {
    this.qualityNotification = { 
      qualityNotificationId: null,
      qualityNotificationCode: null,
      qualityNotificationPriority: null,
      qualityNotificationType: null,
      stockId: null,
      plantId: null,
      plantName: null,
      qualityInspectionLotId: null,
      purchaseOrderId: null,
      qualityDefectRecordingId: null,
      qualityNotificationReportTypeId: null,
      notificationStatus: 'OUTSTANDING',
      documentNoId: null,
      batchId: null,
      vendorId: null,
      vendorAddress: null,
      complaintQuantity: null,
      quantityUnit: null,
      description: null,
      longText: null,
      workCenterId: null,
      saleOrder: null,
      customer: null,
      customerAddress: null
    }
  }

  save() {
    this.loaderService.showLoader();
    this._qualityNotification.saveNotification(this.qualityNotification).then(
      (result: any) => {
        this.qualityNotification.qualityNotificationId = result.qualityNotificationId;
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.activeTab = 1;
        }, environment.DELAY);
      },
      error => {
        this.utilities.showErrorToast(error);
        this.loaderService.hideLoader();
      }
    );

  }
} 
