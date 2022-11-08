import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'environments/environment';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { QualityCauseTypeService } from 'app/services/dto-services/quality-cause-type/quality.cause.type.service';
@Component({
  selector: 'new-quality-causes',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})

export class NewQualityCause implements OnInit {

  @Input() fromAutoComplete = false;
  @Input() plantId = false;
  @Output() saveAction = new EventEmitter<any>();

  qualityCausesType = {
    createDate: null,
    qualityCauseTypeCode: null,
    qualityCauseTypeDescription: null,
    qualityCauseTypeId: null,
    qualityCauseTypeName: null,
    updateDate: null
  };

  constructor(
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _qualityCauseTypeService: QualityCauseTypeService
  ) { }

  ngOnInit() {}

  reset() {
    this.qualityCausesType = {
      createDate: null,
      qualityCauseTypeCode: null,
      qualityCauseTypeDescription: null,
      qualityCauseTypeId: null,
      qualityCauseTypeName: null,
      updateDate: null
    };
  }

  save() {
    this.loaderService.showLoader();
    this.qualityCausesType['plantId'] = this.plantId;
    this._qualityCauseTypeService.save(this.qualityCausesType).then(
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
