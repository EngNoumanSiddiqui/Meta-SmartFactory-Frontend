import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { ResponseOrderFilterListDto, OrderDetailDto } from 'app/dto/sale-order/sale-order.model';
import { SalesOrderService } from 'app/services/dto-services/sales-order/sales-order.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';


@Component({
  selector: 'customer-orders',
  templateUrl: './list.component.html',
})
export class ListCustomerOrdersComponent implements OnInit {

  @Output() selectedOrderEvent = new EventEmitter<ResponseOrderFilterListDto>();
  @Output() selectedOrderDetailEvent = new EventEmitter<OrderDetailDto>();

  @Input('actId') set act(actId) {
    if (actId) {
      this.filter(actId);
    } else {
      this.saleOrders = null;
    }
  }

  selectedOrderId;

  @Input('selectedOrderId') set order(selectedOrderId) {
    this.selectedOrderId = selectedOrderId;
  }

  saleOrders: any = [];


  constructor(private _orderSvc: SalesOrderService,
              private loaderService: LoaderService, private utilities: UtilitiesService) {

  }

  ngOnInit() {
  }

  selectedOrderChanged(order) {
    this.selectedOrderEvent.next(order);
  }

  fireSelectedOrderDetail(orderDetail: OrderDetailDto) {
    this.selectedOrderDetailEvent.next(orderDetail);
  }


  filter(actId) {
    this.loaderService.showLoader();
    this._orderSvc.getDeliveryNotCompletedOrders(actId)
      .then(result => {
        this.saleOrders = result as ResponseOrderFilterListDto[];
        this.loaderService.hideLoader();
        console.log(result);
      })
      .catch(error => {
        this.saleOrders = [] as ResponseOrderFilterListDto[];
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }


}


