
/**
 * Created by reis on 31.07.2019.
 */
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {EquipmentObjectTypesService} from '../../../../../services/dto-services/maintenance-equipment/object-types.service';
import {EquipmentObjectTypesRequestDto} from '../../../../../dto/maintenance/equipment-object-types.dto';
import {environment} from '../../../../../../environments/environment';
import { UsersService } from 'app/services/users/users.service';
@Component({
  selector: 'object-types-edit',
  templateUrl: './edit.component.html'
})
export class EditObjectTypesComponent implements OnInit {
  selectedPlant: any;
  constructor(
    private _router: Router,
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _confirmationSvc: ConfirmationService,
    private _translateSvc: TranslateService,
    private _userSvc: UsersService,
    private equipmentService: EquipmentObjectTypesService) {

  }
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
  dataModel: EquipmentObjectTypesRequestDto = new EquipmentObjectTypesRequestDto();
  ngOnInit() {
    const setPlant = this._userSvc.getPlant();
    this.selectedPlant = JSON.parse(setPlant);
    if (this.selectedPlant) {
      this.dataModel.plantId = this.selectedPlant.plantId;
    }
// this.initialize(this.id);
  }
  private initialize(id) {

    this.loaderService.showLoader();
    this.equipmentService.getDetail(this.id)
      .then(result => {
        this.loaderService.hideLoader();
        if (result) {
          this.dataModel.equipmentObjectTypeId = this.id;
         this.dataModel.equipmentObjectType = result['equipmentObjectType'];
         this.dataModel.plantId = this.selectedPlant.plantId;
         this.dataModel.equipmentObjectTypeDescription = result['equipmentObjectTypeDescription'];
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
    this.dataModel.equipmentObjectType = null;
    this.dataModel.equipmentObjectTypeDescription = null;
  }
}
