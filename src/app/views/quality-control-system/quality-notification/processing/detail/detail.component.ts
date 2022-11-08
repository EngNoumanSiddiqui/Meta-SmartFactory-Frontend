import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { QualityNotificationService } from 'app/services/dto-services/quality-notification/quality-notification.service'
import { ImageViewerComponent } from '../../../../image/image-viewer/image-viewer.component';
import { LoaderService } from '../../../../../services/shared/loader.service';

@Component({
  selector: 'detail-processing',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'] 
})
export class DetailProcessing implements OnInit {
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

  processing;

  @Output() selectedTab = new EventEmitter<any>();

  constructor(
    private loaderService: LoaderService,
    private _qualityNotificationService: QualityNotificationService) {
  }

  private initialize(id: string) {
    this.loaderService.showLoader();
    this._qualityNotificationService.getProcessingData(this.id).subscribe(
      result => {
        this.processing = result;
        console.log("this.processing: ", this.processing)
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
