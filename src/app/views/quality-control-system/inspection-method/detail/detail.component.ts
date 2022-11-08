import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { InspectionMethodService } from 'app/services/dto-services/inspection-method/inspection-method.service';
import { ImageViewerComponent } from '../../../image/image-viewer/image-viewer.component';
import { LoaderService } from '../../../../services/shared/loader.service';

@Component({
  selector: 'detail-inspection-method',
  templateUrl: './detail.component.html',
})

export class DetailInspectionMethod implements OnInit {
  @ViewChild(ImageViewerComponent) imageViewerComponent: ImageViewerComponent;
  id;
  showTable1 = true;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  inspectionMethod;

  @Output() selectedTab = new EventEmitter<any>();

  constructor(
    private loaderService: LoaderService,
    private _inspectionMethodService: InspectionMethodService) {
  }

  private initialize(id: string) {
    this.loaderService.showLoader();
    this._inspectionMethodService.detailInspectionMethod(id).then(
      result => {
        this.inspectionMethod = result;
        this.loaderService.hideLoader();
      },
      error => {
        console.log("error: ", error)
      });
    // this._inspectionMethodService.getUpdateDetail(this.id).subscribe(
    //   result => {
    //     this.inspectionMethod = result;
    //     this.loaderService.hideLoader();
    //   },
    //   error => {
    //     console.log(error);
    //   });
  }

  ngOnInit() {
  }

  handleChange(e) {
    const index = e.index;
    this.selectedTab.emit(index);
  }

}
