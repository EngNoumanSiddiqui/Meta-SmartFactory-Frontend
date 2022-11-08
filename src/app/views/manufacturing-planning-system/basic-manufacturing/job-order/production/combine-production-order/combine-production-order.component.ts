import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CreateNewProdObject, JobOrderList, JobOrderOperation } from 'app/dto/porder/porder.model';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
import { ProductionOrderService } from 'app/services/dto-services/production-order/production-order.service';
import { StockCardService } from 'app/services/dto-services/stock/stock.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UsersService } from 'app/services/users/users.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { ConvertUtil } from 'app/util/convert-util';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ConfirmationService } from 'primeng';
import { Subscription } from 'rxjs';

@Component({
    selector: 'combine-production-order',
    templateUrl: 'combine-production-order.component.html'
})

export class CombineProductionOrderComponent implements OnInit, OnDestroy {

  @ViewChild('myModal') public myModal: ModalDirective;

    dataModel = new CreateNewProdObject();

    selectedPlant: any;
    selectedMaterial: any;
    unitList: any;
    
    commonPriorities: any = [];
    addmodal = {active: false};

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

    productionTypes: [];

    jobOrderPositions = ["STANDARD","JOINED","DIVIDED","JOIN_PAIR","CREATED","EXTERNAL_JOB"];

    combineActivityTypes = ['ACTIVITY_COMBINING', 'COMPONENT_COMBINING', 'ORDER_COMBINING'];

    dialog = {
      visible: false
    }

    @Output() saveAction = new EventEmitter<any>();
    materialList = [];

    prodOrderMaterialList= [];

    jobOrderOperationDetailsAdded = false;
    
    subscription: Subscription;
    
    counter = 1;

    prodOrderTypeList = [];

