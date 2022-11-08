import {Component, Input, OnInit} from '@angular/core';
@Component({
  selector: 'job-order-row-detail',
  templateUrl: './detail.component.html',
  styleUrls:['./detail.scss']
})
export class DetailJobOrderRowComponent implements OnInit {


  @Input('data') set x(data) {
    console.log('@DetailJobOrderRowComponent', data);
    if (data) {
      this.rowData = data;
    }
  };


  rowData;

  constructor() {

  }

  ngOnInit() {

  }


}
