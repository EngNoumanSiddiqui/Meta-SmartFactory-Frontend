import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { InspectionPlanOperationService } from 'app/services/dto-services/inspection-plan/inspection-plan-operation.service';
import { ImageViewerComponent } from '../../../../image/image-viewer/image-viewer.component';
import { LoaderService } from '../../../../../services/shared/loader.service';

@Component({
  selector: 'detail-inspection-plan-operation',
  templateUrl: './detail.component.html',
})

export class DetailInspectionPlanOperation implements OnInit {
  @ViewChild(ImageViewerComponent) imageViewerComponent: ImageViewerComponent;
  id;
  showTable1 = true;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  inspectionPlanOperation;

  @Output() selectedTab = new EventEmitter<any>();

  constructor(
    private loaderService: LoaderService,
    private _inspectionPlanOperationService: InspectionPlanOperationService) {
  }

  private initialize(id: string) {
    this.loaderService.showLoader();
    this._inspectionPlanOperationService.detailInsPlanOperation(id).then(
      result => {
        this.inspectionPlanOperation = result;
        this.inspectionPlanOperation.qualityInspectionOperationId = result['qualityInspectionOperation']?.inspectionOperationId
        this.loaderService.hideLoader();
      },
      error => {
        console.log(error);
      });
  }

  ngOnInit() {
  }

  handleChange(e) {
    const index = e.index;
    this.selectedTab.emit(index);
  }

}
