import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { InspectionLotService } from 'app/services/dto-services/quality-inspection/inspection-lot.service';
import { ImageViewerComponent } from '../../../../../image/image-viewer/image-viewer.component';
import { LoaderService } from 'app/services/shared/loader.service';

@Component({
  selector: 'detail-inspection-specification',
  templateUrl: './detail.component.html',
})

export class DetailInspectionSpecification implements OnInit {
  @ViewChild(ImageViewerComponent) imageViewerComponent: ImageViewerComponent;
  id;
  showTable1 = true;

  @Input('id') set z(id) {
    this.id = id;
    console.log("this.id: ", this.id)
    if (id) {
      this.initialize(this.id);
    }
  };

  inspectionSpecification;

  @Output() selectedTab = new EventEmitter<any>();

  constructor(
    private loaderService: LoaderService,
    private _inspectionLotService: InspectionLotService) {
  }

  private initialize(id: string) {
    this.loaderService.showLoader();
    this._inspectionLotService.getInspSpec(this.id).subscribe(
      result => {
        this.inspectionSpecification = result;
        console.log("this.inspectionSpecification: ", this.inspectionSpecification)
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
