import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {EquipmentService} from '../../../../../services/dto-services/equipment/equipment.service';
 
import {TableTypeEnum} from '../../../../../dto/table-type-enum';
import {ImageAdderComponent} from '../../../../image/image-adder/image-adder.component';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {environment} from '../../../../../../environments/environment';
import { UsersService } from 'app/services/users/users.service';

@Component({
  selector: 'equipment-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditEquipmentComponent implements OnInit {
  @ViewChild(ImageAdderComponent) imageAdderComponent: ImageAdderComponent;
  tableTypeForImg = TableTypeEnum.EQUIPMENT;
  @Output() saveAction = new EventEmitter<any>();
  id;
  selectedPlant: any;
  modal = {active: false, type: null};
  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };
  @Input('data') set zdata(data) {
    if (data) {
      const datmodel = JSON.parse(JSON.stringify(data));
      this.detailEquipment = datmodel;
      this.assignToMainObject(datmodel);
    }
  };
  detailEquipment;
  equipment = {
    'description': null,
    'dataMinSquareError': null,
    'totalErrorCount': null,
    'equipmentABCIndicatorId': null,
    'equipmentCategoryId': null,
    'equipmentId': null,
    'equipmentName': null,
    parentEquipmentId: null,
    maintenanceFuntionalLocationId: null,
    maintenanceFuntionalLocationDesc: null,
    'equipmentNo': null,
    stockId: null,
    'equipmentObjectTypeId': null,
    'equipmentPlannerGroupId': null,
    'maintenanceWorkstationId': null,
    'maintenanceWorkstationPlantId': null,
    'manufacturerCountryId': null,
    'manufacturerId': null,
    'manufacturerMonth': null,
    'manufacturerPartNo': null,
    'manufacturerSerialNo': null,
    'manufacturerYear': null,
    'modelNumber': null,
    'planningPlantId': null,
    'validFrom': null,
    'weight': null,
    'weightUnit': null,
    'width': null
  };
  params = {
    buttonDisabled: false,
    dialog: {title: '', inputValue: ''}
  };


  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private _userSvc: UsersService,
              private loaderService: LoaderService, private utilities: UtilitiesService,
              private _equipmentSvc: EquipmentService) {

                const setPlant = this._userSvc.getPlant();
                this.selectedPlant = JSON.parse(setPlant);
                // if (this.selectedPlant) {
                //   this.equipment.planningPlantId = this.selectedPlant.plantId;
                // }

    /*  this._route.params.subscribe((params) => {
     this.id = params['id'];
     this.equipment.equipmentId = this.id;
     this.initialize(this.id);
     });*/
  }



  private initialize(id) {
    this.loaderService.showLoader();
    this.equipment.equipmentId = this.id;
    this._equipmentSvc.getDetail(id)
      .then((result: any) => {
        this.detailEquipment = result;
        this.loaderService.hideLoader();
        this.assignToMainObject(result);
      }).then(() =>
      this.imageAdderComponent.initImages(this.id, this.tableTypeForImg))
      .catch(error => {
        this.loaderService.hideLoader();
        console.log(error)
      });
  }

  ngOnInit() {
  }

  assignToMainObject(result) {
    this.equipment = {
      'description': result.description,
      'dataMinSquareError': result.dataMinSquareError,
      'totalErrorCount': result.totalErrorCount,
      'equipmentABCIndicatorId': result['equipmentABCIndicator'] ? result['equipmentABCIndicator'].equipmentABCIndicatorId : null,
      'equipmentCategoryId': result['equipmentCategory'] ? result['equipmentCategory'].equipmentCategoryId : null,
      'equipmentId': result.equipmentId,
      parentEquipmentId: result['parentEquipment']?.equipmentId || result['parentEquipmentId'],
      maintenanceFuntionalLocationId: result['maintenanceFuntionalLocation']?.maintenanceFunctionalLocationId,
      maintenanceFuntionalLocationDesc: result['maintenanceFuntionalLocation']?.description,
      'equipmentName': result.equipmentName,
      'equipmentNo': result.equipmentNo,
      stockId: result['stock'] ?result['stock'].stockId : result.stockId,
      'equipmentObjectTypeId': result['equipmentObjectType'] ? result['equipmentObjectType'].equipmentObjectTypeId : null,
      'equipmentPlannerGroupId': result['equipmentPlannerGroup'] ? result['equipmentPlannerGroup'].equipmentPlannerGroupId : null,
      'maintenanceWorkstationId': result['maintenanceWorkstation'] ? result['maintenanceWorkstation'].workStationId : null,
      'maintenanceWorkstationPlantId': result['maintenanceWorkstationPlant'] ? result['maintenanceWorkstationPlant'].plantId : null,
      'manufacturerCountryId': result['manufacturerCountry'] ? result['manufacturerCountry'].countryId : null,
      'manufacturerId': result['manufacturer'] ? result['manufacturer'].actId : null,
      'manufacturerMonth': result.manufacturerMonth,
      'manufacturerPartNo': result.manufacturerPartNo,
      'manufacturerSerialNo': result.manufacturerSerialNo,
      'manufacturerYear': result.manufacturerYear,
      'modelNumber': result.modelNumber,
      'planningPlantId': result['planningPlant'] ? result['planningPlant'].plantId : null,
      'validFrom': result.validFrom ? new Date(result.validFrom) : null,
      'weight': result.weight,
      'weightUnit': result.weightUnit,
      'width': result.width
    };
  }

  goPage() {
    this._router.navigate(['/settings/equipments']);
  }


  save() {
    this.loaderService.showLoader();

    this._equipmentSvc.save(this.equipment)
      .then(() => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.saveAction.emit('close');
        }, environment.DELAY);
              // this.saveImages(this.id)
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }


  private saveImages(id) {

    this.imageAdderComponent.updateMedia(id, TableTypeEnum.EQUIPMENT).then(() => {
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.saveAction.emit('close');
        }, environment.DELAY);
      }
    ).catch(error => this.utilities.showErrorToast(error));

  }

  setSelectedCategory(category) {
    if (category) {
      this.equipment.equipmentCategoryId = category.equipmentCategoryId;
    } else {
      this.equipment.equipmentCategoryId = null;
    }
  }

  setSelectedWorkstation(event) {
    if (event) {
      this.equipment.maintenanceWorkstationId = event.workStationId;
    } else {
      this.equipment.maintenanceWorkstationId = null;

    }
  }

  setSelectedPlannerGroup(event) {
    if (event) {
      this.equipment.equipmentPlannerGroupId = event.plannerGroupId;
    } else {
      this.equipment.equipmentPlannerGroupId = null;

    }
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
  }

  setSelectedAbcIndicator(abcIndicator) {
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

  modalShow(type) {
    this.modal.type = type;
    this.modal.active=true;
  }

  setSelectedFunctionalLocation(event) {
    this.equipment.maintenanceFuntionalLocationId = event?.maintenanceFunctionalLocationId;
    this.equipment.maintenanceFuntionalLocationDesc = event?.description;
  }

  cancel() {
    this.saveAction.emit('close');
  }

  selectMaterialChanged(event) {
    this.equipment.equipmentName = event?.stockName || null;
    this.equipment.equipmentNo = event?.stockNo || null;
  }

}
