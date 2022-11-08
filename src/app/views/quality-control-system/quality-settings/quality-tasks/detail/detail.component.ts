import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';

import { QualityTastsService } from 'app/services/dto-services/quality-tasks/quality-tasts.service'
@Component({
  selector: 'detail-quality-task',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailQualityTask implements OnInit {

  @Input('data') set setdata (data) {
    if (data) {
      this.qualityTask = data;
    }
  }

  qualityTask;

  @Output() selectedTab = new EventEmitter<any>();

  constructor(
    private _qualityTastsService: QualityTastsService) {
  }

  ngOnInit() {
  }

} 
