import { Component, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'environments/environment';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { ResultRecordingService } from 'app/services/dto-services/quality-inspection/result-recording/result-recording.service'
@Component({
  selector: 'new-result-recording',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewResultRecording{

  @Input() fromAutoComplete = false;
  @Input() plantId = null;
  @Output() saveAction = new EventEmitter<any>();

  resultRecording = {
    createDate: null,
    inspect: null,
    inspected: null,
    inspectionCharacteristicShortText: null,
    inspectionlotResultRecordingCode: null,
    inspectionlotResultRecordingId: null,
    qualityInspectionCharacteristicId: null,
    qualityInspectionLotId: null,
    qualitySamplingProcedureId: null,
    result: null,
    specifications: null,
    updateDate: null,

    // resultRecordingId: null,
    // inspectionCharacteristic: null,
    // specifications: null,
    // recordType: null,
    // inspect: null,
    // inspected: null,
    // result: null,
    // defect: null,
    // attribute: null,
    // inspectionDescription: null,
    // valuation: null,
  };
  
  inspectionCharacteristics = [
    'Item 1',
    'Item 2', 
    'Item 3'
  ];
  attributes = [
    'Attribute 1',
    'Attribute 2'
  ];

  constructor(
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _resultRecordingService: ResultRecordingService
  ) {}

  
  onSelectedInspChar(event) {
    if (event) {
      // this.resultRecording.inspectionCharacteristic = event.inspCharName;
      // this.resultRecording.recordType = "Record Type 1";
      this.resultRecording.specifications = "Specification 1";
      this.resultRecording.inspect = 7;
    }
  }


  save() {
    this.loaderService.showLoader();
    this.resultRecording['plantId'] = this.plantId;
    this._resultRecordingService.saveResultRecording(this.resultRecording).then(
      result => {
        // this.resultRecording.resultRecordingId = result.resultRecordingId;
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
