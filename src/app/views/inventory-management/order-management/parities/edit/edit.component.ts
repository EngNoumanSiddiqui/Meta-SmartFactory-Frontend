import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { environment } from 'environments/environment';

import { ParityService } from 'app/services/dto-services/parity/parity.service';

@Component({
  selector: 'parities-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();
  payLoadObject = {
    "parityCode": null,
    language: null,
    "parityId": null,
    "parityName": null,
    "plantId": null,
  }
  @Input() plantId = null;

  @Input('data') set z(data) {
    if (data) {
      this.payLoadObject = {
        plantId: this.plantId,
        "parityCode": data['parityCode'],
        "parityId": data['parityId'],
        language: data['language'],
        "parityName": data['parityName'],
      };
    }
  };

  constructor( private parityService: ParityService,
    private loaderService: LoaderService,
    private utilities: UtilitiesService, ) {

  }

  ngOnInit() {
    this.payLoadObject.plantId = this.plantId;
  }

  save() {
    this.loaderService.showLoader();
    this.payLoadObject.plantId = this.plantId;
    this.parityService.save(this.payLoadObject)
      .then(() => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('updated-success');
        setTimeout(() => {
          this.saveAction.emit('close');
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });

  }
  reset() {}

}
