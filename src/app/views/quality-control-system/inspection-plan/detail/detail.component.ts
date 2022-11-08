import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { InspectionPlanService } from 'app/services/dto-services/inspection-plan/inspection-plan.service';
import { ImageViewerComponent } from '../../../image/image-viewer/image-viewer.component';
import { LoaderService } from '../../../../services/shared/loader.service';

@Component({
  selector: 'detail-inspection-plan',
  templateUrl: './detail.component.html',
})

export class DetailInspectionPlan implements OnInit {
  @ViewChild(ImageViewerComponent) imageViewerComponent: ImageViewerComponent;
  id;
  showTable1 = true;

  @Input('id') set z(id) {
  };

  @Input('data') set setData(data) {
    if (data) {
      this.inspectionPlan = data;
    }
  };

  inspectionPlan;

  @Output() selectedTab = new EventEmitter<any>();

  constructor(
    private loaderService: LoaderService,
    private _inspectionPlanService: InspectionPlanService) {
  }


  ngOnInit() {
  }

  handleChange(e) {
    const index = e.index;
    this.selectedTab.emit(index);
  }

}
