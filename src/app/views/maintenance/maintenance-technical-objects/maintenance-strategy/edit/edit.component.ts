import { maintenanceStrategyPackageListDto } from './../../../../../dto/maintenance/strategy.dto';
import { WorkstationService } from './../../../../../services/dto-services/workstation/workstation.service';
import { EnumMaintenanceTypeService } from './../../../../../services/dto-services/enum/maintenance-type.service';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {environment} from '../../../../../../environments/environment';
import {MaintenanceStrategyService} from '../../../../../services/dto-services/maintenance-equipment/maintenance-strategy.service';
import { RequestmaintenanceStrategyCreateDto, RequestmaintenanceStrategyUpdateDto } from 'app/dto/maintenance/strategy.dto';
import { UsersService } from 'app/services/users/users.service';
/**
 * Created by reis on 31.07.2019.
 */
@Component({
  selector: 'maintenance-strategy-edit',
  templateUrl: './edit.component.html'
})
export class EditMaintenanceStrategyComponent implements OnInit {
  dummyArray: any[] = [];
id; 
modal = {active: false};
schedulingIndicatorParams: any;
@Output() saveAction = new EventEmitter<any>();
params = {
  dialog: {title: '', inputValue: '', visible: false}
};
selectedDetailIndex = -1;
dataModel: RequestmaintenanceStrategyCreateDto = new RequestmaintenanceStrategyCreateDto();
 /*****ArrayList*****/
 packageDataModel = {
  cycleLenght: 0,
  cycleShortText: null,
  cycleUnit: null,
  hierarchy: 0,
  plantId: this.dataModel.plantId,
  hierarchyText: null,
  maintenanceCycleText: null,
  maintenanceStrategyId: null,
  maintenanceStrategyPackageId: null,
  offset: 0,
  offsetShortText: null,
  packageNumber: 0
 }

 unitList;
 packageList: any[] = [];
 selectedIndex;
/*****ArrayList*****/
maintenanceCategoryFilter = {
    code: null,
    description: null,
    maintenanceCategoryId: null,
    orderByDirection: null,
    orderByProperty: null,
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    query: null
}
  selectedPlant: any;

constructor( private _router: ActivatedRoute,
              private loaderService: LoaderService,
              private _enumService: EnumMaintenanceTypeService,
              private utilities: UtilitiesService,
              private _userSvc: UsersService,
              private workstationService: WorkstationService,
              private mStrategyService: MaintenanceStrategyService) {
                this._router.params.subscribe((params) => {
                  this.id = params['id'];
                  if (params['id']) {
                    this.initialize(this.id);
                  }
                });
              }

@Input('id') set z(id) {
   this.id = id;
   if (id) {
     this.initialize(this.id);
   }
 };


  ngOnInit() {
    const setPlant = this._userSvc.getPlant();
    this.selectedPlant = JSON.parse(setPlant);
    if (this.selectedPlant) {
      this.dataModel.plantId = this.selectedPlant.plantId;
    }
    this.workstationService.getWorkstationUnitList().then(result => this.unitList = result).catch(error => console.log(error));
    this._enumService.getEnumSchedulingList().then(result => {
      this.schedulingIndicatorParams = result;
      console.log('params', this.schedulingIndicatorParams);
    }).catch(error => {
      console.log(error);
    });
  }
  
private initialize(id) {
    this.loaderService.showLoader();
    this.mStrategyService.getDetail(this.id)
      .then(result => {
        this.loaderService.hideLoader();
        if (result) {
          this.dataModel = result as any; // RequestmaintenanceStrategyUpdateDto;
          // console.log("2ndIssue",this.dataModel);
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

openPackageOrderDetailsModal(index) {
    this.params.dialog.title = 'Package Details';
    this.params.dialog.visible = true;
    this.selectedDetailIndex = index;
    if (this.selectedDetailIndex < 0) {
      this.resetNewItemDetails();
    }  else {
      this.packageDataModel = Object.assign({}, this.dataModel.maintenanceStrategyPackageList[index]);
    }
  }
  
addDetails() {
  console.log('@hierarchy', this.packageDataModel);
  const cloneOfNewMaintenanceDetailListItem = Object.assign({}, this.packageDataModel);
  if (this.selectedDetailIndex < 0) {
    this.dataModel.maintenanceStrategyPackageList.push(cloneOfNewMaintenanceDetailListItem);  
  } else {
    // update
    this.dataModel.maintenanceStrategyPackageList[this.selectedDetailIndex] = cloneOfNewMaintenanceDetailListItem;
  }
  this.params.dialog.visible = false;
}

deleteDetailItemFromList(i) {
  this.dataModel.maintenanceStrategyPackageList.splice(i, 1);
}
resetNewItemDetails() {
  this.packageDataModel = {
    cycleLenght: 0,
    cycleShortText: null,
    cycleUnit: null,
    hierarchy: 0,
    hierarchyText: null,
    maintenanceCycleText: null,
    maintenanceStrategyId: null,
    maintenanceStrategyPackageId: null,
    offset: 0,
    plantId: this.selectedPlant.plantId,
    offsetShortText: null,
    packageNumber: 0
  }
  // this.dataModel=new RequestmaintenanceStrategyCreateDto();
}
reset() {

}  
}
