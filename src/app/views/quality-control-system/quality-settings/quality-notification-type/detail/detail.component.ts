import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { QualityNotificationTypeService } from 'app/services/dto-services/quality-notification-type/quality-notification-type.service'
import { LoaderService } from 'app/services/shared/loader.service';


@Component({
  selector: 'detail-quality-notification-type',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailQualityNotificationType implements OnInit {

  
  id;
  showTable1 = true;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  qualityNotificationType;

  @Output() selectedTab = new EventEmitter<any>();

  constructor(
    private loaderService: LoaderService,
    private _qualityNotificationTypeService: QualityNotificationTypeService) {
  }

  private initialize(id: string) {
    this.loaderService.showLoader();
    this._qualityNotificationTypeService.detail(this.id).then(
      result => {
        this.qualityNotificationType = result;
        this.loaderService.hideLoader();
      }).catch( error => {
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
