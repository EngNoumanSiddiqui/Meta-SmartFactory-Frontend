import {Injectable} from '@angular/core';
import {BasePageService} from '../../base/base-page.service';
import {HttpControllerService} from '../../core/http-controller.service';
import {OptionService} from '../../base/option-service';
import { BehaviorSubject, Subject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';

@Injectable()
export class DashboardService extends BasePageService {

  // For Good Movement Dashboard
  private _stockTransferDashList = new BehaviorSubject(null);
  public stockTransferListDash = this._stockTransferDashList.asObservable();
  public searchstockTransferDashTerms = new Subject<any>();
  public stockTransferDashboardPageOpenFirstTime = true;
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService) {
    super();
    this.searchstockTransferDashTerms.pipe( debounceTime(400), 
        switchMap(term => this.getStockTransferNotificationInfo(term))).subscribe(result => {
            this._stockTransferDashList.next(result);
           },
           error => {
             this._stockTransferDashList.thrownError(error);
           }
         );
  }

  getMainScrapCauseList(data) {
    return this._httpSvc.post('dashboard/scrap/getMainScrapCauseList', data, this._opt.getHeader());
  }
  getMainReworkCauseList(data) {
    return this._httpSvc.post('dashboard/rework/getMainReworkCauseList', data, this._opt.getHeader());
  }
  getMaterialWithScrapPercentageList(data) {
    return this._httpSvc.post('dashboard/scrap/getMaterialWithScrapPercentageList', data, this._opt.getHeader());
  }

  getMaterialWithReworkPercentageList(data) {
    return this._httpSvc.post('dashboard/rework/getMaterialWithReworkPercentageList', data, this._opt.getHeader());
  }

  getDailyScrapPercentageList(data) {
    return this._httpSvc.post('dashboard/scrap/getDailyScrapPercentageList', data, this._opt.getHeader());
  }
  getDailyReworkPercentageList(data) {
    return this._httpSvc.post('dashboard/rework/getDailyReworkPercentageList', data, this._opt.getHeader());
  }

  getMTTRInfo(data) {
    return this._httpSvc.post('dashboard/maintenance/getMTTRInfo', data, this._opt.getHeader());
  }

  getMTBFInfo(data) {
    return this._httpSvc.post('dashboard/maintenance/getMTBFInfo', data, this._opt.getHeader());
  }

  getStockTransferNotificationInfo(data){
    return this._httpSvc.postObservable('dashboard/stocktransfer/getStockTransferNotificationInfo', data, this._opt.getHeader());
  }
}
