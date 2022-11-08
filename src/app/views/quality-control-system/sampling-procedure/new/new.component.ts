import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'environments/environment';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { SamplingProcedureService } from 'app/services/dto-services/sampling-procedure/sampling-procedure.service';

@Component({
  selector: 'new-sampling-procedure',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewSamplingProcedure implements OnInit {
  @Input() fromAutoComplete = false;
  @Output() saveAction = new EventEmitter<any>();
  @Input() plantId = null;
  samplingProcedure = {
    createDate: null,
    samplingProcedureId: null,
    acceptance: null,
    sampleSize: null,
    samplingProcedureCode: null,
    samplingProcedureName: null,
    samplingProcedureInspectionPointId: null,
    samplingProcedureValuationModeId: null,
    samplingTypeId: null,
    plantId: null,
    updateDate: null
  }

  constructor(
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _samplingProcedure: SamplingProcedureService,
  ) {}

  ngOnInit() {
   
  }

  save() {
    this.loaderService.showLoader();
    this.samplingProcedure.plantId = this.plantId;
    this._samplingProcedure.saveSamplingProcedure(this.samplingProcedure).then(
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

  onselectSamplingType(event) {
    if (event) {
      this.samplingProcedure.samplingTypeId = event.samplingTypeId;
    } else {
      this.samplingProcedure.samplingTypeId = null;
    }
  }
  onselectSamplingProcValueMode(event) {
    if (event) {
      this.samplingProcedure.samplingProcedureValuationModeId = event.samplingProcedureValuationModeId;
    } else {
      this.samplingProcedure.samplingProcedureValuationModeId = null;
    }
  }
  onselectInspPoint(event) {
    if (event) {
      this.samplingProcedure.samplingProcedureInspectionPointId = event.samplingProcedurePointId;
    } else {
      this.samplingProcedure.samplingProcedureInspectionPointId = null;
    }
  }
}
