import {ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {CreateNewProdObject, JobOrderList} from 'app/dto/porder/porder.model';
import {ProductTreeService} from 'app/services/dto-services/product-tree/prod-tree.service';
import {ProductionOrderService} from 'app/services/dto-services/production-order/production-order.service';
import {DialogTypeEnum} from 'app/services/shared/dialog-types.enum';
import {LoaderService} from 'app/services/shared/loader.service';
import {UtilitiesService} from 'app/services/utilities.service';
import {ConvertUtil} from 'app/util/convert-util';
import {ConfirmationService} from 'primeng';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-prod-review-job-order',
  templateUrl: './prod-review-job-order.component.html',
  styleUrls: ['./prod-review-job-order.component.scss']
})
export class ProdReviewJobOrderComponent implements OnInit, OnChanges, OnDestroy {
  selectedProductTrees = null;
  selectedOperationForDuration = null;
  prodData = new CreateNewProdObject();
  @Output() saveAction = new EventEmitter<any>();

  addDurationModal = {active: false};
  addProdOperationModal = {active: false};
  // addJobOperationmodal = {active: false};

  prodTreeSelectedRowData = null;
  // operationSelectedIndex = -1;

  @Input('productTreeId') productTreeId = null;
  @Input('orderQuantity') orderQuantity = null;

  @Input('prodData') set setprodData(prodData) {
    if (prodData) {
      this.prodData = prodData;
    }
  }
  @Input('jobOrderList') set setjobOrderList(jobOrderList) {
    if (jobOrderList) {
      this.jobOrderList = JSON.parse(JSON.stringify(jobOrderList));
      setTimeout(() => {
        this.jobOrderList = [...this.jobOrderList];
        if(this.jobOrderList && this.jobOrderList.length > 0) {
          if(this.jobOrderList[0].jobOrderOperations && this.jobOrderList[0].jobOrderOperations.length > 0) {
          } else {
            this.jobOrderList[0].jobOrderOperations.push( {
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
              jobOrderStockProduceList: [],
              jobOrderStockUseList: [],
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
              prodOrderId: null,
              quantity: null,
              singleDuration: null,
              singleSetupDuration: null,
              singleTotalDuration: null,
              workStation: null,
              workStationId: null,
              workStationName: null,
              workstationProgramList: [],
            })
          }

          this.jobOrderList.forEach(jb => {
            jb.jobOrderOperations.forEach(op => {
              if(!op.operation && op.operationId) {
                op.operation = <any> {operationName: op.operationName, operationId: op.operationId}
              }
              op.jobOrderStockProduceList.forEach(st => {
                if(!st.stock && st.stockId) {
                  st.stock = <any> {stockId: st.stockId, stockNo: st.stockNo, stockName: st.stockName,
                     stockTypeId: st.stockTypeId, quantityUnit: st.unit};
                }
                if(!st.quantity) {
                  st.quantity = st.neededQuantity;
                }
                if(!st['quantityUnit']) {
                  st['quantityUnit'] = st.unit;
                }

              })
              op.jobOrderStockUseList.forEach(st => {
                if(!st.stock && st.stockId) {
                  st.stock = <any> {stockId: st.stockId, stockNo: st.stockNo, stockName: st.stockName,
                     stockTypeId: st.stockTypeId, quantityUnit: st.unit};
                }
                if(!st.quantity) {
                  st.quantity = st.neededQuantity;
                }
                if(!st['quantityUnit']) {
                  st['quantityUnit'] = st.unit;
                }
                if(st.materialCost && !st.materialCostRate) {
                  st.materialCostRate = parseFloat((st.materialCost / st.neededQuantity).toFixed(2));
                  st.materialCost = (st.quantity * this.orderQuantity * st.materialCostRate);
                }
                
              })
              op.jobOrderStockAuxList.forEach(st => {
                if(!st.stock && st.stockId) {
                  st.stock = <any> {stockId: st.stockId, stockNo: st.stockNo, stockName: st.stockName,
                     stockTypeId: st.stockTypeId, quantityUnit: st.unit};
                }
                if(!st.quantity) {
                  st.quantity = st.neededQuantity;
                }
                if(!st['quantityUnit']) {
                  st['quantityUnit'] = st.unit;
                }
              })
            })
          })
        } else {
          let jobOrder = {
            batch: null,
            customerJobOrderStatus: null,
            description: null,
            endDate: null,
            expectedQuantity: this.prodData.plannedQuantity,
            expectedSetupDuration: null,
            individualCapacity: null,
            item: null,
            jobOrderEquipmentList: [],
            jobOrderId: null,
            jobOrderOperations: [
              {
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
                jobOrderStockProduceList: [],
                jobOrderStockUseList: [],
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
                prodOrderId: null,
                quantity: this.prodData.quantity,
                singleDuration: null,
                singleSetupDuration: null,
                singleTotalDuration: null,
                workStation: null,
                workStationId: null,
                workStationName: null,
                workstationProgramList: [],
              }
            ],
            jobOrderStatus: null,
            jobOrderStockAuxList: [],
            jobOrderStockProduceList: [],
            jobOrderStockUseList: [],
            maxSingleStandbyDuration: null,
            operationRepeat: null,
            orderDetailId: null,
            orderIndex: null,
            orderNo: '10',
            parentId: null,
            plannedCycleQuantity: null,
            plannedHeight: null,
            plannedWidth: null,
            position: 'STANDARD',
            processControlFrequency: null,
            prodOrderId: this.prodData.prodOrderId,
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
          this.jobOrderList.push(jobOrder);
        }
        this.makeItInOrder();
      }, 200);

      // console.log(this.jobOrderList);
    }
  }

  operationSelectedIndex = -1;
  selectedProdItemOperation = null;
  sub: Subscription;
  counter: number = 1;
  jobOrderList: JobOrderList[] = [];

  constructor(private _loaderSvc: LoaderService,
              private _confirmationSvc: ConfirmationService,
              private _translateSvc: TranslateService,
              private svcProductTree: ProductTreeService,
              private _prodOrderSvc: ProductionOrderService,
              private cdx: ChangeDetectorRef,
              private utilities: UtilitiesService) {
  }

  ngOnInit() {

    this.sub = this._prodOrderSvc.saveCompleteEventFire.asObservable().subscribe(res => {
      if (res && this.counter === 1) {
        this.save();
      }
    });
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges.productTreeId && simpleChanges.productTreeId.currentValue) {
      this.detail(simpleChanges.productTreeId.currentValue);
    }
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }


