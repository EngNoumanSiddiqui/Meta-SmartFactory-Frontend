import { Component, EventEmitter, Input, OnInit, Output, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { WorkstationTypeService } from '../../../../services/dto-services/workstation-type/workstation-type.service';
import { WorkstationService } from '../../../../services/dto-services/workstation/workstation.service';

import { TableTypeEnum } from '../../../../dto/table-type-enum';
import { ImageAdderComponent } from '../../../image/image-adder/image-adder.component';
import { LoaderService } from '../../../../services/shared/loader.service';
import { UtilitiesService } from '../../../../services/utilities.service';
import { environment } from '../../../../../environments/environment';
import { Subscription } from 'rxjs';
import { UsersService } from 'app/services/users/users.service';

@Component({
  selector: 'workstation-edit',
  templateUrl: './edit.component.html',
  styles: [`
    :host ::ng-deep tbody > tr> td {
      vertical-align: middle;
    }
  `]
})
export class EditWorkstationComponent implements OnInit, OnDestroy {
  wareHouse: any;
  workstations: any;
  workStationParentid:any;
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
    locationId: null,
    inputWarehouseLocationNo: null,
    outputWarehouseLocationNo: null,
    description: null,
    groupCodeId: null,
    currency: null,
    kwh: null,
    outputWarehouseId: null,
    numberOfScissors: null,
    workstationMaterialGroupList: [],
    kwhCost: null,
    workstationCostRate: null,
    workStationUnit: null,
    wastageCalculation: null,
    targetAvailability: null,
    targetOee: null,
    targetPerformance: null,
    useMsfCalendar: false,
    targetQuality: null,
    targetTeep: null,
    baseUnit: null,
    mark: null,
    minCapacity: null,
    weight: null,
    avarageDiameter: null,
    innerDiameter: null,
    length: null,
    outerDiameter: null,
    density: null,
    model: null,
    operationIdx: null,
    parentId: null,
    plantId: null,
    producer: null,
    productDate: null,
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
    maxInputSpace:null,
    skipChangeoverControl: 0

  };

  @ViewChild(ImageAdderComponent) imageAdderComponent: ImageAdderComponent;
  @Output() saveAction = new EventEmitter<any>();
  id;
  subscription: Subscription;
  selectedPlant: any;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  tableTypeForImg = TableTypeEnum.WORKSTATION;
  params = {
    dialog: { title: '', inputValue: '' }
  };
  workstationTypeList;

  constructor(private _route: ActivatedRoute,
    private _router: Router,
    private loaderService: LoaderService,
    private _workStationSvc: WorkstationService,
    private utilities: UtilitiesService,
    private _userSvc: UsersService,
    private _workStationTypeSvc: WorkstationTypeService) {
      this.selectedPlant = JSON.parse(this._userSvc.getPlant());
      this.workStation.plantId = this.selectedPlant ? this.selectedPlant.plantId : null;
      this.pageFilter.plantId = this.workStation.plantId;

    /* this._route.params.subscribe((params) => {
     this.id = params['id'];
     this.workStation.workStationId = this.id;
     this.initialize(this.id);
     });*/
  }

  private initialize(id) {
    this.workStation.workStationId = this.id;
    this.loaderService.showLoader();
    this._workStationSvc.getDetail(id)
      .then(result => {
        this.loaderService.hideLoader();
        if ((result['workStationNo'])) {
          this.workStation['workStationNo'] = result['workStationNo'];
        }
        if ((result['workStationName'])) {
          this.workStation['workStationName'] = result['workStationName'];
        }

        if ((result['workStationTypeId'])) {
          this.workStation['workStationTypeId'] = result['workStationTypeId'];
        }
        if ((result['workStationCategory'])) {
          this.workStation['workstationCategoryCode'] = result['workStationCategory'].wsCatCode;
        }

        if ((result['parentId'])) {
          this.workStationParentid  = +result['parentId'];
          this.workStation['parentId'] = this.workStationParentid;
          if (this.workStation.parentId === 0) {
            this.workStation.parentId = null;
          }
        }

        if ((result['childId'])) {
          this.workStationParentid  = +result['childId'];
          this.workStation['childId'] = this.workStationParentid;
          if (this.workStation.childId === 0) {
            this.workStation.childId = null;
          }
        }

        if ((result['plant'])) {
          this.workStation['plantId'] = result['plant'].plantId;
        }
        if ((result['baseUnit'])) {
          this.workStation.baseUnit = result['baseUnit'];
        }
        this.workStation.workStationUnit =result['workStationUnit'];
        this.workStation.wastageCalculation = result['wastageCalculation'];
        this.workStation.workstationCostRate = result['workstationCostRate'];
        if ((result['description'])) {
          this.workStation['description'] = result['description'];
        }
        if ((result['mark'])) {
          this.workStation['mark'] = result['mark'];
        }
        if ((result['model'])) {
          this.workStation['model'] = result['model'];
        }
        this.workStation.outputWarehouseId = result['outputWarehouse']?.wareHouseId || null;
        this.workStation.targetAvailability = result['targetAvailability'];
        this.workStation.targetOee = result['targetOee'];
        this.workStation.targetPerformance = result['targetPerformance'];
        this.workStation.targetQuality = result['targetQuality'];
        this.workStation.targetTeep = result['targetTeep'];
        this.workStation.currency = result['currency'];
        if ((result['serialNo'])) {
          this.workStation['serialNo'] = result['serialNo'];
        }
        this.workStation.numberOfScissors = result['numberOfScissors'];
        if ((result['capacity'])) {
          this.workStation['capacity'] = result['capacity'];
        }
        if ((result['minCapacity'])) {
          this.workStation['minCapacity'] = result['minCapacity'];
        }
        if ((result['cyclePeriod'])) {
          this.workStation['cyclePeriod'] = result['cyclePeriod'];
        }
        if ((result['kwh'])) {
          this.workStation['kwh'] = result['kwh'];
        }
        if ((result['kwhCost'])) {
          this.workStation['kwhCost'] = result['kwhCost'];
        }
        if ((result['producer'])) {
          this.workStation['producer'] = result['producer'];
        }
        if ((result['productDate'])) {
          this.workStation['productDate'] = new Date(moment(result['productDate']).format());
        }
        this.workStation.outerDiameter = result['outerDiameter'];
        this.workStation.avarageDiameter = result['avarageDiameter'];
        this.workStation.innerDiameter = result['innerDiameter'];
        this.workStation.length = result['length'];
        this.workStation.density = result['density'];
        this.workStation.weight = result['weight'];
        this.workStation.useMsfCalendar = result['useMsfCalendar'];
        this.workStation.maxRunningDuration = result['maxRunningDuration'];
        this.workStation.maxStandbyDuration = result['maxStandbyDuration'];
        this.workStation.maxStopDuration = result['maxStopDuration'];
        this.workStation.inputWarehouseLocationNo = result['inputWarehouseLocationNo'];
        this.workStation.outputWarehouseLocationNo = result['outputWarehouseLocationNo'];
        this.workStation.locationId = result['location']?.locationId;
        this.workStation.maxSetupDuration = result['maxSetupDuration'];
        this.workStation.maxInputSpace = result['maxInputSpace'];
        this.workStation.skipChangeoverControl = result['skipChangeoverControl'];
        this.workStation.maxBufferQuantity = result['maxBufferQuantity'];
        this.workStation.workstationMaterialGroupList = result['workstationMaterialGroupList'];
        if ((result['purchaseDate'])) {
          this.workStation['purchaseDate'] = new Date(moment(result['purchaseDate']).format());
        }
        if ((result['workCenterId'])) {
          this.workStation['workCenterId'] = result['workCenterId'];
        }
        if ((result['warehouse'])) {
          this.wareHouse = {... result['warehouse'], wareHouseId:  result['warehouseId']};
        }
        this.workStation.warehouseId = result['warehouse'].wareHouseId;

      }).then(() =>
        this.imageAdderComponent.initImages(this.id, this.tableTypeForImg))
      .catch(error => {
        this.loaderService.hideLoader();
        console.log(error)
      });
  }
  worstationUnitChanged(event: any) {
    this.workStation.workStationUnit = event; // includes only measurement Id.
  }
  targetChanged(event) {
    this.workStation.targetOee = ((this.workStation.targetAvailability * this.workStation.targetQuality * this.workStation.targetPerformance) / 10000);
  }
  filter(data) {
    this._workStationSvc.filter(data)
      .then(result => {
        this.workstations = result['content'];
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

  setSelectedPlant(event) {
    this.wareHouse = null;
    this.workStation.warehouseId = null;
    if (event) {
      this.workStation.plantId = event.plantId;
    } else {
      this.workStation.plantId = null;
    }
    this.pageFilter.plantId = this.workStation.plantId;
    this.filter(this.pageFilter);
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
  selectWorkstationCategory(event) {
    if (event && event.hasOwnProperty('wsCatCode')) {
      this.workStation.workstationCategoryCode = event.wsCatCode;
    } else {
      this.workStation.workstationCategoryCode = null;
    }
  }
  selectWorkCenter(event) {
    if (event && event.hasOwnProperty('workCenterId')) {
      this.workStation.workCenterId = event.workCenterId;
    } else {
      this.workStation.workCenterId = null;
    }
  }

  ngOnInit() {
    this.subscription = this._workStationSvc.saveAction$.asObservable().subscribe(rs => {
      this.save();
    });
    this.filter(this.pageFilter);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  baseUnitChanged(event: any) {
    this.workStation.baseUnit = event; // includes only measurement Id.
 }


  saveWorkStationType() {
    this._workStationTypeSvc.save({ 'workStationTypeName': this.params.dialog.inputValue })
      .then(result => {
        this.utilities.showSuccessToast('saved-success');
        this.workstationTypeList.push({ 'workStationTypeId': result, 'workStationTypeName': this.params.dialog.inputValue });
        this.workStation.workStationTypeId = result;
        this.params.dialog.inputValue = '';
      })
      .catch(error => this.utilities.showErrorToast(error));
  }
  cancel() {
    this._router.navigate(['/settings/workstation']);
  }
  goPage() {
    this._router.navigate(['/settings/workstation']);
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
  save() {
    this.loaderService.showLoader();
    if (this.workStation.parentId !== 'null' || null) {
      this.workStation.parentId = +this.workStation.parentId;
      if (this.workStation.parentId === 0) {
        this.workStation.parentId = null;
      }
    } else {
      this.workStation.parentId = null;
    }

    this._workStationSvc.update(this.workStation)
      .then(() => {
        this.loaderService.hideLoader();
        this.saveImages(this.id)
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }
  private saveImages(id) {
    this.imageAdderComponent.updateMedia(id, TableTypeEnum.WORKSTATION).then(() => {
      this.utilities.showSuccessToast('saved-success');
      setTimeout(() => {
        this.saveAction.emit('close');
      }, environment.DELAY);
    }
    ).catch(error => this.utilities.showErrorToast(error));
  }
}
