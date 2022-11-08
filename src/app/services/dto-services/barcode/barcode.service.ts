import {Injectable} from '@angular/core';
import {BasePageService} from '../../base/base-page.service';
import {HttpControllerService} from '../../core/http-controller.service';
import {OptionService} from '../../base/option-service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class BarCodeService extends BasePageService {
  constructor(
    private _httpSvc: HttpControllerService, 
    private httpClient: HttpClient,
    private _opt: OptionService) {
    super();
  }


  getBarcode(barcode) {
    return this._httpSvc.get('barcode-qr/barcode/ean13/' + barcode, this._opt.getBlobHeader());
  }

  getQRCode(qrCode) {
    return this._httpSvc.get('barcode-qr/barcode/ean13/' + qrCode + '/4', this._opt.getFileHeader());
  }
}
