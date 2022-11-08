import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
 
import {FunctionalLocationService} from '../../../../../services/dto-services/maintenance-equipment/functional-location.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {environment} from '../../../../../../environments/environment';
import { UsersService } from 'app/services/users/users.service';

@Component({
  selector: 'functional-location-edit',
  templateUrl: './edit.component.html'
})
export class EditFunctionalLocationComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();
  id;
  selectedPlant: any;
  parentFunctionalList = [];

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

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

  };


  params = {
    buttonDisabled: false,
    dialog: {title: '', inputValue: ''}
  };


  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private _userSvc: UsersService,
              private loaderService: LoaderService, private utilities: UtilitiesService,
              private _equipmentSvc: FunctionalLocationService) {

                 
                const setPlant = this._userSvc.getPlant();
                this.selectedPlant = JSON.parse(setPlant);
                if (this.selectedPlant) {
                  this.dataModel.planningPlantId = this.selectedPlant.plantId;
                }

    /*  this._route.params.subscribe((params) => {
     this.id = params['id'];
     this.dataModel.maintenanceFunctionalLocationId = this.id;
     this.initialize(this.id);
     });*/
  }

  detailEquipment;

  private initialize(id) {
    this.loaderService.showLoader();
    this.dataModel.maintenanceFunctionalLocationId = this.id;
    this._equipmentSvc.getDetail(id)
      .then(result => {
        this.detailEquipment = result;
        this.loaderService.hideLoader();

        if ((result['description'])) {
          this.dataModel['description'] = result['description'];
        }
        if ((result['maintenanceFunctionalLocationId'])) {
          this.dataModel['maintenanceFunctionalLocationId'] = result['maintenanceFunctionalLocationId'];
        }

        if ((result['equipmentObjectType'])) {
          this.dataModel['equipmentObjectTypeId'] = result['equipmentObjectType'].equipmentObjectTypeId;
        }
        if ((result['parentId'])) {
          this.dataModel['parentId'] = result['parentId'];
        }

        if ((result['weight'])) {
          this.dataModel['weight'] = result['weight'];
        }
        if ((result['weightUnit'])) {
          this.dataModel['weightUnit'] = result['weightUnit'];
        }

        if ((result['modelNumber'])) {
          this.dataModel['modelNumber'] = result['modelNumber'];
        }
        if ((result['manufpartNo'])) {
          this.dataModel['manufpartNo'] = result['manufpartNo'];
        }
        if ((result['manufserialNo'])) {
          this.dataModel['manufserialNo'] = result['manufserialNo'];
        }
        if ((result['invertoryNo'])) {
          this.dataModel['invertoryNo'] = result['invertoryNo'];
        }
        if ((result['generalDate'])) {
          this.dataModel['generalDate'] = new Date(result['generalDate']);
        }
        if ((result['manufacturer'])) {
          this.dataModel['manufacturerId'] = result['manufacturer'].actId;
        }
        if ((result['manufacturerCountry'])) {
          this.dataModel['manufacturerCountryId'] = result['manufacturerCountry'].countryId;
        }
        if ((result['equipmentABCIndicator'])) {
          this.dataModel['equipmentABCIndicatorId'] = result['equipmentABCIndicator'].equipmentAbcIndicatorId;
        }
        if ((result['planningPlant'])) {
          this.dataModel['planningPlantId'] = result['planningPlant'].plantId;
        }
        if ((result['workStation'])) {
          this.dataModel['workStationId'] = result['workStation'].workStationId;
        }
        if ((result['equipmentPlannerGroup'])) {
          this.dataModel['equipmentPlannerGroupId'] = result['equipmentPlannerGroup'].plannerGroupId;
        }
        if ((result['mainPlant'])) {
          this.dataModel.mainPlantId= result['mainPlant'].plantId;
           
        }
      })
      .catch(error => {
        this.loaderService.hideLoader();
        console.log(error)
      });
  }

  ngOnInit() {
    this._equipmentSvc.filter({pageNumber: 1,
      pageSize: 99999, mainPlantId: this.selectedPlant ? this.selectedPlant.plantId : null}).then((res: any) => {
        this.parentFunctionalList = res['content'];
      });
  }



  save() {
    this.loaderService.showLoader();

    this._equipmentSvc.save(this.dataModel)
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


  setSelectedWorkstation(event) {
    if (event) {
      this.detailEquipment.workStation = event;
      this.dataModel.workStationId = event.workStationId;
    } else {
      this.dataModel.workStationId = null;

    }
  }

  setSelectedPlannerGroup(event) {
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
  }

  setSelectedAbcIndicator(abcIndicator) {
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

  cancel() {
    this.saveAction.emit('close');
  }

}
