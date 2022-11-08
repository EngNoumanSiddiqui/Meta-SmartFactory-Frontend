import { Injectable } from '@angular/core';
import { BasePageService } from '../../base/base-page.service';
import { HttpControllerService } from '../../core/http-controller.service';
import { OptionService } from '../../base/option-service';
import { Subject } from 'rxjs';

@Injectable()
export class ActService extends BasePageService {
  saveAction$ = new Subject<any>();
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService) {
    super();
  }

  getDetail(id: any) { return this._httpSvc.get('act/detail/' + id, this._opt.getHeader()); }

  getUpdateDetail(id: string) { return this._httpSvc.get('act/detail/update/' + id, this._opt.getHeader()); }

  delete(id: string) { return this._httpSvc.delete('act/deleteAct/' + id, this._opt.getHeader()); }

  save(data) { return this._httpSvc.post('act/save', data, this._opt.getHeader()); }

  update(data) { return this._httpSvc.post('act/update', data, this._opt.getHeader()); }

  filter(data) { return this._httpSvc.post('act/filterAct', data, this._opt.getHeader()); }

  accountContactPersonfilter(data) { return this._httpSvc.post('act/contactperson/filter', data, this._opt.getHeader()); }

  saveActContactPerson(data) {
    return this._httpSvc.post('act/contactperson/save', data, this._opt.getHeader());
  }

  saveActContactPersonObservable(data) {
    return this._httpSvc.post('act/contactperson/save', data, this._opt.getHeader());
  }

  deleteActContactPerson(id) {
    return this._httpSvc.delete('act/contactperson/delete/' + id, this._opt.getHeader());
  }
  getActContactPersonDetail(id: string) { return this._httpSvc.get('act/contactperson/detail/' + id, this._opt.getHeader()); }


  filterObservable(data) { return this._httpSvc.postObservable('act/filterAct', data, this._opt.getHeader()); }


  getActSupplier() { return this._httpSvc.get('act/actSupplierList', this._opt.getHeader()); }
  getActSupplierByPlantId(plantId) { return this._httpSvc.get('act/actSupplierList/' + plantId, this._opt.getHeader()); }

  getActCustomer() { return this._httpSvc.get('act/actCustomerList', this._opt.getHeader()); }
  getActCustomerByPlantId(plantId) { return this._httpSvc.get('act/actCustomerList/' + plantId, this._opt.getHeader()); }

  // getActCustomerByPlantIdAccountPosition(plantId, accountPosition) { return this._httpSvc.get('act/actCustomerList/' + plantId + '/' + accountPosition , this._opt.getHeader()); }

  getActAll() { return this._httpSvc.get('act/actList', this._opt.getHeader()); }

  getLastActNos() { return this._httpSvc.get('act/lastactnos', this._opt.getHeader()); }


  sendMailWithAttachment(data, formData) {
    return this._httpSvc.post('email/sendMailWithAttachment?body='+ data.body
    +'&from='+ data.from+'&to='+data.to+'&subject='+data.subject, formData, this._opt.getFileHeader());
  }
  sendMailCCBCCWithAttachment(data, formData) {
    return this._httpSvc.post('email/sendMailCCBCCWithAttachment?body='+ data.body
    +'&from='+ data.from+'&to='+data.to+'&ccList='+data.ccList+'&bccList='+data.bccList
    +'&subject='+data.subject, formData, this._opt.getFileHeader());
  }

  sendMailCCBCCWithAttachmentV2(data, formData) {
    formData.append('email', new Blob([JSON.stringify(data)], {
      type: 'application/json'
    }));
    return this._httpSvc.post('email/sendMailCCBCCWithAttachmentV2', formData, this._opt.getFileHeader());
  }

  // sendMailCCBCCWithAttachment(formData) {
  //   return this._httpSvc.post('email/sendMailCCBCCWithAttachment', formData, this._opt.getFileHeader());
  // }
  sendMail(data) {
    return this._httpSvc.post('email/sendMail', data, this._opt.getFileHeader());
  }
}
