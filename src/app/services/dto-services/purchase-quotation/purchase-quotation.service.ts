import { Injectable } from '@angular/core';
import { BasePageService } from '../../base/base-page.service';
import { HttpControllerService } from '../../core/http-controller.service';
import { OptionService } from '../../base/option-service';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from 'environments/environment';
import { debounceTime, switchMap } from 'rxjs/operators';

@Injectable()
export class PurchaseQuotationService extends BasePageService {
    // for purchase orders page
    private _purchaseQuotationList = new BehaviorSubject(null);
    public purchaseQuotationList = this._purchaseQuotationList.asObservable();
    public searchPurchaseQuotationTerms = new Subject<any>();
    public purchaseQuotationPageOpenFirstTime = true;

    private _purchaseQuotationPageFilter = {
        pageNumber: 1,
        pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
        orderByProperty: 'purchaseQuotationId',
        orderByDirection: 'desc',
        createDate: null,
        description: null,
        purchaseQuotationId: null,
        purchaseQuotationStatus: null,
        query: null,
        requiredDate: null,
        updateDate: null,
        vendorId: null,
        purchaseQuotationStatusList: []
    };
    
    public get purchaseQuotationPageFilter(): any {
        return this._purchaseQuotationPageFilter;
    }
    public set purchaseQuotationPageFilter(v: any) {
        this._purchaseQuotationPageFilter = v;
    }

    // for purchase quotation items page
    // for purchase quotation page
    private _purchaseQuotationItemList = new BehaviorSubject(null);
    public purchaseQuotationItemList = this._purchaseQuotationItemList.asObservable();
    public searchpurchaseQuotationItemTerms = new Subject<any>();
    public purchaseQuotationItemPageOpenFirstTime = true;

    private _purchaseQuotationItemPageFilter = {
        pageNumber: 1,
        pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
        orderByProperty: 'purchaseQuotationDetailId',
        orderByDirection: 'desc',
        baseUnit: null,
        batch: null,
        createDate: null,
        currency: null,
        deliveryCost: null,
        deliveryDate: null,
        effectivePrice: null,
        netPrice: null,
        orderUnit: null,
        plantId: null,
        purchaseQuotationDetailId: null,
        purchaseQuotationDetailStatus: null,
        purchaseQuotationId: null,
        query: null,
        quotedQuantity: null,
        requestedQuantity: null,
        stockId: null,
        unitPrice: null,
        updateDate: null,
        validUntil: null,
        purchaseQuotationDetailStatusList: [],
        purchaseQuotationStatusList: []
    };
    
    public get purchaseQuotationItemPageFilter(): any {
        return this._purchaseQuotationItemPageFilter;
    }
    public set purchaseQuotationItemPageFilter(v: any) {
        this._purchaseQuotationItemPageFilter = v;
    }

    constructor(private _httpSvc: HttpControllerService, private _opt: OptionService) {
        super();
        this.searchPurchaseQuotationTerms.pipe(debounceTime(400), switchMap(term => this.filterObservable(term))).subscribe(result => {
            this._purchaseQuotationList.next(result);
        },
            error => {
                this._purchaseQuotationList.thrownError(error);
            }
        );

        this.searchpurchaseQuotationItemTerms.pipe(debounceTime(400), switchMap(term => this.filterDetailItems(term))).subscribe(result => {
            this._purchaseQuotationItemList.next(result);
        },
            error => {
                this._purchaseQuotationItemList.thrownError(error);
            }
        );
    }


    filter(data) { return this._httpSvc.post('purchase/quotation/filter', data, this._opt.getHeader()); }
    filterObservable(data) { return this._httpSvc.postObservable('purchase/quotation/filter', data, this._opt.getHeader()); }

    filterDetailItems(data) { return this._httpSvc.postObservable('purchase/quotation/detail/filter', data, this._opt.getHeader()); }

    getDetail(id: string) { return this._httpSvc.get('purchase/quotation/detail/' + id, this._opt.getHeader()); }
    getDetailItem(id: string) { return this._httpSvc.get('purchase/quotation/detail/detail/' + id, this._opt.getHeader()); }

    delete(id: string) { return this._httpSvc.delete('purchase/quotation/delete/' + id, this._opt.getHeader()); }
    deleteDetailItem(id: any) { return this._httpSvc.delete('purchase/quotation/detail/delete/' + id, this._opt.getHeader()); }

    save(data) { return this._httpSvc.post('purchase/quotation/save', data, this._opt.getHeader()); }
    saveDetailItem(data) { return this._httpSvc.post('purchase/quotation/detail/save', data, this._opt.getHeader()); }
}
