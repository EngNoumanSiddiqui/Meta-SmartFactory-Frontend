import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
import { StockCardService } from 'app/services/dto-services/stock/stock.service';
import { UsersService } from 'app/services/users/users.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { ProductionOrderService } from 'app/services/dto-services/production-order/production-order.service';
import { CreateNewProdObject, JobOrderList, JobOrderOperation } from 'app/dto/porder/porder.model';
import { Subscription } from 'rxjs';
import { JobOrderService } from 'app/services/dto-services/job-order/job-order.service';
import { ConfirmationService } from 'primeng';
import { TranslateService } from '@ngx-translate/core';
import { ConvertUtil } from 'app/util/convert-util';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { ImageAdderComponent } from 'app/views/image/image-adder/image-adder.component';
import { TableTypeEnum } from 'app/dto/table-type-enum';
import { BatchService } from 'app/services/dto-services/batch/batch.service';

@Component({
    selector: 'prod-edit',
    templateUrl: 'prod-edit.component.html',
    styles: [`

.input-tooltip{
    padding: 0.3em 0.6em 0.3em 0.6em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 120px;
  }

  .input-space{
    padding: 0.6em;
    height: 22px;
  }

  .jOrderParent{
  list-style: none;
  border-bottom: 1px solid grey;
  padding: 0;
  margin-bottom: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  flex-direction: column;
}

.jOrderParent li {
  border-bottom: 1px solid grey;
  padding: 0;

  width: 100%;
  display: flex;
  align-items: center;
}

  .jOrderParent li:last-child {
    border-bottom: none;
  }

  .jOrderParent li a{
    padding: 3px;
  }

  .jOrderParent li span{
    padding: 3px;
  }
    `]
})

export class ProductionEditComponent implements OnInit, OnDestroy {
  @ViewChild(ImageAdderComponent) imageAdderComponent: ImageAdderComponent;
  dataModel = new CreateNewProdObject();
  @Input() cloned = false;
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
  selectedJobOrders = null;

  selectedJobOrderIndex = null;
  addmodal = {active: false};
  addJobOperationmodal= {active: false};
  addDurationModal = {active: false};
  modal = {active: false};
  addSetupDurationModal = {active: false};
  selectedOperationForDuration = null;

  productionTypes: [];
  jobOrderPositions = ["STANDARD","JOINED","DIVIDED","JOIN_PAIR","CREATED","EXTERNAL_JOB"];
  @Input() prodOrderTypeList = [];

  // combineActivityTypes = ['ACTIVITY_COMBINING', 'COMPONENT_COMBINING', 'ORDER_COMBINING'];

  dialog = {
    visible: false
  }

  @Output() saveAction = new EventEmitter<any>();

  @Output() indexSelection = new EventEmitter<any>();
  materialList = [];

  prodOrderMaterialList = [];

  jobOrderOperationDetailsAdded = true;

  subscription: Subscription;

  counter = 1;
  equipmentSelectedIndex = null;
  jobOrderSelectedIndex = -1;
  operationSelectedIndex = -1;


  @Input('data') set setdata(data) {
    if (data) {
      // console.log(this.dataModel);
      this.dataModel = JSON.parse(JSON.stringify(data));
      this.dataModel.startDate = new Date(this.dataModel.startDate);
      this.dataModel.finishDate = new Date(this.dataModel.finishDate);
      this.dataModel.costCenterId = data.costCenter?.costCenterId;
      this.setBaseUnit(this.dataModel.materialId);
      this.dataModel.prodOrderMaterialList.forEach(prodOrderMaterial => {
        if(!prodOrderMaterial.materialId && prodOrderMaterial['material']) {
          prodOrderMaterial.materialId = prodOrderMaterial['material'].stockId;
          prodOrderMaterial.materialName = prodOrderMaterial['material'].stockName;
          prodOrderMaterial.materialNo = prodOrderMaterial['material'].stockNo;
        }
      });
      // this.dataModel.jobOrderList.forEach(joborder => {
      //   if (joborder.reservationList) {
      //     delete joborder.reservationList;
      //   }
      //   if (joborder.prodOrder) {
      //     joborder.prodOrderId = joborder.prodOrder.prodOrderId;
      //     delete joborder.prodOrder;
      //   }
      //   if (joborder.productTree) {
      //     joborder.productTreeId = joborder.productTree.productTreeId;
      //     delete joborder.productTree;
      //   }
      //   if (joborder.workStation) {
      //     joborder.workstationId = joborder.workStation.workStationId;
      //     joborder.workstationName = joborder.workStation.workStationName;
      //   }
      //   if (joborder.productTreeDetail) {
      //     joborder.productTreeDetailId = joborder.productTreeDetail.productTreeDetailId;
      //     delete joborder.productTreeDetail;
      //   }

      // });
      // this.jo = this.newProductionOrder.jobOrderList;

      // if (this.newProductionOrder['reservationList']) {
      //   delete this.newProductionOrder['reservationList'];
      // }
    }
  }


