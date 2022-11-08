import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'environments/environment';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { QualityReportTypeService } from 'app/services/dto-services/quality-report-type/quality-report-type.service'
@Component({
  selector: 'new-quality-report-type', 
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewQualityReportType {

  @Input() fromAutoComplete = false;
  @Input() plantId = null;
  @Output() saveAction = new EventEmitter<any>();

  qualityReportType = { 
    createDate: null,
    qualityNotificationReportTypeCode: null,
    qualityNotificationReportTypeId: null,
    qualityNotificationReportTypeShortText: null,
    updateDate: null,
  };

  constructor(
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _qualityReportTypeService: QualityReportTypeService
  ) {}
  
  reset() {
    this.qualityReportType = { 
      createDate: null,
      qualityNotificationReportTypeCode: null,
      qualityNotificationReportTypeId: null,
      qualityNotificationReportTypeShortText: null,
      updateDate: null,
    };
  }

  save() {
    this.loaderService.showLoader();
    this.qualityReportType['plantId'] = this.plantId;
    this._qualityReportTypeService.save(this.qualityReportType).then(
      result => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.saveAction.emit('close');
        }, environment.DELAY);
      },
      error => {
        this.utilities.showErrorToast(error);
        this.loaderService.hideLoader();
      }
    );
  }

}
