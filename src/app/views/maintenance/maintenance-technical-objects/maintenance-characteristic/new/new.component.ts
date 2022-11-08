import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {environment} from '../../../../../../environments/environment';
import {CharacteristicService} from '../../../../../services/dto-services/maintenance-equipment/characteristic.service';
import {UsersService} from '../../../../../services/users/users.service';

@Component({
  selector: 'characteristic-new',
  templateUrl: './new.component.html'
})
export class NewCharacteristicComponent implements OnInit {


  @Output() saveAction = new EventEmitter<any>();
  dataModel = {
    'caseSensitive': false,
    'characteristic': null,
    'characteristicDataTypeId': null,
    'decimalPlaces': null,
    'description': null,
    'maintenanceCharacteristicId': null,
    'negativeValuesAllowed': false,
    'numberOfCharacters': null,
    'unitMeasure': null,
    'validFrom': null,
    plantId: null
  };

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

  }

  save() {
    this.loaderService.showLoader();
    this.characteristicService.save(this.dataModel)
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
    this.dataModel = {
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
  }

  setSelectedUnit(unit) {
    if (unit) {
      this.dataModel.unitMeasure = unit;
    } else {
      this.dataModel.unitMeasure = null;
    }
  }

  setSelectedDataType(dataType){
    if (dataType) {
      this.dataModel.characteristicDataTypeId = dataType.maintenanceCharacteristicDataTypeId;
    } else {
      this.dataModel.characteristicDataTypeId = null;
    }
  }

}
