import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {environment} from '../../../../../../environments/environment';
import {MeasuringPointService} from '../../../../../services/dto-services/measuring/measuring-point.service';
import {EquipmentCodeGroupHeaderService} from '../../../../../services/dto-services/maintenance-equipment/code-group-header.service';
import { FunctionalLocationService } from 'app/services/dto-services/maintenance-equipment/functional-location.service';
import { UsersService } from 'app/services/users/users.service';

@Component({
  selector: 'new-measuring-point',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewMeasuringPointComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();
  dataModel = {
    annualEstimate: null,
    annualEstimateUnit: null,
    characteristicId: null,
    codeGroupId: null,
    countBackwards: null,
    counterOverflowReading: null,
    decimalPlaces: null,
    equipmentCodeGroupHeaderId: null,
    equipmentCodeGroupHeader: null,
    equipmentId: null,
    equipmentMeasuringPointNo: null,
    equipmentFunctionalLocationId: null,
    measurementPosition: null,
    measuringPointIsCounter: null,
    targetValue: null,
    targetValueText: null,
    plantId: null
  };
  codeGroupHeaderPageFilter = {
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    equipmentCodeGroupHeaderId: null,
    equipmentCodeGroupId: null,
    codeGroup: null,
    shortText: null,
    query: null,
    orderByProperty: 'equipmentCodeGroupHeaderId',
    orderByDirection: 'desc',
    plantId: null
  };

  functionalLocations: any[];
  selectedCodeGroup;
  codeGroupHeaderList: any[];
  characteristicUnit;
  selectedPlant: any;
  selectedFunctionalLocation: any;

  constructor(private _router: Router,
              private utilities: UtilitiesService,
              private functionalLocationService: FunctionalLocationService,
              private measuringSvc: MeasuringPointService,
              private _userSvc: UsersService,
              private equipmentCodeGroupHeaderService: EquipmentCodeGroupHeaderService,
              private loaderService: LoaderService) {

    const setPlant = this._userSvc.getPlant();
    this.selectedPlant = JSON.parse(setPlant);
    if (this.selectedPlant) {
      this.dataModel.plantId = this.selectedPlant.plantId;
      this.codeGroupHeaderPageFilter.plantId = this.selectedPlant.plantId;
    }
  }

  ngOnInit() {
    this.getFunctionalLocation();
  }


  setSelectedEquipment(equipment) {
    if (equipment) {
      this.dataModel.equipmentId = equipment.equipmentId;
    } else {
      this.dataModel.equipmentId = null;
    }
  }

  getFunctionalLocation() {
    this.functionalLocationService.filter({pageSize: 100000, pageNumber: 1, planningPlantId: this.selectedPlant.plantId})
      .then(r => {
        this.functionalLocations = r ? r['content'] : [];
      }).catch();
  }

  onFunctionalLocationSelected(event) {
    if (event) {
      this.dataModel.equipmentFunctionalLocationId = event.maintenanceFunctionalLocationId;
    }
  }

  setSelectedCharacteristic(characteristic) {
    this.characteristicUnit = null;
    if (characteristic) {
      this.dataModel.characteristicId = characteristic.maintenanceCharacteristicId;
      this.characteristicUnit = characteristic.unitMeasure;
    } else {
      this.dataModel.characteristicId = null;
    }
  }

  setSelectedEquipmentCodeGroup(codeGroup) {
    this.dataModel.equipmentCodeGroupHeaderId = null;
    this.selectedCodeGroup = codeGroup;
    if (codeGroup) {
      this.dataModel.codeGroupId = codeGroup.equipmentCodeGroupId;
      this.codeGroupHeaderPageFilter.equipmentCodeGroupId = codeGroup.equipmentCodeGroupId;
      this.equipmentCodeGroupHeaderService.filter(this.codeGroupHeaderPageFilter)
        .then(r => {
          this.codeGroupHeaderList = r['content'];
        }).catch();
    } else {
      this.dataModel.codeGroupId = null;
    }
  }

  setSelectedEquipmentCodeGroupHeader(codeGroupHeader) {
    if (codeGroupHeader) {
      this.dataModel.equipmentCodeGroupHeader = codeGroupHeader;
      this.dataModel.equipmentCodeGroupHeaderId = codeGroupHeader.equipmentCodeGroupHeaderId;
    } else {
      this.dataModel.equipmentCodeGroupHeaderId = null;
    }
  }

  reset() {


    this.dataModel = {
      annualEstimate: null,
      annualEstimateUnit: null,
      equipmentCodeGroupHeader: null,
      equipmentFunctionalLocationId: null,
      characteristicId: null,
      codeGroupId: null,
      countBackwards: null,
      counterOverflowReading: null,
      decimalPlaces: null,
      equipmentCodeGroupHeaderId: null,
      equipmentId: null,
      equipmentMeasuringPointNo: null,
      measurementPosition: null,
      measuringPointIsCounter: null,
      targetValue: null,
      targetValueText: null,
      plantId: null
    };
  }


  save() {
    if (!this.dataModel.equipmentId) {
      this.utilities.showWarningToast('equipment-required');
      return;
    }
    if (!this.dataModel.characteristicId) {
      this.utilities.showWarningToast('characteristic-required');
      return;
    }
    this.loaderService.showLoader();

    this.measuringSvc.save(this.dataModel)
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


}