  @Input('prodOrderId') set setjobOrder(prodOrderId) {
    if (prodOrderId) {
      this.dataModel.prodOrderId = prodOrderId;
      this.initialize(prodOrderId);
    }
  }
  @Input('prodOrder') set setProdOrder(prodOrder) {
    if (prodOrder) {
      this.dataModel = JSON.parse(JSON.stringify(prodOrder));
      this.setData(prodOrder, false);
      this.dataModel.prodOrderMaterialList.forEach(prodOrderMaterial => {
        if(!prodOrderMaterial.materialId && prodOrderMaterial['material']) {
          prodOrderMaterial.materialId = prodOrderMaterial['material'].stockId;
          prodOrderMaterial.materialName = prodOrderMaterial['material'].stockName;
          prodOrderMaterial.materialNo = prodOrderMaterial['material'].stockNo;
        }
      });
    }
  }

  addButtonItems = [
    {label: 'Child', icon: 'pi pi-plus',
      command: () => {
          this.addJobOrderOperation(this.jobOrderSelectedIndex, this.operationSelectedIndex);
      }
    },
    {label: 'Parallel', icon: 'pi pi-plus',
      command: () => {
        // this.AddBottomNode();
        this.addJobOrderOperation(this.jobOrderSelectedIndex, this.operationSelectedIndex, true);
      }
    }];





