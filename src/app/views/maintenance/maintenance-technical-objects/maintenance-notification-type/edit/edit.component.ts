import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {environment} from '../../../../../../environments/environment';
import {MaintenanceNotificationTypeService} from '../../../../../services/dto-services/maintenance-equipment/maintenance-notification-type.service';
import {UsersService} from '../../../../../services/users/users.service';

/**
 * Created by reis on 31.07.2019.
 */
@Component({
  selector: 'maintenance-notification-type-edit',
  templateUrl: './edit.component.html'
})
export class EditMaintenanceNotificationTypeComponent implements OnInit {

  @Output() saveAction = new EventEmitter<any>();
  id;
  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  dataModel: any = {
    code: null,
    description: null,
    plantId: null
  };
  selectedPlant: any;

  constructor(private _router: Router,
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private mNotificationTypeService: MaintenanceNotificationTypeService,
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
    this.mNotificationTypeService.getDetail(this.id)
      .then(result => {
        this.loaderService.hideLoader();
        if (result) {
          this.dataModel = result;

          this.dataModel.plantId = this.selectedPlant?.plantId;
        }

      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

  save() {
    this.loaderService.showLoader();
    this.mNotificationTypeService.save(this.dataModel)
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
    this.dataModel = {
      code: null,
      description: null,
      plantId: null
    };
    this.saveAction.emit('close');
  }
}
