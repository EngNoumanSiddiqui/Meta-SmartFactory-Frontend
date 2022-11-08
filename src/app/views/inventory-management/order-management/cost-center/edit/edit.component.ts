import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { environment } from 'environments/environment';
import { CostCenterService } from 'app/services/dto-services/cost-center/cost-center.service';

@Component({
  selector: 'cost-center-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();
  payLoadObject = {
    "costCenterCode": null,
    "costCenterId": null,
    "costCenterName": null,
    "plantId": null,
  }
  @Input() plantId = null;

  @Input('data') set z(data) {
    if (data) {
      this.payLoadObject = {
        plantId: this.plantId,
        "costCenterCode": data['costCenterCode'],
        "costCenterId": data['costCenterId'],
        "costCenterName": data['costCenterName'],
      };
    }
  };

  constructor( private costCenterService: CostCenterService,
    private loaderService: LoaderService,
    private utilities: UtilitiesService, ) {

  }

  ngOnInit() {
    this.payLoadObject.plantId = this.plantId;
  }

  save() {
    this.loaderService.showLoader();
    this.payLoadObject.plantId = this.plantId;
    this.costCenterService.save(this.payLoadObject)
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
