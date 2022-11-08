import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
 
import {LoaderService} from '../../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {environment} from '../../../../../../environments/environment';
import {MeasuringPointService} from '../../../../../services/dto-services/measuring/measuring-point.service';
import {EquipmentCodeGroupHeaderService} from '../../../../../services/dto-services/maintenance-equipment/code-group-header.service';
import { FunctionalLocationService } from 'app/services/dto-services/maintenance-equipment/functional-location.service';
import { UsersService } from 'app/services/users/users.service';

@Component({
  selector: 'measuring-point-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditMeasuringPointComponent implements OnInit {

  dataModel = {
    equipmentMeasuringPointId: null,
    annualEstimate: null,
    annualEstimateUnit: null,
    characteristicId: null,
    codeGroupId: null,
    countBackwards: null,
    counterOverflowReading: null,
    decimalPlaces: null,
    equipmentCodeGroupHeaderId: null,
    equipmentFunctionalLocationId: null,
    equipmentCodeGroupHeader: null,
    equipmentId: null,
    equipmentMeasuringPointNo: null,
    measurementPosition: null,
    measuringPointIsCounter: null,
    targetValue: null,
    targetValueText: null,
    plantId: null
  };
  detailMeasuringPoint;

  selectedCodeGroup;
  codeGroupHeaderList: any[];
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
  characteristicUnit;

  @Output() saveAction = new EventEmitter<any>();
  id;
  functionalLocations: any;
  selectedPlant: any;
  selectedFunctionalLocation: any;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  constructor(private measuringSvc: MeasuringPointService,
              private functionalLocationService: FunctionalLocationService,
              private _userSvc: UsersService,
              private equipmentCodeGroupHeaderService: EquipmentCodeGroupHeaderService,
              private loaderService: LoaderService,
              private utilities: UtilitiesService) {

    const setPlant = this._userSvc.getPlant();
    this.selectedPlant = JSON.parse(setPlant);
    if (this.selectedPlant) {
      this.dataModel.plantId = this.selectedPlant.plantId;
      this.codeGroupHeaderPageFilter.plantId = this.selectedPlant.plantId;
    }

    /*this._route.params.subscribe((params) => {
     this.id = params['id'];
     this.operation.operationId = this.id;
     this.initialize(this.id);
     });*/
  }

  private initialize(id) {
    this.loaderService.showLoader();
    this.measuringSvc.getDetail(id)
      .then(result => {
        this.detailMeasuringPoint = result;
        this.loaderService.hideLoader();
        if ((result['annualEstimate'])) {
          this.dataModel['annualEstimate'] = result['annualEstimate'];
        }
        if ((result['annualEstimateUnit'])) {
          this.dataModel['annualEstimateUnit'] = result['annualEstimateUnit'];
        }
        if ((result['countBackwards'])) {
          this.dataModel['countBackwards'] = result['countBackwards'];
        }
        if ((result['counterOverflowReading'])) {
          this.dataModel['counterOverflowReading'] = result['counterOverflowReading'];
        }
        if ((result['decimalPlaces'])) {
          this.dataModel['decimalPlaces'] = result['decimalPlaces'];
        }
        if ((result['equipmentMeasuringPointNo'])) {
          this.dataModel['equipmentMeasuringPointNo'] = result['equipmentMeasuringPointNo'];
        }
        if ((result['measurementPosition'])) {
          this.dataModel['measurementPosition'] = result['measurementPosition'];
        }
        if ((result['measuringPointIsCounter'])) {
          this.dataModel['measuringPointIsCounter'] = result['measuringPointIsCounter'];
        }

        if (result['maintenanceFunctionalLocation']) {
          this.selectedFunctionalLocation = result['maintenanceFunctionalLocation'];
          this.dataModel.equipmentFunctionalLocationId = result['maintenanceFunctionalLocation'].maintenanceFunctionalLocationId;
        }
        if ((result['equipmentMeasuringPointId'])) {
          this.dataModel['equipmentMeasuringPointId'] = result['equipmentMeasuringPointId'];
        }
        // if ((result['codeGroupId'])) {
        //   this.dataModel['codeGroupId'] = result['codeGroupId'];
        // }
        if ((result['equipmentCodeGroupHeader'])) {
          this.selectedCodeGroup = result['equipmentCodeGroupHeader'].equipmentCodeGroup;
          if (this.selectedCodeGroup) {
            this.dataModel.codeGroupId = this.selectedCodeGroup.equipmentCodeGroupId;
          }
          this.getCodeGroupHeaderList();
          this.dataModel.equipmentCodeGroupHeader = result['equipmentCodeGroupHeader'];
          this.dataModel.equipmentCodeGroupHeaderId = result['equipmentCodeGroupHeader'].equipmentCodeGroupHeaderId;
        }
        if ((result['equipment'])) {
          this.dataModel['equipmentId'] = result['equipment'].equipmentId;
        }if ((result['targetValue'])) {
          this.dataModel['targetValue'] = result['targetValue'];
        }if ((result['targetValueText'])) {
          this.dataModel['targetValueText'] = result['targetValueText'];
        }
        if ((result['maintenanceCharacteristic'])) {
          this.dataModel['characteristicId'] = result['maintenanceCharacteristic'].maintenanceCharacteristicId;
          this.characteristicUnit = result['maintenanceCharacteristic'].unitMeasure;
        }
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

  ngOnInit() {
    this.getFunctionalLocation();
  }
  getCodeGroupHeaderList() {
    this.codeGroupHeaderPageFilter.equipmentCodeGroupId = this.selectedCodeGroup.equipmentCodeGroupId;
    this.equipmentCodeGroupHeaderService.filter(this.codeGroupHeaderPageFilter)
      .then(r => {
        this.codeGroupHeaderList = r['content'];
      }).catch();
  }
  setSelectedEquipment(equipment) {
    if (equipment) {
      this.dataModel.equipmentId = equipment.equipmentId;
    } else {
      this.dataModel.equipmentId = null;
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
    // this.dataModel.equipmentCodeGroupHeaderId = ;
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
      this.dataModel.equipmentCodeGroupHeader = null;
    }
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
          this.detailMeasuringPoint = null;
          this.saveAction.emit(result);
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }


  cancel() {
    this.saveAction.emit('close');
    this.detailMeasuringPoint = null;
  }

  onFunctionalLocationSelected(event) {
    if (event) {
      this.dataModel.equipmentFunctionalLocationId = event.maintenanceFunctionalLocationId;
    }
  }

  getFunctionalLocation() {
    this.functionalLocationService.filter({pageSize: 100000, pageNumber: 1, planningPlantId: this.selectedPlant.plantId})
      .then(r => {
        this.functionalLocations = r ? r['content'] : [];
        if (this.selectedFunctionalLocation) {
          this.selectedFunctionalLocation = this.functionalLocations.find(itm => itm.maintenanceFunctionalLocationId === this.selectedFunctionalLocation.maintenanceFunctionalLocationId);
        }
      }).catch();
  }

}

