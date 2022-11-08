import {Injectable} from '@angular/core';
import {BasePageService} from '../../base/base-page.service';
import {HttpControllerService} from '../../core/http-controller.service';
import {OptionService} from '../../base/option-service';
import {HttpClient} from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
@Injectable()

export class JobOrderService extends BasePageService {

  componentType = new BehaviorSubject<number>(0);

  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService, private http: HttpClient) {
    super();
  }
  filterByStatusReadyObservable(data) {
    return this._httpSvc.postObservable('jobOrder/filterJobOrderByStatusReady', data, this._opt.getHeader());
  }
  filterByStatusReadyObservableVs2(data) {
    return this._httpSvc.postObservable('jobOrder/vs2/filterJobOrderByStatusReady', data, this._opt.getHeader());
  }

  getJobOrderOperationDetails(id) {
    return this._httpSvc.get('jobOrderOperation/detail/'+ id, this._opt.getHeader());
  }

  deleteJobOrder(id) {
    return this._httpSvc.delete('jobOrder/delete/'+ id, this._opt.getHeader());
  }

  filterStockWareHouseShiftProdJobReport(data) { return this._httpSvc.postObservable('datawarehouse/stock/report/stockWarehouseShiftProdJobReport', data, this._opt.getHeader()); }
  trendStockWarehouseShiftReportDto(data) { return this._httpSvc.postObservable('datawarehouse/stock/report/trendStockWarehouseShiftReportDto', data, this._opt.getHeader()); }

  deleteJobOrderOperation(id) {
    return this._httpSvc.delete('jobOrderOperation/delete/'+ id, this._opt.getHeader());
  }

  createLoginSummary(plantId) {
    return this._httpSvc.post('employeeLoginSummary/createLoginSummary/' + plantId,{} ,this._opt.getHeader());
  }


  filterByStatusPlannedOrProcessingObservable(data) {
    return this._httpSvc.postObservable('jobOrder/filterJobOrderByStatusPlannedOrProcessing', data, this._opt.getHeader());
  }
  filterByStatusPlannedOrProcessingObservableVs2(data) {
    return this._httpSvc.postObservable('jobOrder/vs2/filterJobOrderByStatusPlannedOrProcessing', data, this._opt.getHeader());
  }


  filter(data) {
    return this._httpSvc.post('jobOrder/filterJobOrder', data, this._opt.getHeader());
  }

  filterObservable(data) {
    return this._httpSvc.postObservable('jobOrder/filterJobOrder', data, this._opt.getHeader());
  }
  filterObservablevs2(data) {
    return this._httpSvc.postObservable('jobOrder/vs2/filterJobOrder', data, this._opt.getHeader());
  }


  updateStatusReadyToPlan(data) {
    return this._httpSvc.post('jobOrder/updateJobOrderStatusReadyToPlan', data, this._opt.getHeader());
  }

  lockJobOrder(jobOrderId) {
    return this._httpSvc.post('jobOrder/lock/job/' + jobOrderId, null , this._opt.getHeader());
  }
  cancelJobOrder(jobOrderId) {
    return this._httpSvc.post('jobOrder/cancel/job/' + jobOrderId, null , this._opt.getHeader());
  }
  unLockJobOrder(jobOrderId) {
    return this._httpSvc.post('jobOrder/unlock/job/' + jobOrderId, null , this._opt.getHeader());
  }

  divideJobOrder(data) {
    return this._httpSvc.post('jobOrder/divideJobOrder', data, this._opt.getHeader());
  }
  cloneJobOrderOperation(data) {
    return this._httpSvc.post('jobOrder/cloneJobOrderOperation', data, this._opt.getHeader());
  }

  editJobOrderStockQuantity(data) {
    return this._httpSvc.post('jobOrder/create/editJobOrderStockQuantity', data, this._opt.getHeader());
  }
  createJobOrder(id, order) {
    return this._httpSvc.get('jobOrder/createJobOrderRequestByOrderDetailId/' + id + '/' + order, this._opt.getHeader());
  }
  createJobOrderAndProductTreeId(orderDetailId,productTreeId, order) {
    return this._httpSvc.get('jobOrder/createJobOrderRequestByOrderDetailIdAndProductTreeId/' + orderDetailId +
     '/' + productTreeId + '/' + order, this._opt.getHeader());
  }

  createJobOrderWithProductTreeId(productTreeId, expectedQuantity) {
    return this._httpSvc.get('jobOrder/createJobOrderRequestByProductTreeId/' + productTreeId + '/' + expectedQuantity, this._opt.getHeader());
  }

  getActiveOrders() {
    return this._httpSvc.get('order/activeOrderDetails', this._opt.getHeader());
  }


  updateJobOrderScheduler(data) {
    return this._httpSvc.post('jobOrder/update/Schedule', data, this._opt.getHeader());
  }

  updateJobOrderAutoScheduler(data) {
    return this._httpSvc.post('jobOrder/update/autoSchedule', data, this._opt.getHeader());
  }
  saveShiftCapacity(data) {
    return this._httpSvc.post('jobOrder/update/autoSchedule/shiftCapacity', data, this._opt.getHeader());
  }

  changeJobOrderStatusToReady(id) {
    return this._httpSvc.get('jobOrder/changeJobOrderStatusToReady/' + id, this._opt.getHeader());
  }
  releaseReservationAndReSchedule(plantId) {
    return this._httpSvc.get('stock/releaseReservationAndReSchedule/' + plantId, this._opt.getHeader());
  }

  recheckJobOrderStockHasUnReristrictedQuantity(plantId) {
    return this._httpSvc.get('jobOrder/recheckJobOrderStockHasUnReristrictedQuantity/' + plantId, this._opt.getHeader());
  }
  createSemiFinishProdOrders(plantId) {
    return this._httpSvc.get('prod-order/createSemiFinishProdOrders/' + plantId, this._opt.getHeader());
  }
  deliverManualPurchaseOrder(plantId) {
    return this._httpSvc.get('porder/deliverManualPurchaseOrder/' + plantId, this._opt.getHeader());
  }
  releasePalletReservation(plantId) {
    return this._httpSvc.get('joborder/operation/pallet/releasePalletReservation/' + plantId, this._opt.getHeader());
  }


  checkStockReservation(plantId) {
    return this._httpSvc.get('stock/checkStockReservation/' + plantId, this._opt.getHeader());
  }

  divideJobOrderOperation(plantId) {
    return this._httpSvc.get('joborder/operation/pallet/divideJobOrderOperation/' + plantId, this._opt.getHeader());
  }
  shiftBaseStockReportPurchase(plantId) {
    return this._httpSvc.get('datawarehouse/stock/report/shiftBaseStockReportPurchase/' + plantId, this._opt.getHeader());
  }
  changeJobOrderStatusToCancel(id) {
    return this._httpSvc.get('jobOrder/changeJobOrderStatusToCancelled/' + id, this._opt.getHeader());
  }


  getDetail(jobOrderId) {
    return this._httpSvc.get(`jobOrder/detail/${jobOrderId}`, this._opt.getHeader())
  }
  getProdDetail(jobOrderId) {
    return this._httpSvc.get(`prod-order/detail/${jobOrderId}`, this._opt.getHeader())
  }


  filterJobOrderReport(data) {
    return this._httpSvc.post('jobOrder/jobOrderReport', data, this._opt.getHeader());
  }
  getJobOrderReportWithEmployeeReport(data) {
    return this._httpSvc.post('jobOrder/getJobOrderReportWithEmployeeReport', data, this._opt.getHeader());
  }

  changeToLongTermProcessing(data) {
    return this._httpSvc.post('jobOrder/changeToLongTermProcessing', data, this._opt.getHeader());
  }
  updateNextJobOrders(data){
    return this._httpSvc.post('jobOrder/updateNextJobOrders/' + data , {}, this._opt.getHeader());
  }
  removeProcessingStatusToComplete(data) {
    return this._httpSvc.post('jobOrder/removeProcessingStatusToComplete', data, this._opt.getHeader());
  }
  removeProcessingStatusToPlanned(data) {
    return this._httpSvc.post('jobOrder/removeProcessingStatusToPlanned', data, this._opt.getHeader());
  }

  getJObOrderReportDetail(jobOrderId) {

    return this._httpSvc.get(`jobOrder/jobOrderReportDetail/${jobOrderId}`, this._opt.getHeader())
  }

  updateJobOrderStatusToStandBy(jobOrderId){
    return this._httpSvc.get(`jobOrder/updateJobOrderStatusToStandBy/${jobOrderId}`, this._opt.getHeader())
  }



  rollbackStandByJobOrder(jobOrderId){
    return this._httpSvc.get(`jobOrder/rollbackStandByJobOrder/${jobOrderId}`, this._opt.getHeader())
  }

  scheduleJobOrders(data) {
    return this._httpSvc.post('jobOrder/planning/scheduleJobOrders', data, this._opt.getHeader());
  }

  saveProductionSchedulingParameters(data) {
    return this._httpSvc.post('production/schedulingParameter/save', data, this._opt.getHeader());
  }

  filterProductionSchedulingParameters(data) {
    return this._httpSvc.post('production/schedulingParameter/filter', data, this._opt.getHeader());
  }

}
