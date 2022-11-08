import { Component, OnInit, OnDestroy, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { JobOrderService } from 'app/services/dto-services/job-order/job-order.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { StockCardService } from 'app/services/dto-services/stock/stock.service';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
import { ProductionOrderService } from 'app/services/dto-services/production-order/production-order.service';
import { Subscription } from 'rxjs';
import { UsersService } from 'app/services/users/users.service';
import { CreateNewProdObject, JobOrderList, JobOrderOperation } from 'app/dto/porder/porder.model';
import { ConvertUtil } from 'app/util/convert-util';
import { ConfirmationService } from 'primeng';
import { TranslateService } from '@ngx-translate/core';
import { ImageAdderComponent } from 'app/views/image/image-adder/image-adder.component';
import { TableTypeEnum } from 'app/dto/table-type-enum';
import { BatchService } from 'app/services/dto-services/batch/batch.service';

@Component({
  selector: 'app-prod-new',
  templateUrl: './prod-new.component.html',
  styleUrls: ['./prod-new.component.scss']
})
export class ProdNewComponent implements OnInit, OnDestroy {
  @ViewChild(ImageAdderComponent) imageAdderComponent: ImageAdderComponent;
  dataModel = new CreateNewProdObject();

  selectedPlant: any;
  selectedMaterial: any;
  unitList: any;

  commonPriorities: any;

  minDateValue = new Date();
  materialKey: any;

  jobOrder: JobOrderList = {
    batch: null,
    customerJobOrderStatus: null,
    description: null,
    endDate: null,
    expectedQuantity: null,
    expectedSetupDuration: null,
    individualCapacity: null,
    item: null,
    jobOrderEquipmentList: [],
    jobOrderId: null,
    jobOrderOperations: [],
    jobOrderStatus: null,
    jobOrderStockAuxList: [],
    jobOrderStockProduceList: [],
    jobOrderStockUseList: [],
    maxSingleStandbyDuration: null,
    operationRepeat: null,
    orderDetailId: null,
    orderIndex: null,
    orderNo: null,
    parentId: null,
    plannedCycleQuantity: null,
    plannedHeight: null,
    plannedWidth: null,
    position: 'STANDARD',
    processControlFrequency: null,
    prodOrderId: null,
    productTreeDetailId: null,
    productTreeId: null,
    productionType: 'STANDARD',
    receiptNo: null,
    reverse: null,
    singleDuration: null,
    singleSetupDuration: null,
    singleStandbyDuration: null,
    startDate: null,
    totalDuration: null,
    wareHouseStockId: null,
    workstationId: null,
    workstationName: null,
  }

  jobOrderOperations: JobOrderOperation[] = [];

  selectedJobOrderOperation = null;

  selectedJobOrderIndex = null;
  addmodal = {active: false, type: null};
  modal = {active: false};

  productionTypes: [];
  equipmentSelectedIndex = null;
  
  jobOrderPositions = ["STANDARD","JOINED","DIVIDED","JOIN_PAIR","CREATED","EXTERNAL_JOB"];
  @Input() prodOrderTypeList = [];

  // combineActivityTypes = ['ACTIVITY_COMBINING', 'COMPONENT_COMBINING', 'ORDER_COMBINING'];

  dialog = {
    visible: false
  }

  @Output() saveAction = new EventEmitter<any>();
  materialList = [];

  prodOrderMaterialList = [];

  jobOrderOperationDetailsAdded = false;

  subscription: Subscription;

  counter = 1;


  constructor(private _jobOrderSvc: JobOrderService,
    private _loaderSvc: LoaderService,
    private batchService: BatchService,
    private _confirmationSvc: ConfirmationService,
    private _translateSvc: TranslateService,
    private utilities: UtilitiesService,
    private _stockSvc: StockCardService,
    private usersService: UsersService,
    private _enumSvc: EnumService,
    private _prodOrderSvc: ProductionOrderService,
  ) {
    const setPlant = this.usersService.getPlant();
    this.selectedPlant = JSON.parse(setPlant);
    if (this.selectedPlant) {
      this.dataModel.plantId = this.selectedPlant.plantId;
      this.dataModel.plantName = this.selectedPlant.plantName;
    }
  }

  ngOnInit() {
    this.dataModel.prodOrderStatus= null;
    this.dataModel.prodOrderType = 'STANDARD_PRODUCTION_ORDER';
    this.dataModel.startDate = new Date();
    this.searchStock();
    this._enumSvc.getCommonPriorityEnum().then((result: any) => this.commonPriorities = result).catch(error => console.log(error));
    this._enumSvc.getProductionTypeEnum().then(result => this.productionTypes = result).catch(error => console.log(error));

    this.subscription = this._prodOrderSvc.saveEventFire.asObservable().subscribe(res => {
      if (res && this.counter === 1) {
        this.save();
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  getReadableTime(time) {
    return ConvertUtil.longDuration2DHHMMSSsssTime(time)
  }

  setSelectedWarehouse(event) {
    if (event && event.hasOwnProperty('wareHouseId')) {
      this.dataModel.wareHouseId = event.wareHouseId;
      this.dataModel['wareHouseNo'] = event.wareHouseNo;
    } else {
      this.dataModel.wareHouseId = null;
      this.dataModel['wareHouseNo'] = null;
    }
  }


  deleteOperation(operationOrder, index) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        // this.dataModel.jobOrderList.forEach(jborder => {
        //     if (jborder.jobOrderOperations && jborder.jobOrderOperations.length > 0) {
        //         jborder.jobOrderOperations = jborder.jobOrderOperations.filter(opration => 
        //             operationOrder.jobOrderOperationId !== opration.jobOrderOperationId)
        //     }
        // });
        this.jobOrderOperations.splice(index, 1);
        // console.log('@afterDelete', this.jobOrderOperations)
        if (this.jobOrderOperations.length === 0) {
          this.jobOrderOperationDetailsAdded = false;
        }
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    })
  }

  onjobOrderPositionChanged(event) {
    if(event === 'STANDARD') {
      this.dataModel.prodOrderType = 'STANDARD_PRODUCTION_ORDER';
    } else if(event === 'EXTERNAL_JOB') {
      this.dataModel.prodOrderType = 'EXTERNAL_PRODUCTION_ORDER';
    }
  }
  onProdTypeChanged(event) {
    if(event === 'STANDARD_PRODUCTION_ORDER') {
      this.jobOrder.position = "STANDARD";
    } else if(event === 'EXTERNAL_PRODUCTION_ORDER') {
      this.jobOrder.position = "EXTERNAL_JOB";
    }
  }

  editSelectJobOrder(operationOrder, index) {
    this.selectedJobOrderOperation = operationOrder;
    this.selectedJobOrderIndex = index;
    // console.log('@selectedJobOrderOperation', this.selectedJobOrderOperation)
  }


  setSelectedBatch(batch) {
    if (batch) {
      this.dataModel.batch = batch.batchCode;
    } else {
      this.dataModel.batch = null;
    }
  }


  setBaseUnit(event) {
    this.unitList = null;
    const me = this;
    if (event) {

      this._stockSvc.getDetail(event).then(res => {
        if (res) {
          this.dataModel.orderUnit = res['baseUnit'];
          this.dataModel.locationNo = res['locationNo'] || this.dataModel.locationNo;
          this.dataModel.baseUnit = res['baseUnit'];
        }
      }).then(() => {
        me._stockSvc.metarialActiveUnits(event).then(result => {
          me.unitList = result;
        });
      });
    }
  }

  prioritySelection(event) {
    if (event) {
      this.dataModel.priority = event.target.value;
    } else {
      this.dataModel.priority = null;
    }
  }

  addOrUpdate(jobOrderOperation) {
    this.jobOrderOperationDetailsAdded = true;
    if (this.jobOrderOperations && this.jobOrderOperations.length > 0) {
      if (this.selectedJobOrderIndex != null) {
        this.jobOrderOperations[this.selectedJobOrderIndex] = jobOrderOperation;
        this.jobOrderOperations[this.selectedJobOrderIndex].workStation = jobOrderOperation.workStation;
        this.jobOrderOperations[this.selectedJobOrderIndex].workStationId = jobOrderOperation.workStation?.workStationId;
        this.jobOrderOperations[this.selectedJobOrderIndex].workStationName = jobOrderOperation.workStation?.workStationName;
        this.jobOrderOperations[this.selectedJobOrderIndex].operation = jobOrderOperation.operation;
        this.jobOrderOperations[this.selectedJobOrderIndex].operationId = jobOrderOperation.operation.operationId;
        this.jobOrderOperations[this.selectedJobOrderIndex].operationName = jobOrderOperation.operation.operationName;
        this.jobOrderOperations[this.selectedJobOrderIndex].defaultStockId = jobOrderOperation.defaultStockId;
        this.jobOrderOperations[this.selectedJobOrderIndex].quantity = jobOrderOperation.quantity;
        this.jobOrderOperations[this.selectedJobOrderIndex].parent = jobOrderOperation.parent;
        this.jobOrderOperations[this.selectedJobOrderIndex].individualCapacity = (this.selectedJobOrderOperation) ? this.selectedJobOrderOperation.individualCapacity : jobOrderOperation.individualCapacity;
      } else {
        jobOrderOperation.workStation = jobOrderOperation.workStation;
        if(jobOrderOperation.workStation) {
          jobOrderOperation.workStationId = jobOrderOperation.workStation.workStationId;
          jobOrderOperation.workStationName = jobOrderOperation.workStation.workStationName;
        }
        jobOrderOperation.operation = jobOrderOperation.operation;
        jobOrderOperation.operationId = jobOrderOperation.operation.operationId;
        jobOrderOperation.operationName = jobOrderOperation.operation.operationName;
        jobOrderOperation.individualCapacity = 1;
        this.jobOrderOperations.push({ ...jobOrderOperation });
      }
    } else {
      this.jobOrderOperations = [];
      jobOrderOperation.workStation = jobOrderOperation.workStation;
      jobOrderOperation.workStationId = jobOrderOperation.workStation?.workStationId;
      jobOrderOperation.workStationName = jobOrderOperation.workStation?.workStationName;
      jobOrderOperation.operation = jobOrderOperation.operation;
      jobOrderOperation.operationId = jobOrderOperation.operation.operationId;
      jobOrderOperation.operationName = jobOrderOperation.operation.operationName;
      jobOrderOperation.individualCapacity = 1;
      this.jobOrderOperations.push({ ...jobOrderOperation });
    }
    this.selectedJobOrderOperation = null;

    this.jobOrderOperations.forEach((operation, index) => {
      operation.operationStatus = 'PLANNED';
      operation.jobOrderStockProduceList.forEach(stck => {
        // delete stck.jobOrderId;
        const stock = this.materialList.find(mt => mt.materialId === stck['componentId']);
        if (!stock) {
          this.materialList.push({
            materialId: stck['component']?.stockId,
            materialName: stck['component']?.stockName,
            materialNo: stck['component']?.stockNo,
            quantiyUnit: stck['quantityUnit'],
            quantiy: stck.quantity,
            unit: stck['quantityUnit'],
          })
        }

        if (stck['component']) {
          // stck['stock'] = stck['component'];
          stck['stockId'] = stck['component']?.stockId;
          stck['stockName'] = stck['component']?.stockName;
          stck['stockNo'] = stck['component']?.stockNo;
          stck['stockTypeId'] = stck['component']?.stockTypeId;
          stck['unit'] = stck['quantityUnit'];
        }
        if (stck.quantity && !stck.neededQuantity) {
          stck.neededQuantity = stck.quantity;
        }
      });
      operation.jobOrderStockAuxList.forEach(stck => {
        if (stck['component']) {
          // stck['stock'] = stck['component'];
          stck['stockId'] = stck['component']?.stockId;
          stck['stockName'] = stck['component']?.stockName;
          stck['stockNo'] = stck['component']?.stockNo;
          stck['stockTypeId'] = stck['component']?.stockTypeId;
          stck['unit'] = stck['quantityUnit'];
        }
        if (stck.quantity && !stck.neededQuantity) {
          stck.neededQuantity = stck.quantity;
        }
      });
      operation.jobOrderStockUseList.forEach(stck => {
        if (stck['component']) {
          // stck['stock'] = stck['component'];
          stck['stockId'] = stck['component']?.stockId;
          stck['stockName'] = stck['component']?.stockName;
          stck['stockNo'] = stck['component']?.stockNo;
          stck['stockTypeId'] = stck['component']?.stockTypeId;
          stck['unit'] = stck['quantityUnit'];
        }
        if (stck.quantity && !stck.neededQuantity) {
          stck.neededQuantity = stck.quantity;
        }
      });
    });
    if(this.materialList.length > 0) {
      this.dataModel.materialId = this.materialList[0].materialId;
      this.dataModel.materialName = this.materialList[0].materialName;
      this.dataModel.baseUnit = this.materialList[0].quantiyUnit;
      this.dataModel.orderUnit = this.materialList[0].quantiyUnit;
    }
  }

  onClosedOperation(event) {
    this.selectedJobOrderOperation = null;
    this.selectedJobOrderIndex = null;
    if (this.jobOrderOperations.length > 0) {
      this.jobOrderOperationDetailsAdded = true;
    }
  }
 

  save() {
    if (!this.dataModel.wareHouseId) {
      this.utilities.showWarningToast('please-select-warehouse');
      return;
    }
    if (!this.dataModel.plannedQuantity) {
      this.utilities.showWarningToast('please-add-production-order-quantity');
      return;
    }
    if (!this.dataModel.startDate) {
      this.utilities.showWarningToast('please-add-start-date');
      return;
    }
    if (!this.dataModel.finishDate) {
      this.utilities.showWarningToast('please-add-finish-date');
      return;
    }

    
    if (this.jobOrderOperations.length === 0) {
      this.utilities.showWarningToast('please-add-job-order-operation');
      return;
    }
    if (this.dataModel.prodOrderMaterialList.length === 0) {
      this.utilities.showWarningToast('please-add-production-order-material');
      return;
    }
    
    this.jobOrder.orderNo = <any> '10';
    this.jobOrder.jobOrderOperations = this.jobOrderOperations;
    // delete stck.jobOrderId;
    this.jobOrder.jobOrderOperations.forEach(operation => {
      delete operation.defaultStockId;
      delete operation['defaultStock'];
      delete operation.workStation;
      delete operation.operation;
      operation.jobOrderStockProduceList.forEach(stck => {
        if (stck.jobOrderId) {
          delete stck.jobOrderId;
        }

      });
    });

    // if (this.jobOrder.jobOrderOperations && this.jobOrder.jobOrderOperations.length > 0) {
    //   this.jobOrder.singleDuration = this.jobOrder.jobOrderOperations[0].singleDuration;
    //   this.jobOrder.plannedCycleQuantity = this.jobOrder.jobOrderOperations[0].plannedCycleQuantity;
    //   this.jobOrder.processControlFrequency = this.jobOrder.jobOrderOperations[0].processControlFrequency;
    //   this.jobOrder.workstationId = this.jobOrder.jobOrderOperations[0].workStationId;
    //   this.jobOrder.totalDuration = this.jobOrder.jobOrderOperations[0].singleTotalDuration;
    //   this.jobOrder.expectedSetupDuration = this.jobOrder.jobOrderOperations[0].expectedSetupDuration;
    //   this.jobOrder.singleSetupDuration = this.jobOrder.jobOrderOperations[0].singleSetupDuration;
    //   this.jobOrder.singleSetupDuration = this.jobOrder.jobOrderOperations[0]['singleStandbyDuration'];
    //   this.jobOrder.maxSingleStandbyDuration = this.jobOrder.jobOrderOperations[0].maxSingleStandbyDuration;
    //   this.jobOrder.jobOrderStatus = 'NOT_READY_YET_WAITING_FOR_JOB';
    //   this.jobOrder.position = 'STANDARD';
    // }
    
    this.jobOrder.expectedQuantity = this.dataModel.plannedQuantity;

    this.dataModel.jobOrderList.push(this.jobOrder);

    if (this.dataModel.prodOrderMaterialList && this.dataModel.prodOrderMaterialList.length > 0) {
      this.dataModel.prodOrderMaterialList.forEach(item => {
        delete item['newlyAdded'];
      })
    }
    this.dataModel.prodOrderStatus = null;
    this._loaderSvc.showLoader();
    this.counter = this.counter + 1;
    this.batchService.getNewBarCode('PRODUCTION_ORDER').then((newbarcode: any) => {
      this.dataModel.barcode = newbarcode;
      this._prodOrderSvc.save(this.dataModel).then((result: any) => {
        this._loaderSvc.hideLoader();
        this.counter = 1;
        this.utilities.showSuccessToast('saved-success')
        this.saveImages(result);
      }).catch(error => {
        this._loaderSvc.hideLoader();
        this.counter = 1;
        this.utilities.showErrorToast(error)
      });
    });
    // this._prodOrderSvc.save(this.dataModel).then((res: any) => {
    //   // console.log('@result', res)
    //   this.utilities.showSuccessToast('saved-success');
    //   this._loaderSvc.hideLoader();
    //   this.saveImages(res);
    //   this.counter = 1;
    //   // this.saveAction.emit();
    // }).catch(error => {
    //   this._loaderSvc.hideLoader();
    //   this.counter = 1;
    // });
  }

  private saveImages(stockId) {
    this.imageAdderComponent.updateMedia(stockId, TableTypeEnum.PRODUCTION_ORDER).then(() => {
        this.saveAction.emit();
    }
    ).catch(error => this.utilities.showErrorToast(error));
  }

  addOperation(oper) {
    console.log('@addOperation', oper)
    if (oper.operation) {
      oper['operationId'] = oper.operation.operationId;
      oper['operationName'] = oper.operation.operationName;
    }
    if (oper.workStation) {
      oper['workStationId'] = oper.workStation.workstationId;
      oper['workStationName'] = oper.workStation.workStationName;
    }
    this.jobOrderOperations.push(oper);
  }


  addProdOrderMaterialList() {
    const materialList = {
      combineProdOrderStatus: null,
      combineProdOrderType: null,
      combinejobOrderId: null,
      createDate: null,
      materialId: null,
      materialNo: null,
      materialName: null,
      neededQuantity: null,
      outputRate: 1,
      prodOrderId: null,
      prodOrderMaterialId: null,
      producedQuantity: null,
      quantity: null,
      quantiyUnit: null,
      updateDate: null,
      newlyAdded: true
    }
    this.dataModel.prodOrderMaterialList.push(materialList);
    
  }

  setSelectedMaterial(materialId, index) {
    const material = this.materialList.find(itm => itm.materialId === +materialId);
    if (material) {
      this.dataModel.prodOrderMaterialList[index].materialId = material.materialId;
      this.dataModel.prodOrderMaterialList[index].materialName = material.materialName;
      this.dataModel.prodOrderMaterialList[index].materialNo = material.materialNo;
      this.dataModel.prodOrderMaterialList[index].quantiyUnit = material.quantiyUnit;
      this.dataModel.prodOrderMaterialList[index].quantity = material.quantity;
      this.dataModel.prodOrderMaterialList[index].neededQuantity = material.neededQuantity;
    }

    this.dataModel.prodOrderMaterialList = [...this.dataModel.prodOrderMaterialList];
  }

  searchStock(eventData?) {

    this.materialList = [...this.dataModel.prodOrderMaterialList.filter(itm => itm.materialId !== null)];

    // remove repeatition from this array
    this.materialList = ConvertUtil.removeDuplicatedDataInArray(this.materialList, 'materialId');

  }

  setMaterialsChanges(event) {
    // this.dataModel.prodOrderMaterialList = [...this.dataModel.prodOrderMaterialList];
  }
  setneededQuantity(event, index) {
    this.dataModel.prodOrderMaterialList[index].neededQuantity = event;
    this.dataModel.prodOrderMaterialList[index].quantity = event;

    this.prodOrderMaterialList = ConvertUtil.removeDuplicatedDataInArray(this.dataModel.prodOrderMaterialList, 'materialId');
  }

  changeProdMaterialQuantity() {
    this.dataModel.prodOrderMaterialList = this.dataModel.prodOrderMaterialList.map(itm => {
      itm.quantity = this.dataModel.quantity;
      itm.neededQuantity = this.dataModel.quantity;
      return itm;
    });
    this.dataModel.minimumDelayQuantityBetweenOperation = this.dataModel.quantity;
  }

  setSelectedEquipment(event) {
    if(event) {
      if(this.equipmentSelectedIndex !== null) {
        this.jobOrder.jobOrderEquipmentList[this.equipmentSelectedIndex].stockId = event.stockId;
        this.jobOrder.jobOrderEquipmentList[this.equipmentSelectedIndex].stockName= event.stockName;
        
      } else {
      this.jobOrder.jobOrderEquipmentList.push({
        stockId: event.stockId,
        stockName: event.stockName,
        count: 1,
        jobOrderId: null,
        jobOrderEquipmentId: null
      });
    }
    }
    
  }

  setSelectedMainMaterial(event) {
    const materialList = {
      combineProdOrderStatus: null,
      combineProdOrderType: null,
      combinejobOrderId: null,
      createDate: null,
      materialId: event.stockId,
      materialNo: event.stockNo,
      materialName: event.stockName,
      neededQuantity: this.dataModel.quantity,
      outputRate: 1,
      prodOrderId: null,
      prodOrderMaterialId: null,
      producedQuantity: 1,
      quantity: this.dataModel.quantity,
      quantiyUnit: event.baseUnit,
      updateDate: null,
      newlyAdded: true
    }

    this.dataModel.materialId = event.stockId;
    this.dataModel.materialName = event.stockName;
    this.dataModel.materialNo = event.stockNo;
    this.dataModel.baseUnit = event.baseUnit;
    this.dataModel.locationNo = event.locationNo || this.dataModel.locationNo;
    this.materialList.push({...materialList})
    this.dataModel.prodOrderMaterialList.push(materialList);
    this.prodOrderMaterialList = ConvertUtil.removeDuplicatedDataInArray(this.dataModel.prodOrderMaterialList, 'materialId');
  }

  onEditProdOrderMaterialList(materialItem) {
    console.log('@onEditProdOrderMaterialList', materialItem)
  }

  onDeleteProdOrderMaterialList(materialitem, index) {
    this.dataModel.prodOrderMaterialList.splice(index, 1);
    this.dataModel.prodOrderMaterialList = [...this.dataModel.prodOrderMaterialList];
  }

}
