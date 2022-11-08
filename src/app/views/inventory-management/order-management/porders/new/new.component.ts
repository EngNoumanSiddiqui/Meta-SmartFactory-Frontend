import { UsersService } from 'app/services/users/users.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActService } from 'app/services/dto-services/act/act.service';
import { PurchaseOrderDetailDto, PurchaseOrderItemCosting, purchaseOrderRequestModel } from 'app/dto/sale-order/sale-order.model';
import { Router } from '@angular/router';
import { SalesOrderService } from 'app/services/dto-services/sales-order/sales-order.service';
import { StockCardService } from 'app/services/dto-services/stock/stock.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { ConfirmationService } from 'primeng';
import { TranslateService } from '@ngx-translate/core';
import { PorderService } from 'app/services/dto-services/porder/porder.service';
import { environment } from 'environments/environment';

import { EnumService } from 'app/services/dto-services/enum/enum.service';
import { ActTypeService } from 'app/services/dto-services/act-type/act-type.service';
import { TableTypeEnum } from 'app/dto/table-type-enum';
import { CommonCodeGeneration } from 'app/dto/common-code-generation.enum';

@Component({
  selector: 'porder-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss'],
  providers: [ActService]
})
export class NewPorderComponent implements OnInit {

  // wareHouse;

  @Output() saveAction = new EventEmitter<any>();

  @Input() notificationId: any;

  order: purchaseOrderRequestModel = new purchaseOrderRequestModel();

  newRequestOrderDetailCreateDto: PurchaseOrderDetailDto = new PurchaseOrderDetailDto();

  purchaseDetailListDto = {
    baseUnit: null,
    batch: null,
    plantId: null,
    purchaseOrderStatus: null,
    orderUnit: null,
    quantity: null,
    fixedPrice: null,
    referenceId: null,
    height: 0,
    description: null,
    width: 0,
    purchaseOrderItemCosting: new PurchaseOrderItemCosting(),
    dimensionUnit: null,
    stockId: null,
    stockNo: null,
    totalIncomeQuantity: 0,
    wareHouseId: null,

    plantName: null,
    stockName: null,
    stockName2: null,
    deliveryDate: null,
    deliveryStartDate: null,
    warehouseName: null,
    priority: 'MEDIUM'
  }


  isLoading = false;

  params = {
    dialog: { title: '', inputValue: '', visible: false }
  };

  actList;

  salesOrderTypes;

  purchaseStatusType;

  unitList = [];

  warehouseList;

  modal = { active: false };

  AllowToSelectBatch = false;

  orderUnitDisable = false;

  selectedDetailIndex = -1;

  selectedPlant: any;

  includeMaterialList = [1, 2,3, 4, 5, 6, 7, 8, 10, 13,14];

  commonPriorities = [];

  customerPriority: string = null;
  selectedVendor: any;
  selectedCurrency: any;
  countryName: any;
  listActTypes: any;
  submitted: boolean =false;
  language: any;

