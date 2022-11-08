import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'environments/environment';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { SamplingTypeService } from 'app/services/dto-services/sampling-type/sampling-type.service';
@Component({
  selector: 'new-sampling-type',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewSamplingType { 

  @Input() fromAutoComplete = false;
  @Output() saveAction = new EventEmitter<any>();

  samplingType = {
    samplingTypeCode: null,
    samplingTypeId: null,
    samplingTypeText: null,
  };

  constructor(
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _SamplingTypeService: SamplingTypeService
  ) {}
  
  reset() {
    this.samplingType = {
      samplingTypeCode: null,
      samplingTypeId: null,
      samplingTypeText: null,
    };
  }

  save() {
    this.loaderService.showLoader();
    this._SamplingTypeService.saveSamplingType(this.samplingType).then(
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
