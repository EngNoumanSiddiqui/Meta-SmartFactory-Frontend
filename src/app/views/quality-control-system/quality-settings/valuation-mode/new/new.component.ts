import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'environments/environment';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { ValuationModeService } from 'app/services/dto-services/valuation-mode/valuation-mode.service';
@Component({
  selector: 'new-valuation-mode',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewValuationMode {

  @Input() fromAutoComplete = false;
  @Input() plantId = null;
  @Output() saveAction = new EventEmitter<any>();

  valuationMode = {
    createDate: null,
    samplingProcedureValuationModeCode: null,
    samplingProcedureValuationModeId: null,
    samplingProcedureValuationModeText: null,
    updateDate: null
  };

  constructor(
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _valuationModeService: ValuationModeService
  ) {}
  reset() {
    this.valuationMode = {
      createDate: null,
      samplingProcedureValuationModeCode: null,
      samplingProcedureValuationModeId: null,
      samplingProcedureValuationModeText: null,
      updateDate: null
    };
  }

  save() {
    this.loaderService.showLoader();
    this.valuationMode['plantId'] = this.plantId;
    this._valuationModeService.save(this.valuationMode).then(
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
