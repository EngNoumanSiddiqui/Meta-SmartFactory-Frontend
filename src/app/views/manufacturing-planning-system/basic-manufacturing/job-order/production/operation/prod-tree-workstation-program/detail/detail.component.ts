import {Component, Input, OnInit} from '@angular/core';
@Component({
  selector: 'job-order-workstation-program-detail',
  templateUrl: './detail.component.html'
})
export class DetailJobOrderWorkstationProgramComponent implements OnInit {



  @Input('data') set x(data) {
    if (data) {
      this.dataModel = data;
    }
  };


  dataModel;

  constructor() {

  }

  ngOnInit() {

  }


}
