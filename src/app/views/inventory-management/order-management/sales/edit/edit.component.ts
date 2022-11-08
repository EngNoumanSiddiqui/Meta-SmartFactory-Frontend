import {Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import { EnumOrderStatusService } from 'app/services/dto-services/enum/order-status.service';
import { UsersService } from 'app/services/users/users.service';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
import * as moment from 'moment';
import { OrderStatusEnum, OrderDetailStatusEnum, RequestOrderCreateDto, RequestOrderDetailCreateDto } from 'app/dto/sale-order/sale-order.model';
import { ActService } from 'app/services/dto-services/act/act.service';
import { SalesOrderService } from 'app/services/dto-services/sales-order/sales-order.service';
import { WorkstationService } from 'app/services/dto-services/workstation/workstation.service';
import { WarehouseService } from 'app/services/dto-services/warehouse/warehouse.service';
import { StockCardService } from 'app/services/dto-services/stock/stock.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { ConfirmationService } from 'primeng';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'environments/environment';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { ActTypeService } from 'app/services/dto-services/act-type/act-type.service';
import { TableTypeEnum } from 'app/dto/table-type-enum';
import { ImageAdderV2Component } from 'app/views/image-v2/image-adder/image-adder.component';
import { ConvertUtil } from 'app/util/convert-util';
import { CommonTemplateTypeEnum } from 'app/dto/print/print.model';
import { CommonCodeGeneration } from 'app/dto/common-code-generation.enum';
import { ExchangeRateService } from 'app/services/dto-services/exchange-rates/exchange-rates.service';

@Component({
  selector: 'sales-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditSaleComponent implements OnInit {
  @ViewChildren(ImageAdderV2Component) imageAdderComponent: QueryList<ImageAdderV2Component>;

  wareHouse: any;

  @Output() saveAction = new EventEmitter<any>();
  @Output() closeAction = new EventEmitter<any>();
  @Output() printAction = new EventEmitter<any>();
  @Output() jobOrderAction = new EventEmitter<any>();

  firstTimeCallUniqueCode: boolean = false;

  order: RequestOrderCreateDto = new RequestOrderCreateDto();

  selectedCustomer;
  selectedMaterialCurrency = null;
  exChangeRate: number = 1;
  materialCurrentPrice = null;

  params = {
    dialog: {title: '', inputValue: '', visible: false, active: true, viewMode: false}
  };

  actList;


  HTS_Status = null;
  HTS_StatusList = ['ORDER_IN_HOUSE', 'DOC_READY', 'DOC_CONFIRMED'];


  id;
  contentEditableCell = '-10';
  lastOrderNos;
  unitList = [];
  warehouseList;
  modal = {active: false};

  newRequestOrderDetailCreateDto: RequestOrderDetailCreateDto = new RequestOrderDetailCreateDto();

  selectedDetailIndex = -1;

  includeMaterials = [2, 3, 13,16];

  listOrderStatus: any;

  productTreeStatusList: any[] = [];

  selectedPlant = null;

  commonPriorities = [];

  customerPriority: string = null;
  onlyUpdateDeliveryDate = false;
  listActTypes: any;
  language: any;
  oldReferenceId: number;

  plantCurrency;
  plantCurrencyItemRate;


  constructor(private _actSvc: ActService,
    private _actTypes: ActTypeService,
              private _route: ActivatedRoute,
              private _router: Router,
              private exChangeRateSvc: ExchangeRateService,
              private _saleSvc: SalesOrderService,
              private _workstationSvc: WorkstationService,
              private _wareHouseSvc: WarehouseService,
              private _stockSvc: StockCardService,
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private userSvc: UsersService,
              private _confirmationSvc: ConfirmationService,
              private _translateSvc: TranslateService,
              private enumSaleOrderStatus: EnumOrderStatusService,
              private _enumSvc: EnumService) {
                this.selectedPlant = JSON.parse(this.userSvc.getPlant());

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

  // step2
  private initialize(id: any) {
    this.loaderService.showLoader();
    this._saleSvc.getDetail(id).then(result => {
      this.loaderService.hideLoader();
      this.order = result as RequestOrderCreateDto;
      this.order.orderId = id;
      if (this.order.orderStatus === 'CONFIRMED' || this.order.orderStatus === 'IN_PROCESS'
      || this.order.orderStatus === 'READY_FOR_PLANNING') {
        this.onlyUpdateDeliveryDate = true;
      }
      this.order.orderDetailList = result['orderDetailDtoList'];
      // this.order.costCenterId = result['costCenter']?.costCenterId;
      delete this.order['orderDetailDtoList'];
      const deliveryDate = this.order.orderDetailList.filter(i => i.deliveryDate !== null)[0]?.deliveryDate || null;
      this.order.deliveryDate = deliveryDate ? new Date(deliveryDate) : null;
      this.order.orderDate = new Date(this.order.orderDate);
      if (this.order.actId) {
        this.selectedCustomer = {actId: this.order.actId, actName: this.order.actName};
      }
      if(this.order.account) {
        this.order.actTypeId = this.order.account?.actType?.actTypeId;
        this.language = this.order.account?.contractDto?.language;
        if(this.order.actTypeId) {
          this.orderTypeChanged(this.order.actTypeId);
        }
      }
      if (this.actList && this.selectedCustomer) {
        const act = this.actList.find((item) => item.actId == this.selectedCustomer.actId);
        if (act) {
          this.selectedCustomer = act;
          this.customerPriority = act.priority;
          // this.order.parity = this.order.parity || act.contractDto?.parity ;
          // this.order.parity = act.contractDto?.parity;
        }
      }
      if(this.order.orderStatus === 'REQUESTED') {
        this.HTS_Status = 'ORDER_IN_HOUSE';
      } else if(this.order.orderStatus === 'WAITING') {
        this.HTS_Status = 'DOC_READY';
      } else if(this.order.orderStatus === 'CONFIRMED') {
        this.HTS_Status = 'DOC_CONFIRMED';
      } else {
        this.HTS_Status = null;
      }

      this.getSaleStatusList();


      // setTimeout(() => {
      //   if (this.imageAdderComponent && this.imageAdderComponent.length) {
      //     this.order.orderDetailList.forEach((item, index) => {
      //       this.imageAdderComponent.toArray()[index].initImages(item.orderDetailId, TableTypeEnum.SALES_ORDER_DETAIL);
      //     });
      //     // this.imageAdderComponent.initImages(this.order.orderId, TableTypeEnum.SALES_ORDER);
      //   }
      // }, 800);

    }).catch(error => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(error)
    });


  }

  // sendMail() {
  //   const mail = this.selectedCustomer.email;
  //   const referenceId = this.order.referenceId|| '';

  //   window.open(`mailto:${mail}?subject=${referenceId}&body=''`);
  // }

  getSaleStatusList() {
    this.enumSaleOrderStatus.getOrderEnumList().then((result: any) => {
      if (result) {
        const saleOrderStatus = this.order.orderStatus;
        if (saleOrderStatus !== OrderStatusEnum.REQUESTED && saleOrderStatus !== OrderStatusEnum.WAITING
          && saleOrderStatus !== OrderStatusEnum.CONFIRMED && saleOrderStatus !== 'ORDER_IN_HOUSE'
          && saleOrderStatus !== 'DOCUMENT_READY' && saleOrderStatus !== 'DOCUMENT_CONFIRMED') {
          this.listOrderStatus = result.filter((item) =>  {
            return  (item == saleOrderStatus );
          });
        } else {
          this.listOrderStatus = result.filter((item) =>  {
            return  (item == OrderStatusEnum.REQUESTED || item == OrderStatusEnum.WAITING || item === 'CANCELED'
              || item == OrderStatusEnum.CONFIRMED || item === 'ORDER_IN_HOUSE'  || item === 'DOCUMENT_READY' || item === 'DOCUMENT_CONFIRMED'
              || item === 'COMPLETED');
          });
        }

      }
    }).catch(error => console.log(error));
  }
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

  getSaleOrderStatusList() {
    this._saleSvc.getSaleOrderStatus().then((res: any) => {
      if (res) {
        this.productTreeStatusList = res.filter((item) =>  {
          return (item === 'REQUESTED' || item === 'WAITING' || item === 'CONFIRMED' || item === 'CANCELED' ||
          item === 'ORDER_IN_HOUSE' || item === 'DOCUMENT_READY' || item === 'DOCUMENT_CONFIRMED' || item === 'COMPLETED');
        });
      }
    });
  }

  setSelectedBatch(batch) {
    if (batch) {
      this.newRequestOrderDetailCreateDto.batch = batch.batchCode;
    } else {
      this.newRequestOrderDetailCreateDto.batch = null;
    }
  }

  setSelectedCustomer(customer) {
    this.selectedCustomer = customer;
    if (customer) {
      this.order.actId = customer.actId;
      this.order.parity = customer.contractDto?.parity || this.order.parity;
      this.language = customer.contractDto?.language;
      this.order.actTypeId = <any> customer.actType?.actTypeId + '';
      this.customerPriority = customer.priority;
    } else {
      this.order.actId = null;
      this.language = null;
      this.customerPriority = null;
    }
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

  ngOnInit() {
    
    this._saleSvc.getLastOrderNos().then(result => this.lastOrderNos = result).catch(error => console.log(error));
    this.getSaleOrderStatusList();
    this._actTypes.getbyPlantId_AccountPosition(this.selectedPlant?.plantId, 'CUSTOMER').then((result: any) => this.listActTypes = result).catch(error => console.log(error));
    this._workstationSvc.getWorkstationUnitList().then((result: any) => { this.unitList = result; }).catch(error => console.log(error));
    this._wareHouseSvc.getIdNameList().then(result => this.warehouseList = result).catch(error => console.log(error));
    this._actSvc.filter({
      "pageNumber": 1,
      "pageSize": 9999,
      "plantId": this.selectedPlant?.plantId,
      accountPosition: 'CUSTOMER'
    }).then(result => {
      this.actList = result['content'];
      // console.log('@act', result)
      if (result && result['content'] && this.selectedCustomer) {
        const act = this.actList.find((item) => item.actId == this.selectedCustomer.actId);
        if (act) {
          this.selectedCustomer = act;
          this.customerPriority = act.priority;
          // this.order.parity = this.order.parity || act.contractDto?.parity ;
          // this.order.parity = act.contractDto?.parity;
        }
      }

    }).catch(error => console.log(error));
    this._enumSvc.getCommonPriorityEnum().then((result: any) => this.commonPriorities = result).catch(error => console.log(error));

    this.plantCurrency = this.selectedPlant?.currency;

    this.getPlantCurrencyRate(this.selectedCustomer?.contractDto?.currency);

  }

  goPage() {
    this._router.navigate(['/orders/sales']);
  }

  async save() {

  this.getOriginalTotalSalesPrice();
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
            this.checkSalesOrderInItem();
          }, 500);
        },
        reject: () => {

        }
      })
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
    if (this.onlyUpdateDeliveryDate) {
      const req = JSON.parse(JSON.stringify(this.order));
      delete req.actName;
      delete req.deliveryDate;
      delete req.documentNo;
      delete req.description;
      delete req.orderTypeName;
      delete req.groupCodeId;
      for (let index = 0; index < this.order.orderDetailList.length; index++) {
        delete this.order.orderDetailList[index]['reservationList'];
        delete this.order.orderDetailList[index]['prodOrderList'];
      }
      req['orderDetailDtoList'] = this.order.orderDetailList;
      delete req['orderDetailList'];
      this._saleSvc.updateDeliveryDate(req).then(() => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('updated-success');
        setTimeout(() => {
          this.saveAction.emit('close');
        }, environment.DELAY);
      }).catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
    } else {
      for (let index = 0; index < this.order.orderDetailList.length; index++) {
        delete this.order.orderDetailList[index]['reservationList'];
        delete this.order.orderDetailList[index]['prodOrderList'];
      }
      this._saleSvc.save(this.order).then((orderId: any) => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('updated-success');
        this.saveImages(orderId || this.order.orderId);
      }).catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
    }
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

  isNullMaterial = () => {
    return this.order.orderDetailList.filter(itm => itm.stockId === null || itm.stockNo === null).length>0 ? true: false;
  }

  jobOrderClicked(item) {
    let jobOrderList = [];
    let prodOrder = null;
    const promise = new Promise((resolve, reject) => {
        if(item.prodOrderList && item.prodOrderList.length) {
          item.prodOrderList.forEach((prod, index) => {
            if(prod.jobOrderList && prod.jobOrderList.length) {
              jobOrderList = [...jobOrderList, ...prod.jobOrderList];
            }
            prodOrder = prod;
            if(index === item.prodOrderList.length - 1) {
              resolve(jobOrderList);
            }
          });
        }
    });
    promise.then(res => {
      this.jobOrderAction.next({jobOrderList, prodOrder, selectedOrder:item, order: this.order});
    });
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
      "accountPosition": "CUSTOMER",
      "orderByDirection": "desc",
    }).then(res => {
      this.actList = res['content'];
      this.loaderService.hideLoader();
    }).catch(err => this.loaderService.hideLoader());
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
  addList(item) {
    item.quantity = 1;
    item.orderDetailStatus = OrderDetailStatusEnum.ACTIVE;
    this.order.orderDetailList.push(item);
  }

  deleteStockFromList(item) {
    this.order.orderDetailList = this.order.orderDetailList.filter(stock => stock.stockId !== item['stockId']);
  }
  sendMail() {
    if(this.order.account) {

      this.loaderService.showLoader();
      this._actSvc.getDetail(this.order.actId).then(result => {
        this.loaderService.hideLoader();
        const mail = result['email'];
        const referenceId = this.order.referenceId|| '';
        window.open(`mailto:${mail}?subject=${referenceId}&body=`);
        // this.imageAdderComponent.downloadFiles();
      }).catch(error => {
        this.loaderService.hideLoader();
        console.log(error);
      });
    }

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
  // get vatPrice() {
  //   // if(this.newRequestOrderDetailCreateDto.vatRate) {
  //     this.newRequestOrderDetailCreateDto.vatPrice = ConvertUtil.getAndChecktNumber((this.newRequestOrderDetailCreateDto.unitNetPrice*this.newRequestOrderDetailCreateDto.quantity) * (this.newRequestOrderDetailCreateDto.vatRate/100));
  //     return this.newRequestOrderDetailCreateDto.vatPrice || 0;
  //   // } else {
  //   //   return 0;
  //   // }
  // }


  sendMail2() {
    const data = {
      referenceId: this.order.referenceId,
      actId: this.order.actId,
      tableType: TableTypeEnum.SALES_ORDER,
      templateTypeCode: CommonTemplateTypeEnum.SALE_ORDER,
      itemId: this.order.orderId,
      sendTo: this.order.account?.email,
      body: this.order.account?.emailTemplate,
      subject: this.order.orderNo
    }
    this.loaderService.showDetailDialog(DialogTypeEnum.MAIL, null, data);
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
  setSelectedWarehouse(event) {
      this.wareHouse = event;
      if (event && event.hasOwnProperty('wareHouseId')) {
        this.newRequestOrderDetailCreateDto.warehouseId = event.wareHouseId;
        this.newRequestOrderDetailCreateDto.warehouseName = event.wareHouseName;
      } else {
        this.newRequestOrderDetailCreateDto.warehouseId = null;
        this.newRequestOrderDetailCreateDto.warehouseName = null;
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

  get TotalDiscountPrice() {
    this.order.totalDiscountPrice = this.order.orderDetailList.reduce((total, item) => total + item.discountPrice, 0);
    return this.order.totalDiscountPrice;
  }
  get TotalSalesPrice() {
    this.order.totalSalesPrice = this.order.orderDetailList.reduce((total, item) => total + item.salePrice, 0) || 0;
    return this.order.totalSalesPrice;
  }
  get TotalVatPrice() {
    this.order.totalVatPrice = this.order.orderDetailList.reduce((total, item) => total + item.vatPrice, 0);
    return this.order.totalVatPrice;
  }
  get TotalNetPrice() {
    this.order.totalNetPrice = this.order.orderDetailList.reduce((total, item) => total + item.netPrice, 0);
    return this.order.totalNetPrice;
  }


  cancel() {
    this.goPage();
  }



  /////////////////////

  openSaleOrderDetailsModal(index, view=false) {
   
    this.selectedDetailIndex = index;
    this.selectedMaterialCurrency = null;
    this.exChangeRate = 1;
    this.materialCurrentPrice = null;
    if (this.selectedDetailIndex < 0) {
      // new
      this.resetNewItemDetails();
      this.newRequestOrderDetailCreateDto.priority = this.customerPriority || 'MEDIUM';
      this.newRequestOrderDetailCreateDto.orderDetailStatus = this.order.orderStatus || 'ORDER_IN_HOUSE';
      this.newRequestOrderDetailCreateDto.deliveryDate = moment(new Date()).add(7*7, 'days').toDate();
      this.newRequestOrderDetailCreateDto.currency = this.selectedCustomer?.contractDto?.currency || null;
      this.newRequestOrderDetailCreateDto.vatRate = this.selectedCustomer?.contractDto?.vat || null;
    } else {
      // edit
      this.newRequestOrderDetailCreateDto = Object.assign({}, this.order.orderDetailList[index]);
      this.newRequestOrderDetailCreateDto.deliveryDate = this.newRequestOrderDetailCreateDto.deliveryDate ?  new Date(this.newRequestOrderDetailCreateDto.deliveryDate) : null;
      this.newRequestOrderDetailCreateDto.shipmentDate = this.newRequestOrderDetailCreateDto.shipmentDate ? new Date(this.newRequestOrderDetailCreateDto.shipmentDate) : null;
      this.newRequestOrderDetailCreateDto.costPrice = ConvertUtil.getAndChecktNumber(this.newRequestOrderDetailCreateDto.costPrice);
      this.newRequestOrderDetailCreateDto.salePrice = ConvertUtil.getAndChecktNumber(this.newRequestOrderDetailCreateDto.salePrice);
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
    this.params.dialog.title = 'sale-order-details';
    this.params.dialog.visible = true;
    this.params.dialog.viewMode = view;
  }

  addAndIncrementReferenceId() {
    if(this.newRequestOrderDetailCreateDto.referenceId) {
      return 0;
    } else if(this.oldReferenceId) {
      this.newRequestOrderDetailCreateDto.referenceId = this.oldReferenceId;
      return 0;
    }
    if(this.order.orderDetailList && this.order.orderDetailList.length && this.firstTimeCallUniqueCode) {
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

  clearReferenceId() {
    
    if(this.newRequestOrderDetailCreateDto.referenceId) {
      this.oldReferenceId = this.newRequestOrderDetailCreateDto.referenceId;
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

  onMaterialChange(event) {
    this.newRequestOrderDetailCreateDto.stockId = event.stockId;
    this.newRequestOrderDetailCreateDto.stockName = event.stockName;
    this.newRequestOrderDetailCreateDto.stockName2 = event.stockName2;
    this.newRequestOrderDetailCreateDto.stockName3 = event.stockName3;
    this.newRequestOrderDetailCreateDto.stockNo = event.stockNo;
    this.newRequestOrderDetailCreateDto.unit = event.baseUnit;
    this.newRequestOrderDetailCreateDto.height = event.height;
    this.newRequestOrderDetailCreateDto.width = event.width;
    this.newRequestOrderDetailCreateDto.dimensionUnit = event.dimensionUnit;
    this.newRequestOrderDetailCreateDto.costCenterId = event.stockCosting?.costCenter?.costCenterId || null;
    this.newRequestOrderDetailCreateDto.costCenterName = event.stockCosting?.costCenter?.costCenterName || null;
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
    // this.newRequestOrderDetailCreateDto.salePrice = event.stockCostEstimate?.currentPrice || null;
    // if(this.newRequestOrderDetailCreateDto.salePrice) {
    //   this.newRequestOrderDetailCreateDto.discount=0;
    //   if(this.newRequestOrderDetailCreateDto.quantity) {
    //     this.calculatePrices();
    //   } else {
    //     this.newRequestOrderDetailCreateDto.unitNetPrice= this.newRequestOrderDetailCreateDto.salePrice;
    //   }
    // } else {
    //   this.newRequestOrderDetailCreateDto.netPrice = 0;
    //   this.newRequestOrderDetailCreateDto.unitNetPrice = 0;
    //   this.newRequestOrderDetailCreateDto.discount = 0;
    //   this.newRequestOrderDetailCreateDto.discountPrice = 0;
    //   this.newRequestOrderDetailCreateDto.vatRate = 0;
    //   this.newRequestOrderDetailCreateDto.vatPrice = 0;
    // }
    // this.selectedMaterialCurrency = event.stockCosting?.currencyCode || null;
    //   if(this.selectedMaterialCurrency && this.selectedCustomer?.contractDto?.currency) {
    //     if(this.selectedMaterialCurrency !== this.selectedCustomer?.contractDto?.currency) {
    //       this.findExchangeRate(this.selectedMaterialCurrency, 
    //         this.selectedCustomer?.contractDto?.currency);
    //     }
    //   }
    // this.newRequestOrderDetailCreateDto.currency = event.stockCosting?.currencyCode || null;

    if(event.salesOrderWarehouseId) {
      this.newRequestOrderDetailCreateDto.warehouseId = event.salesOrderWarehouseId?.wareHouseId;
      this.newRequestOrderDetailCreateDto.warehouseName = event.salesOrderWarehouseId?.wareHouseName;
    }
    if(!event.stockManagement) {
      if(this.oldReferenceId) {
        this.newRequestOrderDetailCreateDto.referenceId = this.oldReferenceId;
      } else if(!this.newRequestOrderDetailCreateDto.referenceId) {
        this.addAndIncrementReferenceId();
      }
    } else {
      if(this.newRequestOrderDetailCreateDto.referenceId) {
        this.oldReferenceId = this.newRequestOrderDetailCreateDto.referenceId;
      } else {
        this.oldReferenceId = null;
      }
      this.newRequestOrderDetailCreateDto.referenceId = null;
    }
    this._stockSvc.metarialActiveUnits(this.newRequestOrderDetailCreateDto.stockId).then((result: any) => {
        this.unitList = result;
      }).catch(error => console.log(error));
  }

  onWareHouseChange(event) {
    // console.log(event);
    const detailItem = this.warehouseList.find(item => item.wareHouseId === +event);
    this.newRequestOrderDetailCreateDto.warehouseName = detailItem.wareHouseName;
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
    this.firstTimeCallUniqueCode = true;
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

  resetNewItemDetails() {
    this.newRequestOrderDetailCreateDto = new RequestOrderDetailCreateDto();
    this.newRequestOrderDetailCreateDto.plantId = this.selectedPlant.plantId;
    this.newRequestOrderDetailCreateDto.plantName = this.selectedPlant.plantName;
  }
  // calculatePrices() {
  //   if(this.newRequestOrderDetailCreateDto.discount){
  //     const discount = (this.newRequestOrderDetailCreateDto.discount/100) * (this.newRequestOrderDetailCreateDto.unitNetPrice*this.newRequestOrderDetailCreateDto.quantity);
  //     this.newRequestOrderDetailCreateDto.netPrice = ConvertUtil.getAndChecktNumber((this.newRequestOrderDetailCreateDto.unitNetPrice*this.newRequestOrderDetailCreateDto.quantity) - discount);
  //   } else {
  //     this.newRequestOrderDetailCreateDto.netPrice = ConvertUtil.getAndChecktNumber(this.newRequestOrderDetailCreateDto.unitNetPrice*this.newRequestOrderDetailCreateDto.quantity);
  //   }
  //   this.newRequestOrderDetailCreateDto.salePrice=ConvertUtil.getAndChecktNumber(this.newRequestOrderDetailCreateDto.netPrice+this.newRequestOrderDetailCreateDto.deliveryCost);
  // }
  calculatePrices() {

    // (unitNetPrice * (1 - discount%)) * (1 + vatRate%) * quantity

    if(this.newRequestOrderDetailCreateDto.discount || this.newRequestOrderDetailCreateDto.vatRate){

      
      this.newRequestOrderDetailCreateDto.netPrice = ConvertUtil.getAndChecktNumber(
        this.newRequestOrderDetailCreateDto.unitNetPrice * this.newRequestOrderDetailCreateDto.quantity
      );

      this.newRequestOrderDetailCreateDto.discountPrice= ConvertUtil.getAndChecktNumber(
        this.newRequestOrderDetailCreateDto.netPrice * this.newRequestOrderDetailCreateDto.discount / 100
      );

      this.newRequestOrderDetailCreateDto.vatPrice=ConvertUtil.getAndChecktNumber(
        (this.newRequestOrderDetailCreateDto.netPrice - this.newRequestOrderDetailCreateDto.discountPrice) * (this.newRequestOrderDetailCreateDto.vatRate /100)
      );

    } else {
      this.newRequestOrderDetailCreateDto.netPrice = ConvertUtil.getAndChecktNumber(this.newRequestOrderDetailCreateDto.unitNetPrice*this.newRequestOrderDetailCreateDto.quantity);
    }
    
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


  onDeliveryDateChanged(event) {
    if(event) {
      this.order.orderDetailList.forEach(wh => {
        wh.deliveryDate = this.order.deliveryDate;
      })
    } else {
      this.order.orderDetailList.forEach(wh => {
        wh.deliveryDate = null;
      })
    }
  }

  deleteDetailItemFromList(index) {
    const detailItem = this.order.orderDetailList[index];

    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        console.log('OrderDetailId: ' + detailItem.orderDetailId);
        if (detailItem.orderDetailId > 0) {
          // exists in db
          this._saleSvc.deleteOrderDetail(detailItem.orderDetailId)
            .then(() => {
              this.utilities.showSuccessToast('deleted-success');
              this.order.orderDetailList.splice(index, 1);
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
          this.order.orderDetailList.splice(index, 1);
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
}
