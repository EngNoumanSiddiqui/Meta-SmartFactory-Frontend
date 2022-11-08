import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'environments/environment';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { QualityActivityTypeService } from 'app/services/dto-services/quality-activity-type/quality.activity.type.service';
@Component({
  selector: 'new-quality-activity',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})

export class NewQualityActivity implements OnInit {

  @Input() fromAutoComplete = false;
  @Input() plantId = false;
  @Output() saveAction = new EventEmitter<any>();

  qualityActivity = {
    createDate: null,
    qualityActivityTypeCode: null,
    qualityActivityTypeId: null,
    qualityActivityTypeName: null,
    qualityActivityTypeShortText: null,
    updateDate: null
  };

  defectRecordList = [];

  constructor(
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _qualityActivityTypeSvc: QualityActivityTypeService
  ) { }

  ngOnInit() {}

  reset() {
    this.qualityActivity = {
      createDate: null,
      qualityActivityTypeCode: null,
      qualityActivityTypeId: null,
      qualityActivityTypeName: null,
      qualityActivityTypeShortText: null,
      updateDate: null
    };
  }

  save() {
    this.loaderService.showLoader();
    this.qualityActivity['plantId'] = this.plantId;
    this._qualityActivityTypeSvc.save(this.qualityActivity).then(
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
