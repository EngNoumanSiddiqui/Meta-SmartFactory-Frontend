import { AfterViewInit, Component, OnInit, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { JobOrderService } from 'app/services/dto-services/job-order/job-order.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { StockCardService } from 'app/services/dto-services/stock/stock.service';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
import { ProductionOrderService } from 'app/services/dto-services/production-order/production-order.service';
import { Router } from '@angular/router';
import { EnumJobOrderStatusService } from 'app/services/dto-services/enum/job-order-status.service';

import { AppStateService } from 'app/services/dto-services/app-state.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { ConvertUtil } from 'app/util/convert-util';
import { ProductTreeService } from 'app/services/dto-services/product-tree/prod-tree.service';
import { ImageAdderComponent } from 'app/views/image/image-adder/image-adder.component';
import { TableTypeEnum } from 'app/dto/table-type-enum';
import { BatchService } from 'app/services/dto-services/batch/batch.service';
import {CommonCodeGeneration} from '../../../../../../dto/common-code-generation.enum';
import {SalesOrderService} from '../../../../../../services/dto-services/sales-order/sales-order.service';

@Component({
  selector: 'app-with-product-tree-order',
  templateUrl: './with-product-tree.component.html',
  styleUrls: ['./with-product-tree.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CreateWithProductTreeSaleOrderComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(ImageAdderComponent) imageAdderComponent: ImageAdderComponent;
  @ViewChild('myModal') public myModal: ModalDirective;

  @ViewChild('myWsModal') public myWsModal: ModalDirective;

  minDateValue = new Date();
  //////////////////////////////
  /*server side rendering*/
  pagination = {
    totalElements: 0,
    currentPage: 1,
    pageNumber: 1,
    pageSize: 10,
    totalPages: 1,
    TotalPageLinkButtons: 5,
    RowsPerPageOptions: [10, 20, 30, 50, 100, 1000],
    rows: 10,
    tag: ''
  };

  pageFilter = {
    pageNumber: 1,
    pageSize: 10,
    startDate: null,
    endDate: null,
    query: null,
    orderByProperty: 'productTreeId',
    orderByDirection: 'desc',
    plantId: null,
    status: 'ACTIVE',
  };

  jobOrderStatusList;

  jobOrderTypes: any[] = [];
  /////////////////////////////
  modal: any;

  newProductionOrder = {
    batch: null,
    receiptNo: null,
    costCenterId: null,
    projectId: null,
    milestoneId: null,
    orderUnit: null,
    baseUnit: null,
    locationNo: null,
    barcode: null,
    quantity: null,
    actualCost: null,
    grQuantity: null,
    currency: null,
    plannedQuantity: null,
    minimumDelayQuantityBetweenOperation: null,
    referenceId: null,
    estimatedCost: null,
    finalCost: null,
    description: null,
    extraProducedQuantityPercentage: 0,
    createDate: null,
    startDate: new Date(),
    finishDate: null,
    actualStart: null,
    actualFinish: null,
    plantId: null,
    materialId: null,
    material: null,
    wareHouseId: null,
    wareHouseName: null,
    wareHouse: null,
    plant: null,
    prodOrderType: null,
    prodOrderStatus: null,
    jobOrderList: null,
    batchExist: false,
    priority: 'MEDIUM',
    productTreeId: null,
    prodOrderMaterialList: null
  }

  prodOrderMaterialList = [];

  combineActivityTypes = ['ACTIVITY_COMBINING', 'COMPONENT_COMBINING', 'ORDER_COMBINING'];

  materialList = [];

  myWsModal_prop = false;

  warehouseLocationModal = {active : false};

  selectedProductTreeItem;

  productTrees;

  selectedCreateJobOrders;

  manualOrderExtra = {
    stockName: null,
    stockProducedName: null,
    operationName: null,
    nextOperationName: null,
    equipmentName: null,
    description: null,
  };

  classReOrder = ['desc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc'];

  cols = [
    { field: 'productTreeId', header: 'product-tree-id' },
    { field: 'materialNo', header: 'stock-no' },
    { field: 'material', header: 'stock' },

    // { field: 'plant', header: 'plant' },
    // { field: 'workstation', header: 'workstation' },
    
    { field: 'startDate', header: 'start-date' },
    { field: 'expiryDate', header: 'expiry-date' },
    { field: 'revisionNo', header: 'revision-no' },
    {field: 'description', header: 'description'},
    // {field: 'lastModeDate', header: 'last-mode-date'},
  ];

  createdJobOrders: Array<any> = [];

  newJobOrderFromExisting = {
    productTreeId: null,
    stockId: null,
    neededQuantity: null,
    extraProducedQuantityPercentage: 0,
    jobOrderType: 'STANDARD'
  };

  prodOrderTypeList: any;

  unitList;

  params = { dialog: { title: '', item: '' } };

  wsModalParams = { title: '' };

  isManual: boolean;

  selectedJobOrder;

  poData: {
    'availableFrom': any; 'batchCode': any;
    // "batchId": null,
    'countryId': any;
    /*"createDate": null,*/
    'lastGoodsReceipt': any; 'manufactureDate': any; 'note': any; 'plantId': any; 'sledBbdDate': string; 'stockId': any; 'actId': any; 'actType': any; 'vendorBatch': any;
  };

  sub: Subscription;

  operationId: any;

  commonPriorities = [];


  private searchTerms = new Subject<any>();

  reOrderData(id, item: string) {
    this.pageFilter.orderByProperty = item;
    if (this.classReOrder[id] === 'asc') {
      this.classReOrder[id] = 'desc';
    } else {
      this.classReOrder[id] = 'asc';
    }
    this.pageFilter.orderByDirection = this.classReOrder[id];
    this.filter();
  }

  constructor(private _jobOrderStatusSvc: EnumJobOrderStatusService,
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private _stockSvc: StockCardService,
              private _jobOrderSvc: JobOrderService,
              private _orderSvc: ProductTreeService,
              private _enumSvc: EnumService,
              private appStateService: AppStateService,
              private _productionOrderSvc: ProductionOrderService,
              private batchService: BatchService,
              private _saleSvc: SalesOrderService,
              private _router: Router) {

  }



  ngOnInit() {
    console.log('@CreateWithProductTreeSaleOrderComponent')

    this.jobOrderStatusTypes();
    this._enumSvc.getCommonPriorityEnum().then((result: any) => this.commonPriorities = result).catch(error => console.log(error));


    this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
      if (!(res)) {
        this.pageFilter.plantId = null;
      } else {
        this.pageFilter.plantId = res.plantId;
        this.filter();
      }

    });
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this._orderSvc.filterObservable(term))).subscribe(
        res => {
            this.productTrees = res['content'];
            this.pagination.currentPage = res['currentPage'];
            this.pagination.totalElements = res['totalElements'];
            this.pagination.totalPages = res['totalPages'];
            this.loaderService.hideLoader();
        },
        error => {
          this.loaderService.hideLoader();
          this.utilities.showErrorToast(error);
        });


  }

  jobOrderStatusTypes() {
    this._jobOrderStatusSvc.getJobOrderPositionList().then((orderTypes: any) => {
      this.jobOrderTypes = orderTypes.filter((jobOrderType) => {
        return (jobOrderType === 'STANDARD' || jobOrderType === 'EXTERNAL_JOB')
      });
      console.log('tupesss', this.jobOrderTypes)
    });
  }

  prioritySelection(event) {
    if (event) {
      this.newProductionOrder.priority = event.target.value;
    } else {
      this.newProductionOrder.priority = null;
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  ngAfterViewInit() {
    this.initialize();
    this.filter();
  }

  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = null;
    }
    this.pageFilter[field] = value;

    this.filter();
  }

  filterByPlant(event) {
    if (event) {
      this.pageFilter.plantId = event.plantId;
    } else {
      this.pageFilter.plantId = null;
    }
    this.filter();
  }


  setSelectedPlant(event) {
    this.newProductionOrder.wareHouse = null;
    this.newProductionOrder.wareHouseId = null;
    if (event) {
      this.newProductionOrder.plantId = event.plantId;
    } else {
      this.newProductionOrder.plantId = null;
    }
  }


  setSelectedWarehouse(event) {
    this.newProductionOrder.wareHouse = event;
    if (event && event.hasOwnProperty('wareHouseId')) {
      this.newProductionOrder.wareHouseId = event.wareHouseId;
      this.newProductionOrder['wareHouseNo'] = event.wareHouseNo;
    } else {
      this.newProductionOrder.wareHouseId = null;
      this.newProductionOrder['wareHouseNo'] = null;
    }

  }


  filter() {
    this.loaderService.showLoader();
    this.searchTerms.next(this.pageFilter);
  }


  private initialize() {

    this._enumSvc.getProductionOrderTypeList().then(result => {
      if(result){
        this.prodOrderTypeList = result.filter(item => item !== 'COMBINED_PRODUCTION_ORDER'
        && item !== 'DIVIDED_PRODUCTION_ORDER')
//         && item !== 'AUTO_PRODUCTION_ORDER' && item !== 'REORDER_PLAN_PRODUCTION_ORDER')
      }
    }).catch(error => console.log(error));

    this._jobOrderStatusSvc.getJobOrderEnumList().then(result => this.jobOrderStatusList = result).catch(error => console.log(error));
  }

  assignOrder(item) {
    this.selectedProductTreeItem = item.data;
    // console.log(this.selectedProductTreeItem);
    this.newProductionOrder.materialId = this.selectedProductTreeItem.material.stockId;
    this.newProductionOrder.material = this.selectedProductTreeItem.material;
    //////////////////////////////////////////////////
    this.newProductionOrder.plantId = this.selectedProductTreeItem.plant.plantId;
    this.newProductionOrder.plant = this.selectedProductTreeItem.plant;
    this.newProductionOrder.baseUnit = this.selectedProductTreeItem.material.baseUnit;
    // this.newProductionOrder.batchExist = (this.selectedProductTreeItem.batch);
    this.newProductionOrder.quantity = this.selectedProductTreeItem.quantity;

    // this.newProductionOrder.wareHouseId = item.data.warehouseId;
    // this.newProductionOrder.wareHouseName = item.data.warehouseName;
    // if (item.data.warehouseId) {
    //   this.newProductionOrder.wareHouse = {wareHouseName: item.data.warehouseName, wareHouseId: item.data.warehouseId};
    // }
    // if (item.data.plantId) {
    //   this.newProductionOrder.plant = {plantName: item.data.plantName, plantId: item.data.plantId};
    // }
    //////////////////////////////////////////////////

    this.newJobOrderFromExisting.productTreeId = this.selectedProductTreeItem.productTreeId;
    this.newJobOrderFromExisting.stockId = this.selectedProductTreeItem.material.stockId;
    this.newJobOrderFromExisting.neededQuantity = 1;
    this.addAndIncrementReferenceId();

  }

  setBaseUnit(event) {
    this.unitList = null;
    const me = this;
    if (event) {

      this._stockSvc.getDetail(event).then(res => {
        if (res) {
          this.newProductionOrder.orderUnit = res['baseUnit'];
          this.newProductionOrder.baseUnit = res['baseUnit'];
          this.newProductionOrder.currency = res['stockCosting']?.currencyCode || null;
          this.newProductionOrder.locationNo = res['locationNo'] || null;
          this.newProductionOrder.costCenterId = res['stockCosting']?.costCenter?.costCenterId || null;
        }
      }).then(() => {
        me._stockSvc.metarialActiveUnits(event).then(result => {
          me.unitList = result;
        });
      });
    }
  }


  closeWsPanel(data) {
    this.selectedJobOrder.workstationId = data.workStationId;
    this.selectedJobOrder.workstationName = data.workStationName;

  }

  closeBatchanel(data) {
    this.selectedJobOrder.batch = data.batchCode;
  }

  showWsPanel(order) {
    this.selectedJobOrder = order;
    this.operationId = this.selectedJobOrder.jobOrderOperations ? this.selectedJobOrder.jobOrderOperations[0].operationId : null;
    this.params.dialog.item = order;

    this.myWsModal_prop = true;
    setTimeout(() => {
      this.myWsModal.show();
    }, 1000);
    this.wsModalParams.title = 'workstations';
  }

  getOperationDataHeight(operation){
    var data = {
      height: 0,
      totalHeight: 0
    }
    if(operation.jobOrderStockProduceList.length >  operation.jobOrderStockUseList.length){
      data.height = (operation.jobOrderStockProduceList.length + 1) * 21;
      data.totalHeight =operation.jobOrderStockProduceList.length;
    } else if((operation.jobOrderStockProduceList.length !== 0) && (operation.jobOrderStockProduceList.length===operation.jobOrderStockUseList.length)){
      data.height = (operation.jobOrderStockProduceList.length + 1) * 21;
      data.totalHeight =operation.jobOrderStockProduceList.length;
    }else{
      data.height = (operation.jobOrderStockUseList.length + 1) * 21;
      data.totalHeight = operation.jobOrderStockUseList.length;
    }

    return data;
  }


  getCreateJobs() {
    // console.log('@getCreateJobs');return;
    this.loaderService.showLoader();
    this.isManual = false;
    this.newProductionOrder.quantity = this.newJobOrderFromExisting.neededQuantity;
    this.newProductionOrder.plannedQuantity = this.newJobOrderFromExisting.neededQuantity;
    this.newProductionOrder.minimumDelayQuantityBetweenOperation = this.newJobOrderFromExisting.neededQuantity;
    this.newProductionOrder.materialId = this.newJobOrderFromExisting.stockId;
    this.newProductionOrder.extraProducedQuantityPercentage = this.newJobOrderFromExisting.extraProducedQuantityPercentage;
    this.setBaseUnit(this.newJobOrderFromExisting.stockId);
    const percentageQuantity = Math.round(this.newJobOrderFromExisting.neededQuantity + this.newJobOrderFromExisting.neededQuantity * (this.newJobOrderFromExisting.extraProducedQuantityPercentage / 100));
    this._jobOrderSvc.createJobOrderWithProductTreeId(this.newJobOrderFromExisting.productTreeId,
      percentageQuantity)
      .then((result: any) => {
        this.loaderService.hideLoader();

        if (result && result.length > 0) {
          result.forEach((it, index) => {
            it.jIndex = index;
          })
        }
        this.createdJobOrders = result;
        this.createdJobOrders.forEach((jb, jbIndex) => {
          const split = jb.orderNo.toString().match(/.{1,2}/g);
          jb.orderFNo = split.join(".");
        });
        this.prodOrderMaterialList = [];
        //SET PROD ORDER MATERIAL LIST
        if (this.createdJobOrders && this.createdJobOrders.length > 0) {
          if(this.createdJobOrders.length > 1) {
            const jobOrderOne = this.createdJobOrders.find(jb => jb.orderNo == 10);
            if(jobOrderOne) {
              if(jobOrderOne.jobOrderOperations && jobOrderOne.jobOrderOperations.length > 0){
                jobOrderOne.jobOrderOperations.forEach(operation => {
                  if ( operation.parent == true && operation.jobOrderStockProduceList && operation.jobOrderStockProduceList.length > 0) {
                    operation.jobOrderStockProduceList.forEach(stockItem => {
                      this.prodOrderMaterialList.push({
                        combineProdOrderStatus: null,
                        combineProdOrderType: null,
                        combinejobOrderId: null,
                        createDate: null,
                        materialId: stockItem.stockId,
                        materialNo: stockItem.stockNo,
                        materialName: stockItem.stockName,
                        outputRate: 1,
                        prodOrderId: null,
                        prodOrderMaterialId: null,
                        producedQuantity: null,
                        quantity: stockItem.neededQuantity,
                        neededQuantity: stockItem.neededQuantity,
                        quantiyUnit: stockItem.unit,
                        updateDate: null,
                      });
                    });
                  }
                });
              }
            }
          } else {
            this.createdJobOrders.forEach(jobOrder => {
              if(jobOrder.jobOrderOperations && jobOrder.jobOrderOperations.length > 0){

                jobOrder.jobOrderOperations.forEach(operation => {
                  if (operation.parent == true && operation.jobOrderStockProduceList && operation.jobOrderStockProduceList.length > 0) {
                    operation.jobOrderStockProduceList.forEach(stockItem => {
                      this.prodOrderMaterialList.push({
                        combineProdOrderStatus: null,
                        combineProdOrderType: null,
                        combinejobOrderId: null,
                        createDate: null,
                        materialId: stockItem.stockId,
                        materialNo: stockItem.stockNo,
                        materialName: stockItem.stockName,
                        outputRate: 1,
                        prodOrderId: null,
                        prodOrderMaterialId: null,
                        producedQuantity: null,
                        quantity: stockItem.neededQuantity,
                        neededQuantity: stockItem.neededQuantity,
                        quantiyUnit: stockItem.unit,
                        updateDate: null,
                      });
                    });
                  }
                });
              }
            });
          }
          this.searchStock();
        }

        console.log('@createdJobOrders', result)
        this.poData = {
          'availableFrom': null,
          'batchCode': this.newProductionOrder.batch,
          // "batchId": null,
          'countryId': null,
          /*"createDate": null,*/
          'lastGoodsReceipt': null,
          'manufactureDate': null,
          'note': null,
          'plantId': this.newProductionOrder.plantId,
          'sledBbdDate': null,
          'stockId': this.newProductionOrder.materialId,
          'actId': null,
          'actType': null,
          'vendorBatch': null
        };
        if (this.newJobOrderFromExisting.jobOrderType === 'EXTERNAL_JOB') {
          this.newProductionOrder.prodOrderType = 'EXTERNAL_PRODUCTION_ORDER';
          this.createdJobOrders = this.createdJobOrders.map((jobOrder) => {
            jobOrder.position = 'EXTERNAL_JOB';
            return jobOrder;
          });
        }
        if (this.newJobOrderFromExisting.jobOrderType === 'STANDARD') {
          this.newProductionOrder.prodOrderType = 'STANDARD_PRODUCTION_ORDER';
        }
        // if (this.newJobOrderFromExisting.jobOrderType === 'EXTERNAL_JOB') {
        //   this.newProductionOrder.prodOrderStatus = 'READY';
        //   this.createdJobOrders = this.createdJobOrders.map((jobOrder) => {
        //     jobOrder.position = 'EXTERNAL_JOB';
        //     return jobOrder;
        //   });
        //   this.newProductionOrder.jobOrderList = this.createdJobOrders;
        //   this._productionOrderSvc.save(this.newProductionOrder).then(res => {
        //     this.loaderService.hideLoader();
        //     this.utilities.showSuccessToast('saved-success')
        //     this.reset();
        //     setTimeout(() => {
        //       this._router.navigate(['/job-order/planning']);
        //     }, 2500);
        //   }).catch(error => {
        //     this.loaderService.hideLoader();
        //     this.utilities.showErrorToast(error)
        //   });
        //   // prodOrderType
        // } else {
        this.myModal.show();
        // }
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });

  }

  searchStock() {

    this.materialList = [...this.prodOrderMaterialList.filter(itm => itm.materialId !== null)];

    // remove repeatition from this array
    this.materialList = ConvertUtil.removeDuplicatedDataInArray(this.materialList, 'materialId');

  }

  setSelectedMaterial(materialId, index) {
    const material = this.materialList.find(itm => itm.materialId === +materialId);
    if (material) {
      this.prodOrderMaterialList[index].materialId = material.materialId;
      this.prodOrderMaterialList[index].materialName = material.materialName;
      this.prodOrderMaterialList[index].materialNo = material.materialNo;
      this.prodOrderMaterialList[index].quantiyUnit = material.quantiyUnit;
      this.prodOrderMaterialList[index].quantity = material.quantity;
    }

    this.prodOrderMaterialList = [...this.prodOrderMaterialList];
  }

  onDeleteProdOrderMaterialList(materialitem, index) {
    this.prodOrderMaterialList.splice(index, 1);
    this.prodOrderMaterialList = [...this.prodOrderMaterialList];
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
    this.prodOrderMaterialList.push(materialList);
    if (this.prodOrderMaterialList && this.prodOrderMaterialList.length > 0) {
      this.newProductionOrder.materialId = this.prodOrderMaterialList[0].materialId;
      this.newProductionOrder.orderUnit = this.prodOrderMaterialList[0].quantiyUnit;
      this.newProductionOrder.baseUnit = this.prodOrderMaterialList[0].quantiyUnit;
    }


  }

  saveJobs() {
    this.loaderService.showLoader();
    this.newProductionOrder.productTreeId = this.selectedProductTreeItem.productTreeId;
    const temp = JSON.parse(JSON.stringify(this.newProductionOrder));
    delete temp.material;
    delete temp.wareHouse;
    delete temp.wareHouseName;
    delete temp.plant;
    if (this.prodOrderMaterialList && this.prodOrderMaterialList.length > 0) {
      this.prodOrderMaterialList.forEach(item => {
        delete item['newlyAdded'];
      })
      temp.prodOrderMaterialList = [...this.prodOrderMaterialList];
    }

    if(temp.jobOrderList && temp.jobOrderList.length > 0){
      temp.jobOrderList.forEach(element => {
        delete element.jobOrderEquipmentList;
        delete element.expectedSetupDuration;
        delete element.maxSingleStandbyDuration;
        delete element.singleDuration;
        delete element.singleSetupDuration;
        delete element.singleStandbyDuration;
        delete element.totalDuration;
        delete element.operationRepeat;
        delete element.orderDetailId;
        delete element.orderNo;
        delete element.processControlFrequency;
      });
    }

    this.batchService.getNewBarCode('PRODUCTION_ORDER').then((newbarcode) => {
        temp.barcode = newbarcode;
        this._productionOrderSvc.save(temp).then((result: any) => {
          this.loaderService.hideLoader();
          this.utilities.showSuccessToast('saved-success')
          this.saveImages(result);
        }).catch(error => {
          this.loaderService.hideLoader();
          this.utilities.showErrorToast(error)
        });
    });

    // this._productionOrderSvc.save(temp).then((result: any) => {
    //   this.loaderService.hideLoader();
    //   this.utilities.showSuccessToast('saved-success')
    //   // this.reset();
    //   this.saveImages(result);
    //   // setTimeout(() => {
    //   //   this._router.navigate(['/manufacturing-planning/basic/management/job-order-planning']);
    //   // }, 2500);
    // }).catch(error => {
    //   this.loaderService.hideLoader();
    //   this.utilities.showErrorToast(error)
    // });
  }
  private saveImages(stockId) {
    this.imageAdderComponent.updateMedia(stockId, TableTypeEnum.PRODUCTION_ORDER).then(() => {
      // this.utilities.showSuccessToast('saved-success');
      setTimeout(() => {
        this._router.navigate(['/manufacturing-planning/basic/management/job-order-planning']);
      }, 2500);
    }
    ).catch(error => this.utilities.showErrorToast(error));
  }

  reset() {
    this.manualOrderExtra = {
      stockName: '',
      stockProducedName: '',
      operationName: '',
      nextOperationName: '',
      equipmentName: '',
      description: '',
    };

  }

  onChangeCostCenter(event) {
    this.newProductionOrder.costCenterId=event?.costCenterId
  }

  showOperationDetail(operationId){
    this.loaderService.showDetailDialog(DialogTypeEnum.OPERATION, operationId);
  }


  showMaterialDetail(materialId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.STOCK, materialId);
  }


  setSelectedBatch(batch) {
    if (batch) {
      this.newProductionOrder.batch = batch.batchCode;
      this.poData.batchCode = this.newProductionOrder.batch;
    } else {
      this.newProductionOrder.batch = null;
    }
  }


  myChanges(event) {
    this.pagination.currentPage = event.currentPage;
    this.pagination.pageNumber = event.pageNumber;
    this.pagination.totalElements = event.totalElements;
    this.pagination.pageSize = event.pageSize;
    this.pagination.TotalPageLinkButtons = event.totalPageLinkButtons;
    if (this.pagination.tag !== event.searchItem) {
      this.pagination.pageNumber = 1;
    }
    this.pagination.tag = event.searchItem;
    this.pageFilter.pageNumber = this.pagination.pageNumber;
    this.pageFilter.pageSize = this.pagination.pageSize;
    this.pageFilter.query = this.pagination.tag;
    setTimeout(() => {
      this.filter()
    }, 500);
  }

  showPlantDetailDialog(plantId: any) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PLANT, plantId);
  }

  showMaterialDetailDialog(stockId: any) {
    this.loaderService.showDetailDialog(DialogTypeEnum.STOCK, stockId);
  }

  showCustomerDetailDialog(customerId: any) {
    this.loaderService.showDetailDialog(DialogTypeEnum.CUSTOMER, customerId);
  }

  showWorkstationDetail(workstationId: any) {
    this.loaderService.showDetailDialog(DialogTypeEnum.WORKSTATION, workstationId);
  }

  showProductTreeDetail(productTreeId: any) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PRODUCTTREE, productTreeId);
  }



  addAndIncrementReferenceId() {
      this.addUniqueCode();
  }

  clearReferenceId() {
    if (this.newProductionOrder.referenceId) {
      this.newProductionOrder.referenceId = null;
    }
  }


  addUniqueCode() {
    this.loaderService.showLoader();
    this._saleSvc.getUniqueCode(this.newProductionOrder.plantId, CommonCodeGeneration.PRODUCTION_ORDER).then((result: any) => {
      this.loaderService.hideLoader();
      this.newProductionOrder.referenceId = result;
    }).catch(error => {
      this.loaderService.hideLoader();
      console.log(error);
    });
  }
}
