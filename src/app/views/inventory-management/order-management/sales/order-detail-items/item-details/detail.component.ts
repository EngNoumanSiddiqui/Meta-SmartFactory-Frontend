import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { ResponseOrderListDto } from 'app/dto/sale-order/sale-order.model';
import { SalesOrderService } from 'app/services/dto-services/sales-order/sales-order.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { OrderDetailPlanComponent } from '../../order-plan/list.component';
import {ModalDirective} from 'ngx-bootstrap/modal';

@Component({
  selector: 'sales-item-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.componet.scss']
})
export class SalesItemDetailComponent implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;
  @ViewChild('orderDetailPlan') orderDetailPlanComponent: OrderDetailPlanComponent;

  id;
  saleOrder: ResponseOrderListDto;
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
  notificationTree = [];
  itemId: any;

  @Input('id') set x(id) {
    this.id = id;
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
              private _saleSvc: SalesOrderService,
              private loaderService: LoaderService, private utilities: UtilitiesService) {

    // this._route.params.subscribe((params) => {
    //   this.id = params['id'];
    //   this.initialize(this.id);
    // });

  }

  public initialize(id: string) {
    this.loaderService.showLoader();
    this._saleSvc.getOrderDetailListByOrderId(id)
      .then(result => {
        console.log(result);
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
          });
          this.notificationTree = notifications;
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
        this.loaderService.hideLoader();
      })
      .catch(error => {
        this.utilities.showErrorToast(error)
        this.loaderService.hideLoader();
      });
  }

  ngOnInit() {
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
}
