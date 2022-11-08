import { Injectable } from '@angular/core';
import { BasePageService } from '../../../../base/base-page.service';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService extends BasePageService { 

  records = {
    currentPage: 1,
    totalElements: 3, 
    totalPages: 1,
    content: [
      {
        itemActivityId: '1',
        itemActivityName: 'Name 1',
        shortText: 'dddd',
      },
      {
        itemActivityId: '2',
        itemActivityName: 'Name 2',
        shortText: 'ddd',
      },
      {
        itemActivityId: '3',
        itemActivityName: 'Name 3',
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
    return of(this.records.content.find(x => x.itemActivityId === id))
  }

  update(id: string, data) {
    
    const index = this.records.content.findIndex(x => x.itemActivityId === id);
    this.records.content[index].itemActivityName = data.itemActivityName;
    this.records.content[index].shortText = data.shortText;
    ;
    return of(this.records);
  }
 
  delete(id: string) {
    this.records.content = this.records.content.filter(
      obj => obj.itemActivityId != id
    );
    return of(this.records);
  }

  save(item) {
    item.itemActivityId = Math.floor(Math.random() * 1000);
    this.records.content.push(item);
    return of(item);
  }
}