  constructor(private _jobOrderSvc: JobOrderService,
    private _loaderSvc: LoaderService,
    private _confirmationSvc: ConfirmationService,
    private _translateSvc: TranslateService,
    private utilities: UtilitiesService,
    private _stockSvc: StockCardService,
    private usersService: UsersService,
    private _enumSvc: EnumService,
    private batchService: BatchService,
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
    this.searchStock();
    this._enumSvc.getCommonPriorityEnum().then((result: any) => this.commonPriorities = result).catch(error => console.log(error));
    this._enumSvc.getProductionTypeEnum().then(result => this.productionTypes = result).catch(error => console.log(error));

    this.subscription = this._prodOrderSvc.saveEventFire.asObservable().subscribe(res => {
      if (res && this.counter === 1) {
        this.save();
      }
    });

    // setTimeout(() => {
    //   if (this.imageAdderComponent) {
    //     this.imageAdderComponent.initImages(this.dataModel.prodOrderId, TableTypeEnum.PRODUCTION_ORDER);
    //   }
    // }, 200);
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  getReadableTime(time) {
    if(time) {
      return ConvertUtil.longDuration2DHHMMSSTime(time)
    }
  }

  onChangeLaborCost(event, operation) {
    operation.singleTotalDuration = (operation.quantity * operation.singleDuration) + operation.singleSetupDuration;
    const hour = ConvertUtil.convertMilisecondsToHours(operation.singleTotalDuration);
    operation.laborCost = parseFloat((hour * operation.laborCostRate).toFixed(1));

  }

  onChangeVariableCost(event, operation) {
    operation.singleTotalDuration = (operation.quantity * operation.singleDuration) + operation.singleSetupDuration;
    operation.variableCost = parseFloat((ConvertUtil.convertMilisecondsToHours(operation.singleTotalDuration) * operation.variableCostRate).toFixed(1));
  }

  getTotalCost(jobOrder: JobOrderList) {
    let totalCost = 0;
    jobOrder.jobOrderOperations.forEach(jop => {
      jop.totalCost = jop.laborCost + jop.variableCost + jop.fixedCost;
      totalCost = totalCost + jop.totalCost;
    });
    return totalCost && ConvertUtil.isFloat(totalCost) ? totalCost.toFixed(1) : totalCost;
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

  public initialize(prodOrderId, newAdded = false) {
    this._loaderSvc.showLoader();
    this._prodOrderSvc.getDetail(prodOrderId)
      .then((result: any) => {
        this.dataModel = JSON.parse(JSON.stringify(result));
        this.setData(result, newAdded = false);
        this.dataModel.prodOrderMaterialList.forEach(prodOrderMaterial => {
          if(!prodOrderMaterial.materialId && prodOrderMaterial['material']) {
            prodOrderMaterial.materialId = prodOrderMaterial['material'].stockId;
            prodOrderMaterial.materialName = prodOrderMaterial['material'].stockName;
            prodOrderMaterial.materialNo = prodOrderMaterial['material'].stockNo;
          }
        });
      })
      .catch(error => {
        // this.jobDetail = null;
        this.utilities.showErrorToast(error);
        this._loaderSvc.hideLoader();
      });
  }


  openMenu(rowIndex,operationIndex ,menu, event) {
    this.jobOrderSelectedIndex=rowIndex;
    this.operationSelectedIndex=operationIndex;
    menu.toggle(event);
  }


  setData(result, newAdded = false) {
    this.dataModel.startDate = new Date(this.dataModel.startDate);
    this.dataModel.finishDate = new Date(this.dataModel.finishDate);
    this.dataModel.createDate = new Date(this.dataModel.createDate);
    this.dataModel.costCenterId = result.costCenter?.costCenterId;
    this.setBaseUnit(this.dataModel.materialId);

        // this.jobOrder = (this.dataModel.jobOrderList && this.dataModel.jobOrderList.length > 0) ? this.dataModel.jobOrderList[0] : this.resetJobOrder();
        // this.jobOrderOperations = this.jobOrder.jobOrderOperations;
        this.prodOrderMaterialList = result.prodOrderMaterialList
        .map(pm => (
          {
            materialId: pm.material?.stockId,
            materialNo: pm.material?.stockNo,
            materialName: pm.material?.stockName,
            outputRate: pm.outputRate || 1,
            prodOrderId: pm.prodOrderId,
            prodOrderMaterialId: pm.prodOrderMaterialId,
            producedQuantity: pm.producedQuantity,
            quantity: pm.quantity,
            quantiyUnit: pm.quantiyUnit,
            combineProdOrderStatus: pm.combineProdOrderStatus,
            combineProdOrderType: pm.combineProdOrderType,
            combinejobOrderId: pm.combinejobOrderId,
            createDate: pm.createDate,
            updateDate: pm.updateDate,

          }
          ));

        if(!this.prodOrderMaterialList || this.prodOrderMaterialList.length == 0) {
          this.prodOrderMaterialList.push(
            {
              materialId: this.dataModel.materialId,
              materialNo: this.dataModel.materialNo,
              materialName: this.dataModel.materialName,
              outputRate:  1,
              prodOrderId: this.dataModel.prodOrderId,
              prodOrderMaterialId: null,
              producedQuantity: this.dataModel.plannedQuantity,
              quantity: this.dataModel.quantity,
              quantiyUnit: this.dataModel.baseUnit,
              combineProdOrderStatus: this.dataModel.prodOrderStatus,
              combineProdOrderType: this.dataModel.prodOrderType,
              combinejobOrderId: null,
              createDate: this.dataModel.createDate,
              updateDate: null,

            }
          )
        }

        this.dataModel.prodOrderMaterialList = this.prodOrderMaterialList;



        this._loaderSvc.hideLoader();
        this.dataModel.jobOrderList = this.dataModel.jobOrderList?.sort((a, b) => {
          if (parseInt(a.orderNo) > parseInt(b.orderNo)) {
              return 1;
          }
          if (parseInt(a.orderNo) < parseInt(b.orderNo)) {
              return -1;
          }
          return 0;
        });
        this.dataModel.jobOrderList.forEach((jb, jbIndex) => {
          if(newAdded) {
            jb['newJobOrderOp'] = true;
          }
          const split = jb.orderNo.toString().match(/.{1,2}/g);
          jb.orderFNo = split.join(".");
          // if (jbIndex === 0) {
          //   jb.orderNo = '10';
          //   jb.orderFNo = '10';
          // } else {
          //   jb.orderNo = this.dataModel.jobOrderList[jbIndex - 1].orderNo + '10';
          //   jb.orderFNo = this.dataModel.jobOrderList[jbIndex - 1].orderFNo + '.10';
          // }
        })

        if(this.cloned) {
          this.dataModel.prodOrderStatus= null;
          this.dataModel.prodOrderType = 'STANDARD_PRODUCTION_ORDER';
          this.dataModel.prodOrderId = null;
          this.dataModel.productTreeId = null;
          this.dataModel['reservationList'] = null;
          this.dataModel.prodOrderMaterialList = this.dataModel.prodOrderMaterialList.map(itm => {
            itm.prodOrderId = null;
            itm.prodOrderMaterialId = null;
            itm.combinejobOrderId=null;
            return itm;
          });
          this.prodOrderMaterialList = this.prodOrderMaterialList.map(itm => {
            itm.prodOrderId = null;
            itm.prodOrderMaterialId = null;
            itm.combinejobOrderId=null;
            return itm;
          });
          this.dataModel.jobOrderList = this.dataModel.jobOrderList.map(jb => {
            jb.jobOrderId = null;
            jb['productTree'] = null;
            jb['productTreeDetail'] = null;
            jb['reservationList'] = null;

            jb.jobOrderOperations = jb.jobOrderOperations.map(op => {
              op.jobOrder = null;
              op.jobOrderId = null;
              op.jobOrderOperationId = null;

              op.jobOrderStockUseList = op.jobOrderStockUseList.map(ustck => {
                ustck.jobOrder = null;
                ustck.jobOrderId = null;
                ustck['jobOrderOperation'] = null;
                ustck.jobOrderOperationId = null;
                ustck.jobOrderStockId = null
                return ustck;
              });
              op.jobOrderStockProduceList = op.jobOrderStockProduceList.map(ustck => {
                ustck.jobOrder = null;
                ustck.jobOrderId = null;
                ustck['jobOrderOperation'] = null;
                ustck.jobOrderOperationId = null;
                ustck.jobOrderStockId = null

                return ustck;
              });
              op.jobOrderStockAuxList = op.jobOrderStockAuxList.map(ustck => {
                ustck.jobOrder = null;
                ustck.jobOrderId = null;
                ustck['jobOrderOperation'] = null;
                ustck.jobOrderOperationId = null;
                ustck.jobOrderStockId = null

                return ustck;
              });

              return op;
            })
            return jb;
          });
          // this.dataModel.startDate = new Date();
        }

        if (!this.cloned && this.imageAdderComponent) {
          this.imageAdderComponent.initImages(this.dataModel.prodOrderId, TableTypeEnum.PRODUCTION_ORDER);
        }



  }

  onTabChanged(event) {
    if(event.index === 0) {
      this.indexSelection.emit('small');
    } else if(event.index === 1) {
      this.indexSelection.emit('big');
    } else if(event.index === 2 && this.dataModel.prodOrderStatus === 'REQUESTED') {
      this.indexSelection.emit('mid');
    } else if(event.index === 2 && this.dataModel.prodOrderStatus !== 'REQUESTED') {
      // i will make it mid later
      this.indexSelection.emit('mid');
    } else if(event.index === 3 && this.dataModel.prodOrderStatus === 'REQUESTED') {
      this.indexSelection.emit('mid');
    } else if(event.index === 3 && this.dataModel.prodOrderStatus !== 'REQUESTED') {
      this.indexSelection.emit('mid');
    } else if(event.index === 4 && this.dataModel.prodOrderStatus === 'REQUESTED') {
      this.indexSelection.emit('mid');
    } else {
      this.indexSelection.emit('small');
    }
    // if(this.dataModel.prodOrderStatus === 'REQUESTED') {

    // }
    // this.indexSelection.emit(event?.index);
  }

  editJobOrder(joborder) {
    this.jobOrder = joborder
    this.jobOrderOperations = this.jobOrder.jobOrderOperations;
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
        if (jobOrderOperation.workStation) {
          jobOrderOperation.workStationId = jobOrderOperation.workStation.workStationId;
          jobOrderOperation.workStationName = jobOrderOperation.workStation.workStationName;
        }
        jobOrderOperation.operation = jobOrderOperation.operation;
        jobOrderOperation.operationId = jobOrderOperation.operation.operationId;
        jobOrderOperation.operationName = jobOrderOperation.operation.operationName;
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
      this.jobOrderOperations.push({ ...jobOrderOperation });
    }
    this.selectedJobOrderOperation = null;

    this.jobOrderOperations.forEach(operation => {
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

    if (!this.dataModel.startDate) {
      this.utilities.showWarningToast('please-select-start-date');
      return;
    }
    if (!this.dataModel.finishDate) {
      this.utilities.showWarningToast('please-select-finish-date');
      return;
    }


    // this.jobOrder.jobOrderOperations = this.jobOrderOperations;
    // delete stck.jobOrderId;
    // this.jobOrder.jobOrderOperations.forEach(operation => {
    //   operation.jobOrderStockProduceList.forEach(stck => {
    //     if (stck.jobOrderId) {
    //       delete stck.jobOrderId;
    //     }

    //   });
    // });
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
    //   this.jobOrder.jobOrderStatus = this.jobOrder.jobOrderStatus;
    //   this.jobOrder.position = this.jobOrder.position;
    // }

    // this.dataModel.jobOrderList.push(this.jobOrder);

    if (this.dataModel.prodOrderMaterialList && this.dataModel.prodOrderMaterialList.length > 0) {
      this.dataModel.prodOrderMaterialList.forEach(item => {
        delete item['newlyAdded'];
      })
    }
    if(this.dataModel.prodOrderStatus === 'REQUESTED') {
      this.dataModel.prodOrderStatus = 'CONFIRMED';
    }


    // console.log('@beforeSave', this.dataModel);

    this._loaderSvc.showLoader();
    this.counter = this.counter + 1;

    if(this.cloned) {
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
    } else {
      this._prodOrderSvc.update(this.dataModel).then((res: any) => {
        // console.log('@result', res)

        this.utilities.showSuccessToast('saved-success');
        this.saveImages(res);
        this._loaderSvc.hideLoader();
        // this.saveAction.emit();
        this.counter = 1;

      }).catch(error => {
        this._loaderSvc.hideLoader();
        this.counter = 1;
      });
    }
  }

  private saveImages(stockId) {
    this.imageAdderComponent.updateMedia(stockId, TableTypeEnum.PRODUCTION_ORDER).then(() => {
      // this.utilities.showSuccessToast('saved-success');
        this.saveAction.emit();
    }
    ).catch(error => this.utilities.showErrorToast(error));
  }


  saveJobOrderOperation(index, operationIndex) {
    this._loaderSvc.showLoader();
    let jobOrderOperations = this.dataModel.jobOrderList.map(job => {
      return job.jobOrderOperations.map(jop => {
        jop.orderNo = job.orderNo;
        return jop;
      })
    });
    // jobOrderOperation.orderNo = this.dataModel.jobOrderList[index].orderNo;

    jobOrderOperations = [].concat.apply([], jobOrderOperations);
    if(jobOrderOperations) {
      jobOrderOperations = JSON.parse(JSON.stringify(jobOrderOperations));
      // delete jobOrderOperation.jobOrder;
      // delete jobOrderOperation.jobOrderStockAuxList;
      // delete jobOrderOperation.jobOrderStockProduceList;
      // delete jobOrderOperation.jobOrderStockUseList;
      this._prodOrderSvc.saveAllJobOrderOperation(jobOrderOperations).then((res: any) => {

          this.utilities.showSuccessToast('saved-success');
          this.initialize(this.dataModel.prodOrderId, true);
          // if(res) {
          //   this.dataModel.jobOrderList[index].jobOrderOperations[operationIndex] = {...res};
          //   this.dataModel.jobOrderList[index].jobOrderOperations[operationIndex].jobOrderStockProduceList.forEach(item => {
          //     item.stock = {stockId: item.stockId, stockName: item.stockName};
          //   });
          //   this.dataModel.jobOrderList[index].jobOrderOperations[operationIndex].jobOrderStockUseList.forEach(item => {
          //     item.stock = {stockId: item.stockId, stockName: item.stockName};
          //   })
          //   this.dataModel.jobOrderList[index].jobOrderId = res.jobOrderId;
          //   this.dataModel.jobOrderList[index].jobOrderOperations[operationIndex].orderNo = this.dataModel.jobOrderList[index].orderNo;
          // }
          this._loaderSvc.hideLoader();
      }).catch(error => {
        this.utilities.showErrorToast(error);
        this._loaderSvc.hideLoader();
      });
    }
  }

  onSelectOperation(event, operation) {
    if(event) {
      operation.operation=event;
      operation.operationId=event?.operationId;
      operation.operationName=event?.operationName;
      operation.singleDuration = event.singleDuration;
      operation.maxSingleStandbyDuration =  event.maxSingleStandbyDuration || 0;
      operation.singleSetupDuration = event.singleSetupDuration || 0;
      if(operation.singleDuration) {
        operation.singleTotalDuration = (operation.quantity * operation.singleDuration) + operation.singleSetupDuration;
      }
      operation.variableCostRate = event.operationCostRate || operation.variableCostRate;
      operation.currency =  event.currency || operation.currency;
      if(operation.variableCostRate) {
        this.onChangeVariableCost(event, operation);
      }
    }
  }

  onOutsourceEvent(event, operation) {
    if(event) {
      operation.operation.outsource = event;
      operation.variableCost = parseFloat(((operation.jobOrderStockUseList[0]?.weight || 0) * operation.variableCostRate).toFixed(1));
      operation.laborCost = parseFloat(((operation.jobOrderStockUseList[0]?.weight || 0) * operation.laborCostRate).toFixed(1));

      if(operation.variableCostRate) {
        this.onChangeVariableCost(event, operation);
      }
    } else {
      operation.operation.outsource = event;
    }
  }

  addJobOrderOperation(index, operationIndex, parallel = false) {
    // this.jobOrderSelectedIndex = index;
    // this.operationSelectedIndex = operationIndex;
    // this.addJobOperationmodal.active = true;
    const jobOrder: any = {
      batch: null,
      newJobOrder: true,
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
      orderNo: parallel ? Number(this.dataModel.jobOrderList[index].orderNo) + 1 : this.dataModel.jobOrderList[index].orderNo,
      parentId: null,
      plannedCycleQuantity: null,
      plannedHeight: null,
      plannedWidth: null,
      position: 'STANDARD',
      processControlFrequency: null,
      prodOrderId: this.dataModel.prodOrderId,
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
    };

    const JobOrderStock = {
      componentList: null,
      currentQuantity: null,
      currentStockQuantity: null,
      currentStockReservedQuantity: null,
      defectName: null,
      defectQuantity: null,
      dimensionUnit: null,
      direction: null,
      height: null,
      jobOrder: null,
      jobOrderId: null,
      jobOrderOperationId: null,
      jobOrderOperationName: null,
      jobOrderStockId: null,
      neededQuantity: null,
      neededToBuyQuantity: null,
      plannedHeight: null,
      plannedWidth: null,
      quantity: null,
      requestJobOrderComponentFeatureList: null,
      responseComponentFeature: null,
      reworkQuantity: null,
      setupDefectQuantity: null,
      stock: null,
      stockId: null,
      stockName: null,
      stockNo: null,
      stockTypeId: null,
      totalDefectQuantity: null,
      totalReworkQuantity: null,
      totalSetupQuantity: null,
      unit: null,
      useStock: null,
      wareHouseStockId: null,
      width: null,
    }
    const jobOrderOperation = {
      actualFinishTime: null,
      actualStartTime: null,
      currentQuantity: null,
      defaultStockId: null,
      defaultStockName: null,
      direction: null,
      expectedSetupDuration: null,
      individualCapacity: null,
      jobOrder: null,
      jobOrderId: null,
      jobOrderOperationId: null,
      jobOrderStockAuxList: [],
      jobOrderStockProduceList: this.dataModel.jobOrderList[index]?.jobOrderOperations[0]?.jobOrderStockUseList.map(itm => {
        itm.jobOrder = null;
        itm.jobOrderId = null;
        itm.stock = {stockId: itm.stockId, stockName: itm.stockName},
        itm.jobOrderOperationId = null;
        itm.jobOrderOperationName = null;
        itm.jobOrderStockId = null;
       return ({...itm})
      }) || [{...JobOrderStock}],
      jobOrderStockUseList: this.dataModel.jobOrderList[index + 1] && this.dataModel.jobOrderList[index + 1].jobOrderOperations ?
      this.dataModel.jobOrderList[index + 1]?.jobOrderOperations[0]?.jobOrderStockProduceList.map(itm => {
        itm.jobOrder = null;
        itm.jobOrderId = null;
        itm.stock = {stockId: itm.stockId, stockName: itm.stockName},
        itm.jobOrderOperationId = null;
        itm.jobOrderOperationName = null;
        itm.jobOrderStockId = null;
       return ({...itm})
      }) : [{...JobOrderStock}],
      maxSingleStandbyDuration: null,
      operation: null,
      operationId: null,
      operationName: null,
      laborCost: null,
      laborCostRate: null,
      variableCost: null,
      variableCostRate: null,
      totalCost: null,
      fixedCost: null,
      operationOrder: null,
      operationRepeat: null,
      operationStatus: null,
      parent: null,
      plannedCycleQuantity: null,
      processControlFrequency: null,
      prodOrderId: this.dataModel.prodOrderId,
      quantity: this.dataModel.jobOrderList[index]?.jobOrderOperations[0]?.quantity,
      singleDuration: null,
      singleSetupDuration: null,
      singleTotalDuration: null,
      workStation: null,
      workStationId: null,
      workStationName: null,
      workstationProgramList: null,
    };

    // console.log(jobOrderOperation);

    jobOrder.jobOrderOperations.push(jobOrderOperation);

    // if(parseInt(this.dataModel.jobOrderList[index].orderNo) % 10 === 0) {
    //   jobOrder.orderNo = this.dataModel.jobOrderList[index].orderNo;
    // } else {
    //   // if 1011 or 101011 or 101012 like that so remove the last two digits
    //   jobOrder.orderNo = this.dataModel.jobOrderList[index].orderNo.slice(0, -2);
    //   jobOrder.orderNo = 10 + '' + jobOrder.orderNo;
    // }

    this.dataModel.jobOrderList.splice(index + 1, 0, jobOrder);
    // this.dataModel.jobOrderList = this.dataModel.jobOrderList.sort();
    this.dataModel.jobOrderList.forEach((jb, jbIndex) => {
      if(jbIndex>index) {
        if((parseInt(jb.orderNo) % 10 === 0) && !parallel) {
          jb.orderNo = 10 + '' + jb.orderNo;
        } else {
          if(parallel && (parseInt(jb.orderNo) % 10 !== 0) && (index+1) !== jbIndex) {
            jb.orderNo = parseInt(jb.orderNo) + 1;
          }

        }
      }
      const split = jb.orderNo.toString().match(/.{1,2}/g);
      jb.orderFNo = split.join(".");
      // if (jbIndex === 0) {
      //   jb.orderNo = '10';
      //   jb.orderFNo = '10';
      // } else {
      //   jb.orderNo = this.dataModel.jobOrderList[jbIndex - 1].orderNo + '10';
      //   jb.orderFNo = this.dataModel.jobOrderList[jbIndex - 1].orderFNo + '.10';
      // }
    });

    this.dataModel.jobOrderList = this.dataModel.jobOrderList?.sort((a, b) => {
      if (parseInt(a.orderNo) > parseInt(b.orderNo)) {
          return 1;
      }
      if (parseInt(a.orderNo) < parseInt(b.orderNo)) {
          return -1;
      }
      return 0;
    });
  }
  AddJobOrderOperationToList(event, myJOModal) {
    if(event) {
      this._loaderSvc.showLoader();
      let jobOrderOperation = event;
      jobOrderOperation.prodOrderId = this.dataModel.prodOrderId;
      jobOrderOperation.jobOrderId = this.dataModel.jobOrderList[this.jobOrderSelectedIndex].jobOrderId;
      jobOrderOperation.jobOrderStockUseList.forEach(stck => {
        stck.stockId = stck.componentId;
        stck.stockName = stck.component?.stockName;
        stck.stockNo = stck.component?.stockNo;
        stck.jobOrderId = jobOrderOperation.jobOrderId;
      });
      jobOrderOperation.jobOrderStockProduceList.forEach(stck => {
        stck.stockId = stck.component?.stockId;
        stck.stockName = stck.component?.stockName;
        stck.stockNo = stck.component?.stockNo;
        stck.jobOrderId = jobOrderOperation.jobOrderId;
      });
      jobOrderOperation.jobOrderStockAuxList.forEach(stck => {
        stck.stockId = stck.componentId || stck.component?.stockId;;
        stck.stockName = stck.component?.stockName;
        stck.stockNo = stck.component?.stockNo;
        stck.jobOrderId = jobOrderOperation.jobOrderId;
      });
      this._prodOrderSvc.saveJobOrderOperation(jobOrderOperation).then((res: any) => {
          this.utilities.showSuccessToast('saved-success');
          this.initialize(this.dataModel.prodOrderId);
          // this._prodOrderSvc.detailJobOrderOperation(res.jobOrderOperationId).then((res: any) => {
          //   this._loaderSvc.hideLoader();
          //   this.dataModel.jobOrderList[this.jobOrderSelectedIndex]
          //     .jobOrderOperations.unshift({...res});
              myJOModal.hide();
          // }).catch(err => {
          //   this.utilities.showErrorToast(err);
          // this._loaderSvc.hideLoader();
          // })
          // this._loaderSvc.hideLoader();
      }).catch(error => {
        this.utilities.showErrorToast(error);
        this._loaderSvc.hideLoader();
      });
    }
  }
  removeJobOrderOperation(index, operationIndex) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-cancel'),
      header: this._translateSvc.instant('cancel-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        if(this.dataModel.jobOrderList[index]?.jobOrderId) {
          this._jobOrderSvc.cancelJobOrder(this.dataModel.jobOrderList[index]?.jobOrderId).then(() => {
            this.removeOperation(index);
          })
        } else {
          this.removeOperation(index);
        }

      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    })
  }

