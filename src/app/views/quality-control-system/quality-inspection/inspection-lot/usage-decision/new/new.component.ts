import { Component, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'environments/environment';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { UsageDecisionService } from 'app/services/dto-services/quality-inspection/usage-decision/usage-decision.service'
@Component({
  selector: 'new-usage-decision',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewUsageDecision{

  @Input() fromAutoComplete = false;
  @Input() plantId = null;
  @Output() saveAction = new EventEmitter<any>();

  usageDecision = {
    usageDecisionId: null,
    udCode: null,
    usageDecision: null,
    qualityScore: null,
    inspectionLotQuantity: null,
    sampleSize: null,
    unrestrictedUse: null,
    scrap: null,
    sampleUsage: null,
    blockedStock: null,
    reserves: null
  };
  
  udCodeList = [
    'Code 1',
    'Code 2', 
    'Code 3'
  ];

  constructor(
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _usageDecisionService: UsageDecisionService
  ) {}

  
  onSelectedUsCode(event) {
    if (event) {
      this.usageDecision.usageDecision = "Decision 1";
      this.usageDecision.qualityScore = "Quality 1";
      this.usageDecision.inspectionLotQuantity = 2;
      this.usageDecision.sampleSize = 3;
    }
  }


  save() {
    this.loaderService.showLoader();
    this.usageDecision['plantId'] = this.plantId;
    this._usageDecisionService.saveUsageDecision(this.usageDecision).then(
      result => {
        // this.usageDecision.usageDecisionId = result.usageDecisionId;
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
