import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SalesOrderService } from 'app/services/dto-services/sales-order/sales-order.service';
import { LoaderService } from 'app/services/shared/loader.service';
import {PurchaseOrderItemCosting } from 'app/dto/sale-order/sale-order.model';
import { ActService } from 'app/services/dto-services/act/act.service';
import { PorderService } from 'app/services/dto-services/porder/porder.service';
import { StockCardService } from 'app/services/dto-services/stock/stock.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'environments/environment';

import { UsersService } from 'app/services/users/users.service';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { ConfirmationService } from 'primeng';
import { ActTypeService } from 'app/services/dto-services/act-type/act-type.service';
import { CommonCodeGeneration } from 'app/dto/common-code-generation.enum';

@Component({
  selector: 'app-porder-edit',
  templateUrl: './porder-edit.component.html',
  styleUrls: ['./porder-edit.component.scss']
})
export class PorderEditComponent implements OnInit {
  
  id;
  
  // wareHouse: any;
  
  @Output() saveAction = new EventEmitter<any>();
  
  order: any;
  firstTimeCallUniqueCode: boolean = false;
  // newRequestOrderDetailCreateDto: PurchaseOrderDetailDto = new PurchaseOrderDetailDto();

  purchaseDetailListDto = {
    baseUnit: null,
    batch: null,
    plantName: null,
    plantId: null,
    orderUnit: null,
    height: 0,
    width: 0,
    referenceId: null,
    dimensionUnit: null,
    purchaseOrderItemCosting: new PurchaseOrderItemCosting(),
    purchaseOrderDetailId: null,
    purchaseOrderStatus: null,
    deliveryDate: null,
    deliveryStartDate: null,
    quantity: null,
    fixedPrice: null,
    stockId: null,
    stockName: null,
    stockName2: null,
    stockNo: null,
    totalIncomeQuantity: 0,
    wareHouseId: null,
    wareHouseName: null,
    priority: null
  }

  AllowToSelectBatch = false;
  
  orderUnitDisable = false;
  selectedCurrency: any;
  
  params = {
    dialog: { title: '', inputValue: '', visible: false }
  };

  actList;
  

  salesOrderTypes;
  
  selectedCustomer;
  
  purchaseStatusType;
  
  unitList = [];
  
  modal = { active: false };
  
  selectedDetailIndex = -1;
  
  selectedPlant = null;
  
  includeMaterialList = [1, 2,3, 4, 5, 6, 7, 8, 10, 13,14];

  commonPriorities = [];

  countryName: any;
  listActTypes: any;
  isLoading: boolean = false;
  language: any;

  constructor(private _actSvc: ActService,
    private _actTypes: ActTypeService,
    private _router: ActivatedRoute,
    private _route: Router,
    private _saleSvc: SalesOrderService,
    private _purchaseSvc: PorderService,
    private _stockSvc: StockCardService,
    private loaderService: LoaderService,
    private useSvc: UsersService,
    private _confirmationSvc: ConfirmationService,
    private utilities: UtilitiesService,
    private _translateSvc: TranslateService,
    private _enumSvc: EnumService) {
    // step1:
    this.selectedPlant = JSON.parse(this.useSvc.getPlant());
    this._router.params.subscribe((params) => {
      this.id = params['id'];
      if (params['id']) {
        this.initialize(this.id);
      }
    });
  }

