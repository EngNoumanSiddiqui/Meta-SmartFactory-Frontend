import {Injectable} from '@angular/core';
import {HttpControllerService} from '../../core/http-controller.service';
import {OptionService} from '../../base/option-service';

@Injectable()
export class ReservationService {

  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService) {
  }

  cancel(id: string) {
    return this._httpSvc.get('stock/cancel/' + id, this._opt.getHeader());
  }

  getReservationDetailForUpdate(id: string) {
    return this._httpSvc.get('stock/StockReservation/' + id, this._opt.getHeader());
  }

  //
  saveStockReservationList(data) {
    return this._httpSvc.post('stock/saveStockReservationList', data, this._opt.getHeader());
  }

  saveStockReservation(data) {
    return this._httpSvc.post('stock/saveStockReservation', data, this._opt.getHeader());
  }


  filter(data) {
    return this._httpSvc.post('stock/filterReservation', data, this._opt.getHeader());
  }
  filterReservationWaitingMaterial(data) {
    return this._httpSvc.post('stock/filterReservationWaitingMaterial', data, this._opt.getHeader());
  }

  filterObservable(data) {
    return this._httpSvc.postObservable('stock/filterReservation', data, this._opt.getHeader());
  }


}
