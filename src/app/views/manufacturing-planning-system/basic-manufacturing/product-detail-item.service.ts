import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class ProductDetailItemCommunicatingService {

    public onhide = new Subject<any>();
    public get seletedProdDTItem(): any {
        return this._seletedProdDTItem;
    }
    public set seletedProdDTItem(v: any) {
        this._seletedProdDTItem = v;
    }

    private _seletedProdDTItem: any = null;
    constructor() { }

}
