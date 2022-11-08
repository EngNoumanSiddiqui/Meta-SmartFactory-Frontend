import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { environment } from 'environments/environment';
import { ParityService } from 'app/services/dto-services/parity/parity.service';

@Component({
  selector: 'parities-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();
  payLoadObject = {
    "parityCode": null,
    "parityId": null,
    language: null,
    "parityName": null,
    "plantId": null,
  }

  @Input() plantId = null;
  constructor( private parityService: ParityService,
    private loaderService: LoaderService,
    private utilities: UtilitiesService, ) {

  }


  ngOnInit() {

    this.payLoadObject.plantId = this.plantId;
  }


  reset() {
    this. payLoadObject = {
      "parityCode": null,
      "parityId": null,
      "parityName": null,
      language: null,
      plantId: this.payLoadObject.plantId,
    }
  }

  save() {
    this.loaderService.showLoader();
    this.parityService.save(this.payLoadObject)
      .then(result => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          // this.reset();
          this.saveAction.emit(result);
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }

}
