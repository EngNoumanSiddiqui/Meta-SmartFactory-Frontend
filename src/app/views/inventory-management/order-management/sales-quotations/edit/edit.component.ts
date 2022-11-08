import {Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { UsersService } from 'app/services/users/users.service';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
import { ActService } from 'app/services/dto-services/act/act.service';
import { WorkstationService } from 'app/services/dto-services/workstation/workstation.service';
import { StockCardService } from 'app/services/dto-services/stock/stock.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { ConfirmationService } from 'primeng';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'environments/environment';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { SalesOrderQuotationsService } from 'app/services/dto-services/sales-order-quotations/sales-order-quotations.service';
import { CreateOrderQuotationDetailList, CreateSalesQuotations, ResponseOrderQuotationDto } from 'app/dto/sale-order/sale-order-quotation.model';
import { ActTypeService } from 'app/services/dto-services/act-type/act-type.service';
import { TableTypeEnum } from 'app/dto/table-type-enum';
import { ImageAdderComponent } from 'app/views/image/image-adder/image-adder.component';
import { ConvertUtil } from 'app/util/convert-util';
import { CommonTemplateTypeEnum } from 'app/dto/print/print.model';
import { ExchangeRateService } from 'app/services/dto-services/exchange-rates/exchange-rates.service';

@Component({
  selector: 'sales-quotations-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditSaleQuotationsComponent implements OnInit {

  // @ViewChild(ImageAdderComponent) imageAdderComponent: ImageAdderComponent;
  @ViewChildren(ImageAdderComponent) imageAdderComponent: QueryList<ImageAdderComponent>;

  wareHouse: any;

  @Output() saveAction = new EventEmitter<any>();
  @Output() saveAndCreateAction = new EventEmitter<any>();

  today = new Date();

  order: CreateSalesQuotations = new CreateSalesQuotations();

  selectedCustomer: any = {};

  params = {
    dialog: {title: '', inputValue: '', visible: false, active: true}
  };

  actList;
  totalSalesPrice : 0;

  id;
  contentEditableCell = '-10';
  lastOrderNos;
  unitList;
  warehouseList;
  modal = {active: false};

  newRequestOrderDetailCreateDto: CreateOrderQuotationDetailList = new CreateOrderQuotationDetailList();

  selectedDetailIndex = -1;

  includeMaterials = [2, 3, 13, 16];

  listOrderStatus: any;

  productTreeStatusList: any[] = [];

  selectedPlant = null;

  commonPriorities = [];

  customerPriority: string = null;
  onlyUpdateDeliveryDate = false;
  listActTypes: any;
  HTS_Status: string = 'null';
  HTS_StatusList = ['CALCULATING_COST', 'OFFER_SENT', 'COST_CONFIRMED', 'OFFER_EXPIRED']
  language: any;
  selectedLangCode: string;
  selectedMaterialCurrency = null;
  exChangeRate: number = 1;
  materialCurrentPrice = null;
  selectedOrganization: any;

  constructor(private _actSvc: ActService,
    private _actTypes: ActTypeService,
              private _route: ActivatedRoute,
              private _router: Router,
              private exChangeRateSvc: ExchangeRateService,
              private _saleSvc: SalesOrderQuotationsService,
              private _workstationSvc: WorkstationService,
              private _stockSvc: StockCardService,
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private userSvc: UsersService,
              private _confirmationSvc: ConfirmationService,
              private _enumSvc : EnumService,
              private _translateSvc: TranslateService) {
                this.selectedPlant = JSON.parse(this.userSvc.getPlant());
                this.selectedOrganization = JSON.parse(this.userSvc.getOrganization());

    // step1:
    this._route.params.subscribe((params) => {
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

  @Input('quotationStatus') set xstatus(quotationStatus) {
    // when sendMail clicked status will be changed to OFFER_SENT
    if (quotationStatus && quotationStatus !== '') {
      this.order.orderQuotationStatus = quotationStatus;
      this.order.orderQuotationDetailList.forEach((item: any) => {
        item.orderDetailQuotationStatus = quotationStatus;
      });
    }
  }

  // step2
  private initialize(id: string) {
    this.loaderService.showLoader();
    this._saleSvc.getDetail(id).then((result: any) => {
      this.loaderService.hideLoader();
      this.order = result as any;
      if(result['act']) {
        this.order.actId = result['act'].actId;
        this.order.actTypeId = result['act'].actType?.actTypeId;
        this.order['actType'] = result['act'].actType;
        this.order['act'] = result['act'];
        this.language = result['act']?.contractDto?.language;
      }
      this.order.costCenterId = result['costCenter']?.costCenterId || null;
      // if (this.order.orderStatus === 'CONFIRMED' || this.order.orderStatus === 'IN_PROCESS'
      // || this.order.orderStatus === 'READY_FOR_PLANNING') {
      //   this.onlyUpdateDeliveryDate = true;
      // }
      this.order.orderQuotationDetailList = this.order.orderQuotationDetailList.filter(item => item.orderDetailQuotationStatus!=='CANCELLED').map((item: any) => {

        item.deliveryDate = new Date(item.deliveryDate);
        this.order.deliveryDate = item.deliveryDate;

        item.plantName = item.plant?.plantName || this.selectedPlant?.plantName;
        item.plantId = item.plant?.plantId || this.selectedPlant?.plantId;
        item.stockNo = item.stock?.stockNo;
        item.orderQuotationId = this.order.quotationId;
        item.stockName = item.stock?.stockName;
        item.stockName2 = item.stock?.stockName2;
        item.stockName3 = item.stock?.stockName3;
        item.stockId = item.stock?.stockId;
        item.costCenterId = item.costCenter?.costCenterId;

        return item;
      });
      // this.order.deliveryDate = new Date(this.order.deliveryDate);
      if(this.order.quotationDate) {
        this.order.quotationDate = new Date(this.order.quotationDate);
      }
      if(this.order.validFrom) {
        this.order.validFrom = new Date(this.order.validFrom);
      }
      if(this.order.validTo) {
        this.order.validTo = new Date(this.order.validTo);
      }
      if(this.order.createDate) {
        this.order.createDate = new Date(this.order.createDate);
      }
      if (this.order.actId) {
        this.selectedCustomer = {actId: result.act?.actId, actName: result.act?.actName};
        if (this.actList) {
          const act = this.actList.find((item) => item.actId == this.selectedCustomer?.actId);
          if (act) {
            this.selectedCustomer = act;
            // this.order.parity = this.order.parity || act.contractDto?.parity ;
            // this.order.parity = act.contractDto?.parity;
            this.customerPriority = act.priority;
          }
        }
      }
      if(this.order.orderQuotationStatus === 'PROCESSING') {
        this.productTreeStatusList = ['PROCESSING'];
        this.listOrderStatus = ['PROCESSING'];
      }
      // if (this.imageAdderComponent) {
      //   this.imageAdderComponent.initImages(this.order.quotationId, TableTypeEnum.SALES_ORDER_QUOTATION);
      // }
      // this.onOrderStatusChanged(this.order.orderQuotationStatus);

      if(this.order.orderQuotationStatus==='REQUESTED') {
        this.HTS_Status = 'CALCULATING_COST';
      } else if(this.order.orderQuotationStatus==='COST_CONFIRMED') {
        this.HTS_Status = 'COST_CONFIRMED';
      } else if(this.order.orderQuotationStatus==='CONFIRMED') {
        this.HTS_Status = 'OFFER_SENT';
      } else {
        this.HTS_Status = null;
      }
      // setTimeout(() => {
      //   if (this.imageAdderComponent && this.imageAdderComponent.length) {
      //     this.order.orderQuotationDetailList.forEach((item, index) => {
      //       this.imageAdderComponent.toArray()[index].initImages(item.quotationDetailId, TableTypeEnum.SALES_QUOTATION_DETAIL);
      //     });
      //   }
      // }, 800);

      // this.getSaleStatusList();
    }).catch(error => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(error)
    });


  }

  // getSaleStatusList() {
  //   this.enumSaleOrderStatus.getOrderEnumList().then((result: any) => {
  //     if (result) {
  //       const saleOrderStatus = this.order.orderStatus;
  //       if (saleOrderStatus !== OrderStatusEnum.REQUESTED && saleOrderStatus !== OrderStatusEnum.WAITING && saleOrderStatus !== OrderStatusEnum.CONFIRMED) {
  //         this.listOrderStatus = result.filter((item) =>  {
  //           return  (item == saleOrderStatus );
  //         });
  //       } else {
  //         this.listOrderStatus = result.filter((item) =>  {
  //           return  (item == OrderStatusEnum.REQUESTED || item == OrderStatusEnum.WAITING || item == OrderStatusEnum.CONFIRMED);
  //         });
  //       }

  //     }
  //   }).catch(error => console.log(error));
  // }
  onSaveNewCustomer($event) {
    this.actList.push($event);
    this.setSelectedCustomer($event);
    this.selectedCustomer = $event;
  }

  openNewCustModal(modal) {
    this.params.dialog.title = 'new-customer';
    this.params.dialog.visible = true;
    setTimeout(() => {
      modal.show();
    }, 300);
  }

  createProforma(myModal) {
    this.params.dialog.title = 'invoice';
    this.params.dialog.visible = true;
    setTimeout(() => {
      myModal.show();
    }, 300);
  }

  getSaleOrderStatusList() {
    this._saleSvc.getSaleQuotationsStatus().then((res: any) => {
      if (res) {
        res = res.filter((item) => {
          return (item === 'CALCULATING_COST' || item === 'CANCELLED' || item === 'CONFIRMED' ||
          item === 'COST_CONFIRMED' || item === 'OFFER_SENT' || item === 'OFFER_EXPIRED' );
        });
        if(this.selectedPlant?.plantId === 9999) { //INSTEAD OF 91. REMOVE ALL HTS CHANGES
          res = ['COST_CONFIRMED', ...res]
        }
        if(this.order.orderQuotationStatus === 'PROCESSING') {
          this.productTreeStatusList = ['PROCESSING'];
          this.listOrderStatus = ['PROCESSING'];
        } else {
          this.productTreeStatusList = res;
          this.listOrderStatus = res;
        }
        // this.enumSaleOrderStatus = res;
      }
    });
  }

  orderTypeChanged(event) {
    if(event) {
      this.actList = [];
      this.order.actTypeId = event?.actTypeId;
      this.order.actTypeName = event?.actTypeName;
      this.order['actType'] = {actTypeId:event?.actTypeId, actTypeName: event?.actTypeName}
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
      if (this.actList) {
        const act = this.actList.find((item) => item.actId == this.selectedCustomer?.actId);
        if (act) {
          this.selectedCustomer = act;
          // this.order.parity = this.order.parity || act.contractDto?.parity ;
          this.customerPriority = act.priority;
        }
      }
      this.loaderService.hideLoader();
    }).catch(err => this.loaderService.hideLoader());
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

  sendMail() {
    const mail = this.selectedCustomer.email;
    const referenceId = this.order.quotationNo;

    window.open(`mailto:${mail}?subject=${referenceId}&body=`);
    // this.imageAdderComponent.downloadFiles();
  }
  sendMail2() {
    const data = {
      referenceId: this.order.quotationNo || '',
      actId: this.order.actId,
      tableType: TableTypeEnum.SALES_ORDER_QUOTATION,
      templateTypeCode: CommonTemplateTypeEnum.SALES_ORDER_QUOTATION,
      itemId: this.order.quotationId,
      sendTo: this.order['act']?.email,
      body: this.order['act']?.emailTemplate,
      subject: this.order.quotationNo
    }
    this.loaderService.showDetailDialog(DialogTypeEnum.MAIL, null, data);
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

  onDeliveryChanged(event) {
    
    if (event) {
      this.order.orderQuotationDetailList.forEach(itm => {
        itm.deliveryDate = this.order.deliveryDate;
      });
    }
  }

  // setSelectedBatch(batch) {
  //   if (batch) {
  //     this.newRequestOrderDetailCreateDto.batch = batch.batchCode;
  //   } else {
  //     this.newRequestOrderDetailCreateDto.batch = null;
  //   }
  // }

  setSelectedCustomer(customer) {
    if (customer) {
      this.selectedCustomer = customer;
      this.order.actId = customer.actId;
      this.order.parity = customer.contractDto?.parity || this.order.parity;
      this.language = customer.contractDto?.language;
      this.customerPriority = customer.priority;
    } else {
      this.order.actId = null;
      this.language = null;
      this.customerPriority = null;
    }
  }
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


  ngOnInit() {
    // this._saleSvc.getLastOrderNos().then(result => this.lastOrderNos = result).catch(error => console.log(error));
    this.getSaleOrderStatusList();
    // this._actTypes.getbyPlantId_AccountPosition(this.selectedPlant?.plantId, 'CUSTOMER').then((result: any) => this.listActTypes = result).catch(error => console.log(error));
    this._workstationSvc.getWorkstationUnitList().then(result => { this.unitList = result; }).catch(error => console.log(error));
    // this._wareHouseSvc.getIdNameList().then(result => this.warehouseList = result).catch(error => console.log(error));
    this.filterActListByOrderType(null);
    // this._actSvc.getActCustomerByPlantId(this.selectedPlant?.plantId).then(result => {
    //   this.actList = result;
    //   // console.log('@act', result)
    //   if (result) {
    //     const act = this.actList.find((item) => item.actId == this.selectedCustomer?.actId);
    //     if (act) {
    //       this.selectedCustomer['priority'] = act.priority;
    //       this.customerPriority = act.priority;
    //     }
    //   }

    // }).catch(error => console.log(error));
    this._enumSvc.getCommonPriorityEnum().then((result: any) => this.commonPriorities = result).catch(error => console.log(error));

  }

  goPage() {
    this._router.navigate(['/orders/sales']);
  }

  save() {
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
    
    const oItem = this.order.orderQuotationDetailList.find(item => item.costCenterId === 0 || item.costCenterId === null || !item.costCenterId);

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
    this._saleSvc.save(this.order)
      .then((res: any) => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        this.saveImages(res.quotationId);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }
  private saveImages(quotationId) {
    this._saleSvc.getDetail(quotationId).then(result => {
      const order = result as any;
      if (order.orderQuotationDetailList) {
        order.orderQuotationDetailList = order.orderQuotationDetailList.filter(item => item.orderDetailQuotationStatus!=='CANCELLED');
      }
      this.order = order;
      this.order.orderQuotationDetailList.forEach((item, index) => {
        this.imageAdderComponent.toArray()[index].updateMedia(item.quotationDetailId, TableTypeEnum.SALES_QUOTATION_DETAIL).then(() => {
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

  }
  saveAndCreate() {
    // console.log(JSON.stringify(this.order));
    this.loaderService.showLoader();
    this._saleSvc.save(this.order)
      .then((res:any) => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        // this.saveImages(res.quotationId);
        setTimeout(() => {
          this.saveAndCreateAction.emit(res);
        }, environment.DELAY);


      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }

  prioritySelection(event) {
    if (event) {
      this.newRequestOrderDetailCreateDto.priority = event.target.value;
    } else {
      this.newRequestOrderDetailCreateDto.priority = null;
    }
  }

  isconfirmORprocessORreadyforplan = (newRequestOrderDetailCreateDto) => {
    return (
      // newRequestOrderDetailCreateDto.orderDetailStatus === 'CONFIRMED' ||
      // newRequestOrderDetailCreateDto.orderDetailStatus === 'CONFIRMED' ||
      newRequestOrderDetailCreateDto.orderDetailStatus === 'PARTIAL_COMPLETED' ||
      newRequestOrderDetailCreateDto.orderDetailStatus === 'IN_PROCESS' ||
      newRequestOrderDetailCreateDto.orderDetailStatus === 'READY_FOR_PLANNING'
    )
  }
  // addList(item) {
  //   item.quantity = 1;
  //   // item.orderDetailStatus = OrderDetailStatusEnum.ACTIVE;
  //   this.order.orderQuotationDetailList.push(item);
  // }

  deleteStockFromList(item) {
    this.order.orderQuotationDetailList = this.order.orderQuotationDetailList.filter(stock => stock.stockId !== item['stockId']);
  }
  setSelectedPlant(event) {
    this.wareHouse = null;
    if (event) {
      this.newRequestOrderDetailCreateDto.plantId = event.plantId;
      this.newRequestOrderDetailCreateDto.plantName = event.plantName;
    } else {
      this.newRequestOrderDetailCreateDto.plantId = null;
      this.newRequestOrderDetailCreateDto.plantName = null;
    }
  }
  // setSelectedWarehouse(event) {
  //     this.wareHouse = event;
  //     if (event && event.hasOwnProperty('wareHouseId')) {
  //       this.newRequestOrderDetailCreateDto.warehouseId = event.wareHouseId;
  //       this.newRequestOrderDetailCreateDto.warehouseName = event.wareHouseName;
  //     } else {
  //       this.newRequestOrderDetailCreateDto.warehouseId = null;
  //       this.newRequestOrderDetailCreateDto.warehouseName = null;
  //     }
  // }


  // cancel() {
  //   this.goPage();
  // }



  /////////////////////

  openSaleOrderDetailsModal(index) {
    this.params.dialog.title = 'sale-order-details';
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
      this.newRequestOrderDetailCreateDto.deliveryDate.setTime(new Date().getTime() + (7 * 7 * 24 * 60 * 60 * 1000));
    } else {
      // edit
      this.newRequestOrderDetailCreateDto = Object.assign({}, this.order.orderQuotationDetailList[index]);
      this.newRequestOrderDetailCreateDto.deliveryDate = this.newRequestOrderDetailCreateDto.deliveryDate ?  new Date(this.newRequestOrderDetailCreateDto.deliveryDate) : null;
      // this.newRequestOrderDetailCreateDto.shipmentDate = this.newRequestOrderDetailCreateDto.shipmentDate ? new Date(this.newRequestOrderDetailCreateDto.shipmentDate) : null;
      this._stockSvc.metarialActiveUnits(this.newRequestOrderDetailCreateDto.stockId).then((result: any) => {
        this.unitList = result;
      }).catch(error => console.log(error));

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
    this.newRequestOrderDetailCreateDto.stockId = event.stockId;
    this.newRequestOrderDetailCreateDto.stockName = event.stockName;
    this.newRequestOrderDetailCreateDto.stockName2 = event.stockName2;
    this.newRequestOrderDetailCreateDto.stockName3 = event.stockName3;
    this.newRequestOrderDetailCreateDto.stockNo = event.stockNo;
    this.newRequestOrderDetailCreateDto.baseUnit = event.baseUnit;
    this.newRequestOrderDetailCreateDto.height = event.height;
    this.newRequestOrderDetailCreateDto.width = event.width;
    this.newRequestOrderDetailCreateDto.costCenterId = event.stockCosting?.costCenter?.costCenterId || null;
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
    this.order.totalSalesPrice = this.order?.orderQuotationDetailList?.reduce((total, item) => total + item.salePrice, 0) || 0;
    return this.order.totalSalesPrice;
  }
  get TotalVatPrice() {
    this.order.totalVatPrice = this.order?.orderQuotationDetailList?.reduce((total, item) => total + item.vatPrice, 0);
    return this.order.totalVatPrice;
  }
  get TotalDiscountPrice() {
    this.order.totalDiscountPrice = this.order.orderQuotationDetailList.reduce((total, item) => total + item.discountPrice, 0);
    return this.order.totalDiscountPrice;
  }
  get TotalNetPrice() {
    this.order.totalNetPrice = this.order?.orderQuotationDetailList?.reduce((total, item) => total + item.netPrice, 0);
    return this.order.totalNetPrice;
  }


  resetNewItemDetails() {
    this.newRequestOrderDetailCreateDto = new CreateOrderQuotationDetailList();
    this.newRequestOrderDetailCreateDto.plantId = this.selectedPlant.plantId;
    this.newRequestOrderDetailCreateDto.plantName = this.selectedPlant.plantName;
  }

  deleteDetailItemFromList(index) {
    const detailItem = this.order.orderQuotationDetailList[index];

    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        console.log('quotationDetailId: ' + detailItem.quotationDetailId);
        if (detailItem.quotationDetailId > 0) {
          // exists in db
          this._saleSvc.deleteOrderDetail(detailItem.quotationDetailId)
            .then(() => {
              this.utilities.showSuccessToast('deleted-success');
              this.order.orderQuotationDetailList.splice(index, 1);
              // setTimeout(() => {
              //   this.saveAction.emit('close');
              // }, environment.DELAY);
            })
            .catch(error => {
              if (error === 'THERE_ARE_RELATED_DATA_YOU_CAN_NOT_DELETE') {
                this.utilities.showWarningToast(error, 'Production order exists');
              } else {
                this.utilities.showErrorToast(error);
              }
            });
        } else {
          this.order.orderQuotationDetailList.splice(index, 1);
        }
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    })
  }

  showDetailDialog(rowData, modal){
    if(modal === 'plant'){
      this.loaderService.showDetailDialog(DialogTypeEnum.PLANT, rowData.plantId)
    }else if(modal === 'stock'){
      this.loaderService.showDetailDialog(DialogTypeEnum.STOCK, rowData.stockId)
    }else if(modal === 'batch'){
      this.loaderService.showDetailDialog(DialogTypeEnum.BATCH, rowData.batch)
    }else if(modal === 'wareHouse'){
      this.loaderService.showDetailDialog(DialogTypeEnum.WAREHOUSE, rowData.warehouseId)
    }
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
}
