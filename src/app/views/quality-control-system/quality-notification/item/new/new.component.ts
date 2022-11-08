import {Component, EventEmitter, Input, Output} from '@angular/core';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import {ItemService} from 'app/services/dto-services/quality-notification/item/item.service'

import { environment } from 'environments/environment';

@Component({
  selector: 'new-item',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewItem {
  @Output() saveAction = new EventEmitter<any>();
  qualityNotificationId: any;

  @Input('qualityNotificationId') set setqualityNotification(qualityNotificationId) {
    if (qualityNotificationId) {
      this.qualityNotificationId = qualityNotificationId;
      this.item.qualityNotificationId = qualityNotificationId;
    }
  };


  item = {
    createDate: null,
    description: null,
    qualityDefectLocationId: null,
    qualityDefectRecordingId: null,
    qualityDefectTypeId: null,
    qualityNotificationId: null,
    qualityNotificationItemCode: null,
    qualityNotificationItemId: null,
    updateDate: null,
  };

  constructor(
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private _itemService: ItemService) {
  }

reset() {
 this.item = {
  createDate: null,
  description: null,
  qualityDefectLocationId: null,
  qualityDefectRecordingId: null,
  qualityDefectTypeId: null,
  qualityNotificationId: this.qualityNotificationId,
  qualityNotificationItemCode: null,
  qualityNotificationItemId: null,
  updateDate: null,
};
}

  save() {
    this.loaderService.showLoader();
    this._itemService.saveNotificationItem(this.item).then(
      result => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.saveAction.emit('close');
        }, environment.DELAY);
      },
      error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }

}
