import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'environments/environment';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { UsageDecisionTypeService } from 'app/services/dto-services/usage-decision-type/usage.decision.type.service';

@Component({
  selector: 'new-usage-decision-type',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})

export class NewUsageDecisionType {

  @Input() fromAutoComplete = false;
  
  @Output() saveAction = new EventEmitter<any>();

  usageDecisionType = {
    qmQualityUsageDecisionTypeCode: null,
    qmQualityUsageDecisionTypeDescription: null,
    qmQualityUsageDecisionTypeId: null,
  };

  constructor(
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _usageDecisionTypeService: UsageDecisionTypeService
  ) {}

  reset() {
    this.usageDecisionType.qmQualityUsageDecisionTypeDescription = null,
    this.usageDecisionType.qmQualityUsageDecisionTypeCode = null;
  }

  save() {
    this.loaderService.showLoader();
    this._usageDecisionTypeService.save(this.usageDecisionType).then(
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
