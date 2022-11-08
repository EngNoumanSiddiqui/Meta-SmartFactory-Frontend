/**
 * Created by reis on 30.07.2019.
 */
import {Injectable} from '@angular/core';
// import {BasePageService} from '../../base/base-page.service';
// import {HttpControllerService} from '../../core/http-controller.service';
// import {OptionService} from '../../base/option-service';
import { of } from 'rxjs';

@Injectable()
export class ManualJobOrderService {
  constructor() {
  }

  // delete(id: string) { return this._httpSvc.delete('manualjoborder/delete/' + id, this._opt.getHeader()); }

  // getDetail(id: string) { return this._httpSvc.get('manualjoborder/detail/' + id, this._opt.getHeader()); }

  // save(data) { return this._httpSvc.post('manualjoborder/save', data, this._opt.getHeader()); }

   records = {
    currentPage: 1,
    totalElements: 3,
    totalPages: 1,
    content: [
      {
        manualJobOrderId: '1',
        workStation: 'workStation',
        quantity: 5,
        plannedTime: {
          days: 1,
          hours: 23,
          minutes: 4,
          seconds: 2
        },
        maxStandbyTime: {
          days: 0,
          hours: 3,
          minutes: 3,
          seconds: 0
        },
        description: 'test2'
      },
      {
        manualJobOrderId: '2',
        workStation: 'workStation',
        quantity: 5,
        plannedTime: {
          days: 4,
          hours: 0,
          minutes: 5,
          seconds: 2
        },
        maxStandbyTime: {
          days: 2,
          hours: 0,
          minutes: 0,
          seconds: 0
        },
        description: 'test2'
      },
      {
        manualJobOrderId: '3',
        workStation: 'workStation',
        quantity: 5,
        plannedTime: {
          days: 7,
          hours: 3,
          minutes: 2,
          seconds: 1
        },
        maxStandbyTime: {
          days: 6,
          hours: 4,
          minutes: 2,
          seconds: 1
        },
        description: 'test2'
      }
    ]
  };

  getAll() {
    return of(this.records);
  }

  getUpdateDetail(id: string) {
    return of(this.records.content.find(x => x.manualJobOrderId === id))
  }

  update(id: string, data) {
    const index = this.records.content.findIndex(x => x.manualJobOrderId === id);
    this.records.content[index].workStation = data.workStation;
    this.records.content[index].quantity = data.quantity;
    this.records.content[index].plannedTime = data.plannedTime;
    this.records.content[index].maxStandbyTime = data.maxStandbyTime;
    this.records.content[index].description = data.description;
    return of(this.records);
  }

  delete(id: string) {
    console.log("delete service id: ", id)
    this.records.content = this.records.content.filter(
      obj => obj.manualJobOrderId != id
    );
    return of(this.records);
  }

  save(item) {
    item.manualJobOrderId = Math.floor(Math.random() * 1000);
    this.records.content.push(item);
    return of(this.records);
  }
}
