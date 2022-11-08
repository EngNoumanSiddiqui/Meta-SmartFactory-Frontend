import {Component, EventEmitter, OnInit, Output, ViewChild, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {WorkstationService} from '../../../../services/dto-services/workstation/workstation.service';
import {TableTypeEnum} from '../../../../dto/table-type-enum';
import {ImageAdderComponent} from '../../../image/image-adder/image-adder.component';
import {LoaderService} from '../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../services/utilities.service';
import {environment} from '../../../../../environments/environment';
import { Subscription } from 'rxjs';
import { UsersService } from 'app/services/users/users.service';

@Component({
  selector: 'workstation-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewWorkstationComponent implements OnInit, OnDestroy {

  @ViewChild(ImageAdderComponent) imageAdderComponent: ImageAdderComponent;
  
  @Output() saveAction = new EventEmitter<any>();
  
  wareHouse;
  
  workstations: any;
  
  parseParentId;
  // workStationCategoryList;
  pageFilter = {
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    plantId: null,
    plantName: null,
    workStationNo: null,
    workStationName: null,
    workStationStatus: null,
    workStationTypeName: null,
    query: null,
    orderByProperty: null,
    orderByDirection: 'desc'
  };
  
  workStation = {
    capacity: null,
    childId:null,
    cyclePeriod: null,
    description: null,
    groupCodeId: null,
    kwh: null,
    weight: null,
    avarageDiameter: null,
    innerDiameter: null,
    length: null,
    outerDiameter: null,
    density: null,
    kwhCost: null,
    locationId: null,
    inputWarehouseLocationNo: null,
    outputWarehouseLocationNo: null,
    currency:null,
    mark: null,
    minCapacity: null,
    workStationUnit: null,
    workstationCostRate: null,
    wastageCalculation: null,
    model: null,
    operationIdx: null,
    parentId: null,
    outputWarehouseId: null,
    plantId: null,
    numberOfScissors: null,
    producer: null,
    productDate: null,
    baseUnit: null,
    purchaseDate: null,
    serialNo: null,
    warehouseId: null,
    workCenterId: null,
    workStationId: null,
    workStationName: null,
    workStationNo: null,
    workStationTypeId: null,
    workstationCategoryCode: null,
    maxRunningDuration: null,
    useMsfCalendar: false,
    maxStandbyDuration: null,
    maxStopDuration: null,
    maxBufferQuantity: null,
    targetAvailability: null,
    targetOee: null,
    targetPerformance: null,
    targetQuality: null,
    targetTeep: null,
    maxSetupDuration: null,
    maxInputSpace: null,
    skipChangeoverControl: 0,
    workstationMaterialGroupList: []
  };

  id;
  
  params = {
    dialog: {title: '', inputValue: ''}
  };
  
  subscription: Subscription;
  
  selectedPlant: any;

  constructor(
    // private _gcodeSvc: GroupCodeService,
    private _router: Router,
    private loaderService: LoaderService,
    private _workStationSvc: WorkstationService,
    private _userSvc: UsersService,
    private utilities: UtilitiesService) {
      this.selectedPlant = JSON.parse(this._userSvc.getPlant());
      this.workStation.plantId = this.selectedPlant ? this.selectedPlant.plantId : null;
      this.pageFilter.plantId = this.workStation.plantId;
  }

  ngOnInit() {

    this.subscription = this._workStationSvc.saveAction$.asObservable().subscribe(rs => {
      this.save();
    });
    // this.filter(this.pageFilter);
  }
  getAllWorkStation() {
    
  }
  setSelectedWorkStation(event){
    this.workStation.parentId = event.workStationId;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // saveWorkStationType() {
  //   this._workStationTypeSvc.save({'workStationTypeName': this.params.dialog.inputValue})
  //     .then(result => {
  //       this.utilities.showSuccessToast('saved-success');
  //       this.workstationTypeList.push({'workStationTypeId': result, 'workStationTypeName': this.params.dialog.inputValue});
  //       this.workStation.workStationTypeId = result;
  //       this.params.dialog.inputValue = '';
  //     })
  //     .catch(error => this.utilities.showErrorToast(error));
  // }

  selectWorkstationType(event) {
    if(event){
      if(event.workStationTypeId.hasOwnProperty('workStationTypeId')){
        this.workStation.workStationTypeId = event.workStationTypeId.workStationTypeId;
      }else{
        this.workStation.workStationTypeId = event.workStationTypeId;
      }
    }
  }
  selectWorkstationCategory(event) {
    this.workStation.workstationCategoryCode = event.wsCatCode;
  }
  selectWorkCenter(event) {
    if (event && event.hasOwnProperty('workCenterId')) {
      this.workStation.workCenterId = event.workCenterId;
    } else {
      this.workStation.workCenterId = null;
    }
  }
  selectLocation(event) {
    if (event && event.hasOwnProperty('locationId')) {
      this.workStation.locationId = event.locationId;
    } else {
      this.workStation.locationId = null;
    }
  }

  

  selectInputLocation(event) {
    if (event && event.hasOwnProperty('locationId')) {
      this.workStation.inputWarehouseLocationNo = event.locationNo;
    } else {
      this.workStation.inputWarehouseLocationNo = null;
    }
  }
  selectOutputLocation(event) {
    if (event && event.hasOwnProperty('locationId')) {
      this.workStation.outputWarehouseLocationNo = event.locationNo;
    } else {
      this.workStation.outputWarehouseLocationNo = null;
    }
  }
  reset() {
    this.workStation = {
      capacity: null,
      childId:null,
      weight: null,
      avarageDiameter: null,
      innerDiameter: null,
      length: null,
      outerDiameter: null,
      density: null,
      cyclePeriod: null,
      locationId: null,
      inputWarehouseLocationNo: null,
      outputWarehouseLocationNo: null,
      description: null,
      groupCodeId: null,
      kwh: null,
      baseUnit: null,
      kwhCost: null,
      mark: null,
      numberOfScissors: null,
      currency: null,
      minCapacity: null,
      workStationUnit: null,
    wastageCalculation: null,
      model: null,
      operationIdx: null,
      parentId: null,
      plantId: null,
      workstationCostRate: null,
      targetAvailability: null,
      outputWarehouseId: null,
      targetOee: null,
      targetPerformance: null,
      targetQuality: null,
      targetTeep: null,
      producer: null,
      productDate: null,
      useMsfCalendar: false,
      purchaseDate: null,
      serialNo: null,
      warehouseId: null,
      workCenterId: null,
      workStationId: null,
      workStationName: null,
      workStationNo: null,
      workStationTypeId: null,
      workstationCategoryCode: null,
      maxRunningDuration: null,
      maxStandbyDuration: null,
      maxStopDuration: null,
      maxBufferQuantity: null,
      maxSetupDuration: null,
      maxInputSpace: null,
      skipChangeoverControl: 0,
      workstationMaterialGroupList: []
    };
  }

  setSelectedPlant(event) {
    // this.workStation.wareHouse = null;
    // this.workStation.wareHouse = null;
    this.wareHouse = null;
    this.wareHouse = null;
    if (event) {
      this.workStation.plantId = event.plantId;
    } else {
      this.workStation.plantId = null;
    }
    this.pageFilter.plantId = this.workStation.plantId;
  }
  
  setSelectedWarehouse(event) {
    // this.workStation.wareHouse = event;
    this.wareHouse = event;
    if (event && event.hasOwnProperty('wareHouseId')) {
      this.workStation.warehouseId = event.wareHouseId;
    } else {
      this.workStation.warehouseId = null;
    }
  }
  

  goPage() {
    this._router.navigate(['/settings/workstation']);
  }

  setSelectedWorkstation(event){
    this.workStation.parentId = event.workStationId;
  }
  save() {
    if (this.workStation.parentId !== 'null' || null) {
      this.workStation.parentId = +this.workStation.parentId;
      if (this.workStation.parentId === 0) {
        this.workStation.parentId = null;
      }
    } else {
      this.workStation.parentId = null;
    }

    this.loaderService.showLoader();
    this._workStationSvc.save(this.workStation)
      .then(workStationId => {
        this.saveImages(workStationId);
        this.workStation.workStationId = workStationId;
        
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }
  baseUnitChanged(event: any) {
    this.workStation.baseUnit = event; // includes only measurement Id.
 }
 worstationUnitChanged(event: any) {
  this.workStation.workStationUnit = event; // includes only measurement Id.
}

targetChanged(event) {
  this.workStation.targetOee = ((this.workStation.targetAvailability * this.workStation.targetQuality * this.workStation.targetPerformance) / 10000);
}

  private saveImages(workStationId) {
    this.imageAdderComponent.updateMedia(workStationId, TableTypeEnum.WORKSTATION).then(() => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.saveAction.emit(this.workStation.workStationId);
        }, environment.DELAY);
        // setTimeout(() => {
        //   this.reset();
        //   // this.saveAction.emit('close');
        // }, environment.DELAY);
      }
    ).catch(error => this.utilities.showErrorToast(error));
  }
}
