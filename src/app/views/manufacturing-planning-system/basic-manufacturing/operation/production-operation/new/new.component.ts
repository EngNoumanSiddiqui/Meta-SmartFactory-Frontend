import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { UsersService } from 'app/services/users/users.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { ProductTreeOperationService } from 'app/services/dto-services/product-tree/prouduct-tree-operation.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'prod-tree-operation-new',
  templateUrl: './new.component.html'
})
export class NewProductTreeOperationComponent implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;

  @Output() saveAction = new EventEmitter<any>();
  @Output() closeAction = new EventEmitter<any>();
  componentList: any;

  @Input() tabIndex = 0;


  @Input('componentList') set  setcomponentList(componentList) {
    if (componentList) {
      this.componentList = componentList;
      setTimeout(() => {
        if (this.isCombineOperation && this.operationMaterialList.length === 0) {
          this.operationMaterialList = this.componentList.map(itm => {
            return {
            unit: itm.quantiyUnit,
            quantityUnit: itm.quantiyUnit,
            component: { stockId: itm.materialId, stockName: itm.materialName, stockNo: itm.materialNo},
            stockId: itm.materialId,
            stockName: itm.materialName,
            direction: 1,
            neededQuantity: itm.neededQuantity,
            jobOrderId: itm.combinejobOrderId,
            stockNo: itm.materialNo,
            quantity: itm.quantity
            };
          });
        }
      }, 1500);
    }
  }
  @Input() productTreeDetailId;
  @Input() workstationId;
  @Input() isParent = false;
  @Input() parentPresent = false;
  @Input() plant;
  @Input() fromOutSideProductTree = true;
  @Input() manualProdOrder = false;

  @Input() saleOrderQuantity = null
  
  @Input() isCombineOperation = false;

  @Input('plannedCycleQuantity') set setPlannedCycleQuantity(plannedCycleQuantity) {
    if(plannedCycleQuantity) {
      setTimeout(() => {
        this.dataModel.plannedCycleQuantity = plannedCycleQuantity;
        this.dataModel.quantity = plannedCycleQuantity;
        this.dataModel.singleTotalDuration = (this.dataModel.quantity * this.dataModel.singleDuration) + this.dataModel.singleSetupDuration;

      }, 1200);
    }
  }
  selectedPlant: any;
  operationMaterialList = [];
  myWorkstationList = null;
  
  @Input('data') set x(data) {
    // console.log('@NewProductTreeOperationComponent', data);
    if (data) {
      if (data.operation) {
        data.operationId = data.operation.operationId;
        this.myWorkstationList = data.operation?.operationWorkStationList || null;
      } else {
        if(data.operationId && data.operationName) {
          data.operation = {operationId: data.operationId, operationName: data.operationName};
        }
      }
      if (data.defaultStock) {
        data.defaultStockId = data.defaultStock.stockId;
      }
      if (data.workStation) {
        data.workStationId = data.workStation.workStationId;
      }
      if (data.productTreeDetailWorkstationProgramList) {
        data.productTreeDetailWorkstationProgramList.forEach(item => {
          if (item.workstationProgram) {
            item['workstationProgramId'] = item.workstationProgram.workstationProgramId;
          }
        })
      } else {
        data.productTreeDetailWorkstationProgramList = [];
      }
      if (data.componentList && data.componentList.length > 0) {
        data.componentList.forEach(itm => {
          if (itm.component) {
            itm.componentId = itm.component.componentId;
          }
          if (itm.productTreeDetailOperation) {
            itm.productTreeDetailOperationId = itm.productTreeDetailOperation.productTreeDetailOperationId;
          }
        });
      }

      

      this.dataModel = Object.assign({}, data);
      // this.dataModel = {
      //   defaultStockId : data.defaultStockId ? data.defaultStockId : null,
      //   defaultStock : data.defaultStock ? data.defaultStock : null,
      //   description : data.description ? data.description : null,
      //   maxSingleStandbyDuration : data.maxSingleStandbyDuration ? data.maxSingleStandbyDuration : null,
      //   operationId : data.operationId ? data.operationId : null,
      //   currency: data.currency || null,
      //   componentList : data.componentList ? data.componentList : null,
      //   operationOrder : data.operationOrder ? data.operationOrder : null,
      //   operationRepeat : data.operationRepeat ? data.operationRepeat : 1,
      //   parent : data.parent ? data.parent : null,
      //   fixedCost: data.fixedCost,
      //   neededPerson: data.neededPerson,
      //   laborCost: data.laborCost,
      //   variableCost: data.variableCost,
      //   plannedCycleQuantity : data.plannedCycleQuantity ? data.plannedCycleQuantity : 1,
      //   processControlFrequency : data.processControlFrequency ? data.processControlFrequency : 1,
      //   productTreeDetailId : data.productTreeDetailId ? data.productTreeDetailId : null,
      //   productTreeDetailOperationId : data.productTreeDetailOperationId ? data.productTreeDetailOperationId : null,
      //   productTreeDetailWorkstationProgramList : data.productTreeDetailWorkstationProgramList ? data.productTreeDetailWorkstationProgramList : null,
      //   quantity : data.quantity ? data.quantity : 1,
      //   singleDuration : data.singleDuration ? data.singleDuration : 0,
      //   singleSetupDuration : data.singleSetupDuration ? data.singleSetupDuration : 0,
      //   singleTotalDuration : data.singleTotalDuration ? data.singleTotalDuration : 0,
      //   workStationId : data.workStationId ? data.workStationId : null,
      //   workStation : data.workStation ? data.workStation : null,
      //   operation: data.operation ? data.operation : null
      // };
      if (this.dataModel.componentList && this.dataModel.componentList.length > 0) {
        this.operationAuxMaterialList = this.dataModel.componentList.filter(itm => +itm.direction === 0);
        this.operationComponentList = this.dataModel.componentList.filter(itm => +itm.direction === -1);
        this.operationMaterialList = this.dataModel.componentList.filter(itm => +itm.direction === 1);
      } else {
        if (data.hasOwnProperty('jobOrderStockAuxList')) {
          this.operationAuxMaterialList = data.jobOrderStockAuxList;
          this.operationComponentList = data.jobOrderStockUseList;
          this.operationMaterialList = data.jobOrderStockProduceList;
        } else {
          this.operationAuxMaterialList = [];
          this.operationComponentList = [];
          this.operationMaterialList = [];
        }
      }
    } else {
      this.reset();
    }
  };

  @Input('openModalType') set onmodal(openModalType) {
    if (openModalType !== null && openModalType !== undefined) {
      setTimeout(() => {
        this.myModal.show();
      }, 1000);
    }
  }
  


  dataModel = {
    defaultStockId : null,
    defaultStock : null,
    description : null,
    maxSingleStandbyDuration : null,
    operationId : null,
    operationOrder : 1,
    operationRepeat : 1,
    currency: null,
    neededPerson: null,
    parent : true,
    plannedCycleQuantity : 1,
    processControlFrequency : 1,
    productTreeDetailId : null,
    productTreeDetailOperationId : null,
    productTreeDetailWorkstationProgramList : null,
    quantity : 1,
    componentList: [],
    singleDuration : null,
    singleSetupDuration : null,
    singleTotalDuration : null,
    workStationId : null,
    workStation : null,
    operation: null,
    fixedCost: null,
    laborCost: null,
    variableCost: null,
  };

  // stockList = [];
  operationComponentList = [];
  operationAuxMaterialList = [];
  constructor(private loaderService: LoaderService,
              private _compSvc: ProductTreeOperationService,
              private userSvc: UsersService,
              private _translateSvc: TranslateService,
              private utilities: UtilitiesService) {
                this.selectedPlant = JSON.parse(this.userSvc.getPlant());

  }

  ngOnInit() {

    if (!this.isCombineOperation && this.componentList && this.componentList.length > 0) {
      // this.stockList = this.componentList.filter(itm => itm.direction === 1).map(itm => ({...itm.component}))
    } else if (this.isCombineOperation && this.componentList && this.componentList.length > 0
      && this.operationMaterialList.length === 0) {
      this.operationMaterialList = this.componentList.map(itm => {
        return {
          unit: itm.quantiyUnit,
          component: { stockId: itm.materialId, stockName: itm.materialName, stockNo: itm.materialNo},
          stockId: itm.materialId,
          stockName: itm.materialName,
          stockNo: itm.materialNo,
          direction: 1,
          jobOrderId: itm.combinejobOrderId,
          quantity: itm.quantity,
          neededQuantity: itm.neededQuantity
        };
      });
    }
  }

  onParentChanged(event) {
    if (event && this.parentPresent) {
      const lbl = this._translateSvc.instant('only-one-operation-can-be-parent-please-change-other-operation-to-child');
      this.utilities.showWarningToast(lbl);
      setTimeout(() => {
        this.dataModel.parent = false;
      }, 200);
    } else if (event && this.dataModel.operationOrder !== 1) {
      const lbl = this._translateSvc.instant('only-order-number-one-must-be-parent');
      this.utilities.showWarningToast(lbl);
      setTimeout(() => {
        this.dataModel.parent = false;
      }, 200);
    } else if (!event && this.dataModel.operationOrder === 1) {
      const lbl = this._translateSvc.instant('order-number-one-must-be-parent');
      this.utilities.showWarningToast(lbl);
      setTimeout(() => {
        this.dataModel.parent = true;
      }, 200);
    }
  }

  save() {
    if (!this.dataModel.operationId) {

      this.utilities.showWarningToast('operation-must-be-selected');
      return;
    }

    if (!this.operationComponentList) {
      this.operationComponentList = [];
    }
    if (!this.operationAuxMaterialList) {
      this.operationAuxMaterialList = [];
    }
    if (this.isCombineOperation) {
      this.dataModel['jobOrderStockAuxList'] = this.operationAuxMaterialList.map(itm => ({...itm, stock:itm.component || itm.stock, stockId: itm.componentId || itm.component?.componentId}));
      this.dataModel['jobOrderStockUseList'] = this.operationComponentList.map(itm => ({...itm, stock:itm.component || itm.stock, stockId: itm.componentId || itm.component?.componentId}));
      this.dataModel['jobOrderStockProduceList'] = this.operationMaterialList.map(itm => ({...itm, stock:itm.component || itm.stock, stockId: itm.componentId || itm.component?.componentId}));
    } else {
      this.dataModel.componentList = [...this.operationComponentList, ...this.operationAuxMaterialList, ...this.operationMaterialList];
    }

    if (!this.dataModel.singleSetupDuration) {
      this.dataModel.singleSetupDuration = 0;
    }

    if (!this.dataModel.singleDuration) {
      this.dataModel.singleDuration = 0;
    }


    this.loaderService.showLoader();

    if (this.dataModel.productTreeDetailWorkstationProgramList && this.dataModel.productTreeDetailWorkstationProgramList.length > 0) {
      this.dataModel.productTreeDetailWorkstationProgramList.forEach((item, index) => {
        item.operationOrder = index + 1;
      })
    }

    // if productTreeDetailId  is not null, that mean this operation will be saved  or update standalone
    if (this.productTreeDetailId) {
      this.dataModel.productTreeDetailId = this.productTreeDetailId;
      const requestDto = JSON.parse(JSON.stringify(this.dataModel));
      requestDto.componentList.forEach(comp => {
        // delete comp.component;
        comp.productTreeDetailOperationId = this.dataModel.productTreeDetailOperationId;
      });
      console.log('Operation : ', this.dataModel);
      // if (requestDto.workStation) {
      //   delete requestDto.workStation;
      // }
      // if (requestDto.operation) {
      //   delete requestDto.operation;
      // }
      this.saveAction.emit(requestDto);
      if ( !this.isCombineOperation) {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
      }

      // this._compSvc.save(requestDto)
      //   .then((result: any) => {
      //     this.loaderService.hideLoader();
      //     this.utilities.showSuccessToast('saved-success');
      //     setTimeout(() => {
      //       if (result.productTreeDetail) {
      //         result.productTreeDetailId =  result.productTreeDetail.productTreeDetailId;
      //       }
      //       if (result.productTreeDetailComponentList) {
      //         result.componentList = result.productTreeDetailComponentList || [];
      //         delete result.productTreeDetailComponentList;
      //       } else {
      //         result.componentList = this.dataModel.componentList;
      //       }
      //       this.saveAction.emit(result);
      //     }, environment.DELAY);
      //   })
      //   .catch(error => {
      //     this.loaderService.hideLoader();
      //     this.utilities.showErrorToast(error);
      //   });
    } else { // this mean operation will be saved after detail saved
      this.saveAction.emit(this.dataModel);
      this.loaderService.hideLoader();
      // this.utilities.showSuccessToast('saved-success');
    }
    // this.reset();
  }

  setSelectedOperation(operation) {
    if (operation) {
      this.dataModel.operationId = operation.operationId;
      this.dataModel.operation = operation;
      this.dataModel.variableCost = operation.operationCostRate;
      this.dataModel.currency = operation.currency;
      this.dataModel.singleDuration = operation.singleDuration || this.dataModel.singleDuration;
      this.dataModel.singleSetupDuration = operation.singleSetupDuration || this.dataModel.singleSetupDuration;
      this.dataModel.maxSingleStandbyDuration = operation.maxSingleStandbyDuration || this.dataModel.maxSingleStandbyDuration;;
      this.dataModel.singleTotalDuration = (this.dataModel.quantity * this.dataModel.singleDuration) + this.dataModel.singleSetupDuration;
      this.myWorkstationList = operation.operationWorkStationList;
    } else {
      this.dataModel.operationId = null;
      this.dataModel.variableCost = null;
      this.dataModel.currency = null;
      this.dataModel.operation = null;
      this.dataModel.singleDuration = null;
      this.dataModel.singleSetupDuration = null;
      this.dataModel.maxSingleStandbyDuration = null;
      this.dataModel.singleTotalDuration = null;
      this.myWorkstationList = [];
    }
  }
  setSelectedStock(stock) {
    if (stock) {
      this.dataModel.defaultStock = stock;
      this.dataModel.defaultStockId = stock.stockId;
    } else {
      this.dataModel.defaultStock = null;
      this.dataModel.defaultStockId = null;
    }
  }
  handleChange(e) {
    this.tabIndex = e.index;
  }

  operationOrderChanged(event) {
    if (this.isParent) {
      if (this.dataModel.operationOrder === 1) {
        this.dataModel.parent = true;
      } else {
        this.dataModel.parent = false;
      }
    }
  }

  featuresUpdated(event) {
    this.dataModel.productTreeDetailWorkstationProgramList = event;
  }

  onQuantityChanged(event) {
    this.dataModel.singleTotalDuration = (this.dataModel.quantity * this.dataModel.singleDuration) + this.dataModel.singleSetupDuration;
  }

  addsingleDuration(event) {
    this.dataModel.singleDuration = event;
    // if (this.dataModel.singleSetupDuration) {
      this.dataModel.singleTotalDuration = (this.dataModel.quantity * this.dataModel.singleDuration) + this.dataModel.singleSetupDuration;
    // }
  }
  addsingleSetupDuration(event) {
    this.dataModel.singleSetupDuration = event;
    // if(this.dataModel.singleSetupDuration !== 0) {
      this.dataModel.singleTotalDuration = (this.dataModel.quantity * this.dataModel.singleDuration) + this.dataModel.singleSetupDuration;
    // } else {
      // this.dataModel.singleTotalDuration = 0;
    // }
    // if (this.dataModel.singleSetupDuration) {
      
    // }
  }
  setSelectedWorkstation(equipment) {
    if (equipment) {
      this.dataModel.workStationId = equipment.workStationId;
      this.dataModel.workStation = equipment;
    } else {
      this.dataModel.workStationId = null;
      this.dataModel.workStation = null;
    }
  }


  reset() {
    this.dataModel = {
      defaultStockId : null,
      defaultStock : null,
      description : null,
      neededPerson: null,
      maxSingleStandbyDuration : null,
      operationId : null,
      operationOrder : 1,
      currency: null,
      fixedCost: null,
      laborCost: null,
      variableCost: null,
      operationRepeat : 1,
      parent : true,
      plannedCycleQuantity : 1,
      processControlFrequency : 1,
      productTreeDetailId : null,
      productTreeDetailOperationId : null,
      productTreeDetailWorkstationProgramList : null,
      quantity : 1,
      componentList: [],
      singleDuration : null,
      singleSetupDuration : null,
      singleTotalDuration : null,
      workStationId : null,
      workStation : null,
      operation: null
    };

    this.operationAuxMaterialList = [];
    this.operationComponentList = [];
    if (this.isCombineOperation && this.componentList && this.componentList.length > 0) {
      this.operationMaterialList = this.componentList.map(itm => {
        return {
        unit: itm.quantiyUnit,
        quantityUnit: itm.quantiyUnit,
        component: { stockId: itm.materialId, stockName: itm.materialName, stockNo: itm.materialNo},
        stockId: itm.materialId,
        stockName: itm.materialName,
        stockNo: itm.materialNo,
        quantity: itm.quantity
        };
      });
    }
  }

  close() {
    this.closeAction.next('close');
  }
 }
