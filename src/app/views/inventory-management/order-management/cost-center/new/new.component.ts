import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { environment } from 'environments/environment';
import { CostCenterService } from 'app/services/dto-services/cost-center/cost-center.service';

@Component({
  selector: 'cost-center-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();
  payLoadObject = {
    "costCenterCode": null,
    "costCenterId": null,
    "costCenterName": null,
    "plantId": null,
  }

  @Input() plantId = null;
  submitted: boolean = false;
  constructor( private costCenterService: CostCenterService,
    private loaderService: LoaderService,
    private utilities: UtilitiesService, ) {

  }


  ngOnInit() {

    this.payLoadObject.plantId = this.plantId;
  }


  reset() {
    this.payLoadObject = {
      plantId: this.payLoadObject.plantId,
      "costCenterCode": null,
    "costCenterId": null,
    "costCenterName": null,
    }
  }

  save() {
    this.loaderService.showLoader();
    this.submitted = true;
    this.costCenterService.save(this.payLoadObject)
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
        this.submitted = true;
        this.utilities.showErrorToast(error);
      });
  }

}
