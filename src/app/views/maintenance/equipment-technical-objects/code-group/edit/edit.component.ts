
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {environment} from '../../../../../../environments/environment';
import {EquipmentCodeGroupService} from '../../../../../services/dto-services/maintenance-equipment/code-group.service';
import {EquipmentGroupCodeRequestDto} from '../../../../../dto/maintenance/equipment-group-code.dto';
import {UsersService} from '../../../../../services/users/users.service';
/**
 * Created by reis on 31.07.2019.
 */

@Component({
  selector: 'code-group-edit',
  templateUrl: './edit.component.html'
})
export class EditCodeGroupComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();
  id;
  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };
  params = {
    dialog: {title: '', inputValue: '', visible: false}
  };
  modal = {active: false};
  dataModel: EquipmentGroupCodeRequestDto = new EquipmentGroupCodeRequestDto();

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
    this.initialize(this.id);
  }
  private initialize(id) {

    this.loaderService.showLoader();
    this.equipmentService.getDetail(this.id)
      .then(result => {
        this.loaderService.hideLoader();
        if (result) {
          this.dataModel.equipmentCodeGroupId = this.id;
         this.dataModel.active = result['active'];
         this.dataModel.category = result['category'];
         this.dataModel.shortText = result['shortText'];
        }

      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }
  save() {
    this.loaderService.showLoader();
    //this.dataModel.equipmentAbcIndicatorId = '';
    this.equipmentService.save(this.dataModel)
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
    this.dataModel.category = null;
    this.dataModel.shortText = null;
    this.dataModel.plantId = null;
  }
}
