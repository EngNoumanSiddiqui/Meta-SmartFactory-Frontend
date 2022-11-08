//import { maintenanceStrategyPackageListDto } from './../../../../../dto/maintenance/strategy.dto';
import { WorkstationService } from './../../../../../services/dto-services/workstation/workstation.service';
import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {environment} from '../../../../../../environments/environment';
import {MaintenanceStrategyService} from '../../../../../services/dto-services/maintenance-equipment/maintenance-strategy.service';
import { MaintenanceCategoryService } from 'app/services/dto-services/maintenance-equipment/maintenance-category.service';
import { TableTypeEnum } from 'app/dto/table-type-enum';
import { RequestmaintenanceStrategyCreateDto, maintenanceStrategyPackageListDto } from 'app/dto/maintenance/strategy.dto';
import { EnumMaintenanceTypeService } from 'app/services/dto-services/enum/maintenance-type.service';
import { UsersService } from 'app/services/users/users.service';
//import { RequestmaintenanceStrategyCreateDto} from 'app/dto/maintenance/strategy.dto';
@Component({
  selector: 'maintenance-cycle-set-new',
  templateUrl: './new.component.html'
})
export class NewMaintenanceCycleSetComponent implements OnInit {
  schedulingIndicatorParams:any;
  @Output() saveAction = new EventEmitter<any>();
  selectedDetailIndex;
  dataModel:RequestmaintenanceStrategyCreateDto=new RequestmaintenanceStrategyCreateDto();
  packageDataModel:maintenanceStrategyPackageListDto= new maintenanceStrategyPackageListDto();
 /*****ArrayList*****/
 unitList;
 packageList:any[]=[];
 selectedIndex;
/*****ArrayList*****/
  params = {
    dialog: {title: '', inputValue: '', visible: false}
  };

  maintenanceCategoryFilter={
    code:null,
    description: null,
    maintenanceCategoryId:null,
    orderByDirection: null,
    orderByProperty: null,
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    query: null
}
  selectedPlant: any;

constructor(private _router: Router,
              private loaderService: LoaderService,
              private _enumService:EnumMaintenanceTypeService,
              private _mCategorySvc:MaintenanceCategoryService,
              private utilities: UtilitiesService,
              private _userSvc: UsersService,
              private workstationService:WorkstationService,
              private mStrategyService: MaintenanceStrategyService){}

  ngOnInit() {
    const setPlant = this._userSvc.getPlant();
    this.selectedPlant = JSON.parse(setPlant);
    if (this.selectedPlant) {
      this.dataModel.plantId = this.selectedPlant.plantId;
      this.packageDataModel.plantId = this.selectedPlant.plantId;
    }
    this.workstationService.getWorkstationUnitList().then(result => this.unitList = result).catch(error => console.log(error));
    this._enumService.getEnumSchedulingList().then(result=>{
      this.schedulingIndicatorParams=result;
      console.log("params",this.schedulingIndicatorParams);
    }).catch(error=>{
      console.log(error);
    });
  }

save() {
    this.loaderService.showLoader();
    this.mStrategyService.savePackageList(this.packageDataModel)
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
    console.log('@close', index);
    this.params.dialog.visible = true;
    this.selectedDetailIndex = index;
    if (this.selectedDetailIndex < 0){
      // new
      this.resetNewItemDetails();
    } 
    else 
    {
       //edit
      this.packageDataModel = Object.assign({}, this.dataModel.maintenanceStrategyPackageList[index]);
      //this.selectedStock = this.stockList.find(item => item.stockId == this.newRequestOrderDetailCreateDto.stockId);
    }
  }

addDetails(){
  console.log("@hierarchy",this.packageDataModel);
  const cloneOfNewMaintenanceDetailListItem=Object.assign({}, this.packageDataModel);
  if(this.selectedDetailIndex<0){
    this.dataModel.maintenanceStrategyPackageList.push(cloneOfNewMaintenanceDetailListItem);  
  }
  else 
  {
    // update
    this.dataModel.maintenanceStrategyPackageList[this.selectedDetailIndex] = cloneOfNewMaintenanceDetailListItem;
  }
  this.params.dialog.visible = false;
}
baseUnitChanged($event){
//will be implement when needed
}
deleteDetailItemFromList(i)
{
  this.dataModel.maintenanceStrategyPackageList.splice(i,1);
}
resetNewItemDetails(){
  this.packageDataModel=new  maintenanceStrategyPackageListDto();
  this.packageDataModel.plantId = this.selectedPlant.plantId;
}
reset(){

}  
}