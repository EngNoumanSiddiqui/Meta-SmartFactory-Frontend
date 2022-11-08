import { Injectable } from '@angular/core';
import { BasePageService } from '../../base/base-page.service';
import { HttpControllerService } from '../../core/http-controller.service';
import { OptionService } from '../../base/option-service';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from 'environments/environment';
import { debounceTime, switchMap } from 'rxjs/operators';

@Injectable()
export class PorderService extends BasePageService {
  // for purchase orders page
  private _purchaseOrderList = new BehaviorSubject(null);
  public purchaseOrderList = this._purchaseOrderList.asObservable();
  public searchPurchaseOrderTerms = new Subject<any>();
  public purchaseOrderPageOpenFirstTime = true;

  private _purchaseOrderPageFilter = {
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    startDate: null,
    endDate: null,
    query: null,
    orderByProperty: 'porderId',
    orderByDirection: 'desc',
    baseUnit: null,
    batch: null,
    plantId: null,
    organizationId: null,
    purchaseOrderStatus: null,
    purchaseOrderType: null,
    orderUnit: null,
    quantity: null,
    stockId: null,
    porderDate: null,
    totalIncomeQuantity: null,
    wareHouseId: null,
    plantName: null,
    stockName: null,
    warehouseName: null,
    purchaseOrderTypeList: [],
    purchaseOrderStatusList: [],
    priorityList: []
  };
  public get purchaseOrderPageFilter(): any {
    return this._purchaseOrderPageFilter;
  }
  public set purchaseOrderPageFilter(v: any) {
    this._purchaseOrderPageFilter = v;
  }

  // for purchage items page
  // for purchase orders page
  private _purchaseOrderItemList = new BehaviorSubject(null);
  public purchaseOrderItemList = this._purchaseOrderItemList.asObservable();
  public searchPurchaseOrderItemTerms = new Subject<any>();
  public purchaseOrderItemPageOpenFirstTime = true;

  private _purchaseOrderItemPageFilter = {
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    startDate: null,
    endDate: null,
    query: null,
    orderByProperty: 'porderId',
    orderByDirection: 'desc',
    baseUnit: null,
    batch: null,
    porderDate: null,
    plantId: null,
    purchaseOrderStatus: null,
    purchaseOrderType: null,
    orderUnit: null,
    quantity: null,
    stockId: null,
    totalIncomeQuantity: 0,
    wareHouseId: null,
    plantName: null,
    stockName: null,
    stockNo: null,
    supplier: null,
    warehouseName: null,
    priority: null,
    purchaseOrderStatusList: [],
    purchaseOrderTypeList:[],
    priorityList:[]
  };
  public get purchaseOrderItemPageFilter(): any {
    return this._purchaseOrderItemPageFilter;
  }
  public set purchaseOrderItemPageFilter(v: any) {
    this._purchaseOrderItemPageFilter = v;
  }

  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService) {
    super();
    this.searchPurchaseOrderTerms.pipe(debounceTime(400), switchMap(term => this.filterObservable(term))).subscribe(result => {
      this._purchaseOrderList.next(result);
    },
      error => {
        this._purchaseOrderList.thrownError(error);
      }
    );

    this.searchPurchaseOrderItemTerms.pipe(debounceTime(400), switchMap(term => this.filterDetailItems(term))).subscribe(result => {
      this._purchaseOrderItemList.next(result);
    },
      error => {
        this._purchaseOrderItemList.thrownError(error);
      }
    );
  }

  getDetail(id: string) { return this._httpSvc.get('porder/detail/' + id, this._opt.getHeader()); }

  getDetailItem(id: string) { return this._httpSvc.get('porder/detailItem/' + id, this._opt.getHeader()); }

  getUpdateDetail(id: string) { return this._httpSvc.get('porder/detail/update/' + id, this._opt.getHeader()); }

  delete(id: string) { return this._httpSvc.delete('porder/deletePorder/' + id, this._opt.getHeader()); }
  complete(data) { return this._httpSvc.post('porder/complete', data, this._opt.getHeader()); }
  save(data) { return this._httpSvc.post('porder/save', data, this._opt.getHeader()); }

  update(data) { return this._httpSvc.post('porder/update', data, this._opt.getHeader()); }

  filter(data) { return this._httpSvc.post('porder/filterPorder', data, this._opt.getHeader()); }

  filterObservable(data) { return this._httpSvc.postObservable('porder/filterPorder', data, this._opt.getHeader()); }

  filterDetailItems(data) { return this._httpSvc.postObservable('porder/filterPorder/detail-items', data, this._opt.getHeader()); }

  filterDetItems(data) { return this._httpSvc.post('porder/filterPorder/detail-items', data, this._opt.getHeader()); }

  deletePOrderItem(id: string) { return this._httpSvc.delete('porder/deletePorderItem/' + id, this._opt.getHeader()); }


}
