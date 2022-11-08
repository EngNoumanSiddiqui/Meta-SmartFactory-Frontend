import { Injectable } from '@angular/core';
import { HttpControllerService } from '../../core/http-controller.service';
import { BasePageService } from 'app/services/base/base-page.service';
import { OptionService} from '../../base/option-service';
import { Subject } from 'rxjs';
import { ShareHttpCallsService } from '../shared-http-calls.service';

@Injectable()
export class StockCardService extends BasePageService {
  public saveAction$: Subject<any> = new Subject();
  constructor(private _httpSvc: HttpControllerService, 
    private _httpSharedSvc: ShareHttpCallsService,
    private _opt: OptionService ) {
    super();
  }

  delete(id: string) { return this._httpSvc.delete('stock/deleteStock/' + id, this._opt.getHeader()); }

  getDetail(id: any) { return this._httpSvc.get('stock/detail/' + id, this._opt.getHeader()); }

  getUpdateDetail(id: string) { return this._httpSvc.get('stock/detail/update/' + id, this._opt.getHeader()); }

  save(data) { return this._httpSvc.post('stock/save', data, this._opt.getHeader()); }
  stockUpdate(data) { return this._httpSvc.post('stocktype/update', data, this._opt.getHeader()); }
  saveWarehouseStock(data) { return this._httpSvc.post('stock/saveWarehouseStock', data, this._opt.getHeader()); }

  update(data) { return this._httpSvc.post('stock/update', data, this._opt.getHeader()); }

  filter(data) { return this._httpSvc.post('stock/filterStock', data, this._opt.getHeader()); }

  filterStockNotHaveProductTree() { return this._httpSvc.get('stock/stockNotHaveProductTree', this._opt.getHeader()); }
  filterStockNotHaveProductTreeByPlantId(plantId) { return this._httpSvc.get('stock/stockNotHaveProductTree/' + plantId, this._opt.getHeader()); }

  getAllStock() { return this._httpSvc.get('stock/stocks', this._opt.getHeader()); }

  filterObservable(data) { return this._httpSvc.postObservable('stock/filterStock', data, this._opt.getHeader()); }

  getLasStockNos() { return this._httpSvc.get('stock/laststocknos', this._opt.getHeader()); }

  filterStockReports(data) { return this._httpSvc.postObservable('stock/filterWarehouseStock', data, this._opt.getHeader()); }
  
  filterShiftBasedStockReports(data) { return this._httpSvc.postObservable('datawarehouse/stock/report/stockWareHouseShiftReport', data, this._opt.getHeader()); }
  
  trendAllWorkstationActualCapacityByPlant(data) { return this._httpSvc.postObservable('datawarehouse/stock/report/trendAllWorkstationActualCapacityByPlant', data, this._opt.getHeader()); }
  trendWorkstationActualCapacityByPlant(data) { return this._httpSvc.postObservable('datawarehouse/stock/report/trendWorkstationActualCapacityByPlant', data, this._opt.getHeader()); }
  trendWorkstationActualCapacity(data) { return this._httpSvc.postObservable('datawarehouse/stock/report/trendWorkstationActualCapacity', data, this._opt.getHeader()); }
  getTrendAllProdStockWarehouseShiftProdJobReport(data) { return this._httpSvc.postObservable('datawarehouse/stock/report/getTrendAllProdStockWarehouseShiftProdJobReport', data, this._opt.getHeader()); }
  getTrendAllSalesStockWarehouseShiftProdJobReport(data) { return this._httpSvc.postObservable('datawarehouse/stock/report/getTrendAllSalesStockWarehouseShiftProdJobReport', data, this._opt.getHeader()); }
  filterStockWareHouseShiftProdJobReport(data) { return this._httpSvc.postObservable('datawarehouse/stock/report/stockWarehouseShiftProdJobReport', data, this._opt.getHeader()); }
  trendAllStockWarehouseShiftReportDto(data) { return this._httpSvc.postObservable('datawarehouse/stock/report/trendAllStockWarehouseShiftReportDto', data, this._opt.getHeader()); }

  filterAdvanceWarehouseStockReports(data) { return this._httpSvc.postObservable('stock/filterAdvanceWarehouseStock', data, this._opt.getHeader()); }

  localStockFilterFrontEndStockSummary(data) { return this._httpSvc.postObservable('stock/localStockFilterFrontEndStockSummary', data, this._opt.getHeader()); }

  updateWareHouseStock(warehouseId, quantity) { return this._httpSvc.get('stock/updateWareHouseStock/' +warehouseId + "/" + quantity, this._opt.getHeader()); }
  
  getMaterialGroupList() {
    return this._httpSvc.get('stock/materialGroupList', this._opt.getHeader());
  }
  getMaterialGroupListByPlant(plantId:any) {
    return this._httpSvc.get('materialgroup/list/' + plantId, this._opt.getHeader());
  }
  metarialActiveUnits(stockId) {
    return this._httpSvc.get(`stock/metarialActiveUnits/${stockId}`, this._opt.getHeader());
  }

  getIndustryList() {
    return this._httpSvc.get('stock/industryList', this._opt.getHeader());
  }
}
