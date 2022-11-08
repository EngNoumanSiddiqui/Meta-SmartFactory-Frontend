import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {EquipmentCodeGroupHeaderService} from '../../../../../services/dto-services/maintenance-equipment/code-group-header.service';
import {environment} from '../../../../../../environments/environment';
import {EquipmentCodeGroupService} from '../../../../../services/dto-services/maintenance-equipment/code-group.service';
import {EquipmentGroupCodeHeaderRequestDto} from '../../../../../dto/maintenance/equipment-group-code-header.dto';
import {UsersService} from '../../../../../services/users/users.service';
@Component({
  selector: 'code-group-header-new',
  templateUrl: './new.component.html'
})
export class NewCodeGroupHeaderComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();
  params = {
    dialog: {title: '', inputValue: '', visible: false}
  };
  modal = {active: false};
  dataModel: EquipmentGroupCodeHeaderRequestDto = new EquipmentGroupCodeHeaderRequestDto();
  selectedCodeGroup: any;

  selectedPlant: any;

  constructor(private _router: Router,
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private equipmentService: EquipmentCodeGroupHeaderService,
              private equipmentCodeGroupService: EquipmentCodeGroupService,
              private _userSvc: UsersService) {

    const setPlant = this._userSvc.getPlant();
    this.selectedPlant = JSON.parse(setPlant);
    if (this.selectedPlant) {
      this.dataModel.plantId = this.selectedPlant.plantId;
    } else {
      this.dataModel.plantId = null;
    }
  }

  ngOnInit() {

  }

  setSelectedCodeGroup(codeGroup) {
    if (codeGroup) {
      this.dataModel.equipmentCodeGroupId = codeGroup.equipmentCodeGroupId;
    } else {
      this.dataModel.equipmentCodeGroupId = null;

    }
  }

  save() {
    this.loaderService.showLoader();
    // this.dataModel.equipmentCodeGroupId = this.selectedCodeGroup.equipmentCodeGroupId;
    this.equipmentService.save(this.dataModel)
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

  }
}
