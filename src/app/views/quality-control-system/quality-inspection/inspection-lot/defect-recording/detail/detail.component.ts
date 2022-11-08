import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { DefectRecordingService } from 'app/services/dto-services/quality-inspection/defect-recording/defect-recording.service'
import { ImageViewerComponent } from '../../../../../image/image-viewer/image-viewer.component';
import { LoaderService } from 'app/services/shared/loader.service';

@Component({
  selector: 'detail-defect-recording',
  templateUrl: './detail.component.html',
})

export class DetailDefectRecording implements OnInit {
  @ViewChild(ImageViewerComponent) imageViewerComponent: ImageViewerComponent;
  id;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  defectRecording;

  @Output() selectedTab = new EventEmitter<any>();

  constructor(
    private loaderService: LoaderService,
    private _defectRecordingService: DefectRecordingService) {
  }

  private initialize(id: string) {
    this.loaderService.showLoader();
    this._defectRecordingService.detailDefectRecording(this.id).then(
      result => {
        this.defectRecording = result;
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
