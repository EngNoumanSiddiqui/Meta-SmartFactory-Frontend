
import {Injectable} from '@angular/core';
import {BasePageService} from '../../base/base-page.service';
import {HttpControllerService} from '../../core/http-controller.service';
import {OptionService} from '../../base/option-service';
import { BehaviorSubject } from 'rxjs';
/**
 * Created by reis on 31.07.2019.
 */


@Injectable()
export class ProductTreeService extends BasePageService {
  
  private productTreeMaterial =  new BehaviorSubject<any>(null);

  productTreeMaterial$ = this.productTreeMaterial.asObservable();

  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) {
    super();
  }

  setProductTreeMaterial(material){
    this.productTreeMaterial.next(material);
  }

  get(id: string) { return this._httpSvc.get('productTree/detail/' + id, this._opt.getHeader()); }
  
  delete(id: string) { return this._httpSvc.delete('productTree/delete/' + id, this._opt.getHeader()); }
  deleteProductTreeDetail(id: string) { return this._httpSvc.delete('productTreeDetail/delete/' + id, this._opt.getHeader()); }

  getProductTreeStatus() { return this._httpSvc.get('productTreeStatus',this._opt.getHeader()); }
  
  getObservable(id: string) { return this._httpSvc.getObservable('productTree/detail/' + id, this._opt.getHeader()); }

  clone(data) {
    return this._httpSvc.post('productTree/save', data, this._opt.getHeader());
  }
  save(data) { return this._httpSvc.post('productTree/save', data, this._opt.getHeader()); }
  saveProductTreeDetail(data) { return this._httpSvc.post('productTreeDetail/save', data, this._opt.getHeader()); }

  filter(data) { return this._httpSvc.post('productTree/filter', data, this._opt.getHeader()); }

  filterObservable(data) { return this._httpSvc.postObservable('productTree/filter', data, this._opt.getHeader()); }
}
