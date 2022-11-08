import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedPlantListService {

  private emitChangeSrc = new Subject<any>();

  private plantList;




  subscriber$ = this.emitChangeSrc.asObservable();

  constructor() {
  }


  public publishNewList(list) {

    this.plantList = list;
    this.emitChangeSrc.next(list);

  }

  public getPlantList() {
    return this.plantList;
  }

}