  detail(id) {
    this.svcProductTree.get(id).then(result => {
      this.initialize(result);
    }).catch(err => {
      this.utilities.showErrorToast(err);
    })
  }

  initialize(dt) {
    let data = JSON.parse(JSON.stringify(dt));
    if (data.startDate) {
      data.startDate = new Date(data.startDate);
    }
    if (data.expiryDate) {
      data.expiryDate = new Date(data.expiryDate);
    }
    if (data.lastModeDate) {
      data.lastModeDate = new Date(data.lastModeDate);
    }
    if (data.material) {
      data.materialId = data.material.stockId;
    }
    if (data.plant) {
      data.plantId = data.plant.plantId;
      // this.plantName = data.plant.plantName;
    }
    if (data.workstation) {
      data.workstationId = data.workstation.workStationId;
    }
    data.productTreeDetailList.forEach(prdetail => {
      this.setWorkstationId(prdetail);
    });
    this.jobOrderList = this.flattenTreeArray(data.productTreeDetailList, 'productTreeDetailList', this.jobOrderList);
    this.makeItInOrder();
    // console.log('Job Order', this.jobOrderList);
  }


  mapToJobOrder(item) {
    let jobOrder: JobOrderList;
    jobOrder = {
      batch: null,
      customerJobOrderStatus: null,
      description: null,
      endDate: null,
      expectedQuantity: this.prodData.plannedQuantity,
      expectedSetupDuration: null,
      individualCapacity: null,
      item: null,
      jobOrderEquipmentList: null,
      jobOrderId: null,
      jobOrderOperations: null,
      jobOrderStatus: null,
      jobOrderStockAuxList: null,
      jobOrderStockProduceList: null,
      jobOrderStockUseList: null,
      maxSingleStandbyDuration: null,
      operationRepeat: null,
      orderDetailId: null,
      orderIndex: null,
      orderNo: item.stepNo || '10',
      parentId: item.parentId,
      plannedCycleQuantity: null,
      plannedHeight: null,
      plannedWidth: null,
      position: 'STANDARD',
      processControlFrequency: null,
      prodOrderId: this.prodData.prodOrderId,
      productTreeDetailId: item.productTreeDetailId,
      productTreeId: item.productTreeId,
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
    jobOrder.jobOrderOperations = item.operationList.map(op => {
      return {
        description: op.description,
        maxSingleStandbyDuration: op.maxSingleStandbyDuration,
        operationId: op.operation?.operationId,
        operation: op.operation,
        operationOrder: op.operationOrder,
        currency: op.currency,
        fixedCost: op.fixedCost,
        laborCost: op.laborCost,
        laborCostRate: op.laborCostRate,
        variableCost: op.variableCost,
        variableCostRate: op.variableCostRate,
        operationRepeat: op.operationRepeat,
        parent: op.parent,
        plannedCycleQuantity: op.plannedCycleQuantity,
        processControlFrequency: op.processControlFrequency,
        productTreeDetailId: op.productTreeDetailId,
        productTreeDetailOperationId: op.productTreeDetailOperationId,
        productTreeDetailWorkstationProgramList: op.productTreeDetailWorkstationProgramList,
        quantity: op.quantity,
        componentList: op.componentList,
        singleDuration: op.singleDuration,
        singleSetupDuration: op.singleSetupDuration,
        singleTotalDuration: op.singleTotalDuration,
        workStationId: op.workStationId,
        jobOrderStockAuxList: this.getAuxList(op).map(us => ({...us, stock: us.component, stockId: us.component?.stockId})),
        jobOrderStockUseList: this.getInputList(op).map(us => ({...us, stock: us.component, stockId: us.component?.stockId})),
        jobOrderStockProduceList: this.getOutputList(op).map(us => ({...us, stock: us.component, stockId: us.component?.stockId})),
        'workStationName': op.worStation?.workStationName,
        'workStation': op.workStation,
        'operationName': op.operation?.operationName,
        'operationStatus': op.operationStatus
      }
    });
    return jobOrder;
  }

  flattenTreeArray(items, prop, flat) {
    if (items) {
      items.forEach(item => {
        const jb = this.mapToJobOrder(item);
        flat.push(jb);
        if (item[prop] && item[prop].length > 0) {
          this.flattenTreeArray(item[prop], prop, flat);
        }
      });
    }
    return flat;

  }

  getInputList = (rowData) => {
    return rowData.componentList ? rowData.componentList.filter(itm => itm.direction < 0) || [] : [];
  }

  getOutputList = (rowData) => {
    return rowData.componentList ? rowData.componentList.filter(itm => itm.direction > 0) || [] : [];
  }
  getAuxList = (rowData) => {
    return rowData.componentList ? rowData.componentList.filter(itm => itm.direction === 0) || [] : [];
  }

  setWorkstationId(prdetail) {
    if (prdetail.workstation) {
      prdetail.workstationId = prdetail.workstation.workStationId;
    }
    if (prdetail.productTreeDetailList && prdetail.productTreeDetailList.length > 0) {
      prdetail.productTreeDetailList.forEach(dt => {
        this.setWorkstationId(dt);
      });
    }
    if (prdetail.productionType && typeof (prdetail.productionType) === 'object') {
      prdetail.productionType = prdetail.productionType.message;
    }
    if (prdetail.operationList && prdetail.operationList.length > 0) {
      prdetail.operationList = prdetail.operationList.sort((a, b) => a.operationOrder - b.operationOrder);
      prdetail.operationList.forEach(operation => {
        if (operation.variableCost) {
          operation.variableCostRate = operation.variableCost;
          operation.variableCost = parseFloat(
            (ConvertUtil.convertMilisecondsToHours(operation.singleTotalDuration) * operation.variableCostRate)
              .toFixed(1));
        }

        if (operation.laborCost) {
          operation.laborCostRate = operation.laborCost;
          operation.laborCost = parseFloat(
            (ConvertUtil.convertMilisecondsToHours(operation.singleTotalDuration) * operation.laborCostRate)
              .toFixed(1));
        }
        operation.componentList = operation.productTreeDetailComponentList || [];
        delete operation.productTreeDetailComponentList;
      });
    }
  }


  showOperationDetail(opearationId) {
    this._loaderSvc.showDetailDialog(DialogTypeEnum.OPERATION, opearationId);
  }

  showStockDetail(stockId) {
    this._loaderSvc.showDetailDialog(DialogTypeEnum.STOCK, stockId);
  }


  getTotalCostOfProductTreeItem = (joborder) => {
    let total = 0;
    joborder.jobOrderOperations.forEach(op => {
      if (op.variableCost) {
        total = total + op.variableCost;
      }
      if (op.laborCost) {
        total = total + op.laborCost;
      }
      op.jobOrderStockUseList.forEach(cmp => {
        if (cmp.materialCost) {
          // total = total + (cmp.materialCost * cmp.quantity * this.orderQuantity);
          total = total + cmp.materialCost;
        }
      });
    });

    return total.toFixed(2);
  }
  getFinalCost = () => {
    let total = 0;
    if (this.jobOrderList) {
      this.jobOrderList.forEach(prd => {
        prd.jobOrderOperations.forEach(op => {
          if (op.variableCost) {
            total = total + op.variableCost;
          }
          if (op.laborCost) {
            total = total + op.laborCost;
          }
          op.jobOrderStockUseList.forEach(cmp => {
            if (cmp.materialCost) {
              // total = total + (cmp.materialCost * cmp.quantity * this.orderQuantity);
              total = total + cmp.materialCost;
            }
          });
          // if(prd.productTreeDetailList && prd.productTreeDetailList.length) {
          //   total = total + this.countCost(prd.productTreeDetailList);
          // }
        });
      });
    }

    return total.toFixed(2);
  }

  countCost(list) {
    let total = 0;
    if (!list || !list.length) {
      return total;
    }
    list.forEach(prd => {
      prd.operationList.forEach(op => {
        if (op.variableCost) {
          total = total + op.variableCost;
        }
        if (op.laborCost) {
          total = total + op.laborCost;
        }
        op.componentList.forEach(cmp => {
          if (cmp.materialCost) {
            total = total + (cmp.materialCost * cmp.quantity * this.orderQuantity);
          }
        });
      });
      if (prd.productTreeDetailList && prd.productTreeDetailList.length) {
        total = total + this.countCost(prd.productTreeDetailList);
      }
    });
    return total;
  }

  addProdTreeLevelOperation(index) {
    // this.prodTreeSelectedIndex = index;
    // this.operationSelectedIndex = operationIndex;
    this.addProdOperationModal.active = true;
  }

  openOperationModal(operation, rowIndex, rowData) {
    // this.prodTreeSelectedIndex = rowIndex;
    this.prodTreeSelectedRowData = rowData;
    this.selectedProdItemOperation = operation;
    this.addProdOperationModal.active = true;
  }

  addOperation(event, myModal) {
    if (event) {
      event.variableCostRate = event.variableCost;
      event.laborCostRate = event.laborCost;
      this.prodTreeSelectedRowData.jobOrderOperations.splice(0, 1, {...event})
      myModal.hide();
      // if(this.operationSelectedIndex === -1) {
      //   // const productDetailDto  = {
      //   //   productTreeId: this.productTreeId,
      //   //   productTreeDetailId: null,
      //   //   operationRepeat: 1,
      //   //   processControlFrequency: 1,
      //   //   productionType: 'STANDARD',
      //   //   plannedCycleQuantity : 1,
      //   //   parentId: this.dataModel.productTreeDetailList[this.prodTreeSelectedIndex].productTreeDetailId,
      //   //   singleDuration: 0,
      //   //   singleSetupDuration: 0,
      //   //   singleTotalDuration: 0,
      //   //   maxSingleStandbyDuration: 0,
      //   //   componentList: [],
      //   //   operationList: [{...event}],
      //   //   equipmentList: [],
      //   //   workstationProgramList: [],
      //   //   workstationId: null,
      //   //   workstation: null,
      //   //   orderNo: (this.dataModel.productTreeDetailList[this.prodTreeSelectedIndex].stepNo + '.' + 10),
      //   // };
      //   // this.prodTreeSelectedRowData.
      // } else {
      //   this.prodTreeSelectedRowData.operationList.splice(this.operationSelectedIndex, 1, {...event});
      //   this.operationSelectedIndex = -1;
      //   this.selectedProdItemOperation = null;
      //   myModal.hide();
      // }

    }
  }


  addJobOrderItem(index) {
    let jobOrder = {
      batch: null,
      customerJobOrderStatus: null,
      description: null,
      endDate: null,
      expectedQuantity: this.prodData.plannedQuantity,
      expectedSetupDuration: null,
      individualCapacity: null,
      item: null,
      jobOrderEquipmentList: [],
      jobOrderId: null,
      jobOrderOperations: [
        {
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
          jobOrderStockProduceList: [],
          jobOrderStockUseList: [],
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
          prodOrderId: null,
          quantity: this.prodData.quantity,
          singleDuration: null,
          singleSetupDuration: null,
          singleTotalDuration: null,
          workStation: null,
          workStationId: null,
          workStationName: null,
          workstationProgramList: [],
        }
      ],
      jobOrderStatus: null,
      jobOrderStockAuxList: [],
      jobOrderStockProduceList: [],
      jobOrderStockUseList: [],
      maxSingleStandbyDuration: null,
      operationRepeat: null,
      orderDetailId: null,
      orderIndex: null,
      orderNo: this.jobOrderList[index] + '.10',
      parentId: this.jobOrderList[index]?.jobOrderId,
      plannedCycleQuantity: null,
      plannedHeight: null,
      plannedWidth: null,
      position: 'STANDARD',
      processControlFrequency: null,
      prodOrderId: this.prodData.prodOrderId,
      productTreeDetailId: this.jobOrderList[index]?.productTreeDetailId,
      productTreeId: this.jobOrderList[index]?.productTreeId,
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
    if (index < this.jobOrderList.length) {
      this.jobOrderList.splice(index + 1, 0, {...jobOrder});
    } else {
      this.jobOrderList.push({...jobOrder})
    }

    this.makeItInOrder();
   

  }

  makeItInOrder() {
    this.jobOrderList.forEach((itm, index) => {
      if (index === 0) {
        itm.orderNo = '10';
        itm.orderFNo = '10';
      } else {
        itm.orderNo = this.jobOrderList[index - 1].orderNo + '10';
        itm.orderFNo = this.jobOrderList[index - 1].orderFNo + '.10';
      }
    })

    // this.prodData.jobOrderList = this.jobOrderList;
  }

  // onTableDataChange() {
  //   const dataToSave = this.nodeList2DetailData(this.tableData);
  //   // this.saveEvent.next(dataToSave);
  // }
  delete(id, index) {
    // if (id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this.jobOrderList.splice(index, 1);
        this.makeItInOrder();
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    })
    // } else {
    // this.removeKey(key, parent);
    // }
  }

