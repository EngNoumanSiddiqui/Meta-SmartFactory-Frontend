import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { InspectionCharOpService } from 'app/services/dto-services/inspection-plan/inspection-characteristic.service';
import { ImageViewerComponent } from '../../../../image/image-viewer/image-viewer.component';
import { LoaderService } from '../../../../../services/shared/loader.service';

@Component({
  selector: 'detail-inspection-characteristic',
  templateUrl: './detail.component.html',
})

export class DetailInspectionCharOp implements OnInit {
  @ViewChild(ImageViewerComponent) imageViewerComponent: ImageViewerComponent;
  id;
  showTable1 = true;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  inspectionCharOp;

  @Output() selectedTab = new EventEmitter<any>();

  constructor(
    private loaderService: LoaderService,
    private _inspectionCharOpService: InspectionCharOpService) {
  }

  private initialize(id: string) {
    this.loaderService.showLoader();
    this._inspectionCharOpService.detail(this.id).then(
      result => {
        this.inspectionCharOp = result;
        this.loaderService.hideLoader();
      }).catch(
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
