import {Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {OrderDetailPlanComponent} from '../order-plan/list.component';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { ResponseOrderListDto } from 'app/dto/sale-order/sale-order.model';
import { SalesOrderService } from 'app/services/dto-services/sales-order/sales-order.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { SalesOrderQuotationsService } from 'app/services/dto-services/sales-order-quotations/sales-order-quotations.service';
import { TableTypeEnum } from 'app/dto/table-type-enum';
import { ImageViewerV2Component } from 'app/views/image-v2/image-viewer/image-viewer.component';
import { UsersService } from 'app/services/users/users.service';
import { ActService } from 'app/services/dto-services/act/act.service';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { filter, map } from 'rxjs/operators';


@Component({
  selector: 'sales-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.componet.scss']
})
export class DetailSaleComponent implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;
  @ViewChild('orderDetailPlan') orderDetailPlanComponent: OrderDetailPlanComponent;
  @ViewChildren(ImageViewerV2Component) imageViewerComponent: QueryList<ImageViewerV2Component>;

  @Output() printAction = new EventEmitter<any>();
  id;
  saleOrder: any = {};
  showLoader = true;

  params = {
    orderDetail: null,
    transferObj: null,
    title: ''
  };
  selectedOrderDetail;
  notificationSelectedColumns = [
    { field: 'stockTransferReceiptNotificationId', header: 'stock-transfer-receipt-notification-id'},
    { field: 'stockTransferNotificationDetailId', header: 'stock-transfer-notification-detail-id'},
    { field: 'materialNo', header: 'material-no'},
    { field: 'materialName', header: 'material-name'},
    { field: 'quantity', header: 'quantity'},
    { field: 'baseUnit', header: 'unit'},
    { field: 'goodMovementDocumentType', header: 'good-movement-document-type'},
    { field: 'goodsMovementActivityType', header: 'goods-movement-activity-type'},
    { field: 'goodsMovementStatus', header: 'status'},
  ];
  salesQuotationsColumns = [
    {field: 'quotationId', header: 'quotation-id'},
    {field: 'quotationNo', header: 'quotation-no'},
    {field: 'orderId', header: 'order-id'},
    // {field: 'orderTypeName', header: 'order-type-name'},
    {field: 'act', header: 'customer-name'},
    // {field: 'description', header: 'description'},
    {field: 'quotationDate', header: 'order-date'},
    { field: 'deliveryDate', header: 'delivery-date' },
    // {field: 'orderTypeName', header: 'order-type-name'},
    {field: 'orderQuotationStatus', header: 'status'},
  ];
  salesPriceColumns = [
    {field: 'salePrice', header: 'sales-price'},
    {field: 'costPrice', header: 'cost-price'},
    {field: 'discount', header: 'discount'},
  ];
  salesReservationColumns = [
    {field: 'reservationId', header: 'reservation-id'},
    {field: 'orderDetailId', header: 'order-detail-id'},
    {field: 'materialNo', header: 'material-no'},
    {field: 'materialName', header: 'material-name'},
    {field: 'requirementQuantity', header: 'quantity'},
    {field: 'warehouseName', header: 'warehouse'},
    {field: 'baseUnitMeasure', header: 'unit'},
    {field: 'latestReservationStatus', header: 'status'},
  ];
  notificationTree = [];
  salesQuotationsList = [];
  salesPriceList = [];
  salesReservations = [];
  itemId: any;
  HTS_Status: string;
  selectedPlant: any;


  actListSubject = new BehaviorSubject([]);
  actList$ = this.actListSubject.asObservable();

  selectedCustomerSubject = new BehaviorSubject(null);
  selectedCustomer$ =  this.selectedCustomerSubject.asObservable();

  @Input('id') set x(id) {
    // this.id = id;
    if (id) {
      this.initialize(id);
    }
  }

  @Input('itemId') set xitemId(itemId) {
    this.itemId = itemId;
    if (itemId) {
      this.getOrderId(itemId);
    }
  }

  initializeAll() {
    if (this.orderDetailPlanComponent) {
      this.orderDetailPlanComponent.initialize();
    }
    this.initialize(this.id);
  }

  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private userSvc: UsersService,
              private _actSvc: ActService,
              private _saleSvc: SalesOrderService,
              private _salesQtSrv: SalesOrderQuotationsService,
              private loaderService: LoaderService, private utilities: UtilitiesService) {
                this.selectedPlant = JSON.parse(this.userSvc.getPlant());
    // this._route.params.subscribe((params) => {
    //   this.id = params['id'];
    //   this.initialize(this.id);
    // });

    this.selectedCustomer$= combineLatest([this.actList$, this.selectedCustomer$])
    .pipe(
      filter(([actList, selectedCustomer]) => !!actList && !!actList.length && !!selectedCustomer),
      map(([actList, selectedCustomer]) => {
          const act = actList.find((item) => item.actId == selectedCustomer.actId);
          if (act) {
            return act;
          }
      })
    );
  }

  public initialize(id: string) {
    this.id = id;
    this.loaderService.showLoader();
    this._saleSvc.getDetail(id)
      .then(result => {
        // console.log(result);
        this.loaderService.hideLoader();
        this.saleOrder = result as ResponseOrderListDto;
        if (this.saleOrder.orderDetailDtoList.length > 0) {
          this.params.orderDetail = this.saleOrder.orderDetailDtoList[0];
        }
        if (this.saleOrder.orderDetailDtoList) {
          const treeData = JSON.parse(JSON.stringify(this.saleOrder.orderDetailDtoList));
          const notifications = [];
          treeData.forEach(itm => {
            if (itm.stockTransferNotificationDetailList) {
              itm.stockTransferNotificationDetailList.forEach(stitem => {
                notifications.push({...stitem});
              });
            }

            if (itm.reservationList) {
              itm.reservationList.forEach(stitem => {
                if(stitem) {
                  this.salesReservations.push({...stitem});
                }
              });
            }


            this.salesPriceList.push(
              {
                orderDetailId: itm['orderDetailId'],
                stockNo: itm['stockNo'],
                stockId: itm['stockId'],
                stockName: itm['stockName'],
                quantity: itm['quantity'],
                salePrice: itm['salePrice'],
                costPrice: itm['costPrice'],
                discount: itm['discount'],
              }
            )

          });
          this.notificationTree = notifications;
          // console.log(this.salesReservations)
          //  treeData.map(itm => {
          //   if (!itm.stockTransferNotificationDetailList || itm.stockTransferNotificationDetailList.length === 0) {
          //     return;
          //   }
          //   return {...itm.stockTransferNotificationDetailList };
          // });
          // this.notificationTree =  notifications.map(itm => ({
          //   label: null,
          //   data: {...itm},
          //   expanded : true,
          //   children: [
          //     {
          //       label: itm.stockTransferNotificationDetailId,
          //       data: null,
          //       expanded : true,
          //       children: [
          //         {
          //           label: itm.stockTransferNotificationDetailId,
          //           expanded : true,
          //           data: {...itm}
          //         }
          //       ]
          //     }

          //   ]
          // }));
        }
        if(this.saleOrder.orderQuotation) {
          this._salesQtSrv.getDetail(this.saleOrder.orderQuotation?.quotationId).then((res: any) => {
            this.salesQuotationsList = [{...res}];
          });
        }
        if (this.saleOrder.actId) {
          this.selectedCustomerSubject.next({actId: this.saleOrder.actId, actName: this.saleOrder.actName});
        }
        if(this.saleOrder.orderStatus === 'REQUESTED') {
          this.HTS_Status = 'ORDER_IN_HOUSE';
        } else if(this.saleOrder.orderStatus === 'WAITING') {
          this.HTS_Status = 'DOC_READY';
        } else if(this.saleOrder.orderStatus === 'CONFIRMED') {
          this.HTS_Status = 'DOC_CONFIRMED';
        }

        setTimeout(() => {
          if (this.imageViewerComponent && this.imageViewerComponent.length) {
            this.saleOrder.orderDetailDtoList.forEach((item, index) => {
              this.imageViewerComponent.toArray()[index].initImages(item.orderDetailId, TableTypeEnum.SALES_ORDER_DETAIL);
            });
            // this.imageViewerComponent.initImages(this.order.orderId, TableTypeEnum.SALES_ORDER);
          }
        }, 800);
        // this.imageViewerComponent.initImages(id, TableTypeEnum.SALES_ORDER);

      })
      .catch(error => {
        this.utilities.showErrorToast(error)
        this.loaderService.hideLoader();
      });
  }

  ngOnInit() {

    this._actSvc.filter({
      "pageNumber": 1,
      "pageSize": 9999,
      "plantId": this.selectedPlant?.plantId,
      accountPosition: 'CUSTOMER'
    }).then(result => {
      this.actListSubject.next(result['content']);
    }).catch(error => console.log(error));
  }


  closeModal() {
    this.params.transferObj = null;
    this.params.title = '';
    this.myModal.hide();
  }

  getOrderId(itemId) {
    this._saleSvc.filterOrderDetails({
      'orderByDirection': 'desc',
      'orderByProperty': 'orderDetailId',
      'orderDetailId': itemId,
      'pageNumber': 1,
      'pageSize': 10
    }).toPromise().then(res => {
      if (res['content'] && res['content'].length > 0) {
        this.initialize(res['content'][0].orderId);
      }
    })
  }
  showDetailDialog(id, type: string) {
    this.loaderService.showDetailDialog(DialogTypeEnum[type], id);
  }

  get TotalSalesPrice() {
    return this.saleOrder?.orderDetailDtoList?.reduce((total, item) => total + item.salePrice, 0) || 0;
  }

  showTemplate() {
    this.printAction.next('delivery-note');
  }
}
