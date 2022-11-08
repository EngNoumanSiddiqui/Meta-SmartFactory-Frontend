import { Injectable } from '@angular/core';
import { HttpControllerService } from '../../core/http-controller.service';
import { BasePageService } from 'app/services/base/base-page.service';
import { OptionService } from '../../base/option-service';
import { Subject, BehaviorSubject } from 'rxjs';
import { environment } from 'environments/environment';
import { debounceTime, switchMap } from 'rxjs/operators';

@Injectable()

export class StockTransferNotificationService extends BasePageService {

  public saveAction$: Subject<any> = new Subject();

  private _stockTransferList = new BehaviorSubject(null);
  public stockTransferList = this._stockTransferList.asObservable();
  public searchstockTransferTerms = new Subject<any>();
  public stockTransferPageOpenFirstTime = true;
  tomorrow = new Date();

  private _pageFilter = {
    actId: null,
    baseUnit: null,
    batch: null,
    defected: null,
    description: null,
    documentDate: null,
    documentNo: null,
    employeeId: null,
    employeeName: null,
    endDate: this.tomorrow,
    goodMovementDocumentType: null,
    goodsMovementActivityType: null,
    goodsMovementStatus: null,
    groupCodeId: null,
    itemNo: null,
    materialId: null,
    materialName: null,
    materialNo: null,
    orderByDirection: null,
    orderByProperty: null,
    orderDetailId: null,
    orderId: null,
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    plantId: null,
    plantName: null,
    postingDate: null,
    prodOrderId: null,
    purchaseOrderId: null,
    quantity: null,
    query: null,
    startDate: null,
    stockId: null,
    stockTransferDetailId: null,
    stockTransferReceipNotificationtId: null,
    wareHouseFromId: null,
    wareHouseFromName: null,
    wareHouseToId: null,
    wareHouseToName: null,
    goodsMovementActivityTypeList: [],
    goodsMovementStatusList: [],
    goodMovementDocumentTypeList: [],
    dispatchingStatusEnumList: []
  };
  public get pageFilter(): any {
    return this._pageFilter;
  }
  public set pageFilter(v: any) {
    this._pageFilter = v;
  }
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService) {
    super();
    this.tomorrow.setDate(new Date().getDate() + 1);
    this.pageFilter.endDate = this.tomorrow;
    this.searchstockTransferTerms.pipe(debounceTime(400),
      switchMap(term => this.filterStockTransferReceiptNotificationObs(term))).subscribe(result => {
        this._stockTransferList.next(result);
      },
        error => {
          this._stockTransferList.thrownError(error);
        }
      );
  }

  resetFilter() {
    this._pageFilter = {
      actId: null,
      baseUnit: null,
      batch: null,
      defected: null,
      description: null,
      documentDate: null,
      documentNo: null,
      employeeId: null,
      employeeName: null,
      endDate: new Date(),
      goodMovementDocumentType: null,
      goodsMovementActivityType: null,
      goodsMovementStatus: null,
      groupCodeId: null,
      itemNo: null,
      materialId: null,
      materialName: null,
      materialNo: null,
      orderByDirection: null,
      orderByProperty: null,
      orderDetailId: null,
      orderId: null,
      pageNumber: 1,
      pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
      plantId: this._pageFilter.plantId,
      plantName: null,
      postingDate: null,
      prodOrderId: null,
      purchaseOrderId: null,
      quantity: null,
      query: null,
      startDate: null,
      stockId: null,
      stockTransferDetailId: null,
      stockTransferReceipNotificationtId: null,
      wareHouseFromId: null,
      wareHouseFromName: null,
      wareHouseToId: null,
      wareHouseToName: null,
      goodsMovementActivityTypeList: [],
      goodsMovementStatusList: [],
      goodMovementDocumentTypeList: [],
      dispatchingStatusEnumList: []
    };
  }



  dispatchingPlan(data) { return this._httpSvc.post('stocktransferreceiptnotification/dispatchingPlan', data, this._opt.getHeader()); }
  filterStockTransferReceiptNotification(data) { return this._httpSvc.post('stocktransferreceiptnotification/filterstocktransferreceiptnotification/items', data, this._opt.getHeader()); }
  filterStockTransferReceiptNotificationObs(data) { return this._httpSvc.postObservable('stocktransferreceiptnotification/filterstocktransferreceiptnotification/items', data, this._opt.getHeader()); }

  saveStockTransferReceiptNotification(data) { return this._httpSvc.post('stocktransferreceiptnotification/save', data, this._opt.getHeader()); }

  getStockTransferReceiptNotificationDetail(id: string) { return this._httpSvc.get('stocktransferreceiptnotification/detail/' + id, this._opt.getHeader()); }

  confirm(id) { return this._httpSvc.get('stocktransferreceiptnotification/confirm/' + id, this._opt.getHeader()); }
  changeStatus(stockTransferReceiptNotificationDetailId) { return this._httpSvc.get('stocktransferreceiptnotification/changeStatus/' + stockTransferReceiptNotificationDetailId, this._opt.getHeader()); }

  confirmNotification(data) { return this._httpSvc.post('stocktransferreceiptnotification/confirmNotification', data, this._opt.getHeader()); }

  confirmNotificationList(data) { return this._httpSvc.post('stocktransferreceiptnotification/confirmNotificationList', data, this._opt.getHeader()); }
  panelConfirmNotificationList(data) { return this._httpSvc.post('panel/stocktransferreceiptnotification/confirmNotificationList', data, this._opt.getHeader()); }

  cancel(id) { return this._httpSvc.get('stocktransferreceiptnotification/cancel/' + id, this._opt.getHeader()); }

}
