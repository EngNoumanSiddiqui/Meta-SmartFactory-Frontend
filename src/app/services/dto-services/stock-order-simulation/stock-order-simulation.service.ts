import { Injectable } from "@angular/core";
import { BasePageService } from "../../base/base-page.service";
import { HttpControllerService } from "../../core/http-controller.service";
import { OptionService } from "../../base/option-service";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { debounceTime, switchMap } from "rxjs/operators";
import { environment } from "environments/environment";
import { ShareHttpCallsService } from "../shared-http-calls.service";
import {
  SimulationRequestDto,
  SimulationResponse,
} from "../../../views/manufacturing-planning-system/advance-manufacturing/material-handling-simulation/similation-response.model";

@Injectable()
export class StockOrderSimulationService extends BasePageService {
  // for sale orders page
  private _stockOrderSimulationList = new BehaviorSubject(null);
  public stockOrderSimulationList =
    this._stockOrderSimulationList.asObservable();
  public searchTerms = new Subject<any>();
  protected plantChanged = new BehaviorSubject(null);
  public salesOrderPageOpenFirstTime = true;

  private _stockOrderPageFilter: SimulationRequestDto = {
    customerName: null,
    customerNo: null,
    finishDate: null,
    orderByDirection: null,
    orderByProperty: null,
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize)
      ? Number(environment.filterRowSize)
      : 10,
    query: null,
    startDate: null,
    plantId: 55,
    stockName: null,
    stockNo: null,
    stockTypeId: null,
    workstationName: null,
    workstationNo: null,
  };

  //
  // private _stockOrderPageFilter = {
  //   pageNumber: 1,
  //   pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
  //   plantId: null,
  //   actId: null,
  //   createDate: null,
  //   orderId: null,
  //   orderQuotationDetailId: null,
  //   orderQuotationStatus: null,
  //   quaotationId: null,
  //   quaotationNo: null,
  //   query: null,
  //   quotationDate: null,
  //   stockId: null,
  //   orderByProperty: 'quaotationId',
  //   orderByDirection: 'desc'
  // };

  public get stockOrderPageFilter(): SimulationRequestDto {
    return this._stockOrderPageFilter;
  }

  public set stockOrderPageFilter(v: SimulationRequestDto) {
    this._stockOrderPageFilter = v;
  }

  // for sale order items page
  private _salesOrderItemList = new BehaviorSubject(null);
  public stockOrderList: Observable<SimulationResponse> =
    this._salesOrderItemList.asObservable();
  // public searchSaleItemsTerms = new Subject<any>();

  private _salesOrderItemPageFilter = {
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize)
      ? Number(environment.filterRowSize)
      : 10,
    query: null,
    orderByProperty: "orderQuotationDetailId",
    orderByDirection: "desc",
    deliveryDate: null,
    dimensionUnit: null,
    orderDetailQuotationStatus: null,
    orderQuotationDetailId: null,
    orderQuotationId: null,
    plantId: null,
    priority: null,
    stockId: null,
  };

  public get salesOrderItemPageFilter(): any {
    return this._salesOrderItemPageFilter;
  }

  public set salesOrderItemPageFilter(v: any) {
    this._salesOrderItemPageFilter = v;
  }

  constructor(
    private _httpSvc: HttpControllerService,
    private _httpSharedvc: ShareHttpCallsService,
    private _opt: OptionService
  ) {
    super();

    this.searchTerms
      .pipe(
        debounceTime(400),
        switchMap((term) => this.getMaterialHandlingSimulationDto(term))
      )
      .subscribe(
        (result) => {
          this._salesOrderItemList.next(result);
        },
        (error) => {
          this._salesOrderItemList.thrownError(error);
        }
      );
  }

  getMaterialHandlingSimulationDto(data: SimulationRequestDto) {
    return this._httpSvc.postObservable(
      "datawarehouse/stock/report/getMaterialHandlingSimulationDto",
      data,
      this._opt.getHeader()
    );
  }

  getMaterialHandlingSimulationDtoPromise(data: SimulationRequestDto) {
    return this._httpSvc.post(
      "datawarehouse/stock/report/getMaterialHandlingSimulationDto",
      data,
      this._opt.getHeader()
    );
  }

  delete(id: string) {
    return this._httpSvc.delete(
      "order/quotation/delete/" + id,
      this._opt.getHeader()
    );
  }

  deleteOrderDetail(id) {
    return this._httpSvc.delete(
      "order/quotation/detail/delete/" + id,
      this._opt.getHeader()
    );
  }

  getDetail(id: string) {
    return this._httpSvc.get(
      "order/quotation/detail/" + id,
      this._opt.getHeader()
    );
  }

  getItemDetail(id: string) {
    return this._httpSvc.get(
      "order/quotation/detail/detail/" + id,
      this._opt.getHeader()
    );
  }

  // getUpdateDetail(id: string) { return this._httpSvc.get('order/detail/update/' + id, this._opt.getHeader()); }

  save(data) {
    return this._httpSvc.post(
      "order/quotation/save",
      data,
      this._opt.getHeader()
    );
  }

  saveItem(data) {
    return this._httpSvc.post(
      "order/quotation/detail/save",
      data,
      this._opt.getHeader()
    );
  }

  // update(data) { return this._httpSvc.post('order/quotation/update', data, this._opt.getHeader()); }
  // updateDeliveryDate(data) { return this._httpSvc.post('order/updateDeliveryDate', data, this._opt.getHeader()); }
  filter(data) {
    return this._httpSvc.post(
      "order/quotation/filter",
      data,
      this._opt.getHeader()
    );
  }

  filterObservable(data) {
    return this._httpSvc.postObservable(
      "order/quotation/filter",
      data,
      this._opt.getHeader()
    );
  }

  filterOrderRDetails(data) {
    return this._httpSvc.post(
      "order/quotation/detail/filter",
      data,
      this._opt.getHeader()
    );
  }

  filterOrderDetails(data) {
    return this._httpSvc.postObservable(
      "order/quotation/detail/filter",
      data,
      this._opt.getHeader()
    );
  }

  // filterOrderRemainingDetails(data) { return this._httpSvc.postObservable('order/quotation/detail/filterRemaining', data, this._opt.getHeader()); }

  getSaleQuotationsStatus() {
    return this._httpSharedvc
      .get("OrderQuotationStatusEnum", this._opt.getHeader())
      .toPromise();
  }

  // getLastOrderNos() { return this._httpSvc.get('order/lastordernos', this._opt.getHeader()); }

  // getDeliveryNotCompletedOrders(actId: any) {
  //   return this._httpSvc.get('order/customer/' + actId, this._opt.getHeader());
  // }

  // getSalesOrderTypes() { return this._httpSvc.get('order/orderTypes', this._opt.getHeader()); }

  // getPurchaseOrderTypes() { return this._httpSharedvc.get('PurchaseOrderTypeEnum', this._opt.getHeader()).toPromise(); }

  // getPurchaseOrderStatus() { return this._httpSharedvc.get('PurchaseOrderStatusEnum', this._opt.getHeader()).toPromise(); }

  // getUpdatePurchaseDetail(id:string) { return this._httpSvc.get('porder/detail/'+id, this._opt.getHeader()); }

  // getOrderDetailListByOrderId(id){ return this._httpSvc.get('order/orderDetail/'+id, this._opt.getHeader()); }

  // getFilterOverdue(data) { return this._httpSvc.post('order-detail/filterOverdue', data, this._opt.getHeader()); }

  watchStorage(): Observable<any> {
    return this.plantChanged;
  }

  plantUpdate() {
    this.plantChanged.next(null);
  }
}
