import { Injectable } from '@angular/core';
import { BasePageService } from '../../base/base-page.service';
import { HttpControllerService } from '../../core/http-controller.service';
import { OptionService } from '../../base/option-service';
import { Subject } from 'rxjs';

@Injectable()
export class ProductionOrderService extends BasePageService {
  public saveEventFire = new Subject<any>();
  public saveCompleteEventFire = new Subject<any>();
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService) {
    super();
  }

  // getDetail(id: string) { return this._httpSvc.get('porder/detail/' + id, this._opt.getHeader()); }
  //
  // getUpdateDetail(id: string) { return this._httpSvc.get('porder/detail/update/' + id, this._opt.getHeader()); }
  //
  // delete(id: string) { return this._httpSvc.delete('porder/deletePorder/' + id, this._opt.getHeader()); }
  //
  save(data) {
    return this._httpSvc.post('prod-order/save', data, this._opt.getHeader());
  }
  cancelAutoProdOrder(data) {
    return this._httpSvc.post('prod-order/cancelAutoProdOrder', data, this._opt.getHeader());
  }
  createProdOrderBaseOnStockStrategy(plantId) {
    return this._httpSvc.post('prod-order/createProdOrderBaseOnStockStrategy/' + plantId, {}, this._opt.getHeader());
  }
  saveObs(data) {
    return this._httpSvc.postObservable('prod-order/save', data, this._opt.getHeader());
  }

  saveAllJobOrderOperation(data) {
    return this._httpSvc.post('jobOrderOperation/saveAll', data, this._opt.getHeader());
  }
  saveJobOrderOperation(data) {
    return this._httpSvc.post('jobOrderOperation/save', data, this._opt.getHeader());
  }

  detailJobOrderOperation(id) {
    return this._httpSvc.get('jobOrderOperation/detail/' + id, this._opt.getHeader());
  }

  combineSave(data) {
    return this._httpSvc.post('prod-order/combine/save', data, this._opt.getHeader());
  }

  update(data) {
    return this._httpSvc.post('prod-order/save', data, this._opt.getHeader());
  }

  combineJobOrders(plantId) {
    return this._httpSvc.get('prod-order/combineJobOrders/' + plantId, this._opt.getHeader());
  }

  combineJobOrderOperations(plantId) {
    return this._httpSvc.get('prod-order/combineJobOrderOperations/' + plantId, this._opt.getHeader());
  }

  // deleteJobOrder(id) {
  //   return this._httpSvc.delete('jobOrder/delete/'+ id, this._opt.getHeader());
  // }

  cancelJobOrder(id) {
    return this._httpSvc.post('jobOrder/cancel/job/'+ id, {},this._opt.getHeader());
  }

  join(data) {
    return this._httpSvc.post('prod-order/combine/save', data, this._opt.getHeader());
  }

  //
  // update(data) { return this._httpSvc.post('porder/update', data, this._opt.getHeader()); }
  //
  // filter(data) { return this._httpSvc.post('porder/filterPorder', data, this._opt.getHeader()); }
  getDetail(prodOrderId) {
    return this._httpSvc.get(`prod-order/detail/${prodOrderId}`, this._opt.getHeader())
  }

  //for urgent work these methods are added here:
  filterProdObservable(data) {
    return this._httpSvc.postObservable('prod-order/filter', data, this._opt.getHeader());
  }

  filter(data) {
    return this._httpSvc.post('prod-order/filter', data, this._opt.getHeader());
  }

  changeProdOrderStatusToCancel(id) {
    return this._httpSvc.get('prod-order/cancel/' + id, this._opt.getHeader());
  }


  uploadProdOrderMedia(formData: FormData, plantId) {
    return this._httpSvc.post(`prod-order/upload-prod-orders/${plantId}`, formData, this._opt.getFileHeader());

  }
  uploadJobOrderMedia(formData: FormData, plantId) {
    return this._httpSvc.post(`prod-order/upload-job-orders/${plantId}`, formData, this._opt.getFileHeader());

  }
  ////for urgent work these methods are added here:

  prodOrderReport(data){
    return this._httpSvc.post('prod-order/prodOrderReport', data, this._opt.getHeader());
  }
}
