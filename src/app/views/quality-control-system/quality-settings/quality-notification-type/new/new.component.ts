import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'environments/environment';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { QualityNotificationTypeService } from 'app/services/dto-services/quality-notification-type/quality-notification-type.service';
@Component({
  selector: 'new-quality-notification-type',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewQualityNotificationType { 

  @Input() fromAutoComplete = false;
  @Input() plantId = false;
  @Output() saveAction = new EventEmitter<any>();

  qualityNotificationType = {
    qualityNotificationTypeId: null,
    qualityNotificationTypeCode: null,
    text: null,
  };

  constructor(
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _qualityNotificationTypeService: QualityNotificationTypeService
  ) {}
  
  reset() {
    this.qualityNotificationType.qualityNotificationTypeCode= '',
    this.qualityNotificationType.text=''
  }

  save() {
    this.loaderService.showLoader();
    this.qualityNotificationType['plantId'] = this.plantId;
    this._qualityNotificationTypeService.save(this.qualityNotificationType).then(
      result => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.saveAction.emit('close');
        }, environment.DELAY);
      }).catch(error => {
        this.utilities.showErrorToast(error);
        this.loaderService.hideLoader();
      });
  }
}
