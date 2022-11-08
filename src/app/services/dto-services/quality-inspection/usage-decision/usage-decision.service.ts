import { Injectable } from '@angular/core';
import {HttpControllerService} from '../../../core/http-controller.service';
import {BasePageService} from 'app/services/base/base-page.service';
import {OptionService} from '../../../base/option-service';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsageDecisionService extends BasePageService {
  constructor(
    private _httpSvc: HttpControllerService,
    private _opt: OptionService) {
       super();
 }

 filterUsageDecision(data) { 
   return this._httpSvc.post('quality/usageDecision/filter', data, this._opt.getHeader()); 
 }

 detailUsageDecision(id: string) {
    return this._httpSvc.get('quality/usageDecision/detail/' + id, this._opt.getHeader()); 
 }

 saveUsageDecision(data) {
   return this._httpSvc.post('quality/usageDecision/save', data, this._opt.getHeader());
 }

 updateUsageDecision(data) {
   return this._httpSvc.post('quality/usageDecision/save', data, this._opt.getHeader());
 }

 deleteUsageDecision(id) {
   return this._httpSvc.delete('quality/usageDecision/delete/' + id, this._opt.getHeader());
 }

  records = {
    currentPage: 1,
    totalElements: 3,
    totalPages: 1,
    content: [
      {
        usageDecisionId: '1',
        udCode: 'Code 1',
        usageDecision: 'Decision 1',
        qualityScore: 'Quality 1',
        inspectionLotQuantity: 1,
        sampleSize: 0,
        unrestrictedUse: null,
        scrap: null,
        sampleUsage: null,
        blockedStock: null,
        reserves: null
      },
      {
        usageDecisionId: '2',
        udCode: 'Code 2',
        usageDecision: 'Decision 2',
        qualityScore: 'Quality 2',
        inspectionLotQuantity: 1,
        sampleSize: 0,
        unrestrictedUse: null,
        scrap: null,
        sampleUsage: null,
        blockedStock: null,
        reserves: null
      },
      {
        usageDecisionId: '3',
        udCode: 'Code 3',
        usageDecision: 'Decision 3',
        qualityScore: 'Quality 3',
        inspectionLotQuantity: 1,
        sampleSize: 0,
        unrestrictedUse: null,
        scrap: null,
        sampleUsage: null,
        blockedStock: null,
        reserves: null
      },
    ]
  };

  getAll() {
    return of(this.records);
  }

  getUpdateDetail(id: string) {
    return of(this.records.content.find(x => x.usageDecisionId === id))
  }

  update(id: string, data) {
    const index = this.records.content.findIndex(x => x.usageDecisionId === id);
    this.records.content[index].udCode = data.udCode;
    this.records.content[index].usageDecision = data.usageDecision;
    this.records.content[index].inspectionLotQuantity = data.inspectionLotQuantity;
    this.records.content[index].qualityScore = data.qualityScore;
    this.records.content[index].sampleSize = data.sampleSize;
    this.records.content[index].unrestrictedUse = data.unrestrictedUse;
    this.records.content[index].scrap = data.scrap;
    this.records.content[index].sampleUsage = data.sampleUsage;
    this.records.content[index].blockedStock = data.blockedStock;
    this.records.content[index].reserves = data.reserves;
    return of(this.records);
  }

  delete(id: string) {
    this.records.content = this.records.content.filter(
      obj => obj.usageDecisionId != id
    );
    return of(this.records);
  }

  save(item) {
    item.usageDecisionId = Math.floor(Math.random() * 1000);
    this.records.content.push(item);
    return of(item);
  }
}
 