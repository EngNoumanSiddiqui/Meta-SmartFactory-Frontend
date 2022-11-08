import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'environments/environment';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { DefectTypeService } from 'app/services/dto-services/defect-type/defect-type.service'

@Component({
  selector: 'new-defect-type',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewDefectType {

  @Input() fromAutoComplete = false;
  @Output() saveAction = new EventEmitter<any>();

  defectType = {
    defectTypeId: null,
    defectTypeCode: null,
    defectTypeText: null,
  };

  constructor(
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _defectTypeService: DefectTypeService
  ) {}
  reset() {
    this.defectType.defectTypeCode= '',
    this.defectType.defectTypeText=''
  }

  save() {
    this.loaderService.showLoader();
    this._defectTypeService.saveDefectType(this.defectType).then(
      result => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.saveAction.emit(result);
        }, environment.DELAY);
      },
      error => {
        this.utilities.showErrorToast(error);
        this.loaderService.hideLoader();
      }
    );
  }

}