  @Input("POQuatationObject") set setPOQuotationObject(POQuatationObject) {
    if(POQuatationObject) {
      this.order = {
        description: POQuatationObject.description,
        referenceId: null,
        costCenterId: POQuatationObject.costCenter? POQuatationObject.costCenter?.costCenterId:  POQuatationObject.costCenterId,
        parity: POQuatationObject.parity || null ,
        porderDate: POQuatationObject.createDate,
        purchaseOrderDetailList: POQuatationObject.purchaseQuotationDetailList.map(itm => ({
          baseUnit:	itm.baseUnit,
          batch: itm.batch,
          deliveryDate: itm.deliveryDate,
          deliveryStartDate: null,
          dimensionUnit: itm.baseUnit,
          height: null,
          fixedPrice: false,
          purchaseOrderItemCosting: new PurchaseOrderItemCosting(),
          orderUnit: itm.orderUnit,
          parentPurchaseOrderId	: null,
          plantId: itm.plant?.plantId,
          plantName: itm.plant?.plantName,
          priority: "MEDIUM",
          purchaseOrderDetailId: null,
          purchaseOrderStatus: "REQUESTED",
          quantity: itm.requestedQuantity,
          stockId: itm.stock?.stockId,
          stockNo: itm.stock?.stockNo,
          stockName: itm.stock?.stockName,
          totalDeliveryCost: itm.deliveryCost,
          totalEffectivePrice: itm.effectivePrice,
          totalIncomeQuantity: itm.requestedQuantity,
          totalNetPrice: itm.netPrice,
          wareHouseId: null,
          width: itm.width,
        })),
        purchaseOrderStatus: "REQUESTED",
        purchaseOrderType: "STANDARD_PURCHASE_ORDER",
        purchaseQuotationId: POQuatationObject.purchaseQuotationId,
        supplier: POQuatationObject.vendor?.actId,
        totalDeliveryCost: null,
        totalEffectivePrice: null,
        totalNetPrice: null,
      }
      // if (this.order.supplier) {
      //   this.selectedCustomer = {actId: SQObject.act?.actId, actName: SQObject.act?.actName}
      // }

      if (POQuatationObject.vendor) {
        this.selectedVendor = { actId: POQuatationObject.vendor?.actId, actName: POQuatationObject.vendor?.actName }
      }
    }
  }

  constructor(private _actSvc: ActService,
    private _actTypes: ActTypeService,
    private _router: Router,
    private _saleSvc: SalesOrderService,
    private _purchaseSvc: PorderService,
    private _stockSvc: StockCardService,
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _confirmationSvc: ConfirmationService,
    private useSvc: UsersService,
    private _translateSvc: TranslateService,
    private _enumSvc: EnumService) {
    this.selectedPlant = JSON.parse(this.useSvc.getPlant());
  }

  ngOnInit() {

    this._enumSvc.getCommonPriorityEnum().then((result: any) => this.commonPriorities = result).catch(error => console.log(error));

    this._saleSvc.getPurchaseOrderTypes().then(result => {
      this.salesOrderTypes = result;
      this.salesOrderTypes = this.salesOrderTypes.filter(itm => itm === 'STANDARD_PURCHASE_ORDER' || itm === 'INTERNATIONAL_ORDER');
    }).catch(error => console.log(error));

    // status
    this._saleSvc.getPurchaseOrderStatus()
      .then((result: any) => {
        if (result) {
          this.purchaseStatusType = result.filter((item) => {
            return (item == 'REQUESTED' || item=='CANCELED' || item == 'WAITING' || item == 'CONFIRMED' || item=='SENT');
          });
        }
      })
      .catch(error => console.log(error));

    this._actSvc.getActSupplierByPlantId(this.selectedPlant?.plantId).then(result => this.actList = result).catch(error => console.log(error));

    this._actTypes.getbyPlantId_AccountPosition(this.selectedPlant?.plantId, 'SUPPLIER').then((result: any) => this.listActTypes = result).catch(error => console.log(error));
    
    this.order.purchaseOrderType = 'STANDARD_PURCHASE_ORDER';
    this.order.purchaseOrderStatus = 'REQUESTED';
    this.order.porderDate = new Date();
  }

  prioritySelection(event) {
    if (event) {
      this.newRequestOrderDetailCreateDto.priority = event.target.value;
    } else {
      this.newRequestOrderDetailCreateDto.priority = null;
    }
  }

  setSelectedCustomer(customer) {

    if (customer) {
      this.order.supplier = customer.actId;
      this._actSvc.getDetail(this.order.supplier).then((result:any) => {
        this.countryName = result['country'] ? result['country'].countryName : null;
        this.selectedVendor = result;
        this.order.parity = result.contractDto?.parity;
        this.language = customer.contractDto?.language;
        this.customerPriority = result.priority;
      }).catch(error => console.log(error));
    } else {
      this.order.supplier = null;
      this.language = null;
      this.customerPriority = null;
    }
  }

