import {Component, EventEmitter, Input, Output, OnInit} from '@angular/core';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { QualityNotificationService } from 'app/services/dto-services/quality-notification/quality-notification.service';
import { environment } from 'environments/environment';
import { QualityNotificationProcessingService } from 'app/services/dto-services/quality-notification/processing/quality-notification-processing.service';
import { EnumService } from 'app/services/dto-services/enum/enum.service';


@Component({
  selector: 'new-processing',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewProcessing implements OnInit {
  @Output() saveAction = new EventEmitter<any>();
  notificationId: any;
  @Input('notificationId') set setnotificationId(notificationId) {
    if (notificationId) {
      this.notificationId = notificationId;
      this.processing.qualityNotificationId = notificationId;
    }
  };

  processing = {
    coordinator: null,
    createDate: null,
    departmentResponsible: null,
    malfunctionEnd: null,
    malfunctionStart: null,
    qualityDefectRecordingId: null,
    qualityNotificationId: null,
    qualityNotificationProcessingCode: null,
    qualityNotificationProcessingId: null,
    reportedBy: null,
    requiredEnd: null,
    requiredStart: null,
    updateDate: null,
    breakDown: null,
  };
  priorityList = [];

  constructor(
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private _enumSvc: EnumService,
              private _qualityNotificationProcessService: QualityNotificationProcessingService) {
  }

  ngOnInit() {
    this._enumSvc.getQualityNotificationPriorityEnum().then((res: any) => this.priorityList = res);
  }

reset() {
  this.processing = {
    coordinator: null,
    createDate: null,
    departmentResponsible: null,
    malfunctionEnd: null,
    malfunctionStart: null,
    qualityDefectRecordingId: null,
    qualityNotificationId: this.notificationId,
    qualityNotificationProcessingCode: null,
    qualityNotificationProcessingId: null,
    reportedBy: null,
    requiredEnd: null,
    requiredStart: null,
    updateDate: null,
    breakDown: null,
  };
}

  save() {
    this.loaderService.showLoader();
    this._qualityNotificationProcessService.saveNotificationProcessing(this.processing).then(
      (result: any) => {
        this.processing.qualityNotificationProcessingId = result.qualityNotificationProcessingId;
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
