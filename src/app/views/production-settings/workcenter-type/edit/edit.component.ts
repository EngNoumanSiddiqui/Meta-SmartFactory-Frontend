import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { environment } from '../../../../../environments/environment';
import { WorkcenterTypeService } from 'app/services/dto-services/workcenter-type/workcenter-type.service';
import { UsersService } from 'app/services/users/users.service';

@Component({
  selector: 'workcenter-type-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();
  selectedPlant:any;
  payLoadObject = {
    'workCenterTypeId': null,
    'workCenterTypeName': null,
    'plantId': null
  }
  data;
  @Input('data') set z(data) {
    this.data = data;
    if (data) {
      this.payLoadObject = {
        'workCenterTypeId': this.data.workCenterTypeId,
        'workCenterTypeName': this.data.workCenterTypeName,
        'plantId': this.data.plant ? this.data.plant.plantId : null
      };
    }
  };
  constructor( private wcTypsrv: WorkcenterTypeService,
    private loaderService: LoaderService,
    private _userSvc: UsersService,
    private utilities: UtilitiesService, ) {
      this.selectedPlant = JSON.parse(this._userSvc.getPlant());
      this.payLoadObject.plantId = this.selectedPlant ? this.selectedPlant.plantId : null;

  }

  ngOnInit() {
  }
  setSelectedPlant(event) {
    if (event) {
      this.payLoadObject.plantId = event.plantId;
    } else {
      this.payLoadObject.plantId = null;
    }
  }
  save() {
    this.loaderService.showLoader();
    this.wcTypsrv.save(this.payLoadObject)
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
