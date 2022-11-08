import { Injectable } from '@angular/core';
import { BasePageService } from '../../base/base-page.service';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InspectionSpecificationService extends BasePageService {

  records = {
    currentPage: 1,
    totalElements: 3, 
    totalPages: 1,
    content: [
      {
        inspectionSpecificationId: '1',
        inspectionPlan: 'Name 1',
        group: 'dddd',
        groupCounter:'aaaa',
        usage:'Usage 1',
        sampleSize: 'addd',
        keyDate: new Date()
      },
      {
        inspectionSpecificationId: '2',
        inspectionPlan: 'Name 1',
        group: 'dddd',
        groupCounter:'aaaa',
        usage:'Usage 2',
        sampleSize: 'addd',
        keyDate: new Date()
      },
      {
        inspectionSpecificationId: '3',
        inspectionPlan: 'Name 1',
        group: 'dddd',
        groupCounter:'aaaa',
        usage:'Usage 2',
        sampleSize: 'addd',
        keyDate: new Date()
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
    return of(this.records.content.find(x => x.inspectionSpecificationId === id))
  }

  update(id: string, data) {
    console.log('checkData', data);
    
    const index = this.records.content.findIndex(x => x.inspectionSpecificationId === id);
    this.records.content[index].inspectionPlan = data.inspectionPlan;
    this.records.content[index].group = data.group;
    this.records.content[index].groupCounter = data.groupCounter;
    this.records.content[index].usage = data.usage;
    this.records.content[index].sampleSize = data.sampleSize;
    this.records.content[index].keyDate = data.keyDate;
    return of(this.records);
  }
 
  delete(id: string) {
    this.records.content = this.records.content.filter(
      obj => obj.inspectionSpecificationId != id
    );
    return of(this.records);
  }

  save(item) {
    item.inspectionSpecificationId = Math.floor(Math.random() * 1000);
    this.records.content.push(item);
    return of(item);
  }
}
 