import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'environments/environment';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { QualitySystemsService } from 'app/services/dto-services/quality-systems/quality-systems.service';

@Component({
  selector: 'new-quality-system',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewQualitySystem  {

  @Input() fromAutoComplete = false;
  @Input() plantId = null;
  @Output() saveAction = new EventEmitter<any>();

  qualitySystem = { 
    qualitySystemId: null,
    qualitySystemCode: null,
    qualitySystemText: null,
  };

  constructor(
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _qualitySystemsService: QualitySystemsService
  ) {}
  
  reset() {
    this.qualitySystem.qualitySystemCode= '',
    this.qualitySystem.qualitySystemText=''
  }

  save() {
    this.loaderService.showLoader();
    this.qualitySystem['plantId'] = this.plantId;
    this._qualitySystemsService.save(this.qualitySystem).then(
      result => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.saveAction.emit('close');
        }, environment.DELAY);
      }).catch(error => {
        this.utilities.showErrorToast(error);
        this.loaderService.hideLoader();
      });
  }

}
