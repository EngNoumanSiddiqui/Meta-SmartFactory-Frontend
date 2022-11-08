import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {FunctionalLocationService} from '../../../../../services/dto-services/maintenance-equipment/functional-location.service';
import {environment} from '../../../../../../environments/environment';
import { UsersService } from 'app/services/users/users.service';

@Component({
  selector: 'functional-location-new',
  templateUrl: './new.component.html'
})
export class NewFunctionalLocationComponent implements OnInit {


  @Output() saveAction = new EventEmitter<any>();
  dataModel = {
    description: null,
    equipmentABCIndicatorId: null,
    equipmentObjectTypeId: null,
    equipmentPlannerGroupId: null,
    generalDate: null,
    invertoryNo: null,
    mainPlantId: null,
    maintenanceFunctionalLocationId: null,
    manufacturerCountryId: null,
    manufacturerId: null,
    manufpartNo: null,
    manufserialNo: null,
    modelNumber: null,
    planningPlantId: null,
    parentId: null,
    weight: null,
    weightUnit: null,
    workStationId: null
  }
  selectedPlant: any;
  parentFunctionalList = [];
  constructor(private _router: Router,
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private _userSvc: UsersService,
              private functionalLocationService: FunctionalLocationService) {
                
                const setPlant = this._userSvc.getPlant();
                this.selectedPlant = JSON.parse(setPlant);
                if (this.selectedPlant) {
                  this.dataModel.planningPlantId = this.selectedPlant.plantId;
                }


  }
  ngOnInit() {

    this.functionalLocationService.filter({pageNumber: 1,
      pageSize: 99999, mainPlantId: this.selectedPlant ? this.selectedPlant.plantId : null}).then((res: any) => {
        this.parentFunctionalList = res['content'];
      });
  }

  save() {
    this.loaderService.showLoader();
    this.functionalLocationService.save(this.dataModel)
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
      description: null,
      equipmentABCIndicatorId: null,
      equipmentObjectTypeId: null,
      equipmentPlannerGroupId: null,
      generalDate: null,
      invertoryNo: null,
      mainPlantId: null,
      maintenanceFunctionalLocationId: null,
      manufacturerCountryId: null,
      manufacturerId: null,
      manufpartNo: null,
      manufserialNo: null,
      modelNumber: null,
      planningPlantId: null,
      parentId: null,
      weight: null,
      weightUnit: null,
      workStationId: null
    }
  }

  setSelectedWorkstation(event) {
    if (event) {
      this.dataModel.workStationId = event.workStationId;
    } else {
      this.dataModel.workStationId = null;

    }
  }  setSelectedPlannerGroup(event) {
  if (event) {
    this.dataModel.equipmentPlannerGroupId = event.plannerGroupId;
  } else {
    this.dataModel.equipmentPlannerGroupId = null;

  }
}

  setSelectedMaintenancePlant(plant) {
    if (plant) {
      this.dataModel.mainPlantId = plant.plantId;
    } else {
      this.dataModel.mainPlantId = null;
    }
  }
  setSelectedPlanningPlant(plant) {
    if (plant) {
      this.dataModel.planningPlantId = plant.plantId;
    } else {
      this.dataModel.planningPlantId = null;
    }
  }   setSelectedAbcIndicator(abcIndicator) {
  if (abcIndicator) {
    this.dataModel.equipmentABCIndicatorId = abcIndicator.equipmentAbcIndicatorId;
  } else {
    this.dataModel.equipmentABCIndicatorId = null;
  }
}


  setSelectedObjectType(objectType) {
    if (objectType) {
      this.dataModel.equipmentObjectTypeId = objectType.equipmentObjectTypeId;
    } else {
      this.dataModel.equipmentObjectTypeId = null;
    }
  }

  setSelectedManufacturer(manufacturer) {
    if (manufacturer) {
      this.dataModel.manufacturerId = manufacturer.actId;
    } else {
      this.dataModel.manufacturerId = null;
    }
  }
  setSelectedCountry(countryId) {
    if (countryId) {
      this.dataModel.manufacturerCountryId = countryId;
    } else {
      this.dataModel.manufacturerCountryId = null;
    }
  }



}
