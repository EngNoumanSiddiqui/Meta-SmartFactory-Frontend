import { UsersService } from 'app/services/users/users.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActService } from 'app/services/dto-services/act/act.service';
import { PurchaseOrderDetailDto, PurchaseOrderItemCosting, purchaseOrderRequestModel } from 'app/dto/sale-order/sale-order.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { SalesOrderService } from 'app/services/dto-services/sales-order/sales-order.service';
import { StockCardService } from 'app/services/dto-services/stock/stock.service';
import { PlantService } from 'app/services/dto-services/plant/plant.service';
import { WarehouseService } from 'app/services/dto-services/warehouse/warehouse.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { PorderService } from 'app/services/dto-services/porder/porder.service';
import { environment } from 'environments/environment';

import { AppStateService } from 'app/services/dto-services/app-state.service';
import { ActTypeService } from 'app/services/dto-services/act-type/act-type.service';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { CommonCodeGeneration } from 'app/dto/common-code-generation.enum';

@Component({
  selector: 'porder-combine',
  templateUrl: './combine.component.html',
  styleUrls: ['./combine.component.scss'],
  providers: [ActService]
})
export class CombinePorderComponent implements OnInit {

  wareHouse;
  order: purchaseOrderRequestModel = new purchaseOrderRequestModel();
  @Output() saveAction = new EventEmitter<any>();
  @Input() notificationId: any;
  listActTypes: any;
  commonPriorities: any;
  isLoading: boolean = false;
  @Input('pOrderItems') set prdset (pOrItems) {
    if (pOrItems) {
      const pOrderItems = JSON.parse(JSON.stringify(pOrItems));
      this.order.purchaseOrderType = 'COMBINED_PURCHASE_ORDER';
      this.order.purchaseOrderStatus = 'REQUESTED';
      this.order.porderDate = new Date();
      this.order.referenceId = null;
      this.order.costCenterId = pOrderItems.find(itm => itm.costCenter != null)?.costCenter?.costCenterId || null;
      this.order.purchaseOrderDetailList = [];
      this.combineOrders(pOrderItems);
    }
  };

  newRequestOrderDetailCreateDto: PurchaseOrderDetailDto = new PurchaseOrderDetailDto();
  selectedStock: any;
  selectedSupplier: any;
  purchaseDetailListDto = {
    baseUnit: null,
    batch: null,
    plantId: null,
    purchaseOrderStatus: null,
    referenceId: null,
    fixedPrice: null,
    orderUnit: null,
    quantity: null,
    height: 0,
    description: null,
    width: 0,
    purchaseOrderItemCosting: new PurchaseOrderItemCosting(),
    dimensionUnit: null,
    stockId: null,
    stockNo: null,
    stockName2: null,
    totalIncomeQuantity: 0,
    wareHouseId: null,
    plantName: null,
    stockName: null,
    deliveryDate: null,
    deliveryStartDate: null,
    warehouseName: null,
    priority: 'MEDIUM'
  }
  params = {
    dialog: { title: '', inputValue: '', visible: false }
  };

  actList;
  lastOrderNos;
  filterStock = { pageNumber: 1, pageSize: 500, stockName: '' };
  stockSearchProgress = false;

  private searchTerms = new Subject<any>();
  salesOrderTypes;
  purchaseStatusType;
  unitList = [];
  plantList: any;
  warehouseList;
  modal = { active: false };
  AllowToSelectBatch = false;
  orderUnitDisable = false;

  selectedDetailIndex = -1;
  preSelectedPlant: any;
  selectedPlant: any;
  countryName: any;
  selectedCurrency: any;
  includeMaterialList = [1, 2, 3, 4, 5, 6, 7, 8, 10];

