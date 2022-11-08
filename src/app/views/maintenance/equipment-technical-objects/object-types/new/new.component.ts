


import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {EquipmentObjectTypesService} from '../../../../../services/dto-services/maintenance-equipment/object-types.service';
import {EquipmentObjectTypesRequestDto} from '../../../../../dto/maintenance/equipment-object-types.dto';
import {environment} from '../../../../../../environments/environment';
import { UsersService } from 'app/services/users/users.service';
@Component({
  selector: 'object-types-new',
  templateUrl: './new.component.html'
})
export class NewObjectTypesComponent implements OnInit {
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
  }
  save() {
    this.loaderService.showLoader();
    this.dataModel.equipmentObjectTypeId = '';
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
    this.dataModel = new EquipmentObjectTypesRequestDto();
    this.dataModel.plantId = this.selectedPlant.plantId;
  }
}
