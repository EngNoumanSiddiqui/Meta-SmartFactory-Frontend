import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'environments/environment';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { InspectionOperationsService } from 'app/services/dto-services/inspection-operations/inspection-operations.service';


@Component({
  selector: 'new-inspection-operation',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewInspectionOperation {

  @Input() fromAutoComplete = false;
  @Output() saveAction = new EventEmitter<any>();

  inspectionOperation = {
    inspectionOperationId: null,
    inspectionOperationCode: null,
    inspectionOperationName: null,
    inspectionOperationText: null,
  };

  constructor(
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _inspectionOperationsService: InspectionOperationsService
  ) {}
  reset() {
    this.inspectionOperation.inspectionOperationCode= '',
    this.inspectionOperation.inspectionOperationName='',
    this.inspectionOperation.inspectionOperationText=''
  }

  save() {
    this.loaderService.showLoader();
    this._inspectionOperationsService.saveInspectionOperation(this.inspectionOperation).then(
      result => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.saveAction.emit('close');
        }, environment.DELAY);
      }).catch(
      error => {
        this.utilities.showErrorToast(error);
        this.loaderService.hideLoader();
      }
    );
  }

}
 