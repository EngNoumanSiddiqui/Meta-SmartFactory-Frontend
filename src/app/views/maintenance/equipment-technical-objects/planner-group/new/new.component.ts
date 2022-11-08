import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {environment} from '../../../../../../environments/environment';
import {EquipmentPlannerGroupService} from '../../../../../services/dto-services/maintenance-equipment/planner-group.service';
import {RequestCreateEquipmentPlannerGroupDto} from '../../../../../dto/maintenance/equipment-planner-group.dto';
import { UsersService } from 'app/services/users/users.service';
@Component({
  selector: 'planner-group-new',
  templateUrl: './new.component.html'
})
export class NewEquipmentPlannerGroupComponent implements OnInit {
  selectedPlant: any;
  constructor(private _router: Router,
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private _userSvc: UsersService,
              private equipmentPlannerGroupService: EquipmentPlannerGroupService) {

                const setPlant = this._userSvc.getPlant();
                this.selectedPlant = JSON.parse(setPlant);
                if (this.selectedPlant) {
                  this.dataModel.plantId = this.selectedPlant.plantId;
                }

  }

  @Output() saveAction = new EventEmitter<any>();
  dataModel: RequestCreateEquipmentPlannerGroupDto = new RequestCreateEquipmentPlannerGroupDto();

  ngOnInit() {

  }

  save() {
    this.loaderService.showLoader();
    this.equipmentPlannerGroupService.save(this.dataModel)
      .then(result => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.reset();
          this.saveAction.emit(result);
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }

  reset() {
    this.dataModel = new RequestCreateEquipmentPlannerGroupDto();
  }

  setSelectedPlant(plant) {
    if (plant) {
      this.dataModel.plantId = plant.plantId;
    } else {
      this.dataModel.plantId = null;
    }
  }

}
