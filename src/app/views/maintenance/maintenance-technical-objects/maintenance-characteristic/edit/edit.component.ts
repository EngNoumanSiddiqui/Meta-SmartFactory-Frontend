/**
 * Created by reis on 31.07.2019.
 */
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {environment} from '../../../../../../environments/environment';
import {CharacteristicService} from '../../../../../services/dto-services/maintenance-equipment/characteristic.service';
import {UsersService} from '../../../../../services/users/users.service';

@Component({
  selector: 'characteristic-edit',
  templateUrl: './edit.component.html'
})
export class EditCharacteristicComponent implements OnInit {

  @Output() saveAction = new EventEmitter<any>();
  id;
  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  dataModel = {
    'caseSensitive': true,
    'characteristic': null,
    'characteristicDataTypeId': null,
    'decimalPlaces': null,
    'description': null,
    'maintenanceCharacteristicId': null,
    'negativeValuesAllowed': true,
    'numberOfCharacters': null,
    'unitMeasure': null,
    'validFrom': null,
    plantId: null
  };

  detailCharacteristic;
  selectedPlant: any;

  constructor(private _router: Router,
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private characteristicService: CharacteristicService,
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
    this.characteristicService.getDetail(this.id)
      .then(result => {
        this.loaderService.hideLoader();
        if (result) {
          this.detailCharacteristic = result;
          this.dataModel = this.detailCharacteristic;
          this.dataModel.maintenanceCharacteristicId = this.detailCharacteristic.maintenanceCharacteristicId;
          this.dataModel.validFrom = new Date(this.detailCharacteristic.validFrom);
        }

      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

  save() {
    this.loaderService.showLoader();
    this.characteristicService.save(this.dataModel)
      .then(() => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.saveAction.emit('close');
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }


  cancel() {
    this.saveAction.emit('close');
  }

  setSelectedUnit(unit) {
    if (unit) {
      this.dataModel.unitMeasure = unit;
    } else {
      this.dataModel.unitMeasure = null;
    }
  }
  /**
   * Select Characteristic Data Type ID
   * @param dataType
   */
  setSelectedDataType(dataType) {
    if (dataType) {
      this.dataModel.characteristicDataTypeId = dataType.maintenanceCharacteristicDataTypeId;
    } else {
      this.dataModel.characteristicDataTypeId = null;
    }
  }

}
