import { UsersService } from 'app/services/users/users.service';
import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
import { RequestOrderCreateDto, RequestOrderDetailCreateDto } from 'app/dto/sale-order/sale-order.model';
import { ActService } from 'app/services/dto-services/act/act.service';
import { Router } from '@angular/router';
import { SalesOrderService } from 'app/services/dto-services/sales-order/sales-order.service';
import { StockCardService } from 'app/services/dto-services/stock/stock.service';
import { WorkstationService } from 'app/services/dto-services/workstation/workstation.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { ConfirmationService } from 'primeng';
import { EnumOrderStatusService } from 'app/services/dto-services/enum/order-status.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'environments/environment';
import { ActTypeService } from 'app/services/dto-services/act-type/act-type.service';

import { TableTypeEnum } from 'app/dto/table-type-enum';
import { ImageAdderV2Component } from 'app/views/image-v2/image-adder/image-adder.component';
import { ConvertUtil } from 'app/util/convert-util';
import { CommonCodeGeneration } from 'app/dto/common-code-generation.enum';
import { ExchangeRateService } from 'app/services/dto-services/exchange-rates/exchange-rates.service';
@Component({
  selector: 'sales-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewSaleComponent implements OnInit {
  // @ViewChild(ImageAdderComponent) imageAdderComponent: ImageAdderComponent;
  @ViewChildren(ImageAdderV2Component) imageAdderComponent: QueryList<ImageAdderV2Component>;
  wareHouse: any;

  preSelectedPlant: any;

  @Output() saveAction = new EventEmitter<any>();
  @Output() closeAction = new EventEmitter<any>();

  order: RequestOrderCreateDto = new RequestOrderCreateDto();


  newRequestOrderDetailCreateDto: RequestOrderDetailCreateDto = new RequestOrderDetailCreateDto();

  params = {
    dialog: { title: '', inputValue: '', visible: false }
  };
  actList;
  lastOrderNos;
  includeMaterials = [2, 3, 13,16];
  salesOrderTypes;
  unitList = [];
  plantList: any;
  listActTypes = [];
  HTS_Status = 'ORDER_IN_HOUSE';
  HTS_StatusList = ['ORDER_IN_HOUSE', 'DOC_READY', 'DOC_CONFIRMED'];

  warehouseList;

  modal = { active: false };

  productTreeStatusList: any[] = [];

  saleOrderStatusList: any[] = [];

  selectedDetailIndex = -1;

  selectedCustomer;

  selectedPlant: any;

  todayDate = new Date();
  mainSelectedWareHouse = null;

  commonPriorities = [];

  customerPriority: string = null;
  submitted: boolean = false;
  language: any;
  selectedMaterialCurrency = null;
  exChangeRate: number = 1;
  materialCurrentPrice = null;


  plantCurrency;
  plantCurrencyItemRate;

  @Input('SQObject') set setSQObject(SQObject) {
    if(SQObject) {
      this.order = {
        actId: SQObject.act?.actId,
        checkStock: true,
        referenceId: null,
        actTypeName: SQObject.act?.actType?.actTypeName,
        actTypeId: SQObject.act?.actType?.actTypeId,
        customerOrderNo:SQObject.customerOrderNo,
        description: SQObject.description,
        originalTotalSalesPrice: 0,
        totalSalesPrice : 0,
        totalVatPrice : 0,
        totalNetPrice : 0,
        totalDiscountPrice : 0,
        orderDetailList: SQObject.orderQuotationDetailList.filter(
          (v,i,a)=> a.findIndex( t => (t.quotationDetailId === v.quotationDetailId))===i)
          .map(itm => (
          {
            batch: itm.batch,
            costPrice: itm.costPrice,
            deliveryDate: new Date(itm.deliveryDate),
            dimensionUnit: itm.dimensionUnit,
            directProduction: itm.directProduction || false,
            description: itm.description,
            prepareProduction: true,
            stockManagement: null,
            discount: itm.discount || this.selectedCustomer?.contractDto?.discount || null,
            deliveryCost: itm.deliveryCost,
            height: itm.height,
            orderDetailId: null,
            costCenterId: itm.costCenter?.costCenterId,
            costCenterName: itm.costCenter?.costCenterName,
            orderDetailStatus: 'ORDER_IN_HOUSE',
            plannedQuantity: itm.plannedQuantity,
            plantId: itm.plant?.plantId,
            plantName: itm.plant?.plantName,
            priority: itm.priority,
            referenceId: itm.referenceId,
            quantity: itm.quantity,
            originalSalesPrice: itm.originalSalesPrice,
            salePrice: itm.salePrice,
            unitNetPrice: itm.unitNetPrice,
            netPrice: itm.netPrice,
            discountPrice: itm.discountPrice,
            stockCode: itm.stockCode,
            currency: itm.currency || this.selectedCustomer?.contractDto?.currency || null,
            vatRate : itm.vatRate || this.selectedCustomer?.contractDto?.vat || null,
            vatPrice : itm.vatPrice,
            stockId: itm.stock?.stockId,
            stockNo: itm.stock?.stockNo,
            stockName: itm.stock?.stockName,
            unit: itm.baseUnit,
            warehouseId: itm.warehouseId,
            width: itm.width,
          })),
        orderNo: null,
        orderQuotationId: SQObject.quotationId,
        orderStatus: "ORDER_IN_HOUSE",
        orderTypeId: 1,
        parity: SQObject.parity,
        plantId: this.selectedPlant?.plantId,
        deliveryDate: new Date(),
        orderDate: new Date(),
        documentNo: null,
      }

      if (this.order.actId) {
        this.selectedCustomer = {actId: SQObject.act?.actId, actName: SQObject.act?.actName}
      }


      setTimeout(() => {
        if (this.imageAdderComponent && this.imageAdderComponent.length) {
          SQObject.orderQuotationDetailList.filter(
            (v,i,a)=> a.findIndex( t => (t.quotationDetailId === v.quotationDetailId))===i)
            .forEach((item, index) => {
            this.imageAdderComponent.toArray()[index].initForSaleOrder(item.quotationDetailId, TableTypeEnum.SALES_QUOTATION_DETAIL);
          });
          // this.imageAdderComponent.initImages(this.order.orderId, TableTypeEnum.SALES_ORDER);
        }
      }, 1500);
    }
  }

  constructor(private _actSvc: ActService,
    private _actTypes: ActTypeService,
    private _router: Router,
    private _saleSvc: SalesOrderService,
    private _stockSvc: StockCardService,
    private _workstationSvc: WorkstationService,
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private userSvc: UsersService,
    private exChangeRateSvc: ExchangeRateService,
    private _confirmationSvc: ConfirmationService,
    private orderStatusService: EnumOrderStatusService,
    private _translateSvc: TranslateService,
    private _enumSvc: EnumService) {

    this.selectedPlant = JSON.parse(this.userSvc.getPlant());


  }

  ngOnInit() {

    this.getSaleOrderStatusList();
    this.getSaleOrderStatusDetailList();
    this._saleSvc.getLastOrderNos().then(result => this.lastOrderNos = result).catch(error => console.log(error));
    this._enumSvc.getCommonPriorityEnum().then((result: any) => this.commonPriorities = result).catch(error => console.log(error));
    this._saleSvc.getSalesOrderTypes().then(result => this.salesOrderTypes = result).catch(error => console.log(error));
    this._workstationSvc.getWorkstationUnitList().then((result: any) => { this.unitList = result; }).catch(error => console.log(error));
    this.filterActListByOrderType(null);
    // this.order.orderTypeId = 1;
    this.order.orderStatus = 'ORDER_IN_HOUSE';
    this.order.orderTypeId = 1;
    this.order.plantId = this.selectedPlant?.plantId;
    this.plantCurrency = this.selectedPlant?.currency;
    this.order.orderDetailList.forEach(itm => {
      itm.plantId = this.selectedPlant?.plantId;
      itm.plantName = this.selectedPlant?.plantName;
      
      this._stockSvc.getDetail(itm.stockId).then((result:any) =>
      {
        itm.stockManagement = result.stockManagement;
      })
      .catch(error => console.log(error));
    });


    this._actTypes.getbyPlantId_AccountPosition(this.selectedPlant?.plantId, 'CUSTOMER').then((result: any) => this.listActTypes = result).catch(error => console.log(error));

    // setTimeout(() => {
    //   if (this.imageAdderComponent && this.imageAdderComponent.length) {
    //     this.order.orderDetailList.forEach((item, index) => {
    //       this.imageAdderComponent.toArray()[index].initImages(item.orderDetailId, TableTypeEnum.SALES_ORDER_DETAIL);
    //     });
    //     // this.imageAdderComponent.initImages(this.order.orderId, TableTypeEnum.SALES_ORDER);
    //   }
    //   if(this.order.orderQuotationId && this.imageAdderComponent) {
    //       this.imageAdderComponent.initImages(this.order.orderQuotationId, TableTypeEnum.SALES_ORDER_QUOTATION);
    //   }
    // }, 300);

    this.plantCurrency = this.selectedPlant?.currency;

    this.getPlantCurrencyRate(this.selectedCustomer?.contractDto?.currency);

  }

  getSaleOrderStatusList() {
    this.orderStatusService.getOrderEnumList().then((res: any) => {
      if (res) {
        this.saleOrderStatusList = res.filter((item) => {
          return ( item === 'REQUESTED' || item === 'WAITING' || item === 'CONFIRMED' || item === 'CANCELED' ||
           item === 'ORDER_IN_HOUSE' || item === 'DOCUMENT_READY' || item === 'DOCUMENT_CONFIRMED');
        });
      }
    });
  }

  onOrderStatusChanged(event) {
    if (event) {
      this.order.orderDetailList.forEach(itm => {
        itm.orderDetailStatus = this.order.orderStatus;
      });
      if(event === 'REQUESTED') {
        this.HTS_Status = 'ORDER_IN_HOUSE';
      } else if(event === 'WAITING') {
        this.HTS_Status = 'DOC_READY';
      } else if(event === 'CONFIRMED') {
        this.HTS_Status = 'DOC_CONFIRMED';
      } else {
        this.HTS_Status = null;
      }
    }
  }
  onHTSStatusChanged(event) {

    if(event === 'ORDER_IN_HOUSE') {
      this.order.orderStatus = 'REQUESTED';
      this.onOrderStatusChanged(this.order.orderStatus);
    } else if(event === 'DOC_READY') {
      this.order.orderStatus = 'WAITING';
      this.onOrderStatusChanged(this.order.orderStatus);
    } else if(event === 'DOC_CONFIRMED') {
      this.order.orderStatus = 'CONFIRMED';
      this.onOrderStatusChanged(this.order.orderStatus);
    }

  }

  orderTypeChanged(event) {
    this.order.actTypeId = +event || null;
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
      "accountPosition": "CUSTOMER",
      "orderByDirection": "desc",
    }).then(res => {
      this.actList = res['content'];
      const act = this.actList.find((item) => item.actId == this.selectedCustomer?.actId);
      if (act) {
        this.selectedCustomer = act;
        this.order.orderDetailList.forEach(itm => {
          itm.vatRate = itm.vatRate || act.contractDto?.vat;
        });
        this.customerPriority = act.priority;
        this.order.parity = this.order.parity || act.contractDto?.parity;
      }

      this.loaderService.hideLoader();
    }).catch(err => this.loaderService.hideLoader());
  }

  setSelectedStorageLocation(event) {
    this.mainSelectedWareHouse = event;
    if(event) {
      this.order.orderDetailList.forEach(wh => {
        wh.warehouseId = event.wareHouseId;
        wh.warehouseName = event.wareHouseName;
      })
    } else {
      this.order.orderDetailList.forEach(wh => {
        wh.warehouseId = null;
        wh.warehouseName = null;
      })
    }

  }

  getSaleOrderStatusDetailList() {
    this._saleSvc.getSaleOrderStatus().then((res: any) => {
      if (res) {
        this.productTreeStatusList = res.filter((item) => {
          return (item === 'REQUESTED' || item === 'WAITING' || item === 'CONFIRMED' || item === 'CANCELED' ||
          item === 'ORDER_IN_HOUSE' || item === 'DOCUMENT_READY' || item === 'DOCUMENT_CONFIRMED');
        });
      }
    });
  }

  setSelectedCustomer(customer) {
    this.selectedCustomer = customer;
    if (customer) {
      this.order.actId = customer.actId;
      this.order.parity = customer.contractDto?.parity;
      this.language = customer.contractDto?.language;
      if(customer.actType?.actTypeId && +this.order.actTypeId !== customer.actType?.actTypeId){
        this.filterActListByOrderType(+customer.actType?.actTypeId);
      }
      this.order.actTypeId = <any> customer.actType?.actTypeId + '';
      this.customerPriority = customer.priority;
    } else {
      this.order.actId = null;
      this.customerPriority = null;
      this.language = null;
      // this.filterActListByOrderType(null);
    }
  }

  prioritySelection(event) {
    if (event) {
      this.newRequestOrderDetailCreateDto.priority = event.target.value;
    } else {
      this.newRequestOrderDetailCreateDto.priority = null;
    }
  }

  setSelectedBatch(batch) {
    if (batch) {
      this.newRequestOrderDetailCreateDto.batch = batch.batchCode;
    } else {
      this.newRequestOrderDetailCreateDto.batch = null;
    }
  }

  async save() {
    this.getOriginalTotalSalesPrice();
    // console.log(JSON.stringify(this.order));
    for await (const item of this.order.orderDetailList) {
      if(!item.warehouseId) {
        this.utilities.showWarningToast('warehouse-is-missing-in-order-items');
       return 0;
      }
    }

    if(!this.order.orderStatus) {
      this.order.orderStatus = 'ORDER_IN_HOUSE';
      this.onOrderStatusChanged(this.order.orderStatus);
    }

    if(this.order.orderDetailList.every( (val, i, arr) => val.orderDetailStatus === arr[0].orderDetailStatus ) && this.order.orderStatus !== this.order.orderDetailList[0].orderDetailStatus) {
      this.order.orderStatus = this.order.orderDetailList[0].orderDetailStatus;
    }


    if(this.order.customerOrderNo) {

      this.checkCostCenter();

    } else {
      this._confirmationSvc.confirm({
        message: this._translateSvc.instant('are-you-sure-to-save-without-customer-order-no'),
        header: this._translateSvc.instant('save-confirmation'),
        icon: 'fa fa-floppy-o',
        accept: () => {
          setTimeout(() => {
            this.checkCostCenter();
          }, 500);
        },
        reject: () => {

        }
      });
    }

  }

  checkCostCenter() {
    
    const oItem = this.order.orderDetailList.find(item => item.costCenterId === 0 || item.costCenterId === null);

    if(oItem) {
      this._confirmationSvc.confirm({
        message: this._translateSvc.instant('are-you-sure-to-save-without-cost-center'),
        header: this._translateSvc.instant('save-confirmation'),
        icon: 'fa fa-floppy-o',
        accept: () => {
          setTimeout(() => {
            this.checkCurrency();
          }, 500);
        },
        reject: () => {

        }
      })
    } else {
      this.checkCurrency();
    }

  }


  checkCurrency() {
    const oItem = this.order.orderDetailList.find(item => item.currency === null);

    if(oItem) {
      this._confirmationSvc.confirm({
        message: this._translateSvc.instant('are-you-sure-to-save-without-currency'),
        header: this._translateSvc.instant('save-confirmation'),
        icon: 'fa fa-floppy-o',
        accept: () => {
          setTimeout(() => {
            this.checkSalesOrderInItem();
          }, 500);
        },
        reject: () => {

        }
      })
    } else {
      this.checkSalesOrderInItem();
    }

  }


  checkSalesOrderInItem() {
    const oItem = this.order.orderDetailList.find(item => item.salePrice === 0 || item.salePrice === null);
    if(oItem) {
      this._confirmationSvc.confirm({
        message: this._translateSvc.instant('are-you-sure-to-save-the-sales-order-with-z-price'),
        header: this._translateSvc.instant('save-confirmation'),
        icon: 'fa fa-floppy-o',
        accept: () => {
          oItem.salePrice = 0;

          setTimeout(() => {
            this.checkReferenceId();
          }, 500);
        },
        reject: () => {

        }
      })
    } else {
      this.checkReferenceId();
    }
  }
  checkReferenceId() {
    const oItem = this.order.orderDetailList.find(item => !item.referenceId || item.referenceId === 0 || item.referenceId === null);
    if(oItem) {
      this._confirmationSvc.confirm({
        message: this._translateSvc.instant('are-you-sure-to-save-without-reference-id'),
        header: this._translateSvc.instant('save-confirmation'),
        icon: 'fa fa-floppy-o',
        accept: () => {
          this.actualSaveMethod();
        },
        reject: () => {

        }
      })
    } else {
      this.actualSaveMethod();
    }
  }



  actualSaveMethod() {

  this.order.totalSalesPrice = this.TotalSalesPrice;

    this.loaderService.showLoader();
    this.submitted = true;
    this._saleSvc.save(this.order)
    .then((orderId: any) => {
      this.loaderService.hideLoader();
      this.utilities.showSuccessToast('saved-success');
      this.saveImages(orderId);
    })
    .catch(error => {
      this.loaderService.hideLoader();
      this.submitted = false;
      this.utilities.showErrorToast(error);
    });
  }

  private saveImages(stockId) {

    this._saleSvc.getDetail(stockId).then(result => {
      this.order = result as RequestOrderCreateDto;
      this.order.orderDetailList = result['orderDetailDtoList'];


      this.order.orderDetailList.forEach((item, index) => {
        this.imageAdderComponent.toArray()[index].updateMedia(item.orderDetailId, TableTypeEnum.SALES_ORDER_DETAIL).then(() => {
            setTimeout(() => {
              this.saveAction.emit('close');
            }, environment.DELAY);
          }
          ).catch(error => this.utilities.showErrorToast(error));
      });



    }).catch(error => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(error)
    });





    // this.imageAdderComponent.updateMedia(stockId, TableTypeEnum.SALES_ORDER).then(() => {
    //   // this.utilities.showSuccessToast('saved-success');
    //   setTimeout(() => {
    //     this.saveAction.emit('close');
    //   }, environment.DELAY);
    // }
    // ).catch(error => this.utilities.showErrorToast(error));
  }

  reset() {
    this.order = new RequestOrderCreateDto();
  }

  calculatePrices() {

    // (unitNetPrice * (1 - discount%)) * (1 + vatRate%) * quantity

    if(this.newRequestOrderDetailCreateDto.discount || this.newRequestOrderDetailCreateDto.vatRate){

      // this.newRequestOrderDetailCreateDto.netPrice = ConvertUtil.getAndChecktNumber(
      //   (this.newRequestOrderDetailCreateDto.unitNetPrice * (1 - this.newRequestOrderDetailCreateDto.discount / 100)) 
      //   * (1 + this.newRequestOrderDetailCreateDto.vatRate / 100) * this.newRequestOrderDetailCreateDto.quantity
      // );

      this.newRequestOrderDetailCreateDto.netPrice = ConvertUtil.getAndChecktNumber(
        this.newRequestOrderDetailCreateDto.unitNetPrice * this.newRequestOrderDetailCreateDto.quantity
      );

      this.newRequestOrderDetailCreateDto.discountPrice= ConvertUtil.getAndChecktNumber(
        this.newRequestOrderDetailCreateDto.netPrice * this.newRequestOrderDetailCreateDto.discount / 100
      );

      this.newRequestOrderDetailCreateDto.vatPrice=ConvertUtil.getAndChecktNumber(
        (this.newRequestOrderDetailCreateDto.netPrice - this.newRequestOrderDetailCreateDto.discountPrice) * (this.newRequestOrderDetailCreateDto.vatRate /100)
      );


      // const discount = (this.newRequestOrderDetailCreateDto.discount/100) * (this.newRequestOrderDetailCreateDto.unitNetPrice*this.newRequestOrderDetailCreateDto.quantity);
      // const vat = (this.newRequestOrderDetailCreateDto.vatRate/100) * (this.newRequestOrderDetailCreateDto.unitNetPrice*this.newRequestOrderDetailCreateDto.quantity);
      // this.newRequestOrderDetailCreateDto.netPrice = ConvertUtil.getAndChecktNumber((this.newRequestOrderDetailCreateDto.unitNetPrice*this.newRequestOrderDetailCreateDto.quantity) - discount + vat);

    } else {
      this.newRequestOrderDetailCreateDto.netPrice = ConvertUtil.getAndChecktNumber(this.newRequestOrderDetailCreateDto.unitNetPrice*this.newRequestOrderDetailCreateDto.quantity);
    }
    // this.newRequestOrderDetailCreateDto.salePrice=ConvertUtil.getAndChecktNumber(this.newRequestOrderDetailCreateDto.netPrice+this.newRequestOrderDetailCreateDto.deliveryCost);
    
    if(this.newRequestOrderDetailCreateDto.deliveryCost) {
      this.newRequestOrderDetailCreateDto.salePrice=ConvertUtil.getAndChecktNumber(
        this.newRequestOrderDetailCreateDto.netPrice - this.newRequestOrderDetailCreateDto.discountPrice + this.newRequestOrderDetailCreateDto.vatPrice  
        + this.newRequestOrderDetailCreateDto.deliveryCost
      );
    } else 
    this.newRequestOrderDetailCreateDto.salePrice=ConvertUtil.getAndChecktNumber(
      this.newRequestOrderDetailCreateDto.netPrice - this.newRequestOrderDetailCreateDto.discountPrice + this.newRequestOrderDetailCreateDto.vatPrice  
    );

    if(this.newRequestOrderDetailCreateDto.currency && this.plantCurrency && (this.newRequestOrderDetailCreateDto.currency!= this.plantCurrency) ){
      // this.getPlantCurrencyItemRate(this.newRequestOrderDetailCreateDto.currency);
         if(this.plantCurrencyItemRate) {
           this.newRequestOrderDetailCreateDto.originalSalesPrice = this.newRequestOrderDetailCreateDto.salePrice * this.plantCurrencyItemRate;
         }
        
 
     } else  this.newRequestOrderDetailCreateDto.originalSalesPrice = this.newRequestOrderDetailCreateDto.salePrice;

    
  }

  async getPlantCurrencyRate(currency) {

    if (this.selectedPlant?.currency) {
      let data = {
        currencyRecordId: null,
        fromCurrencyCode: currency,
        pageNumber: 1,
        pageSize: 10,
        plantId: this.selectedPlant?.plantId,
        rate: null,
        toCurrencyCode: this.plantCurrency
      }

      if(data) {
        const result = await this.exChangeRateSvc.filterObservable(data).toPromise();

        if (result['content'] && result['content'].length) {
          this.plantCurrencyItemRate = result['content'][0].rate;
        } 

      } 
    }
  }
  


  calculateUnitNetPrice() {

    this.newRequestOrderDetailCreateDto.unitNetPrice=ConvertUtil.getAndChecktNumber(this.newRequestOrderDetailCreateDto.netPrice/this.newRequestOrderDetailCreateDto.quantity);
    this.calculatePrices();
  }




  get totalDiscountExplaination() {
    if(this.newRequestOrderDetailCreateDto.discount) {
      return '(' + this.newRequestOrderDetailCreateDto.discount +  '/ 100)' +
        ' * ' + '(' + this.newRequestOrderDetailCreateDto.unitNetPrice + ' * ' +
        this.newRequestOrderDetailCreateDto.quantity + ') =' + this.newRequestOrderDetailCreateDto.netPrice;
    } else {
      return '';
    }

  }




  get discountPrice() {
    if(this.newRequestOrderDetailCreateDto.discount) {
      this.newRequestOrderDetailCreateDto.discountPrice = ConvertUtil.getAndChecktNumber(
        (this.newRequestOrderDetailCreateDto.netPrice) * (this.newRequestOrderDetailCreateDto.discount/100));
      return this.newRequestOrderDetailCreateDto.discountPrice;
    } else {
      this.newRequestOrderDetailCreateDto.discountPrice = 0;
      return 0;
    }
  }

  get vatPrice() {
    if(this.newRequestOrderDetailCreateDto.vatRate) {
      // this.newRequestOrderDetailCreateDto.vatPrice = ConvertUtil.getAndChecktNumber((
      //   (this.newRequestOrderDetailCreateDto.unitNetPrice*this.newRequestOrderDetailCreateDto.quantity) - 
      //   (this.newRequestOrderDetailCreateDto.discountPrice || 0) ) * 
      //   (this.newRequestOrderDetailCreateDto.vatRate/100)
      // );

      this.newRequestOrderDetailCreateDto.vatPrice = ConvertUtil.getAndChecktNumber((
        (this.newRequestOrderDetailCreateDto.netPrice - this.newRequestOrderDetailCreateDto.discountPrice) * 
        (this.newRequestOrderDetailCreateDto.vatRate /100) || 0
      ));



      return this.newRequestOrderDetailCreateDto.vatPrice || 0;
    } else {
      this.newRequestOrderDetailCreateDto.vatPrice = 0;
      return 0;
    }


  }

  setCustomer(customer) {
    const cloneOfCustomer = Object.assign({}, customer);
    this.actList.push(cloneOfCustomer);
    this.order.actId = cloneOfCustomer.actId;
    this.selectedCustomer = cloneOfCustomer;
  }


  openSaleOrderDetailsModal(index) {
   
    // this.myModal.show();
    // this.getStockItems();
    this.selectedDetailIndex = index;
    this.selectedMaterialCurrency = null;
    this.exChangeRate = 1;
    this.materialCurrentPrice = null;
    if (this.selectedDetailIndex < 0) {
      // new
      this.resetNewItemDetails();
      
      this.newRequestOrderDetailCreateDto.priority = this.customerPriority || 'MEDIUM';
      this.newRequestOrderDetailCreateDto.warehouseId = this.mainSelectedWareHouse?.wareHouseId || null;
      this.newRequestOrderDetailCreateDto.warehouseName = this.mainSelectedWareHouse?.wareHouseName || null;
      this.newRequestOrderDetailCreateDto.orderDetailStatus = this.order.orderStatus || 'ORDER_IN_HOUSE';
      // this.newRequestOrderDetailCreateDto.deliveryDate = moment(new Date()).add(7*7, 'days').toDate();
      this.newRequestOrderDetailCreateDto.deliveryDate = new Date();
      this.newRequestOrderDetailCreateDto.deliveryDate.setTime(new Date().getTime() + (7 * 7 * 24 * 60 * 60 * 1000));     
      this.newRequestOrderDetailCreateDto.currency = this.selectedCustomer?.contractDto?.currency || null;
      this.newRequestOrderDetailCreateDto.vatRate = this.selectedCustomer?.contractDto?.vat || null;
      this.newRequestOrderDetailCreateDto.discount = this.selectedCustomer?.contractDto?.discount || null;
      
    } else {
      // edit
      this.newRequestOrderDetailCreateDto = Object.assign({}, this.order.orderDetailList[index]);
      this.newRequestOrderDetailCreateDto.deliveryDate = this.newRequestOrderDetailCreateDto.deliveryDate ?  new Date(this.newRequestOrderDetailCreateDto.deliveryDate) : null;
      this.newRequestOrderDetailCreateDto.shipmentDate = this.newRequestOrderDetailCreateDto.shipmentDate ? new Date(this.newRequestOrderDetailCreateDto.shipmentDate) : null;
      if(this.newRequestOrderDetailCreateDto.stockId) {
        this._stockSvc.getDetail(this.newRequestOrderDetailCreateDto.stockId).then((result: any) => {
          this.selectedMaterialCurrency = result?.stockCosting?.currencyCode || null;
          this.materialCurrentPrice = result?.stockCostEstimate?.currentPrice || null;
          if(this.selectedMaterialCurrency && this.selectedCustomer?.contractDto?.currency) {
            if(this.selectedMaterialCurrency !== this.selectedCustomer?.contractDto?.currency) {
              this.findExchangeRate(this.selectedCustomer?.contractDto?.currency,
                this.selectedMaterialCurrency);
            }
          }
        }).catch(error => {
          console.log(error);
        });
      }
      // if(!(this.unitList.length > 0) || (this.unitList.filter(item => item.stockId ===this.newRequestOrderDetailCreateDto.stockId).length === 0)) {
      //   this._stockSvc.metarialActiveUnits(this.newRequestOrderDetailCreateDto.stockId).then((result: any) => {
      //     this.unitList = result;
      //   }).catch(error => console.log(error));
      // }
    }

    this.params.dialog.title = 'Sale Order Details';
    this.params.dialog.visible = true;
  }

  clearReferenceId() {
    if(this.newRequestOrderDetailCreateDto.referenceId) {
      this.newRequestOrderDetailCreateDto.referenceId = null;
      if(this.selectedDetailIndex !== -1) {
        for (let index = this.selectedDetailIndex; index < this.order.orderDetailList.length; index++) {
          const orderItem = this.order.orderDetailList[index];
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

  addAndIncrementReferenceId() {
    if(this.newRequestOrderDetailCreateDto.referenceId) {
      return 0;
    }
    if(this.order.orderDetailList && this.order.orderDetailList.length) {
      let lastIndex = this.order.orderDetailList.length;
      while (lastIndex-- && !this.order.orderDetailList[lastIndex].referenceId);
      const prevReferenceId = <any> (this.order.orderDetailList[(lastIndex === -1)? 0 : lastIndex].referenceId || '') + '';
      if(prevReferenceId && prevReferenceId.length > 0) {
        const splittedReferenceId = prevReferenceId.split('');
        if(parseInt(splittedReferenceId[splittedReferenceId.length - 1]) < 9) {
          this.newRequestOrderDetailCreateDto.referenceId = <any> prevReferenceId.substring(0, splittedReferenceId.length - 1) + (parseInt(splittedReferenceId[splittedReferenceId.length - 1]) + 1);
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
          this.newRequestOrderDetailCreateDto.referenceId = <any> splittedReferenceId.join('');
        }
      } else {
        this.addUniqueCode();
      }
    } else {
      this.addUniqueCode();
    }
  }

  onMaterialChange(event) {
    if (event.value) {
      this.newRequestOrderDetailCreateDto.stockId = event.value.stockId;
      this.newRequestOrderDetailCreateDto.stockNo = event.value.stockNo;
      this.newRequestOrderDetailCreateDto.stockName = event.value.stockName;
      this.newRequestOrderDetailCreateDto.unit = event.value.baseUnit;
      this.newRequestOrderDetailCreateDto.batch = event.value.batch;
    } else {
      this.newRequestOrderDetailCreateDto.stockName = null;
      this.newRequestOrderDetailCreateDto.stockNo = null;
      this.newRequestOrderDetailCreateDto.unit = null;
    }
  }

  selectMaterialChanged(event) {
    if (event) {
      this.newRequestOrderDetailCreateDto.stockId = event.stockId;
      this.newRequestOrderDetailCreateDto.stockName = event.stockName;
      this.newRequestOrderDetailCreateDto.stockName2 = event.stockName2;
      this.newRequestOrderDetailCreateDto.stockName3 = event.stockName3;
      this.newRequestOrderDetailCreateDto.stockNo = event.stockNo;
      this.newRequestOrderDetailCreateDto.unit = event.baseUnit;
      this.newRequestOrderDetailCreateDto.batch = event.batch;
      this.newRequestOrderDetailCreateDto.height = event.height;
      this.newRequestOrderDetailCreateDto.stockManagement= event.stockManagement;
      if(!event.stockManagement) {
        if(!this.newRequestOrderDetailCreateDto.referenceId) {
          this.addAndIncrementReferenceId();
        }
      } else {
        this.newRequestOrderDetailCreateDto.referenceId = null;
      }
      // if(this.newRequestOrderDetailCreateDto.salePrice) {
      // //  this.newRequestOrderDetailCreateDto.discount=0;
      //   if(this.newRequestOrderDetailCreateDto.quantity) {
      //     this.calculatePrices();
      //   } else {
      //     this.newRequestOrderDetailCreateDto.unitNetPrice= this.newRequestOrderDetailCreateDto.salePrice;
      //   }
      // }
        
      // } else if (event.stockCostEstimate?.currentPrice) {
      //   this.newRequestOrderDetailCreateDto.unitNetPrice = event.stockCostEstimate?.currentPrice;
      //   this.calculatePrices();
      // }
      //  else {
      //   this.newRequestOrderDetailCreateDto.netPrice = 0;
      //   this.newRequestOrderDetailCreateDto.unitNetPrice = 0;
      // }
      this.selectedMaterialCurrency = event.stockCosting?.currencyCode || null;
      if(this.selectedMaterialCurrency && this.selectedCustomer?.contractDto?.currency) {
        if(this.selectedMaterialCurrency !== this.selectedCustomer?.contractDto?.currency) {
          this.materialCurrentPrice = event.stockCostEstimate?.currentPrice || null;
          this.findExchangeRate(this.selectedCustomer?.contractDto?.currency,
            this.selectedMaterialCurrency);
        } else {
          this.materialCurrentPrice = event.stockCostEstimate?.currentPrice || null;
          this.newRequestOrderDetailCreateDto.unitNetPrice = event.stockCostEstimate?.currentPrice;
          this.calculatePrices();
        }
      } else {
        this.materialCurrentPrice = event.stockCostEstimate?.currentPrice || null;
        this.newRequestOrderDetailCreateDto.unitNetPrice = event.stockCostEstimate?.currentPrice;
        this.calculatePrices();
      }
      this.newRequestOrderDetailCreateDto.width = event.width;
      this.newRequestOrderDetailCreateDto.dimensionUnit = event.dimensionUnit;
      this.newRequestOrderDetailCreateDto.costCenterId = event.stockCosting?.costCenter?.costCenterId || null;
      this.newRequestOrderDetailCreateDto.costCenterName = event.stockCosting?.costCenter?.costCenterName || null;
      if(event.salesOrderWarehouseId) {
        this.newRequestOrderDetailCreateDto.warehouseId = event.salesOrderWarehouseId?.wareHouseId;
        this.newRequestOrderDetailCreateDto.warehouseName = event.salesOrderWarehouseId?.wareHouseName;
      }
      this._stockSvc.metarialActiveUnits(this.newRequestOrderDetailCreateDto.stockId).then((result: any) => {
          this.unitList = result;
        }).catch(error => console.log(error));
    } else {
      this.newRequestOrderDetailCreateDto.stockName = null;
      this.newRequestOrderDetailCreateDto.stockNo = null;
      this.newRequestOrderDetailCreateDto.unit = null;
    }
  }

  findExchangeRate(fromCurrencyCode, toCurrencyCode) {
    this.exChangeRateSvc.filterObservable({
      currencyRecordId: null,
      fromCurrencyCode: fromCurrencyCode,
      pageNumber: 1,
      pageSize: 10,
      rate: null,
      toCurrencyCode: toCurrencyCode
    }).subscribe(async result => {
      if(result['content'] && result['content'].length) {
        this.exChangeRate = result['content'][0].rate || 1;
        if(this.materialCurrentPrice) {
          const res = await this.exChangeRateSvc.filterObservable({currencyRecordId: null,fromCurrencyCode: toCurrencyCode,pageNumber: 1,pageSize: 10,rate: null,toCurrencyCode: fromCurrencyCode}).toPromise();
          if(res['content'] && res['content'].length) {
            const inVerseRate = res['content'][0].rate || 1;
            if(this.selectedDetailIndex < 0) {
              this.newRequestOrderDetailCreateDto.unitNetPrice = ConvertUtil.getAndChecktNumber(this.materialCurrentPrice * inVerseRate);
              this.calculatePrices();
            }
          }
        }
      } else {
        this.exChangeRate = 1;
      }
    }, err => {
      console.log(err);
      this.exChangeRate = 1;
    });
  }

  onSelectCurrency(event) {
    if(event) {
      this.newRequestOrderDetailCreateDto.currency=event?.currencyCode;
      if(this.selectedMaterialCurrency && this.newRequestOrderDetailCreateDto.currency) {
        if(this.selectedMaterialCurrency !== this.newRequestOrderDetailCreateDto.currency) {
          this.findExchangeRate(this.newRequestOrderDetailCreateDto.currency,
            this.selectedMaterialCurrency);
        } else {
          this.exChangeRate = 1;
          this.newRequestOrderDetailCreateDto.unitNetPrice = this.materialCurrentPrice || 0;
        }
      }
    } else {
      this.newRequestOrderDetailCreateDto.currency = null;
    }

  }

  onWareHouseChange(event) {
    // console.log(event);
    const detailItem = this.warehouseList.find(item => item.wareHouseId === +event);
    this.newRequestOrderDetailCreateDto.warehouseName = detailItem.wareHouseName;
  }

  setSelectedPlant(event) {
    this.wareHouse = null;
    if (event) {
      // this.selectedPlant = event;
      // this.order.plantId = event.plantId;
      this.newRequestOrderDetailCreateDto.plantId = event.plantId;
      this.newRequestOrderDetailCreateDto.plantName = event.plantName;
    } else {
      this.newRequestOrderDetailCreateDto.plantId = null;
      this.newRequestOrderDetailCreateDto.plantName = null;
    }
  }

  isNullMaterial = () => {
    return this.order.orderDetailList.filter(itm => itm.stockId === null || itm.stockNo === null).length>0 ? true: false;
  }
  setSelectedWarehouse(event) {
    // console.log('@s!!', event);
    // this.workStation.wareHouse = event;
    // this.onWareHouseChange(event);
    this.wareHouse = event;
    // this.stockList = event.wareHouseStockDtoList;
    if (event && event.hasOwnProperty('wareHouseId')) {
      this.newRequestOrderDetailCreateDto.warehouseId = event.wareHouseId;
      this.newRequestOrderDetailCreateDto.warehouseName = event.wareHouseName;
    } else {
      // this.workStation.warehouseId = null;
      this.newRequestOrderDetailCreateDto.warehouseId = null;
      this.newRequestOrderDetailCreateDto.warehouseName = null;
    }
  }

  addDetails() {
    const cloneOfNewOrderDetailListItem = Object.assign({}, this.newRequestOrderDetailCreateDto);
    if (this.selectedDetailIndex < 0) {
      // add
      this.order.orderDetailList.push(cloneOfNewOrderDetailListItem);
    } else {
      // update
      this.order.orderDetailList[this.selectedDetailIndex] = cloneOfNewOrderDetailListItem;
    }
    this.params.dialog.visible = false;
    this.wareHouse = null;
    if(this.order.orderDetailList.every(i => i.warehouseId === this.order.orderDetailList[0]?.warehouseId)) {

      this.mainSelectedWareHouse =  {
        wareHouseId: this.order.orderDetailList[0]?.warehouseId,
        wareHouseName: this.order.orderDetailList[0]?.warehouseName
      }
    } else {
      this.mainSelectedWareHouse = null;
    }

  }






  async getOriginalTotalSalesPrice () {

    let data = {
      currencyRecordId: null,
      fromCurrencyCode: this.selectedCustomer?.contractDto?.currency,
      pageNumber: 1,
      pageSize: 10,
      plantId: this.selectedPlant?.plantId,
      rate: null,
      toCurrencyCode: this.plantCurrency
    }
if(this.selectedCustomer?.contractDto?.currency) {
  const result = await this.exChangeRateSvc.filterObservable(data).toPromise();

  if(result['content'] && result['content'].length) {
    const exRate = result['content'][0].rate || 1;
    
    this.order.originalTotalSalesPrice = this.order.totalSalesPrice * exRate ;
  }  else this.order.originalTotalSalesPrice = this.order.totalSalesPrice ;
}
    else this.order.originalTotalSalesPrice = this.order.totalSalesPrice ;
      
    
  }


  get TotalSalesPrice() {
    this.order.totalSalesPrice = this.order.orderDetailList.reduce((total, item) => total + item.salePrice, 0) || 0;
    return this.order.totalSalesPrice;
  }
  get TotalVatPrice() {
    this.order.totalVatPrice = this.order.orderDetailList.reduce((total, item) => total + item.vatPrice, 0);
    return this.order.totalVatPrice;
  }
  get TotalDiscountPrice() {
    this.order.totalDiscountPrice = this.order.orderDetailList.reduce((total, item) => total + item.discountPrice, 0);
    return this.order.totalDiscountPrice;
  }
  get TotalNetPrice() {
    this.order.totalNetPrice = this.order.orderDetailList.reduce((total, item) => total + item.netPrice, 0);
    return this.order.totalNetPrice;
  }

  resetNewItemDetails() {
    this.newRequestOrderDetailCreateDto = new RequestOrderDetailCreateDto();
    this.newRequestOrderDetailCreateDto.plantId = this.selectedPlant ? this.selectedPlant.plantId : null;
    this.newRequestOrderDetailCreateDto.plantName = this.selectedPlant ? this.selectedPlant.plantName : null;
    this.newRequestOrderDetailCreateDto.warehouseId = null;
    this.wareHouse = null;
  }

  addUniqueCode() {
    this.loaderService.showLoader();
    this._saleSvc.getUniqueCode(this.selectedPlant.plantId, CommonCodeGeneration.SALE_ORDER).then((result: any) => {
      this.loaderService.hideLoader();
      this.newRequestOrderDetailCreateDto.referenceId = result;
    }).catch(error => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(error, 'Something went wrong!');
      console.log(error);
    });
  }

  

  deleteDetailItemFromList(index) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this.order.orderDetailList.splice(index, 1);
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    })
  }

}