    @Input('data') set setData(data) {
        if (data) {
            const FullData = [...data];
            console.log('@fullData', FullData);

            FullData.forEach(itm => {
                if (itm.jobOrderList && itm.jobOrderList.length > 0) {
                    itm.jobOrderList.forEach((jborder: JobOrderList) => {
                        if (jborder.jobOrderOperations && jborder.jobOrderOperations.length > 0) {
                          jborder.jobOrderOperations.forEach(opration => {
                            opration.operation = {
                              operationId : opration.operationId,
                              operationName : opration.operationName,
                              description: null,
                              operationNo: null,
                              operationType: null,
                              outsource: null,
                              plant: null
                            }
          
                            if (opration.workStationId) {
                              opration.workStation = {
                                workStationId: opration.workStationId,
                                workStationName: opration.workStationName
                              }
                            }
                            

                            if (opration.individualCapacity === 0 || !opration.individualCapacity) {
                              opration.individualCapacity = 1;
                            }

                            delete opration.jobOrderId;
                            delete opration.prodOrderId;
                            // Task #1747 mentioned we don't need to add operations in table.
                            // this.jobOrderOperations.push(opration);
                            // console.log('@prodorderMaterial')


                            if ((opration.jobOrderStockProduceList && opration.jobOrderStockProduceList.length > 0 ) && opration.operationOrder == 1) {
                                opration.jobOrderStockProduceList.forEach(stock => {
                                  this.dataModel.prodOrderMaterialList.push({
                                    combineProdOrderStatus: 'COMBINED',
                                    combineProdOrderType: 'ACTIVITY_COMBINING',
                                    combinejobOrderId: stock.jobOrderId,
                                    createDate: null,
                                    materialId: stock.stockId,
                                    materialNo: stock.stockNo,
                                    materialName: stock.stockName,
                                    outputRate: 1,
                                    prodOrderId: null,
                                    prodOrderMaterialId: null,
                                    producedQuantity: null,
                                    quantity: stock.neededQuantity,
                                    neededQuantity: stock.neededQuantity,
                                    quantiyUnit: stock.unit,
                                    updateDate: null,
                                  });   
                                });
                                const prodMaterialData = this.dataModel.prodOrderMaterialList[0];
                                this.dataModel.materialId = prodMaterialData.materialId;
                                this.dataModel.materialName = prodMaterialData.materialName;
                                this.dataModel.orderUnit = prodMaterialData.quantiyUnit;
                                this.dataModel.baseUnit = prodMaterialData.quantiyUnit;
                                this.dataModel.priority = 'MEDIUM';
                              
                            }
                          
                          });
                        }
                    });
                }

                if (itm.jobOrderOperations && itm.jobOrderOperations.length > 0) {
                  itm.jobOrderOperations.forEach(opration => {
                    opration.operation = {
                      operationId : opration.operationId,
                      operationName : opration.operationName,
                      description: null,
                      operationNo: null,
                      operationType: null,
                      outsource: null,
                      plant: null
                    }
  
                    if (opration.workStationId) {
                      opration.workStation = {
                        workStationId: opration.workStationId,
                        workStationName: opration.workStationName
                      }
                    }
                    

                    if (opration.individualCapacity === 0 || !opration.individualCapacity) {
                      opration.individualCapacity = 1;
                    }

                    delete opration.jobOrderId;
                    delete opration.prodOrderId;
                    // Task #1747 mentioned we don't need to add operations in table.
                    // this.jobOrderOperations.push(opration);

                    if ((opration.jobOrderStockProduceList && opration.jobOrderStockProduceList.length > 0) && opration.operationOrder == 1) {
                        opration.jobOrderStockProduceList.forEach(stock => {
                        this.dataModel.prodOrderMaterialList.push({
                            combineProdOrderStatus: 'COMBINED',
                            combineProdOrderType: 'ACTIVITY_COMBINING',
                            combinejobOrderId: stock.jobOrderId,
                            createDate: null,
                            materialId: stock.stockId,
                            materialNo: stock.stockNo,
                            materialName: stock.stockName,
                            outputRate: 1,
                            prodOrderId: null,
                            prodOrderMaterialId: null,
                            producedQuantity: null,
                            quantity: stock.neededQuantity,
                            neededQuantity: stock.neededQuantity,
                            quantiyUnit: stock.unit,
                            updateDate: null,
                          });   
                        });
                        const prodMaterialData = this.dataModel.prodOrderMaterialList[0];
                        this.dataModel.materialId = prodMaterialData.materialId;
                        this.dataModel.materialName = prodMaterialData.materialName;
                        this.dataModel.orderUnit = prodMaterialData.quantiyUnit;
                        this.dataModel.baseUnit = prodMaterialData.quantiyUnit;
                        this.dataModel.priority = 'MEDIUM';
                      
                    }
                  
                  });



                }
            });

            //#region For Setting Same JobOrderOperation ByDefault in Combine JobOrder
            if(FullData && FullData[0].jobOrderOperations) {
              this.assignSameJobOrderOperation(FullData);
            } else {
              let fullData = FullData.map(itm => itm.jobOrderList);
              fullData = [].concat(...fullData);
              this.assignSameJobOrderOperation(fullData);
            }

            //#endregion


            const uniqueValues = new Set(FullData.map(v => v.position));
            if(uniqueValues.size === 1 && uniqueValues.has('EXTERNAL_JOB')) {
              this.dataModel.prodOrderType = 'EXTERNAL_PRODUCTION_ORDER';
              this.jobOrder.position = 'EXTERNAL_JOB';
            } else {
              this.dataModel.prodOrderType = 'STANDARD_PRODUCTION_ORDER';
            }
            let index = -1;
            let itemId = -1;
            this.dataModel.prodOrderMaterialList.sort((a, b) => a.materialId - b.materialId).forEach((itm,i) => {
              if(itemId === itm.materialId) {
                const oldneedqty = this.dataModel.prodOrderMaterialList[index].neededQuantity;
                const oldqty = this.dataModel.prodOrderMaterialList[index].quantity
                this.dataModel.prodOrderMaterialList[index].neededQuantity += itm.neededQuantity; 
                this.dataModel.prodOrderMaterialList[index].quantity += itm.quantity; 
                itm.neededQuantity += oldneedqty;
                itm.quantity += oldqty;
              } else {
                itemId = itm.materialId;
                index = i;
              }

            })
            this.dataModel.prodOrderMaterialList = ConvertUtil.removeDuplicatedDataInArray(this.dataModel.prodOrderMaterialList, 'materialId');
            this.prodOrderMaterialList = [...this.dataModel.prodOrderMaterialList];

            
            this.searchStock();
        }
    }

