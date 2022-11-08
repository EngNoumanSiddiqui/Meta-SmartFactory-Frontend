import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {environment} from '../../../../../../environments/environment';
import {EquipmentOperationService} from '../../../../../services/dto-services/maintenance-equipment/equipment-operation.service';
import { UsersService } from 'app/services/users/users.service';
/**
 * Created by reis on 31.07.2019.
 */

@Component({
  selector: 'equipment-operation-edit',
  templateUrl: './edit.component.html'
})
export class EditEquipmentOperationComponent implements OnInit {

  @Output() saveAction = new EventEmitter<any>();
  id;
  selectedPlant: any;
  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  dataModel;

  constructor(private _router: Router,
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private _userSvc: UsersService,
              private mStrategyService: EquipmentOperationService) {

  }

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
    this.mStrategyService.getDetail(this.id)
      .then(result => {
        this.loaderService.hideLoader();
        if (result) {
          this.dataModel = result;
          this.dataModel.plantId = this.selectedPlant.plantId;
        }

      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

  save() {
    this.loaderService.showLoader();
    this.mStrategyService.save(this.dataModel)
      .then(() => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.dataModel = null;
          this.saveAction.emit('close');
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }

  cancel() {
    this.dataModel = null;
    this.saveAction.emit('close');
  }
}
