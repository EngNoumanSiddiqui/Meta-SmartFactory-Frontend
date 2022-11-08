

import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {EquipmentCategoryService} from '../../../../../services/dto-services/maintenance-equipment/equipment-category.service';
import {EquipmentCategoryRequestDto} from '../../../../../dto/maintenance/equipment-category.dto';
import {environment} from '../../../../../../environments/environment';
import { UsersService } from 'app/services/users/users.service';
@Component({
  selector: 'category-new',
  templateUrl: './new.component.html'
})
export class NewCategoryComponent implements OnInit {
  selectedPlant: any;
    constructor(
              private _router: Router,
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private _confirmationSvc: ConfirmationService,
              private _translateSvc: TranslateService,
              private _userSvc: UsersService,
              private categoryService: EquipmentCategoryService) {

  }
  @Output() saveAction = new EventEmitter<any>();
  params = {
    dialog: {title: '', inputValue: '', visible: false}
  };
  modal = {active: false};
  dataModel: EquipmentCategoryRequestDto = new EquipmentCategoryRequestDto();
  ngOnInit() {
    const setPlant = this._userSvc.getPlant();
    this.selectedPlant = JSON.parse(setPlant);
    if (this.selectedPlant) {
      this.dataModel.plantId = this.selectedPlant.plantId;
    }
  }
  save() {
    this.loaderService.showLoader();
    this.dataModel.equipmentCategoryId = '';
    this.categoryService.save(this.dataModel)
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
    this.dataModel = new EquipmentCategoryRequestDto();
    this.dataModel.plantId = this.selectedPlant.plantId;
  }
}
