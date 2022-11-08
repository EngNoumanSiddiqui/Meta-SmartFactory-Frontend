import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
 
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { InspectionLotService } from 'app/services/dto-services/quality-inspection/inspection-lot.service';
import { environment } from 'environments/environment';
import { UsersService } from 'app/services/users/users.service';
import { JobOrderService } from 'app/services/dto-services/job-order/job-order.service';
import { SalesOrderService } from 'app/services/dto-services/sales-order/sales-order.service';
import { QualityInfoRecordService } from 'app/services/dto-services/quality-info-record/quality-info-record.service';
import { InspectionOperationsService } from 'app/services/dto-services/inspection-operations/inspection-operations.service';
import { ProductionOrderService } from 'app/services/dto-services/production-order/production-order.service';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
@Component({
  selector: 'edit-inspection-lot',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditInspectionLot implements OnInit {
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
  inspectionOperations = [];
  inspectionLotStatusList = [];
  prodOrders= [];

  activeTab: number;
  selectedPlant: any;
  id;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  myModal;

  params = {
    cityDisabled: true,
    dialog: {
      title: '',
      inputText: '',
      inputValue: ''
    },
    displayDialog: false,
  };

  @Output() saveAction = new EventEmitter<any>();
  
  lastAccountNos;
  
  inspectionTypes= [];

  constructor( 
    private _route: ActivatedRoute,
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _userSvc: UsersService,
    private _inspectionLotService: InspectionLotService,
    private _orderSvc: SalesOrderService, 
    private _jobOrderSvc: JobOrderService, 
    private _qualityInfoRecordService: QualityInfoRecordService, 
    private _inspectionOperationsService: InspectionOperationsService,
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
    this._route.params.subscribe((params) => {
      this.id = params['id'];
      if (this.id) {
        this.inspectionLot.inspectionLotId = this.id;
        this.initialize(this.id);
      }
    });
    this._orderSvc.filter({pageNumber: 1, pageSize: 9999, plantId: this.inspectionLot.plantId}).then((res: any) => {
      this.orders = res['content'];
      this.orders = this.orders.map(item => {
        item['orderName'] =  item.orderId + ' | ' + item.orderNo;
        return item;
      });
    });
    // this._orderSvc.filter({pageNumber: 1, pageSize: 9999, plantId: this.inspectionLot.plantId}).then((res: any) => this.orders = res['content']);
    this._jobOrderSvc.filter({pageNumber: 1, pageSize: 9999, plantId: this.inspectionLot.plantId}).then((res: any) => this.jobOrders = res['content']);
    // this._qualityInfoRecordService.filterRecord({pageNumber: 1, pageSize: 9999}).then((res: any) => this.infoRecords = res['content']);
    // this._inspectionOperationsService.filterInspectionOperation({pageNumber: 1, pageSize: 9999}).then((res: any) => this.inspectionOperations = res['content']);
    this._prodOrderSvc.filter({pageNumber: 1, pageSize: 9999, plantId: this.inspectionLot.plantId}).then((res: any) => this.prodOrders = res['content']);
    this._qualityInfoRecordService.filterRecord({pageNumber: 1, pageSize: 9999, plantId: this.inspectionLot.plantId}).then((res: any) => this.infoRecords = res['content']);
    this._inspectionOperationsService.filterInspectionOperation({pageNumber: 1, pageSize: 9999, plantId: this.inspectionLot.plantId}).then((res: any) => this.inspectionOperations = res['content']);
    this._enumSvc.getQualityInspectionLotStatusEnum().then((res: any) => { this.inspectionLotStatusList = res; });
    this._enumSvc.getQualityInspectionTypeEnum().then((res: any) => { this.inspectionTypes = res; });
  }

  setSelectedBatch(batch) {
    if (batch) this.inspectionLot.batch = batch.batchCode;
  }

  setSelectedOrder(event){
    if (event) {
      this.inspectionLot.orderId = event.orderId;
    }else{
      this.inspectionLot.orderId = null;
    }
  }

  private initialize(id) {
    this.inspectionLot.inspectionLotId = this.id;
    this.loaderService.showLoader();

    this._inspectionLotService.detailInspectionLot(id).then(
      result => {
        this.loaderService.hideLoader();
        if ((result['inspectionLotCode'])) {
          this.inspectionLot.inspectionLotCode = result['inspectionLotCode'];
        }
        if ((result['inspectionLotStatus'])) {
          this.inspectionLot.inspectionLotStatus = result['inspectionLotStatus'];
        }
        if ((result['lotCreatedOn'])) {
          this.inspectionLot.lotCreatedOn = result['lotCreatedOn'];
        }
        if ((result['lotCreatedTo'])) {
          this.inspectionLot.lotCreatedTo = result['lotCreatedTo'];
        }
        if ((result['orderId'])) {
          this.inspectionLot.orderId = result['orderId'];
        }

        if ((result['plantId'])) {
          this.inspectionLot.plantId = result['plantId'];
        }
        if ((result['jobOrderId'])) {
          this.inspectionLot.jobOrderId = result['jobOrderId'];
        }
        if ((result['prodOrderId'])) {
          this.inspectionLot.prodOrderId = result['prodOrderId'];
        }
        if ((result['qualityInspectionOperationId'])) {
          this.inspectionLot.qualityInspectionOperationId = result['qualityInspectionOperationId'];
        }
        if ((result['qualityInfoRecordId'])) {
          this.inspectionLot.qualityInfoRecordId = result['qualityInfoRecordId'];
        }
        if ((result['qualityInspectionTypeId'])) {
          this.inspectionLot.qualityInspectionTypeId = result['qualityInspectionTypeId'];
        }
        if ((result['stockId'])) {
          this.inspectionLot.stockId = result['stockId'];
        }
        if ((result['vendorId'])) {
          this.inspectionLot.vendorId = result['vendorId'];
        }
        if ((result['batch'])) {
          this.inspectionLot.batch = result['batch'];
        }
      },
      error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }
  
  ngOnDestroy() {
    this.loaderService.hideLoader();
  }

  save() {
    this.loaderService.showLoader();

    if(this.inspectionLot.prodOrderId){
      this.inspectionLot.prodOrderId = parseInt(this.inspectionLot.prodOrderId);
    }

    if(this.inspectionLot.qualityInspectionOperationId){
      this.inspectionLot.qualityInspectionOperationId = parseInt(this.inspectionLot.qualityInspectionOperationId);
    }

    this._inspectionLotService.updateInspectionLot(this.inspectionLot).then(
      result => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.saveAction.emit('close');
          // this.activeTab = 1;
        }, environment.DELAY);
      },
      error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }

  cancel() {
    this.saveAction.emit('close');
  }
}