  constructor(private _actSvc: ActService,
    private _router: Router,
    private _saleSvc: SalesOrderService,
    private _purchaseSvc: PorderService,
    private _stockSvc: StockCardService,
    private _plantSvc: PlantService,
    private _wareHouseSvc: WarehouseService,
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _confirmationSvc: ConfirmationService,
    private _appStateSvc: AppStateService,
    private useSvc: UsersService,
    private _actTypes: ActTypeService,
    private _enumSvc: EnumService,
    private _translateSvc: TranslateService) {
      // this._appStateSvc.plantAnnounced$.subscribe(res => {
      //   console.log("@user selected plant", res);
      //   this.plantList=res;
      // });
      this.selectedPlant = JSON.parse(this.useSvc.getPlant());

  }

  ngOnInit() {
    // this.checkIfPlantAlreadySelected();
    this._saleSvc.getLastOrderNos().then(result => this.lastOrderNos = result).catch(error => console.log(error));

    this._actTypes.getbyPlantId_AccountPosition(this.selectedPlant?.plantId, 'SUPPLIER')
    .then((result: any) => this.listActTypes = result).catch(error => console.log(error));
    // order-type
    this._saleSvc.getPurchaseOrderTypes()
      .then(result => this.salesOrderTypes = result)
      .catch(error => console.log(error));
    // status
    this._saleSvc.getPurchaseOrderStatus()
      .then(result => {
        this.purchaseStatusType = result.filter((item) => {
          return (item == 'REQUESTED' || item=='CANCELED' || item == 'WAITING' || item == 'CONFIRMED' || item=='SENT');
        });
      })
      .catch(error => console.log(error));

      this._enumSvc.getCommonPriorityEnum().then((result: any) => this.commonPriorities = result).catch(error => console.log(error));

    // this._plantSvc.getAllPlants().then(result => {
    //   this.plantList = result;
    //   console.log(result);
    // }).catch(error => console.log(error));


    this._wareHouseSvc.getIdNameList().then(result => this.warehouseList = result).catch(error => console.log(error));

    this.filterActListByOrderType(null);
    // this._actSvc.getActSupplier().then(result => this.actList = result).catch(error => console.log(error));

    this.getStockItems();
  }

  checkIfPlantAlreadySelected(){
    this.preSelectedPlant=this.useSvc.getPlant();
    if((this.preSelectedPlant)){
      this.setSelectedPlant(JSON.parse(this.preSelectedPlant));
    }
  }

  setSelectedCustomer(customer) {
    if (customer) {
      this.order.supplier = customer.actId;
      this.selectedSupplier = customer;
    } else {
      this.order.supplier = null;
    }
  }

  setSelectedPlant(event) {
    // this.workStation.wareHouse = null;
    this.wareHouse = null;
    if (event) {
      // this.selectedPlant = event;
      // this.order.plantId = event.plantId;
      this.purchaseDetailListDto.plantId = event.plantId;
      this.purchaseDetailListDto.plantName = event.plantName;
    } else {
      this.purchaseDetailListDto.plantId = null;
      this.purchaseDetailListDto.plantName = null;
    }
  }
  setSelectedWarehouse(event) {
    // this.workStation.wareHouse = event;
    this.wareHouse = event;
    if (event && event.hasOwnProperty('wareHouseId')) {
      this.purchaseDetailListDto.wareHouseId = event.wareHouseId;
      this.purchaseDetailListDto.warehouseName = event.wareHouseName;
      // this.stockList = event.wareHouseStockDtoList;
    } else {
      // this.workStation.warehouseId = null;
      this.purchaseDetailListDto.wareHouseId = null;
      this.purchaseDetailListDto.warehouseName = null;
    }
  }
  goPage() {
    this._router.navigate(['/orders/sales']);
  }
  save() {
    if(this.checkMissingDeliveryDateForOutsourceOrder()){
      this._confirmationSvc.confirm({
        message: this._translateSvc.instant('some-delivery-dates-are-missing-for-outsource-orders-do-you-want-to-set-them-for-one-week'),
        header: this._translateSvc.instant('confirmation'),
        icon: 'fa fa-edit',
        accept: () => {
          for (let index = 0; index < this.order.purchaseOrderDetailList.length; index++) {
            const porderItem = this.order.purchaseOrderDetailList[index];
            if(!porderItem.deliveryStartDate) {
              porderItem.deliveryStartDate = new Date();
              let today = new Date();
              today.setDate(today.getDate() + 7);
              porderItem.deliveryDate = today;
            }
          }
          
          this.actualSavePOrders();
        },
        reject: () => {
          // this.utilities.showInfoToast('cancelled-operation');
        }
  
      });

    } else {

      this.actualSavePOrders();
    }
    
  }

