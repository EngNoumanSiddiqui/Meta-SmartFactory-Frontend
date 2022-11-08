import { Injectable } from '@angular/core';
import { BasePageService } from '../../base/base-page.service';
import { HttpControllerService } from '../../core/http-controller.service';
import { OptionService } from '../../base/option-service';
import { Subject, BehaviorSubject } from 'rxjs';
import { debounceTime, switchMap, filter, map } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { ShareHttpCallsService } from '../shared-http-calls.service';

@Injectable()
export class SalesOrderService extends BasePageService {

  // for sale orders page
  private _salesOrderList = new BehaviorSubject(null);
  public salesOrderList = this._salesOrderList.asObservable();
  public searchTerms = new Subject<any>();
  public salesOrderPageOpenFirstTime = true;


  private _salesOrderPageFilter = {
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    stockId: null,
    plantId: null,
    organizationId: null,
    actName: null,
    orderNo: null,
    description: null,
    orderStatus: null,
    orderStartDate: null,
    orderEndDate: null,
    orderDate: null,
    orderTypeName: null,
    deliveryDate: null,
    query: null,
    orderByProperty: 'orderDate',
    orderByDirection: 'desc',
    orderStatusList: []
  };
  public get salesOrderPageFilter(): any {
    return this._salesOrderPageFilter;
  }
  public set salesOrderPageFilter(v: any) {
    this._salesOrderPageFilter = v;
  }

  // for sale order items page
  private _salesOrderItemList = new BehaviorSubject(null);
  public salesOrderItemList = this._salesOrderItemList.asObservable();
  public searchSaleItemsTerms = new Subject<any>();
  public searchSaleReportTerms = new Subject<any>();
  private _salesOrderReportList = new BehaviorSubject(null);
  public salesOrderReportList = this._salesOrderReportList.asObservable();

  private _salesOrderItemPageFilter = {
    pageNumber: 1,
    pageSize: 1000,
    query: null,
    orderByProperty: 'orderDate',
    orderByDirection: 'desc',
    actId: null,
    actName: null,
    actNo: null,
    batch: null,
    completedQuantity: null,
    deliveredQuantity: null,
    deliveryDate: null,
    description: null,
    documentNo: null,
    endDate: null,
    orderDetailId: null,
    orderId: null,
    orderNo: null,
    orderStatus: null,
    orderTypeName: null,
    plannedQuantity: null,
    organizationId: null,
    plantName: null,
    quantity: null,
    startDate: null,
    stockId: null,
    stockName: null,
    warehouseName: null,
    priority: null,
    orderStatusList: []
  };

  public get salesOrderItemPageFilter(): any {
    return this._salesOrderItemPageFilter;
  }
  public set salesOrderItemPageFilter(v: any) {
    this._salesOrderItemPageFilter = v;
  }

  constructor(private _httpSvc: HttpControllerService, private _httpSharedvc: ShareHttpCallsService, private _opt: OptionService) {
    super();

    this.searchTerms.pipe(debounceTime(400), switchMap(term => this.filterObservable(term))).subscribe(result => {
      this._salesOrderList.next(result);
    }, error => {
      this._salesOrderList.thrownError(error);
    });

    this.searchSaleItemsTerms.pipe(debounceTime(400), switchMap(term => this.filterOrderDetails(term))).subscribe(result => {
      this._salesOrderItemList.next(result);
    }, error => {
      this._salesOrderItemList.thrownError(error);
    }
    );

    this.searchSaleReportTerms.pipe(debounceTime(400), switchMap(term => this.filterOrderReporstDetails(term))).subscribe(result => {
      this._salesOrderReportList.next(result);
    }, error => {
      this._salesOrderReportList.thrownError(error);
    }
    );
  }

  delete(id: string) { return this._httpSvc.delete('order/deleteOrder/' + id, this._opt.getHeader()); }

  deleteOrderDetail(id) { return this._httpSvc.delete('order-detail/delete/' + id, this._opt.getHeader()); }

  getDetail(id: string) { return this._httpSvc.get('order/detail/' + id, this._opt.getHeader()); }
  getOrderItemDetail(id: string) { return this._httpSvc.get('order-detail/detail/' + id, this._opt.getHeader()); }

  getUpdateDetail(id: string) { return this._httpSvc.get('order/detail/update/' + id, this._opt.getHeader()); }


  save(data) { return this._httpSvc.post('order/save', data, this._opt.getHeader()); }

  update(data) { return this._httpSvc.post('order/update', data, this._opt.getHeader()); }
  updateDeliveryDate(data) { return this._httpSvc.post('order/updateDeliveryDate', data, this._opt.getHeader()); }

  filter(data) { return this._httpSvc.post('order/filterOrder', data, this._opt.getHeader()); }
  filterObservable(data) { return this._httpSvc.postObservable('order/filterOrder', data, this._opt.getHeader()); }

  filterOrderDetails(data) { return this._httpSvc.postObservable('order-detail/filter', data, this._opt.getHeader()); }
  filterOrderReporstDetails(data) { return this._httpSvc.postObservable('order-detail/filter/report', data, this._opt.getHeader()); }
  filterOrderRemainingDetails(data) { return this._httpSvc.postObservable('order-detail/filterRemaining', data, this._opt.getHeader()); }

  getSaleOrderStatus() { return this._httpSharedvc.get('OrderDetailStatusEnum', this._opt.getHeader()).toPromise(); }
  getLastOrderNos() { return this._httpSvc.get('order/lastordernos', this._opt.getHeader()); }

  getDeliveryNotCompletedOrders(actId: any) {
    return this._httpSvc.get('order/customer/' + actId, this._opt.getHeader());
  }

  getSalesOrderTypes() { return this._httpSvc.get('order/orderTypes', this._opt.getHeader()); }

  getPurchaseOrderTypes() { return this._httpSharedvc.get('PurchaseOrderTypeEnum', this._opt.getHeader()).toPromise(); }
  getUniqueCode(plantId, type) {
    return this._httpSvc.get('batch/createUniqueCode/' + plantId + '/' + type, { ...this._opt.getHeader(), responseType: 'text' });
  }
  getPurchaseOrderStatus() { return this._httpSharedvc.get('PurchaseOrderStatusEnum', this._opt.getHeader()).toPromise(); }

  getUpdatePurchaseDetail(id: string) { return this._httpSvc.get('porder/detail/' + id, this._opt.getHeader()); }

  getOrderDetailListByOrderId(id) { return this._httpSvc.get('order/orderDetail/' + id, this._opt.getHeader()); }

  getFilterOverdue(data) { return this._httpSvc.post('order-detail/filterOverdue', data, this._opt.getHeader()); }

  uploadSalesOrderMedia(formData: FormData, plantId) {
    return this._httpSvc.post('order/upload-sales-orders/' + plantId, formData, this._opt.getFileHeader());
  }
}
