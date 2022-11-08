import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'environments/environment';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { QualityControlKeyServiceService } from 'app/services/dto-services/quality-control-key/quality-control-key-service.service';

@Component({
  selector: 'new-quality-control-key',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewQualityControlKey {

  @Input() fromAutoComplete = false;
  @Input() plantId = null;
  @Output() saveAction = new EventEmitter<any>();

  qualityControlKey = {
    qmControlKeyId: null,
    qmControlKeyText: null,
    qmControlKeyCode: null,
  };

  constructor(
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _qualityControlKeyServiceService: QualityControlKeyServiceService
  ) { }

  reset() {
    this.qualityControlKey.qmControlKeyCode = '',
      this.qualityControlKey.qmControlKeyText = ''
  }

  save() {
    this.loaderService.showLoader();
    this.qualityControlKey['plantId'] = this.plantId;
    this._qualityControlKeyServiceService.save(this.qualityControlKey).then(
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
        });
  }

}
