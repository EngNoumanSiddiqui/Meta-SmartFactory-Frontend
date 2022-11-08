import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { ResultRecordingService } from 'app/services/dto-services/quality-inspection/result-recording/result-recording.service'
import { ImageViewerComponent } from '../../../../../image/image-viewer/image-viewer.component';
import { LoaderService } from 'app/services/shared/loader.service';

@Component({
  selector: 'detail-result-recording',
  templateUrl: './detail.component.html',
})

export class DetailResultRecording implements OnInit {
  @ViewChild(ImageViewerComponent) imageViewerComponent: ImageViewerComponent;
  id;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  resultRecording;

  @Output() selectedTab = new EventEmitter<any>();

  constructor(
    private loaderService: LoaderService,
    private _resultRecordingService: ResultRecordingService) {
  }

  private initialize(id: string) {
    this.loaderService.showLoader();
    this._resultRecordingService.detailResultRecording(this.id).then(
      result => {
        this.resultRecording = result;
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
