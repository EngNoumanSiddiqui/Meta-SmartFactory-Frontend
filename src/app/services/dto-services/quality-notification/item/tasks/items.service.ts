import { Injectable } from '@angular/core';
import { BasePageService } from '../../../../base/base-page.service';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemsService extends BasePageService {

  records = {
    currentPage: 1,
    totalElements: 3, 
    totalPages: 1,
    content: [ 
      {
        itemTasksId: '1',
        itemTaskName: 'Name 1',
        itemTaskResponsible: 'fff',
        shortText: 'dddd',
        status: null,
      },
      {
        itemTasksId: '2',
        itemTaskName: 'Name 2',
        itemTaskResponsible: 'fff',
        shortText: 'ddd',
        status: null
      },
      {
        itemTasksId: '3',
        itemTaskName: 'Name 3',
        itemTaskResponsible: 'fff',
        shortText: 'ddd',
        status: null
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
    return of(this.records.content.find(x => x.itemTasksId === id))
  }

  update(id: string, data) {
    
    const index = this.records.content.findIndex(x => x.itemTasksId === id);
    this.records.content[index].itemTaskName = data.itemTaskName;
    this.records.content[index].itemTaskResponsible = data.itemTaskResponsible
    this.records.content[index].shortText = data.shortText;
    this.records.content[index].status = data.status;
    ;
    return of(this.records);
  }
 
  delete(id: string) {
    this.records.content = this.records.content.filter(
      obj => obj.itemTasksId != id
    );
    return of(this.records);
  }

  save(item) {
    item.itemTasksId = Math.floor(Math.random() * 1000);
    this.records.content.push(item);
    return of(item);
  }
}