  removeOperation(index) {
    this.dataModel.jobOrderList.forEach((jb, jbIndex) => {
      if(jbIndex>=index) {
        if((parseInt(jb.orderNo) % 10 === 0) &&
        (parseInt(this.dataModel.jobOrderList[jbIndex-1].orderNo)% 10 === 0)) {
          jb.orderNo = '' + jb.orderNo;
          jb.orderNo = jb.orderNo.substring(2)
        } else {
          if((parseInt(this.dataModel.jobOrderList[jbIndex-1].orderNo)% 10 !== 0)
          && (parseInt(jb.orderNo) % 10 !== 0) && (index) !== jbIndex) {
            jb.orderNo = parseInt(jb.orderNo) - 1;
          }

        }
      }
      const split = jb.orderNo.toString().match(/.{1,2}/g);
      jb.orderFNo = split.join(".");
    });
    if(this.dataModel.jobOrderList[index]?.jobOrderId) {
      this.dataModel.jobOrderList.splice(index, 1);
      // if(this.dataModel.jobOrderList[index].jobOrderOperations.length == 0) {
      //   this._jobOrderSvc.deleteJobOrder(this.dataModel.jobOrderList[index].jobOrderId).then(() => {
      //     this.dataModel.jobOrderList.splice(index, 1);
      //   })
      // }
    } else {
      this.dataModel.jobOrderList.splice(index, 1);
      // if(this.dataModel.jobOrderList[index].jobOrderOperations.length == 0) {
      //   this.dataModel.jobOrderList.splice(index, 1);
      // }
    }

    this.dataModel.jobOrderList = this.dataModel.jobOrderList?.sort((a, b) => {
      if (parseInt(a.orderNo) > parseInt(b.orderNo)) {
          return 1;
      }
      if (parseInt(a.orderNo) < parseInt(b.orderNo)) {
          return -1;
      }
      return 0;
    });

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
  setMaterial(event, item) {
    if(event) {
      item.stock= {...event};
      item.stockId =  event.stockId;
      item.stockNo=event?.stockNo;
      item.stockName=event?.stockName;
      item.height =  event.height;
      item.innerDiameter =  event.innerDiameter;
      item.length =  event.length;
      item.outerDiameter =  event.outerDiameter;
      item.stockTypeId =  event.stockTypeId;
      item.unit =  event.baseUnit || event.quantityUnit;
      item.quantityUnit =  event.baseUnit;
      item.weight =  event.weight;
      item.weightUnit =  event.weightUnit;
      item.width =  event.width;
    }
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

  onEditProdOrderMaterialList(materialItem) {
    console.log('@onEditProdOrderMaterialList', materialItem)
  }

  onDeleteProdOrderMaterialList(materialitem, index) {
    this.dataModel.prodOrderMaterialList.splice(index, 1);
    this.dataModel.prodOrderMaterialList = [...this.dataModel.prodOrderMaterialList];
  }

  resetJobOrder(){
    const jobOrder: JobOrderList = {
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

    return jobOrder
  }

  showOperationDetail(opearationId) {
    this._loaderSvc.showDetailDialog(DialogTypeEnum.OPERATION, opearationId);
  }
  showJobOrderDetail(jobOrderId) {
    this._loaderSvc.showDetailDialog(DialogTypeEnum.JOBORDER, jobOrderId);
  }
  getOperationDataHeight(operation){
    var data = {
      height: 0,
      totalHeight: 0
    }
    if(operation.jobOrderStockProduceList.length >  operation.jobOrderStockUseList.length){
      data.height = (operation.jobOrderStockProduceList.length + 1) * 36;
      data.totalHeight =operation.jobOrderStockProduceList.length;
    } else if((operation.jobOrderStockProduceList.length !== 0) && (operation.jobOrderStockProduceList.length===operation.jobOrderStockUseList.length)){
      data.height = (operation.jobOrderStockProduceList.length + 1) * 36;
      data.totalHeight =operation.jobOrderStockProduceList.length;
    }else{
      data.height = (operation.jobOrderStockUseList.length + 1) * 46;
      data.totalHeight = operation.jobOrderStockUseList.length;
    }

    return data;
  }

  showStockDetail(stockId) {
    this._loaderSvc.showDetailDialog(DialogTypeEnum.STOCK, stockId);
  }
}
