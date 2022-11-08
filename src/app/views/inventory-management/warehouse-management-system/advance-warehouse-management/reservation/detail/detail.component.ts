import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { ResponseReservationDetailDto } from 'app/dto/reservation/reservation.model';
import { WorkstationService } from 'app/services/dto-services/workstation/workstation.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { ReservationService } from 'app/services/dto-services/reservation/reservation.service';
import { UtilitiesService } from 'app/services/utilities.service';

@Component({
  selector: 'reservation-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailReservationComponent implements OnInit {
  id;

  dialogEnum = DialogTypeEnum;

  msgs: Message[] = [];
  
  unitList: any = [];
  
  movementTypeList: any = [];
  
  productionOrders: any = [];
  
  jobOrderList: any = [];
  
  saleOrders: any = [];
  
  saleOrderDetailList: any = [];
  
  stocks: any = [];
  
  plantList: any = [];
  
  wareHouseList: any = [];
  
  reservationDetail: any = new ResponseReservationDetailDto();
  
  batchCodes = [];

  GroupCodeList;

  filterAllData = {
    pageNumber: 1,
    pageSize: 10000
  };

  plants = {
    plantId: null,
    plantName: null,
    plantCode: null,
    createdDate: null,
    address: null,
    postcode: null
  };

  modal: any;

  params = {
    dialog: {title: '', inputValue: '', visible: false},
    warehouseDialog: {title: '', stockId: null, stockName: '', visible: false, item: null},
  };

  prodOrder: any;

  purchaseOrder: any;

  maintenanceorder:any;

  palletList = [];

  cols = [
    {field: 'jobOrderId', header: 'Job order Id'},
    {field: 'jobOrderStockProduceList', header: 'material-no'},
    {field: 'jobOrderStockProduceList', header: 'material-name'},
    {field: 'jobOrderStockProduceList', header: 'quantity'},
    {field: 'plannedQuantity', header: 'planned-quantity'},
    {field: 'grQuantity', header: 'gr-quantity'},
    {field: 'orderUnit', header: 'order-unit'},
    {field: 'baseUnit', header: 'base-unit'},
    {field: 'description', header: 'description'},
    {field: 'createDate', header: 'create-date'},
    {field: 'startDate', header: 'planned-start-date'},
    {field: 'finishDate', header: 'planned-finish-date'},
    {field: 'actualStart', header: 'actual-start'},
    {field: 'actualFinish', header: 'actual-finish'},
  ];

  notificationSelectedColumns = [
    { field: 'stockTransferReceiptNotificationId', header: 'stock-transfer-receipt-notification-id'},
    { field: 'stockTransferNotificationDetailId', header: 'stock-transfer-notification-detail-id'},
    { field: 'materialNo', header: 'material-no'},
    { field: 'materialName', header: 'material-name'},
    { field: 'quantity', header: 'quantity'},
    { field: 'baseUnit', header: 'unit'},
    { field: 'goodMovementDocumentType', header: 'good-movement-document-type'},
    { field: 'goodsMovementActivityType', header: 'goods-movement-activity-type'},
    { field: 'goodsMovementStatus', header: 'status'},
  ];

  palletSelectedColumns = [
    { field: 'palletId', header: 'pallet-id'},
    { field: 'palletName', header: 'pallet-name'},
    { field: 'palletSettingId', header: 'pallet-setting-id'},
    { field: 'materialNo', header: 'material-no'},
    { field: 'materialName', header: 'material-name'},
    { field: 'wareHouseId', header: 'warehouse-id'},
    { field: 'palletStatus', header: 'pallet-status'}
  ];

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
    console.log('id: ' + id);
  };

  constructor(private _workstationSvc: WorkstationService,
              private _router: Router,
              private loaderService: LoaderService,
              private _reservationSvc: ReservationService, private utilities: UtilitiesService) {

  }

  initialize(id) {
    this.loaderService.showLoader();
    this._reservationSvc.getReservationDetailForUpdate(this.id).then(result => {
      this.loaderService.hideLoader();
      if (result['requirementDate']) {
        result['requirementDate'] = new Date(result['requirementDate']);
      }
      if(result['movementType'] === 'RESERVATION_FOR_SALE_ORDER'){
        result['itemNo'] =  '';
      }
      this.reservationDetail = result as ResponseReservationDetailDto;
      this.prodOrder = this.reservationDetail['prodOrder'];
      this.purchaseOrder = this.reservationDetail['purchaseOrderDetailDto'];
      this.maintenanceorder = this.reservationDetail['maintenanceOrder'];
      if (this.reservationDetail['stockTransferNotificationDetailList'] ) {
        this.reservationDetail['stockTransferNotificationDetailList'].forEach(itm => {
          if (itm.pallet) {
            this.palletList.push(itm.pallet);
          }
        });
      }
      // this.palletList = this.reservationDetail['stockTransferNotificationDetailList'];

    }).catch(error => {
      this.loaderService.hideLoader();

    });
  }

  ngOnInit(): void {
    // this._workstationSvc.getWorkstationUnitList().then(result => {
    //   this.unitList = result;
    //   console.log(result);
    // }).catch(error => console.log(error));

  }

  showJobOrderDetail(jobOrderId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.JOBORDER, jobOrderId)
  }
  showMaterialDetail(materialId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.STOCK, materialId)
  }
  showPlantDetail(plantId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PLANT, plantId)
  }
  showBatchDetail(batch) {
    this.loaderService.showDetailDialog(DialogTypeEnum.BATCH, batch)
  }
  showWarehouseDetail(warehouseId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.WAREHOUSE, warehouseId)
  }

  showDialog(uniqueId, type) {
    this.loaderService.showDetailDialog(type, uniqueId);
  }


}