  actualSavePOrders() {
    this.loaderService.showLoader();
    this.isLoading = true;
    this._purchaseSvc.save(this.order)
      .then(() => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          // this.reset();
          this.isLoading = false;
          this.saveAction.emit('close');
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
        this.isLoading = false;
      });
  }


  checkMissingDeliveryDateForOutsourceOrder() {
    for (let index = 0; index < this.order.purchaseOrderDetailList.length; index++) {
      const porderItem = this.order.purchaseOrderDetailList[index];
      if(!porderItem.deliveryStartDate && porderItem.outsource && porderItem.purchaseOrderStatus!="REQUESTED") {
        // this.utilities.showWarningToast('please-enter-delivery-start-date');
        return true;
      }
    }

    return false;
  }

  prioritySelection(event) {
    if (event) {
      this.purchaseDetailListDto.priority = event.target.value;
    } else {
      this.purchaseDetailListDto.priority = null;
    }
  }

  orderTypeChanged(event) {
    if(event) {
      this.actList = [];
      this.filterActListByOrderType(+event);
    } else {
      this.filterActListByOrderType(null);
    }
  }

  combineOrders = async (pOrderItems) => {
    for (let index = 0; index < pOrderItems.length; index++) {
      const orditm = pOrderItems[index];
      if (orditm.supplierId && !this.order.supplier) {
        this.order.supplier = orditm.supplierId;
        this.order.supplierName = orditm.supplierName;
        this.selectedSupplier = {actId: orditm.supplierId, actName: orditm.supplierName}
        delete orditm.supplierId;
      }
      await this._purchaseSvc.getDetailItem(orditm.purchaseOrderDetailId).then(res => {
        this.extracted(res, index);
      }).catch(err => {
        this.utilities.showErrorToast(err);
        setTimeout(() => {
          // this.reset();
          this.saveAction.emit('close');
        }, environment.DELAY);
      });


    }
  }


  private async extracted(orditm, index: number) {

    const newitem = {
      baseUnit: orditm.baseUnit,
      batch: orditm.batch,
      plantId: orditm.plantId,
      parentPurchaseOrderId: orditm.purchaseOrderDetailId,
      purchaseOrderDetailId: orditm.purchaseOrderDetailId,
      purchaseOrderStatus: orditm.purchaseOrderStatus,
      quantity: orditm.quantity,
      stockId: orditm.stockId,
      fixedPrice: orditm.fixedPrice,
      height: orditm.height,
      width: orditm.width,
      outsource: orditm.outsource,
      dimensionUnit: orditm.dimensionUnit,
      stockNo: orditm.stockNo,
      totalIncomeQuantity: orditm.totalIncomeQuantity,
      wareHouseId: orditm.wareHouseId,
      plantName: orditm.plantName,
      stockName: orditm.stockName,
      stockName2: orditm.stockName2,
      description: orditm.description,
      referenceId: orditm.referenceId,
      warehouseName: orditm.wareHouseName,
      orderUnit: orditm.orderUnit || orditm.baseUnit,
      purchaseOrderItemCosting: orditm.purchaseOrderItemCosting || new PurchaseOrderItemCosting(),
      deliveryDate: orditm.deliveryDate,
      deliveryStartDate: orditm.deliveryStartDate,
      priority: orditm.priority,
    };
    newitem.purchaseOrderItemCosting.purchaseOrderDetailId = orditm.purchaseOrderDetailId;
    // if (index === 0) {
    //   // newitem.referenceId = await this.getUniqeCode();

    // } else {
    //   // newitem.referenceId = await this.getCalculatedUniqeCode(this.order.purchaseOrderDetailList[index - 1].referenceId);
    // }
    this.order.purchaseOrderDetailList.push(newitem);
  }

  filterActListByOrderType(event) {
    this.loaderService.showLoader()
    this._actSvc.filter({
      "pageNumber": 1,
      "pageSize": 9999,
      "actStatus": "ACTIVE",
      "actTypeId": event,
      "plantId": this.selectedPlant?.plantId,
      "accountPosition": "SUPPLIER",
      "orderByDirection": "desc",
    }).then(res => {
      this.actList = res['content'];
      this.loaderService.hideLoader();
    }).catch(err => this.loaderService.hideLoader());
  }

  getStockItems() {
    this.stockSearchProgress = true;
    this.searchTerms.next(this.filterStock);
  }

  reset() {
    this.order = new purchaseOrderRequestModel();
  }

  showDetailDialog(rowData, modal){
    if(modal === 'plant'){
      this.loaderService.showDetailDialog(DialogTypeEnum.PLANT, rowData.plantId)
    }else if(modal === 'stock'){
      this.loaderService.showDetailDialog(DialogTypeEnum.STOCK, rowData.stockId)
    }else if(modal === 'batch'){
      this.loaderService.showDetailDialog(DialogTypeEnum.BATCH, rowData.batch)
    }else if(modal === 'wareHouse'){
      this.loaderService.showDetailDialog(DialogTypeEnum.WAREHOUSE, rowData.wareHouseId)
    }
  }


  setCustomer(customer) {
    this.actList.push(customer)
    this.order.supplier = customer.actId;
  }

  setSelectedBatch(batch) {
    if (batch) {
      this.purchaseDetailListDto.batch = batch.batchCode;
    } else {
      this.purchaseDetailListDto.batch = null;
    }
  }


  openSaleOrderDetailsModal(index) {
    console.log('@fixIt', index);

    this.params.dialog.title = 'Sale Order Details';
    this.params.dialog.visible = true;
    // this.myModal.show();
    // this.getStockItems();
    this.selectedDetailIndex = index;
    if (this.selectedDetailIndex < 0) {
      // new
      this.resetNewItemDetails();
      this.addAndIncrementReferenceId();
      this.selectedStock = null;
      this.purchaseDetailListDto.plantId = this.selectedPlant ? this.selectedPlant.plantId : null;
      this.purchaseDetailListDto.plantName = this.selectedPlant ? this.selectedPlant.plantName : null;
    } else {
      // edit
      // this.newRequestOrderDetailCreateDto = Object.assign({}, this.order.purchaseOrderDetailList[index]);
      this.purchaseDetailListDto = Object.assign({}, this.order.purchaseOrderDetailList[index]);

      this.purchaseDetailListDto.deliveryDate = this.purchaseDetailListDto.deliveryDate ? new Date(this.purchaseDetailListDto.deliveryDate) : null;
      // this.selectedStock = this.stockList.find(item => item.stockId === this.purchaseDetailListDto.stockId);

      if(!(this.unitList.length > 0) || (this.unitList.filter(item => item.stockId ===this.purchaseDetailListDto.stockId).length === 0)) {
        this._stockSvc.metarialActiveUnits(this.purchaseDetailListDto.stockId).then((result: any) => {
          this.unitList = result;
        }).catch(error => console.log(error));
      }

    }
  }



  addAndIncrementReferenceId() {
    if(this.order.purchaseOrderDetailList && this.order.purchaseOrderDetailList.length) {
      let lastIndex = this.order.purchaseOrderDetailList.length;
      while (lastIndex-- && !this.order.purchaseOrderDetailList[lastIndex].referenceId);
      const prevReferenceId = <any> (this.order.purchaseOrderDetailList[(lastIndex === -1)? 0 : lastIndex].referenceId || '') + '';
      if(prevReferenceId && prevReferenceId.length > 0) {
        const splittedReferenceId = prevReferenceId.split('');
        if(parseInt(splittedReferenceId[splittedReferenceId.length - 1]) < 9) {
          this.purchaseDetailListDto.referenceId = <any> prevReferenceId.substring(0, splittedReferenceId.length - 1) + (parseInt(splittedReferenceId[splittedReferenceId.length - 1]) + 1);
        } else {
          for (let index=splittedReferenceId.length-1; index >=0 ; index--) {
            const element = splittedReferenceId[index];
            if(parseInt(element) == 9) {
              splittedReferenceId[index] = '0';
              if(index !== 0 && parseInt(splittedReferenceId[index-1]) < 9) {
                splittedReferenceId[index-1] = (parseInt(splittedReferenceId[index-1]) + 1) + '';
                if(parseInt(splittedReferenceId[index-1]) == 9) {
                  index--;
                }
              }
            } else {
              break;
            }

          }
          this.purchaseDetailListDto.referenceId = <any> splittedReferenceId.join('');
        }
      } else {
        this.addUniqueCode();
      }
    } else {
      this.addUniqueCode();
    }
  }

  addUniqueCode() {
    this.loaderService.showLoader();
    this._saleSvc.getUniqueCode(this.selectedPlant.plantId, CommonCodeGeneration.PURCHASE_ORDER).then((result: any) => {
      this.loaderService.hideLoader();
      this.purchaseDetailListDto.referenceId = result;
    }).catch(error => {
      this.loaderService.hideLoader();
      console.log(error);
    });
  }

  async getUniqeCode() {
    try {
      return await this._saleSvc.getUniqueCode(this.selectedPlant.plantId, CommonCodeGeneration.PURCHASE_ORDER);
    } catch (error) {
      return null;
    }
  }

  async getCalculatedUniqeCode(prevReferenceId) {
      if(prevReferenceId && prevReferenceId.length > 0) {
        const splittedReferenceId = prevReferenceId.split('');
        if(parseInt(splittedReferenceId[splittedReferenceId.length - 1]) < 9) {
          return prevReferenceId.substring(0, splittedReferenceId.length - 1) + (parseInt(splittedReferenceId[splittedReferenceId.length - 1]) + 1);
        } else {
          for (let index=splittedReferenceId.length-1; index >=0 ; index--) {
            const element = splittedReferenceId[index];
            if(parseInt(element) == 9) {
              splittedReferenceId[index] = '0';
              if(index !== 0 && parseInt(splittedReferenceId[index-1]) < 9) {
                splittedReferenceId[index-1] = (parseInt(splittedReferenceId[index-1]) + 1) + '';
                if(parseInt(splittedReferenceId[index-1]) == 9) {
                  index--;
                }
              }
            } else {
              break;
            }

          }
          return splittedReferenceId.join('');
        }
      } else {
        return await this.getUniqeCode();
      }
  }

  clearReferenceId() {
    if(this.purchaseDetailListDto.referenceId) {
      this.purchaseDetailListDto.referenceId = null;
      if(this.selectedDetailIndex !== -1) {
        for (let index = this.selectedDetailIndex; index < this.order.purchaseOrderDetailList.length; index++) {
          const orderItem = this.order.purchaseOrderDetailList[index];
          const referenceId = <any> (orderItem.referenceId || '') + '';
          if(referenceId && referenceId.length > 0) {
            const splittedReferenceId = referenceId.split('');
            if(parseInt(splittedReferenceId[splittedReferenceId.length - 1]) !== 0) {
              splittedReferenceId[splittedReferenceId.length - 1] = (parseInt(splittedReferenceId[splittedReferenceId.length - 1]) - 1).toString();
              orderItem.referenceId = <any> splittedReferenceId.join('');
            } else {
              for (let index=splittedReferenceId.length-1; index >=0 ; index--) {
                if(parseInt(splittedReferenceId[index])== 0) {
                  splittedReferenceId[index] = "9";
                  if(index !== 0 && parseInt(splittedReferenceId[index-1]) !== 0) {
                    splittedReferenceId[index-1] = (parseInt(splittedReferenceId[index-1]) - 1) + '';
                    if(parseInt(splittedReferenceId[index-1]) == 0) {
                      index--;
                    }
                  }
                } else {
                  break;
                }
              }
              orderItem.referenceId = <any> splittedReferenceId.join('');
            }
          }
        }
      }
    }
  }

  onPlantChange(event) {
    // console.log(event);
    const detailItem = this.plantList.find(item => item.plantId === +event);
    // this.newRequestOrderDetailCreateDto.purchaseOrderDetailList[0].plantId = detailItem.plantName;
    this.purchaseDetailListDto.plantId = detailItem.plantId;
    this.purchaseDetailListDto.plantName = detailItem.plantName;

  }


  onWareHouseChange(event) {
    console.log(event);
    const detailItem = this.warehouseList.find(item => item.wareHouseId === +event);
    this.purchaseDetailListDto.wareHouseId = detailItem.wareHouseId;
    this.purchaseDetailListDto.warehouseName = detailItem.wareHouseName;
  }

  addDetails() {
    // const cloneOfNewOrderDetailListItem = Object.assign({}, this.newRequestOrderDetailCreateDto);
    if (this.selectedDetailIndex < 0) {
      // add
      this.order.purchaseOrderDetailList.push(this.purchaseDetailListDto);
      console.log('showItem', this.order);
    } else {
      // update
      // this.order.purchaseOrderDetailList[this.selectedDetailIndex] = cloneOfNewOrderDetailListItem;
      this.order.purchaseOrderDetailList[this.selectedDetailIndex] = this.purchaseDetailListDto;
    }
    this.params.dialog.visible = false;
  }

  resetNewItemDetails() {
    this.purchaseDetailListDto = {
      baseUnit: null,
      batch: null,
      description: null,
      referenceId: null,
      deliveryStartDate: null,
      plantId: this.selectedPlant ? this.selectedPlant.plantId : null,
      // purchaseOrderDetailId:null,
      purchaseOrderStatus: null,
      fixedPrice: false,
      height: 0,
      purchaseOrderItemCosting: new PurchaseOrderItemCosting(),
      width: 0,
      dimensionUnit: null,
      orderUnit: null,
      quantity: null,
      stockId: null,
      stockNo: null,
      stockName2: null,
      totalIncomeQuantity: 0,
      wareHouseId: null,
      plantName: this.selectedPlant ? this.selectedPlant.plantName : null,
      stockName: null,
      deliveryDate: null,
      warehouseName: null,
      priority: null
    };
    this.newRequestOrderDetailCreateDto = new PurchaseOrderDetailDto();
    this.newRequestOrderDetailCreateDto.plantId = this.selectedPlant ? this.selectedPlant.plantId : null;
    this.newRequestOrderDetailCreateDto.plantName = this.selectedPlant ? this.selectedPlant.plantName : null;
  }

  deleteDetailItemFromList(index) {
    const detailItem = this.order.purchaseOrderDetailList[index];
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        console.log("@this.pu", this.order.purchaseOrderDetailList);
        this.order.purchaseOrderDetailList.splice(index, 1);

      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    })
  }

  onMaterialDropDownSelect(event) {
    const { value } = event;
    const stockFullDetail = value;
    this.unitList = null;
    if ((stockFullDetail.stockPurchasing)) {
      if (stockFullDetail.isBatchActive === true) {
        this.AllowToSelectBatch = true;
      } else {
        this.AllowToSelectBatch = false;
      }
      this.purchaseDetailListDto.stockId = stockFullDetail.stockId;
      this.purchaseDetailListDto.stockNo = stockFullDetail.stockNo;
      this.purchaseDetailListDto.stockName = stockFullDetail.stockName;
      this.purchaseDetailListDto.baseUnit = stockFullDetail.baseUnit;
      this.purchaseDetailListDto.orderUnit = stockFullDetail.stockPurchasing.orderUnit;
      this.orderUnitDisable = true;
    } else {

      this.purchaseDetailListDto.orderUnit = null;

      if (stockFullDetail.isBatchActive === true) {
        this.AllowToSelectBatch = true;
      } else {
        this.AllowToSelectBatch = false;
      }
      this.purchaseDetailListDto.stockId = stockFullDetail.stockId;
      this.purchaseDetailListDto.stockNo = stockFullDetail.stockNo;
      this.purchaseDetailListDto.stockName = stockFullDetail.stockName;
      this.purchaseDetailListDto.baseUnit = stockFullDetail.baseUnit;
      this.purchaseDetailListDto.orderUnit = stockFullDetail.baseUnit;

      this.orderUnitDisable = false;
      if (value) {
        this._stockSvc.metarialActiveUnits(stockFullDetail.stockId).then((result: any) => {
          this.unitList = result;
        }).catch(error => console.log(error));
      }
    }

  }


  onPriceChanges() {
    this.purchaseDetailListDto.purchaseOrderItemCosting.discountPrice =
    (this.purchaseDetailListDto.purchaseOrderItemCosting.discountPercentage/100)*this.purchaseDetailListDto.purchaseOrderItemCosting.grossPrice;

    // const discountPrice = this.purchaseDetailListDto.purchaseOrderItemCosting.grossPrice * Number((this.purchaseDetailListDto.purchaseOrderItemCosting.discountPercentage/100).toFixed(1));
    this.purchaseDetailListDto.purchaseOrderItemCosting.netPrice =  this.purchaseDetailListDto.purchaseOrderItemCosting.grossPrice - this.purchaseDetailListDto.purchaseOrderItemCosting.discountPrice;
    this.purchaseDetailListDto.fixedPrice=true;
  }
  cancel() {
    console.log("@invoke");
  }
  onOrderStatusChanged(event) {
    if (event) {
      this.order.purchaseOrderDetailList.forEach(itm => {
        itm.purchaseOrderStatus = this.order.purchaseOrderStatus;
      });
    }
  }
  onMaterialChange(event) {
    this.selectedStock = event;
    const stockFullDetail = event;
    this.unitList = null;
    if ((stockFullDetail.stockPurchasing)) {
      if (stockFullDetail.isBatchActive === true) {
        this.AllowToSelectBatch = true;
      } else {
        this.AllowToSelectBatch = false;
      }
      this.purchaseDetailListDto.stockId = stockFullDetail.stockId;
      this.purchaseDetailListDto.stockNo = stockFullDetail.stockNo;
      this.purchaseDetailListDto.stockName = stockFullDetail.stockName;
      this.purchaseDetailListDto.baseUnit = stockFullDetail.baseUnit;
      this.purchaseDetailListDto.orderUnit = stockFullDetail.stockPurchasing.orderUnit;
      this.orderUnitDisable = true;
    } else {

      this.purchaseDetailListDto.orderUnit = null;

      if (stockFullDetail.isBatchActive === true) {
        this.AllowToSelectBatch = true;
      } else {
        this.AllowToSelectBatch = false;
      }
      this.purchaseDetailListDto.stockId = stockFullDetail.stockId;
      this.purchaseDetailListDto.stockNo = stockFullDetail.stockNo;
      this.purchaseDetailListDto.stockName = stockFullDetail.stockName;
      this.purchaseDetailListDto.baseUnit = stockFullDetail.baseUnit;
      this.purchaseDetailListDto.orderUnit = stockFullDetail.baseUnit;

      this.orderUnitDisable = false;
      if (event) {
        this._stockSvc.metarialActiveUnits(stockFullDetail.stockId).then((result: any) => {
          this.unitList = result;
        }).catch(error => console.log(error));
      }
    }

  }
}
