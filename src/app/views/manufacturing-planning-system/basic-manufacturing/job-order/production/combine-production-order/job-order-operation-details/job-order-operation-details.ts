import { Component, Input, OnInit } from '@angular/core';
import { ConvertUtil } from 'app/util/convert-util';

@Component({
    selector: 'job-order-operation-details',
    templateUrl: 'job-order-operation-details.html'
})

export class JobOrderOperationDetailsComponent implements OnInit {

    @Input('data') set x(data) {
        if (data) {
          this.rowData = data;
        }
      };
    rowData;
    constructor() { }

    ngOnInit() { }


    getReadableTime(time) {
      return ConvertUtil.longDuration2DHHMMSSsssTime(time)
    }
  
}