  onTableDataChange() {
    // this.dataModel.productTreeDetailList = this.nodeList2DetailData(this.tableData);
    // this.tableData = this.detailList2Node(this.dataModel.productTreeDetailList);
    // this.cdx.markForCheck();
    // this.initialize(this.dataModel);
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

  getOperationDataHeight(operation, num: number) {
    var data = {
      height: 0,
      totalHeight: 0
    }
    if (operation.jobOrderStockProduceList.length > operation.jobOrderStockUseList.length) {
      data.height = (operation.jobOrderStockProduceList.length + 1) * 45;
      data.totalHeight = operation.jobOrderStockProduceList.length;
    } else if ((operation.jobOrderStockProduceList.length !== 0) && (operation.jobOrderStockProduceList.length === operation.jobOrderStockUseList.length)) {
      data.height = (operation.jobOrderStockProduceList.length + 1) * 45;
      data.totalHeight = operation.jobOrderStockProduceList.length;
    } else {
      data.height = (operation.jobOrderStockUseList.length + 1) * 45;
      data.totalHeight = operation.jobOrderStockUseList.length;
    }
    return data;
  }

  getReadableTime(time) {
    if (time) {
      return ConvertUtil.longDuration2DHHMMSSTime(time)
    }
  }

  save() {
    if (!this.prodData.wareHouseId) {
      this.utilities.showWarningToast('please-select-warehouse');
      return;
    }
    this.prodData.jobOrderList = this.jobOrderList;
    if (this.prodData.prodOrderMaterialList && this.prodData.prodOrderMaterialList.length > 0) {
      this.prodData.prodOrderMaterialList.forEach(item => {
        delete item['newlyAdded'];
      })
    }
    if (this.prodData.prodOrderStatus === 'REQUESTED') {
      this.prodData.prodOrderStatus = 'CONFIRMED';
    }
    this._loaderSvc.showLoader();
    this.counter = this.counter + 1;
    this._prodOrderSvc.update(this.prodData).then((res: any) => {
      this.utilities.showSuccessToast('saved-success');
      this.saveAction.emit();
      this._loaderSvc.hideLoader();
      this.counter = 1;
    }).catch(error => {
      this._loaderSvc.hideLoader();
      this.counter = 1;
    });
  }


  // async save() {
  //   const newDto = JSON.parse(JSON.stringify(this.dataModel));
  //   delete newDto.plant;
  //   delete newDto.material;
  //   delete newDto.workstation;
  //   if (newDto.productTreeDetailList.length <= 0) {
  //     this.utilities.showWarningToast('add minimum one detail');
  //     return;
  //   }
  //   const validate = await this.validateProductTreeDetailList(newDto.productTreeDetailList);
  //   if ( validate === 0) {
  //     return ;
  //   }
  //   const parentData = this.dataModel.productTreeDetailList[0].operationList.find(e => e.parent === true);
  //   if (!parentData) {
  //     const lbl = this._translateSvc.instant('please-select-operation-as-parent-for-level-1');
  //     this.utilities.showWarningToast(lbl);
  //     return;
  //   }

  //   this._loaderSvc.showLoader();
  //   newDto.status = 'ACTIVE';
  //   this.svcProductTree.save(newDto).then(result => {
  //     this._loaderSvc.hideLoader();
  //     this.utilities.showSuccessToast('save-success');
  //   }).catch(err => {
  //     this._loaderSvc.hideLoader();
  //     this.utilities.showErrorToast(err);
  //   });


  // }

  async validateProductTreeDetailList(treedetailist) {
    return new Promise(async (res) => {
      const allvalidate = new Promise<number>(async (response, rej) => {
        await treedetailist.forEach(async productreedetail => {
          const vld = await this.validateProductTreeDetailItem(productreedetail);
          if (vld === 0) {
            return rej(0);
          } else if (productreedetail.productTreeDetailList && productreedetail.productTreeDetailList.length > 0) {
            const result = await this.validateProductTreeDetailList(productreedetail.productTreeDetailList);
            if (result === 0) {
              return rej(0);
            } else {
              response(1);
            }
          } else {
            response(1);
          }
        });
      });
      const valid = await allvalidate;
      res(valid);
    });
  }

  validateProductTreeDetailItem(productTreeDetailitem) {
    return new Promise((res) => {

      if (!productTreeDetailitem.operationList || productTreeDetailitem.operationList.length === 0) {
        this.utilities.showWarningToast('add minimum one operation');
        return res(0);
      } else {
        productTreeDetailitem.operationList.forEach(opr => {
          if (opr.operation) {
            opr.operationId = opr.operation.operationId;
            delete opr.operation;
          }
          if (opr.defaultStock) {
            opr.defaultStockId = opr.defaultStock.stockId;
            delete opr.defaultStock;
          }
          if (opr.workStation) {
            opr.workStationId = opr.workStation.workStationId;
            delete opr.workStation;
          }
          if (opr.componentList) {
            opr.componentList.forEach(comp => {
              if (comp.component) {
                comp.componentId = comp.component.stockId;
                delete comp.component;
              }
              if (comp.productTreeDetailOperation) {
                comp.productTreeDetailOperationId = comp.productTreeDetailOperation.productTreeDetailOperationId;
                delete comp.productTreeDetailOperation;
              }
            });
          }
        });
      }
      if (productTreeDetailitem.equipmentList) {
        productTreeDetailitem.equipmentList.forEach(eqpt => {
          if (eqpt.stock) {
            eqpt.stockId = eqpt.stock.stockId;
            delete eqpt.stock;
          }
        });
      }
      if (productTreeDetailitem.workstationProgramList) {
        productTreeDetailitem.workstationProgramList.forEach(wrkprgm => {
          if (wrkprgm.workstationProgram) {
            wrkprgm.workstationProgramId = wrkprgm.workstationProgram.workstationProgramId;
            delete wrkprgm.workstationProgram;
          }
        });
      }
      if (productTreeDetailitem.workstation) {
        productTreeDetailitem.workstationId = productTreeDetailitem.workstation.workStationId;
        delete productTreeDetailitem.workstation;
      }
      // }
      return res(1);
    });
  }
}
