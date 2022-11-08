import {Component, EventEmitter, Input, OnInit, Output, AfterViewInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
 
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { environment } from 'environments/environment';
import {ItemService} from 'app/services/dto-services/quality-notification/item/item.service'

@Component({
  selector: 'edit-item',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditItem implements OnInit {
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
  @Input('data') set z(data) { 
    if (data) {
      this.item = {
        createDate: data.createDate,
        description: data.description,
        qualityDefectLocationId: data.qualityDefectLocation ? data.qualityDefectLocation.defectLocationId : null,
        qualityDefectRecordingId: data.qualityDefectRecording ? data.qualityDefectRecording.defectRecordingId : null,
        qualityDefectTypeId: data.qualityDefectType ? data.qualityDefectType.defectTypeId : null,
        qualityNotificationId: data.qualityNotification ? data.qualityNotification.qualityNotificationId : null,
        qualityNotificationItemCode: data.qualityNotificationItemCode,
        qualityNotificationItemId: data.qualityNotificationItemId,
        updateDate: data.updateDate,
      }; 
    }
  };

  myModal;

  params = {
    cityDisabled: true,
    dialog: {
      title: '',
      inputText: '',
      inputValue: ''
    },
    displayDialog: false,
  };

  @Output() saveAction = new EventEmitter<any>();
  lastAccountNos;

  constructor(
    private _route: ActivatedRoute,
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _itemService: ItemService) {
  }

  ngOnInit() {
    
  }

  
  reset() {
   

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

  cancel() {
    this.saveAction.emit('close');
  }


}
