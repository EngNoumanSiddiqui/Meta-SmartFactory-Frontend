import { UsersService } from 'app/services/users/users.service';
import { Component, EventEmitter, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
import { Subject } from 'rxjs';
import { ActService } from 'app/services/dto-services/act/act.service';
import { Router } from '@angular/router';
import { StockCardService } from 'app/services/dto-services/stock/stock.service';
import { WorkstationService } from 'app/services/dto-services/workstation/workstation.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { ConfirmationService } from 'primeng';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'environments/environment';
import { SalesOrderQuotationsService } from 'app/services/dto-services/sales-order-quotations/sales-order-quotations.service';
import { CreateOrderQuotationDetailList, CreateSalesQuotations } from 'app/dto/sale-order/sale-order-quotation.model';
import { ActTypeService } from 'app/services/dto-services/act-type/act-type.service';
import { ImageAdderComponent } from 'app/views/image/image-adder/image-adder.component';
import { TableTypeEnum } from 'app/dto/table-type-enum';
import { ConvertUtil } from 'app/util/convert-util';
import { ExchangeRateService } from 'app/services/dto-services/exchange-rates/exchange-rates.service';
@Component({
  selector: 'sales-quotations-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewSaleQuotationsComponent implements OnInit {

  @ViewChildren(ImageAdderComponent) imageAdderComponent: QueryList<ImageAdderComponent>;
  wareHouse: any;

  preSelectedPlant: any;

  @Output() saveAction = new EventEmitter<any>();
  @Output() saveAndCreateAction = new EventEmitter<any>();

  order: CreateSalesQuotations = new CreateSalesQuotations();

  newRequestOrderDetailCreateDto: CreateOrderQuotationDetailList = new CreateOrderQuotationDetailList();

  params = {
    dialog: { title: '', inputValue: '', visible: false }
  };

  actList;
  totalSalesPrice : 0;
  HTS_Status = 'CALCULATING_COST';
  HTS_StatusList = ['CALCULATING_COST', 'COST_CONFIRMED', 'OFFER_SENT', 'OFFER_EXPIRED' ]

  lastOrderNos;

  includeMaterials = [2, 3, 13, 16];

  private searchTerms = new Subject<any>();

  salesOrderTypes;

  unitList;

  plantList: any;

  warehouseList;

  modal = { active: false };

  productTreeStatusList: any[] = [];

  saleOrderStatusList: any[] = [];

  selectedDetailIndex = -1;

  selectedCustomer;

  selectedPlant: any;

  todayDate = new Date();

  commonPriorities = [];

  customerPriority: string = null;
  listActTypes: any;
  submitted: boolean = false;
  language: any;
  selectedMaterialCurrency = null;
  exChangeRate: number = 1;
  materialCurrentPrice = null;

  constructor(private _actSvc: ActService,
    private _actTypes: ActTypeService,
    private _router: Router,
    private _saleSvc: SalesOrderQuotationsService,
    private _stockSvc: StockCardService,
    private _workstationSvc: WorkstationService,
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private exChangeRateSvc: ExchangeRateService,
    private userSvc: UsersService,
    private _confirmationSvc: ConfirmationService,
    private _translateSvc: TranslateService,
    private _enumSvc: EnumService) {

    this.selectedPlant = JSON.parse(this.userSvc.getPlant());

    // if(this.selectedPlant.plantId === 91) {

    // }

  }

  ngOnInit() {

    // this.getSaleOrderStatusList();
    this.getSaleOrderStatusDetailList();
    // this._saleSvc.getLastOrderNos().then(result => this.lastOrderNos = result).catch(error => console.log(error));
    this._enumSvc.getCommonPriorityEnum().then((result: any) => this.commonPriorities = result).catch(error => console.log(error));
    // this._saleSvc.getSalesOrderTypes().then(result => this.salesOrderTypes = result).catch(error => console.log(error));
    this._workstationSvc.getWorkstationUnitList().then(result => { this.unitList = result; }).catch(error => console.log(error));
    // this._actSvc.getActCustomerByPlantId(this.selectedPlant?.plantId).then(result => this.actList = result).catch(error => console.log(error));
    this.filterActListByOrderType(null);
    // this.order.orderTypeId = 1;
    this.order.orderQuotationStatus = 'CALCULATING_COST';
    this.order.quotationDate = new Date();

    // this._actTypes.getbyPlantId_AccountPosition(this.selectedPlant?.plantId, 'CUSTOMER').then((result: any) => this.listActTypes = result).catch(error => console.log(error));

    this.order.validTo = new Date();
    this.order.validTo.setDate(this.order.validTo.getDate() + 3);
    this.order.deliveryDate = new Date();
    this.order.deliveryDate.setTime(new Date().getTime() + (7 * 7 * 24 * 60 * 60 * 1000));
  }

  // getSaleOrderStatusList() {
  //   this.orderStatusService.getOrderEnumList().then((res: any) => {
  //     if (res) {
  //       this.saleOrderStatusList = res.
  //     }
  //   });
  // }

  getSaleOrderStatusDetailList() {
    this._saleSvc.getSaleQuotationsStatus().then((res: any) => {
      if (res) {
        res = res.filter((item) => {
          return (item === 'CALCULATING_COST' ||  item === 'COST_CONFIRMED' || item === 'CONFIRMED' ||
          item === 'CANCELLED'  || item === 'OFFER_SENT' || item === 'OFFER_EXPIRED');
        });
        if(this.selectedPlant?.plantId === 9999) { //INSTEAD OF 91. REMOVE ALL HTS CHANGES
          res = ['COST_CONFIRMED', ...res]
        }
        this.productTreeStatusList = res;
        this.saleOrderStatusList = res;
      }
    });
  }



  orderTypeChanged(event) {
    if(event) {
      this.actList = [];
      this.order.actTypeId = event?.actTypeId;
      this.order.actTypeName = event?.actTypeName;
      this.filterActListByOrderType(event.actTypeId);
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
      this.loaderService.hideLoader();
    }).catch(err => this.loaderService.hideLoader());
  }

  setSelectedCustomer(customer) {
    if (customer) {
      this.selectedCustomer = customer;
      this.order.actId = customer.actId;
      this.order.parity = customer.contractDto?.parity;
      this.language = customer.contractDto?.language;
      this.customerPriority = customer.priority;
      this.order.actTypeId = <any> (customer.actType?.actTypeId + '');
      this.order.actTypeName = <any> (customer.actType?.actTypeName + '');
    } else {
      this.order.actId = null;
      this.selectedCustomer = null;
      this.language = null;
      this.customerPriority = null;
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
    if(this.newRequestOrderDetailCreateDto.vat) {

      this.newRequestOrderDetailCreateDto.vatPrice = ConvertUtil.getAndChecktNumber((
        (this.newRequestOrderDetailCreateDto.netPrice - this.newRequestOrderDetailCreateDto.discountPrice) * 
        (this.newRequestOrderDetailCreateDto.vat /100) || 0
      ));

      return this.newRequestOrderDetailCreateDto.vatPrice || 0;
    } else {
      this.newRequestOrderDetailCreateDto.vatPrice = 0;
      return 0;
    }
  }

  prioritySelection(event) {
    if (event) {
      this.newRequestOrderDetailCreateDto.priority = event.target.value;
    } else {
      this.newRequestOrderDetailCreateDto.priority = null;
    }
  }

  // setSelectedBatch(batch) {
  //   if (batch) {
  //     this.newRequestOrderDetailCreateDto.batch = batch.batchCode;
  //   } else {
  //     this.newRequestOrderDetailCreateDto.batch = null;
  //   }
  // }

  onOrderStatusChanged(event) {
    if (event) {

      if(event==='REQUESTED') {
        this.HTS_Status = 'CALCULATING_COST';
      } else if(event==='COST_CONFIRMED') {
        this.HTS_Status = 'COST_CONFIRMED';
      } else if(event==='CONFIRMED') {
        this.HTS_Status = 'OFFER_SENT';
      } else {
        this.HTS_Status = null;
      }

      this.order.orderQuotationDetailList.forEach(itm => {
        itm.orderDetailQuotationStatus = this.order.orderQuotationStatus;
      });
    }
  }
  onHTSStatusChanged(event) {

    if(event === 'CALCULATING_COST') {
      this.order.orderQuotationStatus = 'REQUESTED';
      this.onOrderStatusChanged(this.order.orderQuotationStatus);
    } else if(event === 'OFFER_SENT') {
      this.order.orderQuotationStatus = 'CONFIRMED';
      this.onOrderStatusChanged(this.order.orderQuotationStatus);
    } else if(event === 'COST_CONFIRMED') {
      this.order.orderQuotationStatus = 'COST_CONFIRMED';
      this.onOrderStatusChanged(this.order.orderQuotationStatus);
    }

  }
  onDeliveryChanged(event) {
    if (event) {
      this.order.orderQuotationDetailList.forEach(itm => {
        itm.deliveryDate = this.order.deliveryDate;
      });
    }
  }
  save() {
    // console.log(JSON.stringify(this.order));
    this.order.totalSalesPrice= this.TotalSalesPrice;
    this.checkNetPrice();
  }

  checkNetPrice() {
    const oItem = this.order.orderQuotationDetailList.find(item => !item.netPrice || item.netPrice === 0 || item.netPrice === null);
    if(oItem) {
      this._confirmationSvc.confirm({
        message: this._translateSvc.instant('are-you-sure-to-save-without-net-price'),
        header: this._translateSvc.instant('save-confirmation'),
        icon: 'fa fa-floppy-o',

        accept: () => {
          setTimeout(() => {
            this.checkCostCenter();
          }, 500);
        },
        reject: () => {

        }
      })
    } else {
      this.checkCostCenter();
    }
  }

  checkCostCenter() {
    
    const oItem = this.order.orderQuotationDetailList.find(item => item.costCenterId === 0 || item.costCenterId === null);

    if(oItem) {
      this._confirmationSvc.confirm({
        message: this._translateSvc.instant('are-you-sure-to-save-without-cost-center'),
        header: this._translateSvc.instant('save-confirmation'),
        icon: 'fa fa-floppy-o',
        accept: () => {
          setTimeout(() => {
            this.actualSaveMethod();
          }, 500);
        },
        reject: () => {

        }
      })
    } else {
      this.actualSaveMethod();
    }

  }

  actualSaveMethod() {

    this.loaderService.showLoader();
    this.submitted = true;
    this._saleSvc.save(this.order)
      .then((res: any) => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        this.saveImages(res.quotationId, res);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.submitted = false;
        this.utilities.showErrorToast(error);
      });
  }
  private saveImages(quotationId, res, isSaveOnly= true) {

    this._saleSvc.getDetail(quotationId).then(result => {
      this.order = result as any;
      this.order.orderQuotationDetailList.forEach((item, index) => {
        this.imageAdderComponent.toArray()[index].updateMedia(item.quotationDetailId, TableTypeEnum.SALES_QUOTATION_DETAIL).then(() => {
          setTimeout(() => {
            if(isSaveOnly) {
            this.saveAction.emit('close');
            } else {
              this.saveAndCreateAction.emit(res);
            }
          }, environment.DELAY);
        }
        ).catch(error => this.utilities.showErrorToast(error));
      });

    }).catch(error => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(error)
    });

    // this.imageAdderComponent.updateMedia(quotationId, TableTypeEnum.SALES_ORDER_QUOTATION).then(() => {
    //   // this.utilities.showSuccessToast('saved-success');
    //   setTimeout(() => {
    //     this.saveAction.emit('close');
    //   }, environment.DELAY);
    // }
    // ).catch(error => this.utilities.showErrorToast(error));
  }

  // calculatePrices() {
  //   if(this.newRequestOrderDetailCreateDto.discount || this.newRequestOrderDetailCreateDto.vat){
  //     const discount = (this.newRequestOrderDetailCreateDto.discount/100) * (this.newRequestOrderDetailCreateDto.unitNetPrice*this.newRequestOrderDetailCreateDto.quantity);
  //     const vat = (this.newRequestOrderDetailCreateDto.vat/100) * (this.newRequestOrderDetailCreateDto.unitNetPrice*this.newRequestOrderDetailCreateDto.quantity);
  //     // this.newRequestOrderDetailCreateDto.netPrice = ConvertUtil.getAndChecktNumber((this.newRequestOrderDetailCreateDto.unitNetPrice*this.newRequestOrderDetailCreateDto.quantity) - discount);
  //     this.newRequestOrderDetailCreateDto.netPrice = ConvertUtil.getAndChecktNumber((this.newRequestOrderDetailCreateDto.unitNetPrice*this.newRequestOrderDetailCreateDto.quantity) - discount + vat);
      

  //   } else {
  //     this.newRequestOrderDetailCreateDto.netPrice = ConvertUtil.getAndChecktNumber(this.newRequestOrderDetailCreateDto.unitNetPrice*this.newRequestOrderDetailCreateDto.quantity);
  //   }
  //   this.newRequestOrderDetailCreateDto.salePrice=ConvertUtil.getAndChecktNumber(this.newRequestOrderDetailCreateDto.netPrice+this.newRequestOrderDetailCreateDto.deliveryCost);
  // }
  calculatePrices() {

    if(this.newRequestOrderDetailCreateDto.discount || this.newRequestOrderDetailCreateDto.vat){
        this.newRequestOrderDetailCreateDto.netPrice = ConvertUtil.getAndChecktNumber(
          this.newRequestOrderDetailCreateDto.unitNetPrice * this.newRequestOrderDetailCreateDto.quantity
        );
      



      this.newRequestOrderDetailCreateDto.discountPrice= ConvertUtil.getAndChecktNumber(
        this.newRequestOrderDetailCreateDto.netPrice * this.newRequestOrderDetailCreateDto.discount / 100
      );

      this.newRequestOrderDetailCreateDto.vatPrice=ConvertUtil.getAndChecktNumber(
        (this.newRequestOrderDetailCreateDto.netPrice - this.newRequestOrderDetailCreateDto.discountPrice) * (this.newRequestOrderDetailCreateDto.vat /100)
      );



      
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
  saveAndCreate() {
    // console.log(JSON.stringify(this.order));
    this.loaderService.showLoader();
    this._saleSvc.save(this.order)
      .then((res:any) => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        this.saveImages(res.quotationId, res, false);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }

  reset() {
    this.order = new CreateSalesQuotations();
  }


  setCustomer(customer) {
    const cloneOfCustomer = Object.assign({}, customer);
    this.actList.push(cloneOfCustomer);
    this.order.actId = cloneOfCustomer.actId;
    this.selectedCustomer = cloneOfCustomer;
  }


  openSaleOrderDetailsModal(index) {
    this.params.dialog.title = 'Sale Order Details';
    this.params.dialog.visible = true;
    // this.myModal.show();
    // this.getStockItems();
    this.selectedMaterialCurrency = null;
    this.exChangeRate = 1;
    this.materialCurrentPrice = null;

    this.selectedDetailIndex = index;
    if (this.selectedDetailIndex < 0) {
      // new
      this.resetNewItemDetails();
      this.newRequestOrderDetailCreateDto.priority = this.customerPriority;
      this.newRequestOrderDetailCreateDto.discount= this.selectedCustomer?.contractDto?.discount || 0;
      this.newRequestOrderDetailCreateDto.vat= this.selectedCustomer?.contractDto?.vat || 0;
      this.newRequestOrderDetailCreateDto.orderDetailQuotationStatus = this.order.orderQuotationStatus || 'CALCULATING_COST';
      this.newRequestOrderDetailCreateDto.currency = this.selectedCustomer?.contractDto?.currency || null;
      this.newRequestOrderDetailCreateDto.deliveryDate = this.order.deliveryDate 
      || this.newRequestOrderDetailCreateDto.deliveryDate.setTime(new Date().getTime() + (7 * 7 * 24 * 60 * 60 * 1000));
    } else {
      // edit
      this.newRequestOrderDetailCreateDto = Object.assign({}, this.order.orderQuotationDetailList[index]);
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
    }
  }

  onMaterialChange(event) {
    if (event.value) {
      this.newRequestOrderDetailCreateDto.stockId = event.value.stockId;
      this.newRequestOrderDetailCreateDto.stockNo = event.value.stockNo;
      this.newRequestOrderDetailCreateDto.stockName = event.value.stockName;
      this.newRequestOrderDetailCreateDto.baseUnit = event.value.baseUnit;
      this.newRequestOrderDetailCreateDto.dimensionUnit = event.value.baseUnit;
      // this.newRequestOrderDetailCreateDto.batch = event.value.batch;
    } else {
      this.newRequestOrderDetailCreateDto.stockName = null;
      this.newRequestOrderDetailCreateDto.stockNo = null;
      // this.newRequestOrderDetailCreateDto.unit = null;
    }
  }

  selectMaterialChanged(event) {
    if (event) {
      this.newRequestOrderDetailCreateDto.stockId = event.stockId;
      this.newRequestOrderDetailCreateDto.stockName = event.stockName;
      this.newRequestOrderDetailCreateDto.stockName2 = event.stockName2;
      this.newRequestOrderDetailCreateDto.stockName3 = event.stockName3;
      this.newRequestOrderDetailCreateDto.stockNo = event.stockNo;
      this.newRequestOrderDetailCreateDto.baseUnit = event.baseUnit;
      this.newRequestOrderDetailCreateDto.dimensionUnit = event.dimensionUnit;
      this.newRequestOrderDetailCreateDto.costCenterId = event.stockCosting?.costCenter?.costCenterId || null;
      this.newRequestOrderDetailCreateDto.height = event.height;
      this.newRequestOrderDetailCreateDto.width = event.width;
      this.newRequestOrderDetailCreateDto.dimensionUnit = event.dimensionUnit;
      this._stockSvc.metarialActiveUnits(this.newRequestOrderDetailCreateDto.stockId).then((result: any) => {
          this.unitList = result;
        }).catch(error => console.log(error));

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
  
    } else {
      this.newRequestOrderDetailCreateDto.stockName = null;
      this.newRequestOrderDetailCreateDto.stockNo = null;
      this.newRequestOrderDetailCreateDto.baseUnit = null;
      this.newRequestOrderDetailCreateDto.dimensionUnit = null;
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
  }

  // onWareHouseChange(event) {
  //   // console.log(event);
  //   const detailItem = this.warehouseList.find(item => item.wareHouseId === +event);
  //   this.newRequestOrderDetailCreateDto.warehouseName = detailItem.wareHouseName;
  // }

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

  // setSelectedWarehouse(event) {
  //   // console.log('@s!!', event);
  //   // this.workStation.wareHouse = event;
  //   // this.onWareHouseChange(event);
  //   this.wareHouse = event;
  //   // this.stockList = event.wareHouseStockDtoList;
  //   if (event && event.hasOwnProperty('wareHouseId')) {
  //     this.newRequestOrderDetailCreateDto.warehouseId = event.wareHouseId;
  //     this.newRequestOrderDetailCreateDto.warehouseName = event.wareHouseName;
  //   } else {
  //     // this.workStation.warehouseId = null;
  //     this.newRequestOrderDetailCreateDto.warehouseId = null;
  //     this.newRequestOrderDetailCreateDto.warehouseName = null;
  //   }
  // }

  addDetails() {
    const cloneOfNewOrderDetailListItem = Object.assign({}, this.newRequestOrderDetailCreateDto);
    if (this.selectedDetailIndex < 0) {
      // add
      this.order.orderQuotationDetailList.push(cloneOfNewOrderDetailListItem);
    } else {
      // update
      this.order.orderQuotationDetailList[this.selectedDetailIndex] = cloneOfNewOrderDetailListItem;
    }
    this.params.dialog.visible = false;
  }

  get TotalSalesPrice() {
    this.order.totalSalesPrice = this.order.orderQuotationDetailList.reduce((total, item) => total + item.salePrice, 0) || 0;
    return this.order.totalSalesPrice;
  }
  get TotalVatPrice() {
    this.order.totalVatPrice = this.order.orderQuotationDetailList.reduce((total, item) => total + item.vatPrice, 0);
    return this.order.totalVatPrice;
  }
  get TotalDiscountPrice() {
    this.order.totalDiscountPrice = this.order.orderQuotationDetailList.reduce((total, item) => total + item.discountPrice, 0);
    return this.order.totalDiscountPrice;
  }
  get TotalNetPrice() {
    this.order.totalNetPrice = this.order.orderQuotationDetailList.reduce((total, item) => total + item.netPrice, 0);
    return this.order.totalNetPrice;
  }

  resetNewItemDetails() {
    this.newRequestOrderDetailCreateDto = new CreateOrderQuotationDetailList();
    this.newRequestOrderDetailCreateDto.plantId = this.selectedPlant ? this.selectedPlant.plantId : null;
    this.newRequestOrderDetailCreateDto.plantName = this.selectedPlant ? this.selectedPlant.plantName : null;
    // this.newRequestOrderDetailCreateDto.warehouseId = null;
    this.wareHouse = null;
  }

  deleteDetailItemFromList(index) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this.order.orderQuotationDetailList.splice(index, 1);
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    })
  }

}
