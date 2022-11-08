import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedUnitListService {

  private emitChangeSrc = new Subject<any>();

  private unitList;

  subscriber$ = this.emitChangeSrc.asObservable();

  constructor() {
  }


  public publishNewList(list) {

    this.unitList = list;
    this.emitChangeSrc.next(list);

  }

  public getUnitList() {
    return this.unitList;
  }

}