    // @Input('saveCombineOrder') set sO(saveCombineOrder: boolean) {
    //   if (saveCombineOrder) { this.save(); } 
    // }

    constructor(private userSvc: UsersService,
        private _stockSvc: StockCardService,
        private _enumSvc: EnumService,
        private _confirmationSvc: ConfirmationService,
        private _translateSvc: TranslateService,
        private utilities: UtilitiesService,
        private _prodOrderSvc: ProductionOrderService,
        private _loaderSvc: LoaderService
        ) {
        const setPlant = this.userSvc.getPlant();
        this.selectedPlant = JSON.parse(setPlant);
        if (this.selectedPlant) {
          this.dataModel.plantId = this.selectedPlant.plantId;
          this.dataModel.plantName = this.selectedPlant.plantName;
        }
     }

    ngOnInit() {
        this.getProductionOrderTypeList();
        this._enumSvc.getCommonPriorityEnum().then((result: any) => this.commonPriorities = result || []).catch(error => console.log(error));
        this._enumSvc.getProductionTypeEnum().then(result => this.productionTypes = result || []).catch(error => console.log(error));

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
        } else {
          this.dataModel.wareHouseId = null;
        }
    }


    assignSameJobOrderOperation(FullData: any) {
       //#region Combine Job Order --> assign same values if they are same #2353
       let joborderOperationIds = FullData.map(itm => itm.jobOrderOperations
        .map(jbop => jbop.operationId));
        joborderOperationIds = [].concat(...joborderOperationIds);
        // joborderOperationIds.flat();
      let inputIds = FullData.map(itm => 
                      itm.jobOrderOperations
                      .map(jbop => jbop.jobOrderStockUseList.map(st => st.stockId)));
          inputIds = [].concat(...inputIds); // need two times flatten cus it's in nested array
          inputIds = [].concat(...inputIds);
      let outputIds = FullData.map(itm => 
            itm.jobOrderOperations
            .map(jbop => jbop.jobOrderStockProduceList.map(st => st.stockId)));
          outputIds = [].concat(...outputIds); // need two times flatten cus it's in nested array
          outputIds = [].concat(...outputIds);

      let workstationIds = FullData.map(itm => itm.jobOrderOperations
        .map(jbop => jbop.workStationId));
        workstationIds = [].concat(...workstationIds);

      if(this.allEqual(joborderOperationIds) && this.allEqual(inputIds) 
      && this.allEqual(workstationIds)) {
        this.selectedJobOrderOperation = {...FullData[0].jobOrderOperations[0]};
        this.selectedJobOrderOperation.jobOrderOperationId = null;
       
        this.selectedJobOrderOperation.jobOrderStockUseList.forEach(st => {
          st.jobOrderId = null;
          st.quantityUnit = st.unit;
          st.jobOrderOperationId = null;
          st.jobOrderStockId = null;
        });
        this.selectedJobOrderOperation.jobOrderStockAuxList.forEach(st => {
          st.jobOrderId = null;
          st.quantityUnit = st.unit;
          st.jobOrderOperationId = null;
          st.jobOrderStockId = null;
        });

        if(this.allEqual(outputIds)) { // if all outputs are equal
          this.selectedJobOrderOperation.jobOrderStockProduceList.forEach(st => {
            let producestocks = FullData.map(jb => jb.jobOrderOperations.map(op => op.jobOrderStockProduceList));
            producestocks = producestocks.flat();
            producestocks = producestocks.flat();
            st.neededQuantity = producestocks.filter(pst => pst.stockId === st.stockId)
            .reduce((acc,sum)=>acc+sum.neededQuantity, 0);
            st.quantity = producestocks.filter(pst => pst.stockId === st.stockId)
            .reduce((acc,sum)=>acc+sum.quantity, 0)
            st.jobOrderId = null;
            st.jobOrderOperationId = null;
            st.quantityUnit = st.unit;
            st.jobOrderStockId = null;
          });
        } else {
          this.selectedJobOrderOperation.jobOrderStockProduceList = [];
          FullData.forEach(jb => {
            jb.jobOrderOperations.forEach(jbp => {
              jbp.jobOrderStockProduceList.forEach(st => {
                st.jobOrderId = null;
                st.jobOrderOperationId = null;
                st.quantityUnit = st.unit;
                st.jobOrderStockId = null;
                this.selectedJobOrderOperation.jobOrderStockProduceList.push({...st});
              });
            });
          });
        }
        
        
      }

      //#endregion
    }
    allEqual = arr => arr.every(v => v === arr[0]);

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

    
  getProductionOrderTypeList() {
    this._enumSvc.getProductionOrderTypeList().then(result => {
      this.prodOrderTypeList = result;
      console.log(result);
    }).catch(error => console.log(error));
    // this.prodSvc.filter({pageSize: 100000, pageNumber: 1}).then(data => {
    //   // console.log('@prOderType', data);
    //   if (data && data['content']) {
    //     this.prodOrderTypeList = data['content'];
    //   }
    // });
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
          this.dataModel.orderUnit =  res['baseUnit'];
          this.dataModel.baseUnit =  res['baseUnit'];
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
  onProdTypeChanged(event) {
    if (event) {
      if(event === 'STANDARD_PRODUCTION_ORDER') {
        this.jobOrder.position = 'STANDARD';
      } else if (event === 'EXTERNAL_PRODUCTION_ORDER') {
        this.jobOrder.position = 'EXTERNAL_JOB';
      }
    }
  }

  addOrUpdate(jobOrderOperation) {
   this.jobOrderOperationDetailsAdded = true;
    if (this.jobOrderOperations && this.jobOrderOperations.length > 0) {
      if (this.selectedJobOrderIndex != null) {
        console.log('@individualCapacity', jobOrderOperation)
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
        this.jobOrderOperations[this.selectedJobOrderIndex].individualCapacity = (this.selectedJobOrderOperation) ? this.selectedJobOrderOperation.individualCapacity: jobOrderOperation.individualCapacity;
      } else {
        jobOrderOperation.workStation = jobOrderOperation.workStation;
        if (jobOrderOperation.workStation) {
          jobOrderOperation.workStationId = jobOrderOperation.workStation.workStationId;
          jobOrderOperation.workStationName = jobOrderOperation.workStation.workStationName;
        }
        jobOrderOperation.operation = jobOrderOperation.operation;
        jobOrderOperation.operationId = jobOrderOperation.operation.operationId;
        jobOrderOperation.operationName = jobOrderOperation.operation.operationName;
        this.jobOrderOperations.push({...jobOrderOperation});
      }
    } else {
      this.jobOrderOperations = [];
      jobOrderOperation.workStation = jobOrderOperation.workStation;
      jobOrderOperation.workStationId = jobOrderOperation.workStation?.workStationId;
      jobOrderOperation.workStationName = jobOrderOperation.workStation?.workStationName;
      jobOrderOperation.operation = jobOrderOperation.operation;
      jobOrderOperation.operationId = jobOrderOperation.operation.operationId;
      jobOrderOperation.operationName = jobOrderOperation.operation.operationName;
      this.jobOrderOperations.push({...jobOrderOperation});
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
          stck.neededQuantity = stck.quantity ;
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
          stck.neededQuantity = stck.quantity ;
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
          stck.neededQuantity = stck.quantity ;
        }
      });

    });
  }
  setSelectedEquipment(event) {
    if(event) {
      this.jobOrder.jobOrderEquipmentList.push({
        stockId: event.stockId,
        stockName: event.stockName,
        count: 1,
        jobOrderId: null,
        jobOrderEquipmentId: null
      });
    }
    
  }

  onClosedOperation(event) {
    this.selectedJobOrderOperation = null;
    this.selectedJobOrderIndex = null; 
    if (this.jobOrderOperations.length > 0 ) {
      this.jobOrderOperationDetailsAdded = true;
    } 
  }

  save() {

    if (!this.dataModel.wareHouseId) {
      this.utilities.showWarningToast('please-select-warehouse');
      return;
    }

    if(!this.jobOrderOperations || this.jobOrderOperations.length == 0) {
      this.utilities.showWarningToast('please-add-job-operations');
      return;
    }
    if(this.jobOrderOperations.find(op => op.operationId == null)) {
      this.utilities.showWarningToast('operation-must-be-selected');
      return;
    }

    this.jobOrder.jobOrderOperations = this.jobOrderOperations;
    // delete stck.jobOrderId;
    this.jobOrder.jobOrderOperations.forEach(operation => {
      operation.expectedSetupDuration = operation.singleSetupDuration;
      operation.jobOrderStockProduceList.forEach(stck => {
        stck.neededQuantity = stck.quantity;
      })
      operation.jobOrderStockAuxList.forEach(stck => {
        stck.neededQuantity = stck.quantity;
      })
      operation.jobOrderStockProduceList.forEach(stck => {
        stck.neededQuantity = stck.quantity;
        if (stck.jobOrderId) {
          delete stck.jobOrderId;
        }
        
      });
    });
    if (this.jobOrder.jobOrderOperations && this.jobOrder.jobOrderOperations.length > 0) {
      this.jobOrder.singleDuration = this.jobOrder.jobOrderOperations[0].singleDuration;
      this.jobOrder.plannedCycleQuantity = this.jobOrder.jobOrderOperations[0].plannedCycleQuantity;
      this.jobOrder.processControlFrequency = this.jobOrder.jobOrderOperations[0].processControlFrequency;
      this.jobOrder.workstationId = this.jobOrder.jobOrderOperations[0].workStationId;
      this.jobOrder.totalDuration = this.jobOrder.jobOrderOperations[0].singleTotalDuration;
      this.jobOrder.expectedSetupDuration = this.jobOrder.jobOrderOperations[0].expectedSetupDuration;
      this.jobOrder.singleSetupDuration = this.jobOrder.jobOrderOperations[0].singleSetupDuration;
      this.jobOrder.singleSetupDuration = this.jobOrder.jobOrderOperations[0]['singleStandbyDuration'];
      this.jobOrder.maxSingleStandbyDuration = this.jobOrder.jobOrderOperations[0].maxSingleStandbyDuration;
      this.jobOrder.jobOrderStatus = 'NOT_READY_YET_WAITING_FOR_JOB';
      // this.jobOrder.position = 'STANDARD';
    }
    this.jobOrder.expectedQuantity = this.dataModel.plannedQuantity;
    this.dataModel.jobOrderList.push(this.jobOrder);
    
    if (this.dataModel.prodOrderMaterialList && this.dataModel.prodOrderMaterialList.length > 0) {
      this.dataModel.prodOrderMaterialList.forEach(item => {
        delete item['newlyAdded'];
      });
      const prodMaterialData = this.dataModel.prodOrderMaterialList[0];
      this.dataModel.materialId = prodMaterialData.materialId;
      this.dataModel.materialName = prodMaterialData.materialName;
      this.dataModel.orderUnit = prodMaterialData.quantiyUnit;
      this.dataModel.baseUnit = prodMaterialData.quantiyUnit;
      this.dataModel.priority = 'MEDIUM';
    }
    this.dataModel.prodOrderStatus = null;

    // console.log('@beforeSave', this.dataModel);

    this._loaderSvc.showLoader();
    this.counter = this.counter + 1;
    this._prodOrderSvc.save(this.dataModel).then((res: any) => {
      // console.log('@result', res)
      this.utilities.showSuccessToast('saved-success');
      this._loaderSvc.hideLoader();
      this.counter = 1;
      this.saveAction.emit();
    }).catch(error => {
      this._loaderSvc.hideLoader();
      this.counter = 1;
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
      combineProdOrderStatus: 'COMBINED',
      combineProdOrderType: 'ACTIVITY_COMBINING',
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
    if (this.dataModel.prodOrderMaterialList && this.dataModel.prodOrderMaterialList.length > 0) {
      this.dataModel.materialId = this.dataModel.prodOrderMaterialList[0].materialId;
      this.dataModel.materialName = this.dataModel.prodOrderMaterialList[0].materialName;
      this.dataModel.orderUnit = this.dataModel.prodOrderMaterialList[0].quantiyUnit;
      this.dataModel.baseUnit = this.dataModel.prodOrderMaterialList[0].quantiyUnit;
    }

    
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

  onEditProdOrderMaterialList(materialItem) {
    console.log('@onEditProdOrderMaterialList', materialItem)
  }

  onDeleteProdOrderMaterialList(materialitem, index) {
    this.dataModel.prodOrderMaterialList.splice(index, 1);
    this.dataModel.prodOrderMaterialList = [...this.dataModel.prodOrderMaterialList];
  }
}

