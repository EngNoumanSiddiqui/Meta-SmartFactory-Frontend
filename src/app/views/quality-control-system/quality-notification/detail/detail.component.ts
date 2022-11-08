import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { QualityNotificationService } from 'app/services/dto-services/quality-notification/quality-notification.service';
import { ImageViewerComponent } from '../../../image/image-viewer/image-viewer.component';
import { LoaderService } from '../../../../services/shared/loader.service';

@Component({
  selector: 'detail-quality-notification',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailQualityNotification implements OnInit {

  @ViewChild(ImageViewerComponent) imageViewerComponent: ImageViewerComponent;
  id;
  showTable1 = true;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  qualityNotification;

  @Output() selectedTab = new EventEmitter<any>();

  constructor(
    private loaderService: LoaderService,
    private _qualityNotificationService: QualityNotificationService) {
  }

  private initialize(id: string) {
    this.loaderService.showLoader();
    this._qualityNotificationService.detailNotification(this.id).then(
      result => {
        this.qualityNotification = result;
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
