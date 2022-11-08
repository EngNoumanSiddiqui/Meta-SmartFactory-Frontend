/**
 * Created by reis on 31.07.2019.
 */


import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {environment} from '../../../../../../environments/environment';
import {EquipmentPlannerGroupService} from '../../../../../services/dto-services/maintenance-equipment/planner-group.service';
import {RequestCreateEquipmentPlannerGroupDto, ResponseEquipmentPlannerGroupDto} from '../../../../../dto/maintenance/equipment-planner-group.dto';
import { UsersService } from 'app/services/users/users.service';
@Component({
  selector: 'equipment-planner-group-edit',
  templateUrl: './edit.component.html'
})
export class EditEquipmentPlannerGroupComponent implements OnInit {

  @Output() saveAction = new EventEmitter<any>();
  id;
  selectedPlant: any;
  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  dataModel: RequestCreateEquipmentPlannerGroupDto = new RequestCreateEquipmentPlannerGroupDto();

  initialPlant;

  constructor(private _router: Router,
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private _userSvc: UsersService,
              private equipmentPlannerGroupService: EquipmentPlannerGroupService) {

                const setPlant = this._userSvc.getPlant();
                this.selectedPlant = JSON.parse(setPlant);
                // if (this.selectedPlant) {
                //   this.dataModel.plantId = this.selectedPlant.plantId;
                // }


  }

  ngOnInit() {
    this.initialize(this.id);
  }

  private initialize(id) {

    this.loaderService.showLoader();
    this.equipmentPlannerGroupService.getDetail(this.id)
      .then(result => {
        this.loaderService.hideLoader();
        if (result) {
          const myResult = result as ResponseEquipmentPlannerGroupDto;
          this.dataModel.plannerGroupId = myResult.plannerGroupId;
          this.dataModel.plannerGroup = myResult.plannerGroup;
          this.dataModel.mail = myResult.mail;
          this.dataModel.telephone = myResult.telephone;
          this.dataModel.definition = myResult.definition;
          if (myResult.maintanencePlanningPlant) {
            this.dataModel.plantId = myResult.maintanencePlanningPlant.plantId;
            this.initialPlant = myResult.maintanencePlanningPlant;
          }
        }

      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

  save() {
    this.loaderService.showLoader();
    this.equipmentPlannerGroupService.save(this.dataModel)
      .then(() => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.reset();
          this.saveAction.emit('close');
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }


  reset() {
    this.dataModel.plannerGroup = null;
    this.dataModel.definition = null;
    this.dataModel.mail = null;
    this.dataModel.telephone = null;
    this.dataModel.plantId = null;
    this.initialPlant = null;
  }

  setSelectedPlant(plant) {
    if (plant) {
      this.dataModel.plantId = plant.plantId;
    } else {
      this.dataModel.plantId = null;
    }
  }

}
