/**
 * Created by reis on 31.07.2019.
 */


import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
  selector: 'category-edit',
  templateUrl: './edit.component.html'
})
export class EditCategoryComponent implements OnInit {
  selectedPlant: any;
  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };
  @Output() saveAction = new EventEmitter<any>();
  id;
  params = {
    dialog: {title: '', inputValue: '', visible: false}
  };
  modal = {active: false};
  dataModel: EquipmentCategoryRequestDto = new EquipmentCategoryRequestDto();
  constructor(
    private _router: Router,
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _confirmationSvc: ConfirmationService,
    private _translateSvc: TranslateService,
    private _userSvc: UsersService,
    private categoryService: EquipmentCategoryService) {

  }
  ngOnInit() {
    // this.initialize(this.id);
    const setPlant = this._userSvc.getPlant();
    this.selectedPlant = JSON.parse(setPlant);
    if (this.selectedPlant) {
      this.dataModel.plantId = this.selectedPlant.plantId;
    }
  }
  private initialize(id) {
    this.loaderService.showLoader();
    this.categoryService.getDetail(this.id)
      .then(result => {
        this.loaderService.hideLoader();
        if (result) {
          this.dataModel.equipmentCategoryId = result['equipmentCategoryId'];
         this.dataModel.equipmentCategory = result['equipmentCategory'];
         this.dataModel.plantId = result['plant']? result['plant'].plantId : this.selectedPlant.plantId;
         this.dataModel.equipmentCategorydescription = result['equipmentCategorydescription'];
        }

      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }
  save() {
    this.loaderService.showLoader();
    this.categoryService.save(this.dataModel)
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
    this.dataModel.equipmentCategory = null;
    this.dataModel.equipmentCategorydescription = null;
  }
}