  // step1.1
  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  private initialize(id: string) {
    this.loaderService.showLoader();
    this._saleSvc.getUpdatePurchaseDetail(id).then((result: any) => {
      this.loaderService.hideLoader();
      this.order = result;
      // console.log('@InitializeOrder', this.order)
      if (result.supplierId) {
        this.selectedCustomer = { actId: result.supplierId, actName: result.supplierName };

      }
      this.order.supplier = result.supplierId;
      this.order.costCenterId = result.costCenter? result.costCenter.costCenterId : result.costCenterId;
      if(result['account']) {
        this.order.vendorTypeId = result['account'].actType?.actTypeId;
        this.language = result['account'].contractDto?.language;
      }
      
      // delete this.order.supplierId;
      // delete this.order.supplierName;
      this.order.purchaseOrderDetailList.forEach(itm => {
        if(!itm.purchaseOrderItemCosting) {
          itm.purchaseOrderItemCosting = new PurchaseOrderItemCosting();
          itm.purchaseOrderItemCosting.purchaseOrderId = id;
          itm.purchaseOrderItemCosting.purchaseOrderDetailId = itm.purchaseOrderDetailId;
        } else {
          itm.purchaseOrderItemCosting.purchaseOrderId = id;
          itm.purchaseOrderItemCosting.purchaseOrderDetailId = itm.purchaseOrderDetailId;
        }
      });
      this.purchaseOrderStatusList();
      this.purchaseOrderTypes();

    }).then(() => {
     if (this.order.supplier) {
      this._actSvc.getDetail(this.order.supplier).then(result => {
        this.countryName = result['country'] ? result['country'].countryName : null;
      }).catch(error => console.log(error));
     }

    }).catch(error => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(error);
    });
  }
  setSelectedBatch(batch) {
    if (batch) {
      this.purchaseDetailListDto.batch = batch.batchCode;
    } else {
      this.purchaseDetailListDto.batch = null;
    }
  }

  ngOnInit() {
    // this.purchaseOrderTypes();
    this._actSvc.getActSupplierByPlantId(this.selectedPlant?.plantId).then(result => this.actList = result).catch(error => console.log(error));
    this._enumSvc.getCommonPriorityEnum().then((result: any) => this.commonPriorities = result).catch(error => console.log(error));
    this._actTypes.getbyPlantId_AccountPosition(this.selectedPlant?.plantId, 'SUPPLIER').then((result: any) => this.listActTypes = result).catch(error => console.log(error));
  }

  onOrderStatusChanged(event) {
    if (event) {
      this.order.purchaseOrderDetailList.forEach(itm => {
        itm.purchaseOrderStatus = this.order.purchaseOrderStatus;
      });
    }
  }

  purchaseOrderTypes() {
    // order-type
    this._saleSvc.getPurchaseOrderTypes()
      .then(result => {
        this.salesOrderTypes = result;
        if(this.order.purchaseOrderType !== 'COMBINED_PURCHASE_ORDER') {
          this.salesOrderTypes = this.salesOrderTypes.filter(itm => itm !== 'COMBINED_PURCHASE_ORDER');
        }
        
      })
      .catch(error => console.log(error));
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

  prioritySelection(event) {
    if (event) {
      this.purchaseDetailListDto.priority = event.target.value;
    } else {
      this.purchaseDetailListDto.priority = null;
    }
  }

  purchaseOrderStatusList() {
    this._saleSvc.getPurchaseOrderStatus().then((result: any) => {
      const purchaseOrderStatus = this.order.purchaseOrderStatus;
      if (purchaseOrderStatus !== 'REQUESTED' && purchaseOrderStatus !== 'WAITING' && purchaseOrderStatus !== 'CONFIRMED' && purchaseOrderStatus !== 'SENT' ) {
        this.purchaseStatusType = result.filter((item) =>  {
          return  (item == purchaseOrderStatus );
        });
      } else {
        this.purchaseStatusType = result.filter((item) => {
          return (item == 'REQUESTED' || item=='CANCELED' || item == 'WAITING' || item == 'CONFIRMED' || item=='SENT');
        });
      }
      // if (result) {
      //   //this.purchaseOrderTypes = result;
      //   this.purchaseStatusType = result.filter((item) => {
      //     return (item == 'REQUESTED' || item == 'WAITING' || item == 'CONFIRMED');
      //   });
      // }
    }).catch(error => console.log(error));
  }

  setSelectedCustomer(customer) {
    if (customer) {
      this.order['supplierId'] = customer.actId;
      this.order['supplierName'] = customer.actName;
      this.order.supplier = customer.actId;
      
      this._actSvc.getDetail(this.order.supplier).then(result => {
        this.countryName = result['country'] ? result['country'].countryName : null;
        this.order.parity = result['contractDto']?.parity;
        this.language = customer.contractDto?.language;
        this.selectedCustomer = result;
      }).catch(error => console.log(error));
    } else {
      this.order['supplierId'] = null;
      this.order['supplierName'] = null;
      this.order.supplier = null;
      this.language = null;
    }
  }

  setSelectedPlant(event) {
    // this.wareHouse = null;
    if (event) {
      this.purchaseDetailListDto.plantId = event.plantId;
      this.purchaseDetailListDto.plantName = event.plantName;
    } else {
      this.purchaseDetailListDto.plantId = null;
      this.purchaseDetailListDto.plantName = null;
    }
  }
  setSelectedWarehouse(event) {
    // this.wareHouse = event;
    if (event && event.hasOwnProperty('wareHouseId')) {
      this.purchaseDetailListDto.wareHouseId = event.wareHouseId;
      this.purchaseDetailListDto.wareHouseName = event.wareHouseName;
    } else {
      this.purchaseDetailListDto.wareHouseId = null;
      this.purchaseDetailListDto.wareHouseName = null;
    }
  }
  goPage() {
    this._route.navigate(['/orders/sales']);
  }

  save() {
    // if(this.order.purchaseOrderType === 'AUTOMATIC_PURCHASE_ORDER_OUTSOURCE') {
    //   for (let index = 0; index < this.order.purchaseOrderDetailList.length; index++) {
    //     const porderItem = this.order.purchaseOrderDetailList[index];
    //     if(!porderItem.deliveryStartDate) {
    //       this.utilities.showWarningToast('please-enter-delivery-start-date');
    //       return 0;
    //     }
    //   }
    // }

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
  addList(item) {
    item.quantity = 1;
    this.order.purchaseOrderDetailList.push(item);
  }
  reset() {
    // const porderNo = this.order.porderNo;
    // this.order = new purchaseOrderRequestModel();
    // this.order.porderNo = porderNo;
    this.initialize(this.id);
  }
  setCustomer(customer) {
    this.actList.push(customer)
    this.order.supplier = customer.actId;
  }


  openSaleOrderDetailsModal(index) {
    this.params.dialog.title = 'Sale Order Details';
    this.params.dialog.visible = true;
    this.selectedDetailIndex = index;
    if (this.selectedDetailIndex < 0) {
      this.resetNewItemDetails();
      this.addAndIncrementReferenceId()
      this.purchaseDetailListDto.priority = 'MEDIUM';
      this.purchaseDetailListDto.plantId = this.selectedPlant ? this.selectedPlant.plantId : null;
      this.purchaseDetailListDto.plantName = this.selectedPlant ? this.selectedPlant.plantName : null;
      this.purchaseDetailListDto.purchaseOrderStatus = this.order.purchaseOrderStatus || 'REQUESTED';
    } else {
      this.purchaseDetailListDto = JSON.parse(JSON.stringify(this.order.purchaseOrderDetailList[index]));
      if(!this.purchaseDetailListDto.purchaseOrderItemCosting) {
        this.purchaseDetailListDto.purchaseOrderItemCosting = new PurchaseOrderItemCosting();
        this.purchaseDetailListDto.purchaseOrderItemCosting.purchaseOrderDetailId = this.purchaseDetailListDto.purchaseOrderDetailId;
        this.purchaseDetailListDto.purchaseOrderItemCosting.stockId = this.purchaseDetailListDto.stockId;
        this.purchaseDetailListDto.purchaseOrderItemCosting.quantity = this.purchaseDetailListDto.quantity;
      } else {
        this.purchaseDetailListDto.purchaseOrderItemCosting.quantity = this.purchaseDetailListDto.quantity;
        if(this.purchaseDetailListDto.purchaseOrderItemCosting.discountPrice) {
          this.purchaseDetailListDto.purchaseOrderItemCosting.discountPercentage =  
          parseFloat(((this.purchaseDetailListDto.purchaseOrderItemCosting.discountPrice * 100)/ 
            this.purchaseDetailListDto.purchaseOrderItemCosting.grossPrice).toFixed(1));
        }
      }
      if(this.order.purchaseOrderType === 'AUTOMATIC_PURCHASE_ORDER_OUTSOURCE') {
       
      }
      if(!this.purchaseDetailListDto.purchaseOrderItemCosting?.discountPrice || !this.purchaseDetailListDto.purchaseOrderItemCosting?.discountPercentage) {
        this.purchaseDetailListDto.purchaseOrderItemCosting.discountPercentage = 0;
        this.purchaseDetailListDto.purchaseOrderItemCosting.discountPrice = 0;
      }
      this.purchaseDetailListDto.deliveryDate = this.purchaseDetailListDto.deliveryDate ? new Date(this.purchaseDetailListDto.deliveryDate) : null;
      this.purchaseDetailListDto.deliveryStartDate = this.purchaseDetailListDto.deliveryStartDate ? new Date(this.purchaseDetailListDto.deliveryStartDate) : null;
      // this.purchaseListClone = Object.assign({}, this.purchaseDetailListDto);
      if(!(this.unitList.length > 0) || (this.unitList.filter(item => item.stockId ===this.purchaseDetailListDto.stockId).length === 0)) {
        this._stockSvc.metarialActiveUnits(this.purchaseDetailListDto.stockId).then((result: any) => {
          this.unitList = result;
        }).catch(error => console.log(error));
      }
    }
  }

  addAndIncrementReferenceId() {
    if(this.order.purchaseOrderDetailList && this.order.purchaseOrderDetailList.length&& this.firstTimeCallUniqueCode) {
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

  onMaterialChange(event) {
    // this.selectedStock = event;
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
      this.purchaseDetailListDto.stockName2 = stockFullDetail.stockName2;
      this.purchaseDetailListDto.baseUnit = stockFullDetail.baseUnit;
      this.purchaseDetailListDto.orderUnit = stockFullDetail.stockPurchasing.orderUnit;
      this.purchaseDetailListDto.purchaseOrderItemCosting.stockId = this.purchaseDetailListDto.stockId;
      this.purchaseDetailListDto.purchaseOrderItemCosting.effectivePrice = stockFullDetail.stockCostEstimate?.currentPrice || 0;
      this.purchaseDetailListDto.purchaseOrderItemCosting.netPrice = stockFullDetail.stockCostEstimate?.currentPrice || 0;
      this.purchaseDetailListDto.purchaseOrderItemCosting.currency = stockFullDetail.stockCosting?.currencyCode || null;
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
      this.purchaseDetailListDto.orderUnit = stockFullDetail.baseUnit;
      this.purchaseDetailListDto.purchaseOrderItemCosting.stockId = this.purchaseDetailListDto.stockId;
      this.purchaseDetailListDto.purchaseOrderItemCosting.effectivePrice = stockFullDetail.stockCostEstimate?.currentPrice || 0;
      this.purchaseDetailListDto.purchaseOrderItemCosting.currency = stockFullDetail.stockCosting?.currencyCode || null;
      this.purchaseDetailListDto.purchaseOrderItemCosting.netPrice = stockFullDetail.stockCostEstimate?.currentPrice || 0;
      this.orderUnitDisable = false;
      if (event) {
        if(stockFullDetail.productionOrderWareHouseId) {
          this.purchaseDetailListDto.wareHouseId = stockFullDetail.productionOrderWareHouseId?.wareHouseId;
          this.purchaseDetailListDto.wareHouseName = stockFullDetail.productionOrderWareHouseId?.wareHouseName;
        }
        this._stockSvc.metarialActiveUnits(stockFullDetail.stockId).then((result: any) => {
          this.unitList = result;
        }).catch(error => console.log(error));
      }
    }

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
    this.firstTimeCallUniqueCode = true;
  }

  resetNewItemDetails() {
    this.purchaseDetailListDto = {
      baseUnit: null,
      batch: null,
      plantName: this.selectedPlant ? this.selectedPlant.plantName : null,
      plantId: this.selectedPlant ? this.selectedPlant.plantId : null,
      orderUnit: null,
      referenceId: null,
      height: 0,
      width: 0,
      purchaseOrderItemCosting: new PurchaseOrderItemCosting(),
      dimensionUnit: null,
      purchaseOrderDetailId: null,
      purchaseOrderStatus: null,
      deliveryStartDate: null,
      deliveryDate: null,
      quantity: null,
      fixedPrice: false,
      stockId: null,
      stockName: null,
      stockName2: null,
      stockNo: null,
      totalIncomeQuantity: 0,
      wareHouseId: null,
      wareHouseName: null,
      priority: 'MEDIUM'
    }
    // this.newRequestOrderDetailCreateDto.plantId = this.selectedPlant ? this.selectedPlant.plantId : null;
    // this.newRequestOrderDetailCreateDto.plantName = this.selectedPlant ? this.selectedPlant.plantName : null;

    // this.purchaseDetailListDto = Object.assign({}, this.purchaseListClone);
  }


  deleteDetailItemFromList(index) {
    // this.deletePorderItem(item);
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        const item = this.order.purchaseOrderDetailList[index];
        if (item.purchaseOrderDetailId > 0) {
          this._purchaseSvc.deletePOrderItem(item.purchaseOrderDetailId).then(res => {
            // console.log("itemDelete", res);
            this.utilities.showSuccessToast('removed-success');
            this.order.purchaseOrderDetailList.splice(index, 1);
          });
        } else {
          this.order.purchaseOrderDetailList.splice(index, 1);
        }
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }

    });
    // this._confirmationSvc.confirm({
    //   message: this._translateSvc.instant('do-you-want-to-delete'),
    //   header: this._translateSvc.instant('delete-confirmation'),
    //   icon: 'fa fa-trash',
    //   key: 'porderEdit',
    //   accept: () => {
    //     const item = this.order.purchaseOrderDetailList[index];
    //     this._purchaseSvc.deletePOrderItem(item.purchaseOrderDetailId).then(res => {
    //       // console.log("itemDelete", res);
    //       this.utilities.showSuccessToast('removed-success');
    //       this.order.purchaseOrderDetailList.splice(index, 1);
    //     });
    //   },
    //   reject: () => {
    //     this.utilities.showInfoToast('cancelled-operation');
    //   }
    // });

  }

  deletePorderItem(item: any) {
    console.log('item', item);
    // item.forEach(element => {
    //   this._purchaseSvc.deletePOrderItem(element.purchaseOrderDetailId).then(res => {
    //     console.log("itemDelete", res);
    //   });
    // });
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

  onPriceChanges() {
    this.purchaseDetailListDto.purchaseOrderItemCosting.discountPrice = 
    (this.purchaseDetailListDto.purchaseOrderItemCosting.discountPercentage/100)*this.purchaseDetailListDto.purchaseOrderItemCosting.grossPrice;

    // const discountPrice = this.purchaseDetailListDto.purchaseOrderItemCosting.grossPrice * Number((this.purchaseDetailListDto.purchaseOrderItemCosting.discountPercentage/100).toFixed(1));
    this.purchaseDetailListDto.purchaseOrderItemCosting.netPrice =  this.purchaseDetailListDto.purchaseOrderItemCosting.grossPrice - this.purchaseDetailListDto.purchaseOrderItemCosting.discountPrice;
    this.purchaseDetailListDto.fixedPrice=true;
  }

}
