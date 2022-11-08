
import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {EquipmentCodeGroupService} from '../../../../../services/dto-services/maintenance-equipment/code-group.service';
import {EquipmentGroupCodeRequestDto} from '../../../../../dto/maintenance/equipment-group-code.dto';
import {environment} from '../../../../../../environments/environment';
import {UsersService} from '../../../../../services/users/users.service';

@Component({
  selector: 'code-group-new',
  templateUrl: './new.component.html'
})
export class NewCodeGroupComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();
  params = {
    dialog: {title: '', inputValue: '', visible: false}
  };
  modal = {active: false};
  dataModel: EquipmentGroupCodeRequestDto = new EquipmentGroupCodeRequestDto();
  codeGroupHeaderList: any[];
  selectedCodeGroupHeader: any;
  selectedPlant: any;

  constructor(
    private _router: Router,
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private equipmentService: EquipmentCodeGroupService,
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
  save() {
    this.loaderService.showLoader();
    this.dataModel.equipmentCodeGroupId = '';
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
    this.dataModel = new EquipmentGroupCodeRequestDto();
  }
}
