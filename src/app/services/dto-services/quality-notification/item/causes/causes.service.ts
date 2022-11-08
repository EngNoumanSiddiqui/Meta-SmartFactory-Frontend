import { Injectable } from '@angular/core';
import { BasePageService } from '../../../../base/base-page.service';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CausesService extends BasePageService {

  records = {
    currentPage: 1,
    totalElements: 3, 
    totalPages: 1,
    content: [
      {
        itemCauseId: '1',
        causeName: 'Name 1',
        shortText: 'dddd',
      },
      {
        itemCauseId: '2',
        causeName: 'Name 2',
        shortText: 'ddd',
      },
      {
        itemCauseId: '3',
        causeName: 'Name 3',
        shortText: 'ddd',
      }
    ]
  };

  constructor(
  ) {
    super();
  }

  getAll() {
    return of(this.records);
  }

  getUpdateDetail(id: string) {
    return of(this.records.content.find(x => x.itemCauseId === id))
  }

  update(id: string, data) {
    
    const index = this.records.content.findIndex(x => x.itemCauseId === id);
    this.records.content[index].causeName = data.causeName;
    this.records.content[index].shortText = data.shortText;
    ;
    return of(this.records);
  }
 
  delete(id: string) {
    this.records.content = this.records.content.filter(
      obj => obj.itemCauseId != id
    );
    return of(this.records);
  }

  save(item) {
    item.itemCauseId = Math.floor(Math.random() * 1000);
    this.records.content.push(item);
    return of(item);
  }
}
 