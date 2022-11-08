import { Component, EventEmitter, Input, OnInit, Output, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { QualityNotificationTypeService } from 'app/services/dto-services/quality-notification-type/quality-notification-type.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'edit-quality-notification-type',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditQualityNotificationType implements OnInit, AfterViewInit {
  @Input() plantId = false;
  qualityNotificationType = {
    qualityNotificationTypeId: null,
    qualityNotificationTypeCode: null,
    text: null,
  };

  id;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
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
    private _qualityNotificationTypeService: QualityNotificationTypeService) {
  }

  ngOnInit() {
    this._route.params.subscribe((params) => {
      this.id = params['id'];
      if (this.id) {
        this.qualityNotificationType.qualityNotificationTypeId = this.id;
        this.initialize(this.id);
      }
    });
  }

  ngAfterViewInit() {
    // this.showImages();
  }

  private initialize(id) {
    this.qualityNotificationType.qualityNotificationTypeId = this.id;
    this.loaderService.showLoader();

    this._qualityNotificationTypeService.detail(id).then(
      result => {
        this.loaderService.hideLoader();
        if ((result['qualityNotificationTypeCode'])) {
          this.qualityNotificationType.qualityNotificationTypeCode = result['qualityNotificationTypeCode'];
        }
        if ((result['text'])) {
          this.qualityNotificationType.text = result['text'];
        }
      }).catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }
  reset() {
    this.qualityNotificationType.qualityNotificationTypeCode = '',
      this.qualityNotificationType.text = ''
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
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }

  cancel() {
    this.saveAction.emit('close');
  }

}
