import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LoaderService} from 'app/services/shared/loader.service';
import {UtilitiesService} from 'app/services/utilities.service';
import {environment} from 'environments/environment';
import {EnumService} from 'app/services/dto-services/enum/enum.service';
import {QualityNotificationProcessingService} from 'app/services/dto-services/quality-notification/processing/quality-notification-processing.service';

@Component({
  selector: 'edit-processing',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditProcessingComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();
  notificationId: any;
  @Input('notificationId') set setnotificationId(notificationId) {
    if (notificationId) {
      this.notificationId = notificationId;
      this.processing.qualityNotificationId = notificationId;
    }
  };

  @Input('data') set setData (data) {
    if (data) {
      this.processing = {
        coordinator: data.coordinator,
        createDate: data.createDate,
        departmentResponsible: data.departmentResponsible,
        malfunctionEnd: data.malfunctionEnd,
        malfunctionStart: data.malfunctionStart,
        qualityDefectRecordingId: data.qualityDefectRecording ? data.qualityDefectRecording.defectRecordingId : null,
        qualityNotificationId: data.qualityNotification ? data.qualityNotification.qualityNotificationId : null,
        qualityNotificationProcessingCode: data.qualityNotificationProcessingCode,
        qualityNotificationProcessingId: data.qualityNotificationProcessingId,
        reportedBy: data.reportedBy,
        requiredEnd: data.requiredEnd,
        requiredStart: data.requiredStart,
        updateDate: data.updateDate,
        breakDown: data.breakDown,
      };
    }
  }

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