  // get discountPrice() {
  //   if(this.newRequestOrderDetailCreateDto.discount) {
  //     this.newRequestOrderDetailCreateDto.discountPrice = ConvertUtil.getAndChecktNumber((this.newRequestOrderDetailCreateDto.unitNetPrice*this.newRequestOrderDetailCreateDto.quantity) * (this.newRequestOrderDetailCreateDto.discount/100));
  //     return this.newRequestOrderDetailCreateDto.discountPrice;
  //   } else {
  //     return 0;
  //   }
  // }

  setSelectedPlant(event) {
    // this.workStation.wareHouse = null;
    // this.wareHouse = null;
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
  onOrderStatusChanged(event) {
    if (event) {
      this.order.purchaseOrderDetailList.forEach(itm => {
        itm.purchaseOrderStatus = this.order.purchaseOrderStatus;
      });
    }
  }
  setSelectedWarehouse(event) {
    // this.workStation.wareHouse = event;
    // this.wareHouse = event;
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
  
  save() {
    // console.log('order Data', JSON.stringify(this.order));
    for (let index = 0; index < this.order.purchaseOrderDetailList.length; index++) {
      const porderItem = this.order.purchaseOrderDetailList[index];
      if(!porderItem.deliveryStartDate && porderItem.outsource) {
        this.utilities.showWarningToast('please-enter-delivery-start-date');
        return 0;
      }
    }
    this.isLoading = true;
    this.loaderService.showLoader();
    this.submitted = true;
    this._purchaseSvc.save(this.order)
      .then(result => {
        // console.log('@reult', result);
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          // this.reset();
          this.saveAction.emit('close');
          this.isLoading = false;
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.submitted = false;
        this.utilities.showErrorToast(error);
        this.isLoading = false;
      });
  }

  // getStockItems() {
  //   this.stockSearchProgress = true;
  //   this.searchTerms.next(this.filterStock);
  // }

  reset() {
    this.order = new purchaseOrderRequestModel();
  }


  setCustomer(customer) {
    this.actList.push(customer)
    // this.order.supplier = customer.actId;
    this.setSelectedCustomer(customer);
  }

  
  orderTypeChanged(event) {
    if(event) {
      this.actList = [];
      this.filterActListByOrderType(+event);
    } else {
      this.filterActListByOrderType(null);
    }
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
      this.purchaseDetailListDto.plantId = this.selectedPlant ? this.selectedPlant.plantId : null;
      this.purchaseDetailListDto.plantName = this.selectedPlant ? this.selectedPlant.plantName : null;
      this.purchaseDetailListDto.priority = this.customerPriority || 'MEDIUM';
      this.purchaseDetailListDto.purchaseOrderStatus = this.order.purchaseOrderStatus || 'REQUESTED';
      this.purchaseDetailListDto.purchaseOrderItemCosting.vendorId = this.order.supplier;
    } else {
      // edit
      this.purchaseDetailListDto = Object.assign({}, this.order.purchaseOrderDetailList[index]);
      this.purchaseDetailListDto.deliveryDate = this.purchaseDetailListDto.deliveryDate ? new Date(this.purchaseDetailListDto.deliveryDate) : null;
      this.purchaseDetailListDto.deliveryStartDate = this.purchaseDetailListDto.deliveryStartDate ? new Date(this.purchaseDetailListDto.deliveryStartDate) : null;

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


  addDetails() {
    // const cloneOfNewOrderDetailListItem = Object.assign({}, this.newRequestOrderDetailCreateDto);
    if (this.selectedDetailIndex < 0) {
      // add
      this.order.purchaseOrderDetailList.push(this.purchaseDetailListDto);
    } else {
      // update
      this.order.purchaseOrderDetailList[this.selectedDetailIndex] = this.purchaseDetailListDto;
    }
    this.params.dialog.visible = false;
  }

  resetNewItemDetails() {
    this.purchaseDetailListDto = {
      baseUnit: null,
      batch: null,
      plantId: this.selectedPlant ? this.selectedPlant.plantId : null,
      purchaseOrderStatus: null,
      referenceId: null,
      height: 0,
      description: null,
      width: 0,
      dimensionUnit: null,
      fixedPrice: false,
      orderUnit: null,
      quantity: null,
      stockId: null,
      purchaseOrderItemCosting: new PurchaseOrderItemCosting(),
      totalIncomeQuantity: 0,
      wareHouseId: null,
      plantName: this.selectedPlant ? this.selectedPlant.plantName : null,
      stockName: null,
      stockName2: null,
      stockNo: null,
      deliveryDate: null,
      deliveryStartDate: null,
      warehouseName: null,
      priority: 'MEDIUM'
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
      this.purchaseDetailListDto.stockName2 = stockFullDetail.stockName2;
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
      this.purchaseDetailListDto.stockName2 = stockFullDetail.stockName2;
      this.purchaseDetailListDto.baseUnit = stockFullDetail.baseUnit;
      this.purchaseDetailListDto.orderUnit = stockFullDetail.orderUnit;

      this.orderUnitDisable = false;
      if (value) {
        this._stockSvc.metarialActiveUnits(stockFullDetail.stockId).then((result: any) => {
          this.unitList = result;
        }).catch(error => console.log(error));
      }
    }

  }
  cancel() {
    console.log('@invoke');
  }
  onMaterialChange(event) {
    const stockFullDetail = event;
    this.unitList = null;
    if (stockFullDetail && stockFullDetail.stockPurchasing) {
      this.orderUnitDisable = true;
      this.purchaseDetailListDto.orderUnit = stockFullDetail.stockPurchasing.orderUnit;
    } else {
      this.orderUnitDisable = false; 
      this.purchaseDetailListDto.orderUnit = stockFullDetail?.orderUnit;
    }
    if (event) {
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
      this.purchaseDetailListDto.height = stockFullDetail.height;
      this.purchaseDetailListDto.width = stockFullDetail.width;
      this.purchaseDetailListDto.purchaseOrderItemCosting.effectivePrice = stockFullDetail.stockCostEstimate?.currentPrice || 0;
      this.purchaseDetailListDto.purchaseOrderItemCosting.currency = stockFullDetail.stockCosting?.currencyCode || null;
      this.selectedCurrency = stockFullDetail.stockCosting?.currencyCode? {currencyCode: stockFullDetail.stockCosting?.currencyCode} : null;
      this.purchaseDetailListDto.purchaseOrderItemCosting.netPrice = stockFullDetail.stockCostEstimate?.currentPrice || 0;
      this.purchaseDetailListDto.dimensionUnit = stockFullDetail.dimensionUnit;
      this.purchaseDetailListDto.purchaseOrderItemCosting.stockId = this.purchaseDetailListDto.stockId;
      if(stockFullDetail.productionOrderWareHouseId) {
        this.purchaseDetailListDto.wareHouseId = stockFullDetail.productionOrderWareHouseId?.wareHouseId;
        this.purchaseDetailListDto.warehouseName = stockFullDetail.productionOrderWareHouseId?.wareHouseName;
      }
      this._stockSvc.metarialActiveUnits(stockFullDetail.stockId).then((result: any) => {
        this.unitList = result;
      }).catch(error => console.log(error));
    }

  }



  onPriceChanges() {
    // this.purchaseDetailListDto.purchaseOrderItemCosting.discountPrice = this.purchaseDetailListDto.purchaseOrderItemCosting.grossPrice * this.purchaseDetailListDto.purchaseOrderItemCosting.discountPercentage;
    this.purchaseDetailListDto.purchaseOrderItemCosting.discountPrice = 
    (this.purchaseDetailListDto.purchaseOrderItemCosting.discountPercentage/100)*this.purchaseDetailListDto.purchaseOrderItemCosting.grossPrice;
    // const discountPrice = this.purchaseDetailListDto.purchaseOrderItemCosting.grossPrice * Number((this.purchaseDetailListDto.purchaseOrderItemCosting.discountPercentage/100).toFixed(1));
    this.purchaseDetailListDto.purchaseOrderItemCosting.netPrice =  this.purchaseDetailListDto.purchaseOrderItemCosting.grossPrice - this.purchaseDetailListDto.purchaseOrderItemCosting.discountPrice;
    this.purchaseDetailListDto.fixedPrice=true;
  }
}
