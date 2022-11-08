import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import {QualityReportTypeService} from 'app/services/dto-services/quality-report-type/quality-report-type.service'
import { LoaderService } from 'app/services/shared/loader.service';
@Component({
  selector: 'detail-quality-report-type', 
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailQualityReportType implements OnInit {


  @Input('data') set z(data) {
    if (data) {
      this.qualityReportType = data;
    }
  };
  qualityReportType;

  constructor() {
  }

  ngOnInit() {
  }


}
