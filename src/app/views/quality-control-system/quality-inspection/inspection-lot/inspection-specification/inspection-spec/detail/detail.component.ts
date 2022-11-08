import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { InspectionSpecificationService } from 'app/services/dto-services/quality-inspection/inspection-specification.service';
import { ImageViewerComponent } from '../../../../../../image/image-viewer/image-viewer.component';
import { LoaderService } from 'app/services/shared/loader.service';

@Component({
  selector: 'detail-inspection-spec',
  templateUrl: './detail.component.html',
})

export class DetailInspectionSpec implements OnInit {
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
    private _inspectionSpecificationService: InspectionSpecificationService) {
  }

  private initialize(id: string) {
    this.loaderService.showLoader();
    this._inspectionSpecificationService.getUpdateDetail(this.id).subscribe(
      result => {
        this.inspectionSpecification = result;
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
