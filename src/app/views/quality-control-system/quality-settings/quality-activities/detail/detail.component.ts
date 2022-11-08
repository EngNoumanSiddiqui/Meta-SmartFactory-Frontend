import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { QualityActivityService } from 'app/services/dto-services/quality-activity/quality-activity.service'

@Component({
  selector: 'detail-quality-activity',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailQualityActivity implements OnInit {
  id;
  
  @Input('data') set setData (data) {
    if (data) {
     this.qualityActivity = data;
    }
  }

  qualityActivity;

  @Output() selectedTab = new EventEmitter<any>();

  constructor(
    private _qualityActivityService: QualityActivityService) {
  }

  ngOnInit() {
  }

}
