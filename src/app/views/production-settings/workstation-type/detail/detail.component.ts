import { Component, OnInit, Input } from '@angular/core';
@Component({
  selector: 'workstation-type-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class WorkStationTypeDetailComponent implements OnInit {
  payLoadObject = {
    'workStationTypeId': null,
    'workStationTypeName': null
  }
  data;
  @Input('data') set z(data) {
    this.data = data;
    if (data) {
      this.payLoadObject = {
        'workStationTypeId': this.data.workStationTypeId,
        'workStationTypeName': this.data.workStationTypeName
      };
    }
  };

  ngOnInit() {}
}
