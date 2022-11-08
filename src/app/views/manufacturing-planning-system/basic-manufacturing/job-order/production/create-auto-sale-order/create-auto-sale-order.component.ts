import {AfterViewInit, Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {JobOrderService} from 'app/services/dto-services/job-order/job-order.service';
import {LoaderService} from 'app/services/shared/loader.service';
import {UtilitiesService} from 'app/services/utilities.service';
import {StockCardService} from 'app/services/dto-services/stock/stock.service';
import {EnumService} from 'app/services/dto-services/enum/enum.service';
import {ProductionOrderService} from 'app/services/dto-services/production-order/production-order.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {EnumJobOrderStatusService} from 'app/services/dto-services/enum/job-order-status.service';
 
import { ProductTreeService } from 'app/services/dto-services/product-tree/prod-tree.service';
import { AppStateService } from 'app/services/dto-services/app-state.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { Subject, Subscription } from 'rxjs';
import { SalesOrderService } from 'app/services/dto-services/sales-order/sales-order.service';
import { ConvertUtil } from 'app/util/convert-util';
import { TableTypeEnum } from 'app/dto/table-type-enum';
import { ImageAdderComponent } from 'app/views/image/image-adder/image-adder.component';
import { BatchService } from 'app/services/dto-services/batch/batch.service';
import { debounceTime, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-create-auto-sale-order',
  templateUrl: './create-auto-sale-order.component.html',
  styleUrls: ['./create-auto-sale-order.component.scss']
})

export class CreateAutoSaleOrderComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(ImageAdderComponent) imageAdderComponent: ImageAdderComponent;
  minDateValue = new Date();
  //////////////////////////////
  /*server side rendering*/
  warehouseLocationModal = {active : false};
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
    plantId: null,
    // orderByDirection: 'desc',
    orderStatus: null,
    deliveryDate: null
  };
  /////////////////////////////
  orderFilterForm: FormGroup;

  orderStartDate;

  orderEndDate;

  orderStatus;

  deliverDate;

  filterCon = {
    deliveryDate: null,
    endDate: null,
    startDate: null,
    orderStatus: null,
    pageNumber: 0,
    pageSize: 0
  };


  brands: string[] = ['ACTIVE', 'PLANNED'];

  jobOrderStatusList;

  filteredBrands: any[];

  brand: string;

  selectedProductTreeItem;

  jobOrderTypes: any;
  /////////////////////////////
  modal: any;
  newProductionOrder = {
    orderId: null,
    orderDetailId: null,
    costCenterId: null,
    barcode: null,
    projectId: null,
    milestoneId: null,
    batch: null,
    actualCost: null,
    receiptNo: null,
    orderUnit: null,
    minimumDelayQuantityBetweenOperation: null,
    baseUnit: null,
    quantity: null,
    grQuantity: null,
    locationNo: null,
    currency: null,
    estimatedCost: null,
    finalCost: null,
    plannedQuantity: null,
    description: null,
    referenceId: null,
    createDate: null,
    startDate: new Date(),
    finishDate: null,
    actualStart: null,
    actualFinish: null,
    extraProducedQuantityPercentage: 0,
    plantId: null,
    plantName: null,
    materialId: null,
    wareHouseId: null,
    wareHouseName: null,
    wareHouse: null,
    expectedQuantity: null,
    plant: null,
    prodOrderType: 'STANDARD_PRODUCTION_ORDER',
    prodOrderStatus: null,
    jobOrderList: null,
    batchExist: false,
    priority:null,
    productTreeId: null,
    prodOrderMaterialList: null
  }

  autoCreatedJobOrders;

  selectedCreateJobOrders;

  manualOrderExtra = {
    stockName: null,
    stockProducedName: null,
    operationName: null,
    nextOperationName: null,
    equipmentName: null,
    description: null,
  };

  createdJobOrders: Array<any> = [];

  newJobOrderFromExisting = {
    orderId: null,
    orderDetailId: null,
    stockId: null,
    orderQuantity: null,
    existingInStock: null,
    extraProducedQuantityPercentage: 0,
    reserved: null,
    neededQuantity: null,
    jobOrderType: 'STANDARD'
  };

  prodOrderTypeList: any;

  unitList;

  productTreees = [];

  params = {dialog: {title: '', item: ''}};

  wsModalParams = {title: ''};

  createdJobOrdersRowCount = 10;

  isManual: boolean;

  selectedJobOrder;

  poData: {
  'availableFrom': any; 'batchCode': any;
    // "batchId": null,
    'countryId': any;
    /*"createDate": null,*/
    'lastGoodsReceipt': any; 'manufactureDate': any; 'note': any; 'plantId': any; 'sledBbdDate': string; 'stockId': any; 'actId': any; 'actType': any; 'vendorBatch': any;
  };

  actId: any;

  sub: Subscription;

  isLoading = false;

  operationId: any;

  commonPriorities = [];

  prodOrderMaterialList = [];
  
  combineActivityTypes = ['ACTIVITY_COMBINING', 'COMPONENT_COMBINING', 'ORDER_COMBINING'];
  
  materialList = [];

  private searchSaleOrderTerms = new Subject<any>();

  constructor(private _jobOrderStatusSvc: EnumJobOrderStatusService,
              private fb: FormBuilder,
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private _stockSvc: StockCardService,
              private _jobOrderSvc: JobOrderService,
              private _productTreeSvc: ProductTreeService,
              private _orderSvc: SalesOrderService,
              private _enumSvc: EnumService,
              private appStateService: AppStateService,
              private batchService: BatchService,
              private _productionOrderSvc: ProductionOrderService,
              private _router: Router) {
  }

  ngOnInit() {
    this.initializeForm();
    this._enumSvc.getCommonPriorityEnum().then((result: any) => this.commonPriorities = result).catch(error => console.log(error));
    this.jobOrderStatusTypes();
    this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
      if (!(res)) {
        this.pageFilter.plantId = null;
      } else {
        this.pageFilter.plantId = res.plantId;
      }
      // this.filter();
    });

    this.searchSaleOrderTerms.pipe(
      debounceTime(500),
      switchMap(term => this._orderSvc.filterOrderRemainingDetails(term))).subscribe(res => {
        this.autoCreatedJobOrders = res['content'];
      
        //if (this.autoCreatedJobOrders) {
        // this.autoCreatedJobOrders = this.autoCreatedJobOrders.filter(itm => itm.orderStatus === 'CONFIRMED');
        //}
        this.pagination.currentPage = res['currentPage'];
        this.pagination.totalElements = res['totalElements'];
        this.pagination.totalPages = res['totalPages'];
        this.loaderService.hideLoader();
      }, error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }

  prioritySelection(event){
    if(event){
      this.newProductionOrder.priority = event.target.value;
    }else{
      this.newProductionOrder.priority = null;
    }
  }

  jobOrderStatusTypes(){
    this._jobOrderStatusSvc.getJobOrderPositionList().then((orderTypes:any)=> {
      this.jobOrderTypes = orderTypes.filter((jobOrderType)=> {
        return (jobOrderType === 'STANDARD' || jobOrderType === 'EXTERNAL_JOB')
      });
      console.log('tupesss', this.jobOrderTypes)
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  ngAfterViewInit() {
    this.initialize();
    this.filter();
  }

  initializeForm() {
    this.orderStartDate = null; // new Date();
    this.orderEndDate = null; // new Date();
    this.orderStatus = null;
    this.deliverDate = null;
    this.orderFilterForm = this.fb.group({
      orderStartDate: this.orderStartDate,
      orderEndDate: this.orderEndDate,
      deliverDate: this.deliverDate,
      orderStatus: this.orderStatus,
    })
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
  selectProductTreeItem(item) {
    this.selectedProductTreeItem = item;
    console.log(this.selectedProductTreeItem);
  }

  filterBrands(event) {
    this.filteredBrands = [];
    for (let i = 0; i < this.brands.length; i++) {
      const brand = this.brands[i];
      if (brand.toLowerCase().indexOf(event.query.toLowerCase()) === 0) {
        this.filteredBrands.push(brand);
      }
    }
  }

  filter() {
    this.loaderService.showLoader();
    this.pageFilter.startDate = this.orderFilterForm.value.orderStartDate;
    this.pageFilter.endDate = this.orderFilterForm.value.orderEndDate;
    this.pageFilter.orderStatus = this.orderFilterForm.value.orderStatus || null;
    this.pageFilter.deliveryDate = this.orderFilterForm.value.deliverDate;
    const temp = Object.assign({}, this.pageFilter);
    temp.startDate = ConvertUtil.localDateShiftAsUTC(this.pageFilter.startDate);
    temp.endDate = ConvertUtil.date2EndOfDay(this.pageFilter.endDate);
    temp.endDate = ConvertUtil.localDateShiftAsUTC(temp.endDate);
    temp.deliveryDate = ConvertUtil.localDateShiftAsUTC(this.pageFilter.deliveryDate);
    this.searchSaleOrderTerms.next(temp);
  }


  private initialize() {

    this._enumSvc.getProductionOrderTypeList().then(result => {
      if(result){
        this.prodOrderTypeList = result.filter(item => item !== 'COMBINED_PRODUCTION_ORDER' 
        && item !== 'DIVIDED_PRODUCTION_ORDER' && item !== 'AUTO_PRODUCTION_ORDER' && item !== 'REORDER_PLAN_PRODUCTION_ORDER')
      }
    }).catch(error => console.log(error));


    this._jobOrderStatusSvc.getJobOrderEnumList().then(result => this.jobOrderStatusList = result).catch(error => console.log(error));
    console.log('@ActivePlanned', this.jobOrderStatusList); // replaced with constant statuses//left
  }

  assignOrder(item) {
    if(item.data.orderId){
      this._orderSvc.getOrderDetailListByOrderId(item.data.orderId).then((res:any)=>{

        if(res.length > 0){
          //maximum delivery date after minus 2 days can be today's date
          if(res[0].deliveryDate){
            // let currentDate = new Date();
            let deliveryDate = new Date(res[0].deliveryDate);
            let maxDate = deliveryDate.setDate(deliveryDate.getDate() - 2);
            // if(new Date(maxDate) > currentDate){
              this.newProductionOrder.finishDate = new Date(maxDate);
            //}else{
              //this.newProductionOrder.finishDate = currentDate;
            //}
          }
        }
      })
    }
    this.newProductionOrder.orderId = item.data.orderId;
    this.newProductionOrder.orderDetailId = item.data.orderDetailId;
    this.newProductionOrder.materialId = item.data.stockId;
    //////////////////////////////////////////////////
    this.newProductionOrder.plantId = item.data.plantId;
    this.newProductionOrder.plantName = item.data.plantName;
    this.newProductionOrder.batch = item.data.batch;
    this.newProductionOrder.batchExist = (item.data.batch);
    this.newProductionOrder.quantity = item.data.quantity;

    this.newProductionOrder.wareHouseId = item.data.warehouseId;
    this.newProductionOrder.wareHouseName = item.data.warehouseName;
    if (item.data.warehouseId) {
      this.newProductionOrder.wareHouse = {wareHouseName: item.data.warehouseName, wareHouseId: item.data.warehouseId};
    }
    if (item.data.plantId) {
      this.newProductionOrder.plant = {plantName: item.data.plantName, plantId: item.data.plantId};
    }
    //////////////////////////////////////////////////

    this.newJobOrderFromExisting.orderDetailId = item.data.orderDetailId;
    this.newJobOrderFromExisting.orderId = item.data.orderId;
    this.newJobOrderFromExisting.stockId = item.data.stockId;
    this.newJobOrderFromExisting.orderQuantity = item.data.quantity;
    this.newJobOrderFromExisting.existingInStock = item.data.unrestricted || 0;
    this.newJobOrderFromExisting.neededQuantity = item.data.quantity;

  }

  setBaseUnit(event) {
    this.unitList = null;
    const me = this;
    if (event) {

      this._stockSvc.getDetail(event).then(res => {
        if (res) {
          this.newProductionOrder.orderUnit =  res['baseUnit'];
          this.newProductionOrder.baseUnit =  res['baseUnit'];
          this.newProductionOrder.locationNo = res['locationNo'] || null;
          this.newProductionOrder.currency = res['stockCosting']?.currencyCode || null;
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
    this.params.dialog.item = order;
    this.operationId = this.selectedJobOrder.jobOrderOperations ? this.selectedJobOrder.jobOrderOperations[0].operationId : null;
  }


  getCreateJobs(myModal) {
    if (!this.selectedProductTreeItem) {
      this.utilities.showErrorToast('please select product Tree Item');
      return 0;
    }
    if (Number(this.newJobOrderFromExisting.neededQuantity) > this.newJobOrderFromExisting.orderQuantity) {
      this.utilities.showWarningToast('needed quantity is greater than order quantity');
      return 0;
    }
    this.loaderService.showLoader();
    this.isManual = false;

    this.newProductionOrder.quantity = this.newJobOrderFromExisting.neededQuantity;
    this.newProductionOrder.minimumDelayQuantityBetweenOperation = this.newJobOrderFromExisting.neededQuantity;
    this.newProductionOrder.materialId = this.newJobOrderFromExisting.stockId;
    this.setBaseUnit(this.newJobOrderFromExisting.stockId);
    let percentageQuantity = 0;
    if (this.newProductionOrder.extraProducedQuantityPercentage > 0) {
      percentageQuantity =  Math.round(this.newJobOrderFromExisting.orderQuantity + Number(this.newJobOrderFromExisting.neededQuantity) * (this.newJobOrderFromExisting.extraProducedQuantityPercentage / 100));
    } else {
      percentageQuantity =  Math.round(Number(this.newJobOrderFromExisting.neededQuantity) + Number(this.newJobOrderFromExisting.neededQuantity) * (this.newJobOrderFromExisting.extraProducedQuantityPercentage / 100));
    }

    // this.newProductionOrder.expectedQuantity = percentageQuantity;
    this._jobOrderSvc.createJobOrderAndProductTreeId(this.newJobOrderFromExisting.orderDetailId,
      this.selectedProductTreeItem.productTreeId
      , percentageQuantity)
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
        this.createdJobOrdersRowCount = this.createdJobOrders.length;
        this.prodOrderMaterialList = [];
        // console.log('createdJobOrders', this.createdJobOrders);

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

        myModal.show();

        // if(this.newJobOrderFromExisting.jobOrderType === 'EXTERNAL_JOB'){
        //   this.newProductionOrder.prodOrderStatus = 'READY';
        //   this.createdJobOrders = this.createdJobOrders.map((jobOrder) => {
        //     jobOrder.position = 'EXTERNAL_JOB';
        //     return jobOrder;
        //   });
        //   this.newProductionOrder.jobOrderList = this.createdJobOrders;
        //   this._productionOrderSvc.save(this.newProductionOrder).then(result => {
        //     this.loaderService.hideLoader();
        //     this.utilities.showSuccessToast('saved-success')
        //     this.reset();
        //     setTimeout(() => {
        //       this._router.navigate(['/job-order/planning']);
        //     }, 2500);
        //   }).catch(error => {
        //       this.loaderService.hideLoader();
        //       this.utilities.showErrorToast(error)
        //     });
        //   // prodOrderType
        // }else{
        //   myModal.show();
        // }

        // this.poData = {
        //   'availableFrom': null,
        //   'batchCode': this.newProductionOrder.batch,
        //   // "batchId": null,
        //   'countryId': null,
        //   /*"createDate": null,*/
        //   'lastGoodsReceipt': null,
        //   'manufactureDate': null,
        //   'note': null,
        //   'plantId': this.newProductionOrder.plantId,
        //   'sledBbdDate': null,
        //   'stockId': this.newProductionOrder.materialId,
        //   'actId': null,
        //   'actType' : null,
        //   'vendorBatch': null
        // };
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });

    this._orderSvc.getDetail(this.newProductionOrder.orderId).then((res: any) => {
      this.actId = res.actId;
      if(res.orderDetailDtoList){
        this.newProductionOrder.priority = res.orderDetailDtoList[0].priority;
      }
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
    delete temp.plant;
    delete temp.wareHouse;
    delete temp.wareHouseName;
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


  quantityChange(event) {
    this.newProductionOrder.quantity = this.newJobOrderFromExisting.neededQuantity;
  }

  extraProducedQuantityPercentageChange(event) {
    if (+event) {
      this.newProductionOrder.extraProducedQuantityPercentage = this.newJobOrderFromExisting.extraProducedQuantityPercentage;
    }
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
  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = null;
    }
    this.pageFilter[field] = value;
    this.loaderService.showLoader();
    this.searchSaleOrderTerms.next(this.pageFilter);
  }

  selectProdItem(item) {
    // console.log(item);
    this.isLoading = true;
    this.newProductionOrder.referenceId = item.referenceId;
    this._productTreeSvc.filter({ pageNumber: 1, status: 'ACTIVE', pageSize: 1000, plantId: item.plantId, materialId: item.stockId})
    // this._productTreeSvc.filter({ pageNumber: 1, pageSize: 1000, materialId: item.stockId})
    .then(result => {
      this.productTreees = result['content'];
      this.isLoading = false;
    })
    .catch(error => {
      this.isLoading = false;
      this.utilities.showErrorToast(error);
    });
  }

  showPlantDetail(plantId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PLANT, plantId);
  }

  showMaterialDetail(materialId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.STOCK, materialId);
  }

  showSalesOrderDetail(salesOrderId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.ORDER, salesOrderId);
  }
  showSalesOrderItemDetail(salesOrderId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.ORDERITEM, salesOrderId);
  }

  showWarehouseDetail(warehouseId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.WAREHOUSE, warehouseId);
  }

  showProductTreeDetail(productTreeId){
    this.loaderService.showDetailDialog(DialogTypeEnum.PRODUCTTREE, productTreeId);
  }

  showWorkStationDetail(workStationId){
    this.loaderService.showDetailDialog(DialogTypeEnum.WORKSTATION, workStationId);
  }

  showOperationDetail(operationId){
    this.loaderService.showDetailDialog(DialogTypeEnum.OPERATION, operationId);
  }
}
