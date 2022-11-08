import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'workcenter-type-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class WorkCenterTypeDetailComponent implements OnInit {
  payLoadObject = {
    'workCenterTypeId': null,
    'workCenterTypeName': null,
    'plantName': null
  }
  data;
  @Input('data') set z(data) {
    this.data = data;
    if (data) {
      this.payLoadObject = {
        'workCenterTypeId': this.data.workCenterTypeId,
        'workCenterTypeName': this.data.workCenterTypeName,
        'plantName': (this.data.plant) ? this.data.plant.plantName : ''
      };
    }
  };

  ngOnInit() {

  }
}
