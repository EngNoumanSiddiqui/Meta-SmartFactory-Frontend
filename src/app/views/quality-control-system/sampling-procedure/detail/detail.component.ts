import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { SamplingProcedureService } from 'app/services/dto-services/sampling-procedure/sampling-procedure.service';
import { ImageViewerComponent } from '../../../image/image-viewer/image-viewer.component';
import { LoaderService } from '../../../../services/shared/loader.service';

@Component({
  selector: 'detail-sampling-procedure',
  templateUrl: './detail.component.html',
})

export class DetailSamplingProcedure implements OnInit {
  @ViewChild(ImageViewerComponent) imageViewerComponent: ImageViewerComponent;
  id;
  showTable1 = true;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  samplingProcedure;

  @Output() selectedTab = new EventEmitter<any>();

  constructor(
    private loaderService: LoaderService,
    private _samplingProcedure: SamplingProcedureService) {
  }

  private initialize(id: string) {
    this.loaderService.showLoader();
    this._samplingProcedure.detailSamplingProcedure(this.id).then(
      result => {
        this.samplingProcedure = result;
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
