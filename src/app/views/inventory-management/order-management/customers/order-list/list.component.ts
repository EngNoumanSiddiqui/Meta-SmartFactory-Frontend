import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { OrderDetailDto, ResponseOrderFilterListDto } from 'app/dto/sale-order/sale-order.model';
import { environment } from 'environments/environment';
import { SalesOrderService } from 'app/services/dto-services/sales-order/sales-order.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
;


@Component({
  selector: 'customer-all-orders',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListCustomerAllOrdersComponent implements OnInit {

  @Output() selectedOrderDetailEvent = new EventEmitter<OrderDetailDto>();

  @Input('actId') set act(actId) {
    this.pageFilter.actId = actId;
    this.filter();

  }

  pageFilter = {
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    stockId: null,
    actName: null,
    actId: null,
    orderNo: null,
    description: null,
    orderStatus: null,
    orderStartDate: null,
    orderEndDate: null,
    orderTypeName: null,
    deliveryDate: null,
    query: null,
    orderByProperty: 'orderDate',
    orderByDirection: 'desc'
  };

  pagination = {
    totalElements: 0,
    currentPage: 1,
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    totalPages: 1,
    TotalPageLinkButtons: 5,
    RowsPerPageOptions: [10, 20, 30, 50, 100, 1000],
    rows: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    tag: ''
  };


  selectedOrderId;

  @Input('selectedOrderId') set order(selectedOrderId) {
    this.selectedOrderId = selectedOrderId;
  }

  saleOrders: ResponseOrderFilterListDto[] = [];


  constructor(private _orderSvc: SalesOrderService,
              private loaderService: LoaderService, private utilities: UtilitiesService) {

  }

  ngOnInit() {
  }

  selectedOrderDetailId;

  fireSelectedOrderDetail(orderDetail: OrderDetailDto, orderId) {
    this.selectedOrderDetailEvent.next(orderDetail);
    this.selectedOrderId = orderId;
    this.selectedOrderDetailId = orderDetail.orderDetailId;
  }


  filter() {
    this.loaderService.showLoader();


    this._orderSvc.filter(this.pageFilter)
      .then(result => {
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.saleOrders = result['content'] as ResponseOrderFilterListDto[];
        this.loaderService.hideLoader();
        if (this.saleOrders.length > 0) {
          const order = this.saleOrders[0];
          if (order.orderDetailDtoList && order.orderDetailDtoList.length > 0) {
            this.fireSelectedOrderDetail(order.orderDetailDtoList[0], order.orderId);
          }
        }

      })
      .catch(error => {
        this.saleOrders = [] as ResponseOrderFilterListDto[];
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }

  myChanges(event) {
    this.pagination.currentPage = event.currentPage;
    this.pagination.pageNumber = event.pageNumber;
    this.pagination.totalElements = event.totalElements;
    this.pagination.pageSize = event.pageSize;
    this.pagination.TotalPageLinkButtons = event.totalPageLinkButtons;
    if (this.pagination.tag !== event.searchItem) {
      this.pagination.pageNumber = 1;
    }
    this.pagination.tag = event.searchItem;

    this.pageFilter.pageNumber = this.pagination.pageNumber;
    this.pageFilter.pageSize = this.pagination.pageSize;
    this.pageFilter.query = this.pagination.tag;

    setTimeout(() => {
      this.filter()
    }, 500);
  }

}


