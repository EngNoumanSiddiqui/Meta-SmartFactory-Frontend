import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { environment } from '../../../../../environments/environment';
import { WorkstationTypeService } from 'app/services/dto-services/workstation-type/workstation-type.service';

@Component({
  selector: 'workstation-type-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();
  payLoadObject = {
    plantId: null,
    'workStationTypeId': null,
    'workStationTypeName': null
  }
  data;
  @Input() plantId = null;
  @Input('data') set z(data) {
    this.data = data;
    if (data) {
      this.payLoadObject = {
        plantId: this.plantId,
        'workStationTypeId': this.data.workStationTypeId,
        'workStationTypeName': this.data.workStationTypeName
      };
    }
  };

  constructor( private wsTypsrv: WorkstationTypeService,
    private loaderService: LoaderService,
    private utilities: UtilitiesService, ) {

  }

  ngOnInit() {
    this.payLoadObject.plantId = this.plantId;
  }

  save() {
    this.loaderService.showLoader();
    this.payLoadObject.plantId = this.plantId;
    this.wsTypsrv.save(this.payLoadObject)
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
