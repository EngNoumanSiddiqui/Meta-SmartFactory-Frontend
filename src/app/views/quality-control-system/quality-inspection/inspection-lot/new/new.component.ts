import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { InspectionLotService } from 'app/services/dto-services/quality-inspection/inspection-lot.service';
import { SalesOrderService } from 'app/services/dto-services/sales-order/sales-order.service';
import { JobOrderService } from 'app/services/dto-services/job-order/job-order.service';
import { QualityInfoRecordService } from 'app/services/dto-services/quality-info-record/quality-info-record.service';
import { UsersService } from 'app/services/users/users.service';
import { ProductionOrderService } from 'app/services/dto-services/production-order/production-order.service';
import { EnumService } from 'app/services/dto-services/enum/enum.service';

@Component({
  selector: 'new-inspection-lot',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewInspectionLot implements OnInit {

  @Input() fromAutoComplete = false;
  
  @Output() saveAction = new EventEmitter<any>();

  inspectionLot = {
    batch: null,
    createDate: null,
    inspectionLotId: null,
    inspectionLotCode: null,
    inspectionLotStatus: 'CREATED',
    lotCreatedOn: null,
    lotCreatedTo: null,
    lotQuantity: null,
    orderId: null,
    plantId: null,
    jobOrderId: null,
    prodOrderId: null,
    qualityInfoRecordId: null,
    qualityInspectionOperationId: null,
    stockId: null,
    updateDate: null,
    vendorId: null,
    quanityUnit: null,
    inspectionType: null,
    qualityInspectionTypeId: null
  }

  orders = [];

  jobOrders = [];
  
  infoRecords = [];
  
  prodOrders = [];

  inspectionLotStatusList = [] = [];

  inspectionTypes= [];

  activeTab: number;
  
  selectedPlant: any;

  selectedJobOrder: any;

  @Input('inspectionType') set inspType(inspectionType){
    if (inspectionType) {
      this.inspectionLot.inspectionType = inspectionType;
    }
  }
  @Input('fromJobOrderData') set fromJobOrderData(fromJobOrderData){
    if (fromJobOrderData) {
      this.selectedJobOrder = fromJobOrderData;
      this.inspectionLot.stockId = fromJobOrderData.jobOrderStockProduceList ? fromJobOrderData.jobOrderStockProduceList[0].stockId : null;
      this.inspectionLot.qualityInspectionOperationId = fromJobOrderData.jobOrderOperations ? fromJobOrderData.jobOrderOperations[0].operationId : null;
      this.inspectionLot.prodOrderId = fromJobOrderData.prodOrder ? fromJobOrderData.prodOrder.prodOrderId : null;
      this.inspectionLot.jobOrderId = fromJobOrderData.jobOrderId;
    }
  }
  
  constructor( 
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _userSvc: UsersService,
    private _inspectionLotService: InspectionLotService,
    private _orderSvc: SalesOrderService, 
    private _jobOrderSvc: JobOrderService, 
    private _qualityInfoRecordService: QualityInfoRecordService, 
    private _prodOrderSvc: ProductionOrderService,
    private _enumSvc: EnumService
  ) {
    const setPlant = this._userSvc.getPlant();
    this.selectedPlant = JSON.parse(setPlant);
    if (this.selectedPlant) {
      this.inspectionLot.plantId = this.selectedPlant.plantId;
    }
  }

  ngOnInit() {
    this._orderSvc.filter({pageNumber: 1, pageSize: 9999, plantId: this.inspectionLot.plantId}).then((res: any) => {
      this.orders = res['content'];
      this.orders = this.orders.map(item => {
        item['orderName'] =  item.orderId + ' | ' + item.orderNo;
        return item;
      });
    });
    this._jobOrderSvc.filter({pageNumber: 1, pageSize: 9999, plantId: this.inspectionLot.plantId, orderByProperty: 'jobOrderId', orderByDirection: 'desc'}).then((res: any) => this.jobOrders = res['content']);
    this._prodOrderSvc.filter({pageNumber: 1, pageSize: 9999, plantId: this.inspectionLot.plantId}).then((res: any) => this.prodOrders = res['content']);
    this._qualityInfoRecordService.filterRecord({pageNumber: 1, pageSize: 9999, plantId: this.inspectionLot.plantId}).then((res: any) => this.infoRecords = res['content']);
    // this._enumSvc.getQualityInspectionLotStatusEnum().then((res: any) => { this.inspectionLotStatusList = res; });
    this._enumSvc.getQualityInspectionTypeEnum().then((res: any) => { this.inspectionTypes = res; });

  }

  setSelectedBatch(batch) {
    if (batch) this.inspectionLot.batch = batch.batchCode;
  }

  setSelectedJobOrder(event) {
    console.log('selectedJobOrderEvent', event)
    if (event) {
      this.inspectionLot.jobOrderId = event.jobOrderId;
    }else{
      this.inspectionLot.jobOrderId = null;
    }
  }

  setSelectedOrder(event){
    if (event) {
      this.inspectionLot.orderId = event.orderId;
    }else{
      this.inspectionLot.orderId = null;
    }
  }

  save() {
    this.loaderService.showLoader();
    
    if(this.inspectionLot.prodOrderId){
      this.inspectionLot.prodOrderId = parseInt(this.inspectionLot.prodOrderId);
    }

    if(this.inspectionLot.qualityInspectionOperationId){
      this.inspectionLot.qualityInspectionOperationId = parseInt(this.inspectionLot.qualityInspectionOperationId);
    }

    this._inspectionLotService.saveInspectionLot(this.inspectionLot).then(
      result => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        this.inspectionLot.inspectionLotId = result['inspectionLotId'];
        this.activeTab = 1;
        setTimeout(() => {
          // this.saveAction.emit('close');
        }, environment.DELAY);
      },
      error => {
        this.utilities.showErrorToast(error);
        this.loaderService.hideLoader();
      }
    );
  }
}
