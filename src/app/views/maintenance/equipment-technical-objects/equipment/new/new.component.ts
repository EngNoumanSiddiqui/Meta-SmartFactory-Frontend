import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';

import {environment} from '../../../../../../environments/environment';
import {EquipmentService} from '../../../../../services/dto-services/equipment/equipment.service';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import { UsersService } from 'app/services/users/users.service';

@Component({
  selector: 'equipment-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewEquipmentComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();

  equipment = {
    description: null,
    equipmentABCIndicatorId: null,
    equipmentCategoryId: null,
    dataMinSquareError: null,
    totalErrorCount:null,
    equipmentId: null,
    equipmentName: null,
    equipmentNo: null,
    equipmentObjectTypeId: null,
    equipmentPlannerGroupId: null,
    maintenanceWorkstationId: null,
    maintenanceFuntionalLocationId: null,
    maintenanceFuntionalLocationDesc: null,
    planningPlantId: null,
    maintenanceWorkstationPlantId: null,
    manufacturerCountryId: null,
    manufacturerId: null,
    manufacturerMonth: null,
    manufacturerPartNo: null,
    manufacturerSerialNo: null,
    manufacturerYear: null,
    modelNumber: null,
    stockId: null,
    parentEquipmentId: null,
    validFrom: null,
    weight: null,
    weightUnit: null,
  };

  params = {
    dialog: {title: '', inputValue: ''}
  };
  selectedPlant: any;

  modal = {active: false, type: null};

  constructor(private _router: Router,
              private loaderService: LoaderService,
              private _userSvc: UsersService,
              private _equipmentSvc: EquipmentService, private utilities: UtilitiesService) {
                const setPlant = this._userSvc.getPlant();
                this.selectedPlant = JSON.parse(setPlant);
                if (this.selectedPlant) {
                  this.equipment.planningPlantId = this.selectedPlant.plantId;
                  this.equipment.maintenanceWorkstationPlantId = this.selectedPlant.plantId;
                }

  }

  ngOnInit() {
  }

  setSelectedCategory(category) {
    if (category) {
      this.equipment.equipmentCategoryId = category.equipmentCategoryId;
    } else {
      this.equipment.equipmentCategoryId = null;
    }
  }
  setDataMinError(dataSquare) {
    if (dataSquare) {
      this.equipment.dataMinSquareError = dataSquare.dataMinSquareError;
    } else {
      this.equipment.dataMinSquareError = null;
    }
  }


  setSelectedWorkstation(event) {
    if (event) {
      this.equipment.maintenanceWorkstationId = event.workStationId;
    } else {
      this.equipment.maintenanceWorkstationId = null;

    }
  }  setSelectedPlannerGroup(event) {
    if (event) {
      this.equipment.equipmentPlannerGroupId = event.plannerGroupId;
    } else {
      this.equipment.equipmentPlannerGroupId = null;

    }
  }

  modalShow(type) {
    this.modal.type = type;
    this.modal.active=true;
  }

  setSelectedFunctionalLocation(event) {
    this.equipment.maintenanceFuntionalLocationId = event?.maintenanceFunctionalLocationId;
    this.equipment.maintenanceFuntionalLocationDesc = event?.description;
  }

  selectMaterialChanged(event) {
    this.equipment.equipmentName = event?.stockName || null;
    this.equipment.equipmentNo = event?.stockNo || null;
    this.equipment.stockId = event?.stockId || null;
  }
  

  setSelectedMaintenancePlant(plant) {
    if (plant) {
      this.equipment.maintenanceWorkstationPlantId = plant.plantId;
    } else {
      this.equipment.maintenanceWorkstationPlantId = null;
    }
  }
    setSelectedPlanningPlant(plant) {
    if (plant) {
      this.equipment.planningPlantId = plant.plantId;
    } else {
      this.equipment.planningPlantId = null;
    }
  }   setSelectedAbcIndicator(abcIndicator) {
    if (abcIndicator) {
      this.equipment.equipmentABCIndicatorId = abcIndicator.equipmentAbcIndicatorId;
    } else {
      this.equipment.equipmentABCIndicatorId = null;
    }
  }


  setSelectedObjectType(objectType) {
    if (objectType) {
      this.equipment.equipmentObjectTypeId = objectType.equipmentObjectTypeId;
    } else {
      this.equipment.equipmentObjectTypeId = null;
    }
  }

  setSelectedManufacturer(manufacturer) {
    if (manufacturer) {
      this.equipment.manufacturerId = manufacturer.actId;
    } else {
      this.equipment.manufacturerId = null;
    }
  }
  setSelectedCountry(countryId) {
    if (countryId) {
      this.equipment.manufacturerCountryId = countryId;
    } else {
      this.equipment.manufacturerCountryId = null;
    }
  }



  reset() {
    this.equipment = {
      description: null,
      equipmentABCIndicatorId: null,
      equipmentCategoryId: null,
      dataMinSquareError: null,
      totalErrorCount:null,
      equipmentId: null,
      equipmentName: null,
      equipmentNo: null,
      equipmentObjectTypeId: null,
      equipmentPlannerGroupId: null,
      maintenanceWorkstationId: null,
      maintenanceWorkstationPlantId: null,
      manufacturerCountryId: null,
      manufacturerId: null,
      maintenanceFuntionalLocationId: null,
      maintenanceFuntionalLocationDesc: null,
      parentEquipmentId: null,
      manufacturerMonth: null,
      manufacturerPartNo: null,
      manufacturerSerialNo: null,
      manufacturerYear: null,
      modelNumber: null,
      planningPlantId: null,
      stockId: null,
      validFrom: null,
      weight: null,
      weightUnit: null
    };
  }

  goPage() {
    this._router.navigate(['/settings/equipments']);
  }


  save() {
    this.loaderService.showLoader();
    this._equipmentSvc.save(this.equipment)
      .then(equipment => {
        this.loaderService.hideLoader();
        setTimeout(() => {
          this.reset();
          this.saveAction.emit(equipment);
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }

  // private saveImages(equipment) {
  //
  //   this.imageAdderComponent.updateMedia(equipment.equipmentId, TableTypeEnum.EQUIPMENT).then(() => {
  //       this.utilities.showSuccessToast('saved-success');
  //       setTimeout(() => {
  //         this.reset();
  //         this.saveAction.emit(equipment);
  //       }, environment.DELAY);
  //     }
  //   ).catch(error => this.utilities.showErrorToast(error));
  //
  // }


}
