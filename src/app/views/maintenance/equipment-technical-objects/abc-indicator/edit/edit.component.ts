/**
 * Created by reis on 31.07.2019.
 */


import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {environment} from '../../../../../../environments/environment';
import {EquipmentAbcIndicatorService} from '../../../../../services/dto-services/maintenance-equipment/abc-indicator.service';
import {EquipmentAbcIndicatorRequestDto} from '../../../../../dto/maintenance/equipment-abc-indicator.dto';
import {UsersService} from '../../../../../services/users/users.service';

@Component({
  selector: 'abcindicator-edit',
  templateUrl: './edit.component.html'
})
export class EditAbcIndicatorComponent implements OnInit {
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
  dataModel: EquipmentAbcIndicatorRequestDto = new EquipmentAbcIndicatorRequestDto();
  selectedPlant: any;

  constructor(private _router: Router,
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private _confirmationSvc: ConfirmationService,
              private _translateSvc: TranslateService,
              private equipmentService: EquipmentAbcIndicatorService,
              private _userSvc: UsersService) {

    const setPlant = this._userSvc.getPlant();
    this.selectedPlant = JSON.parse(setPlant);
    if (this.selectedPlant) {
      this.dataModel.plantId = this.selectedPlant.plantId;
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
          this.dataModel.equipmentAbcIndicatorId = result['equipmentAbcIndicatorId'];
          this.dataModel.equipmentAbcIndicatorType = result['equipmentAbcIndicatorType'];
          this.dataModel.equipmentAbcIndicatorDescription = result['equipmentAbcIndicatorDescription'];
        }

      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

  save() {
    this.loaderService.showLoader();
    // this.dataModel.equipmentAbcIndicatorId = '';
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
    this.dataModel = new EquipmentAbcIndicatorRequestDto();
  }
}
