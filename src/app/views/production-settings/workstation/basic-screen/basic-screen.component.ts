import {filter} from 'rxjs/operators';
import {Component, OnInit, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import {WorkcenterService} from 'app/services/dto-services/workcenter/workcenter.service';
import {PlantService} from 'app/services/dto-services/plant/plant.service';
import {WorkstationService} from 'app/services/dto-services/workstation/workstation.service';
import {LoaderService} from 'app/services/shared/loader.service';
import {UtilitiesService} from 'app/services/utilities.service';
import {environment} from 'environments/environment';
 
import {ModalDirective} from 'ngx-bootstrap/modal';
import {WorkstationErpService} from '../../../../services/dto-services/workstation/workstation-erp.service';
import {WorkstationEfficiencyDto} from '../../../../dto/workstation/workstation.model';
import {ResponseEquipmentPlannerGroupDto} from '../../../../dto/maintenance/equipment-planner-group.dto';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-basic-screen',
  templateUrl: './basic-screen.component.html',
  styleUrls: ['./basic-screen.component.scss']
})
export class BasicScreenComponent implements OnInit {
  // @Output() saveAction = new EventEmitter<any>();
  @ViewChild('myModal') public myModal: ModalDirective;
  stockUnitMessage: string;
  standardUnitEditrowId;
  standardKeyObject: any;

  workstationEfficiencyItem = {
    wsPrmtId: null,
    wsId: null,
    wsEffcnCode: null,
    wsEffcnParameterCode: null,
    wsEffcnRate: 0
  };

  editMode = false;
  filterStandardKeyParameters: any;
  plantList;
  filterWorkcenter = {pageNumber: 1, pageSize: 500, workCenterName: ''};
  workcenterList;
  workStationCategoryList;
  standardKeyList;
  standardKeyParameterList;
  workstationId;
  // dumbStandardKeyList: any = [] = [];
  workStationEfficiencyList: any = [];

  @Input('workstationId') set z(wsId) {
    if (wsId) {
      this.editMode = true;
      this.workstationId = wsId;
      this.initialize();
    }
  };

  params = {
    dialog: {title: '', inputValue: ''}
  };

  workStationUpdate = {
    'capacity': null,
    'cyclePeriod': null,
    'description': null,
    'kwh': null,
    'kwhCost': null,
    'mark': null,
    'minCapacity': null,
    'model': null,
    'operationIdx': null,
    'plantId': null,
    'producer': null,
    'productDate': null,
    'purchaseDate': null,
    'serialNo': null,
    'workCenterId': null,
    'workStationId': null,
    'workStationName': null,
    'workStationNo': null,
    'workStationTypeId': null,
    'workstationCategoryCode': null

  };
  workStation = {
    capacity: null,
    cyclePeriod: null,
    description: null,
    groupCodeId: null,
    kwh: null,
    kwhCost: null,
    mark: null,
    minCapacity: null,
    model: null,
    operationIdx: null,
    plantId: null,
    producer: null,
    productDate: null,
    purchaseDate: null,
    serialNo: null,
    workCenterId: null,
    workStationName: null,
    workStationNo: null,
    workStationTypeId: null,
    workstationCategoryCode: null
  }

  constructor(private _confirmationSvc: ConfirmationService,
              private _translateSvc: TranslateService,
              private _workcenterSvc: WorkcenterService,
              private loaderService: LoaderService,
              private _plantSvc: PlantService,
              private utilities: UtilitiesService,
              private _workstationSvc: WorkstationService,
              private workstationErpService: WorkstationErpService) {
  }

  ngOnInit() {
    this.initialize();
    // this.getEfficiencyItemDefinitions();
    // this.getInitialTabSelectedData();
  }

  initialize() {
    // this._plantSvc.getAllPlants().then(result => {
    //   this.plantList = result;
    //   console.log(result);
    // }).catch(error => console.log(error));
    //
    // this._workcenterSvc.filter(this.filterWorkcenter).then(result => this.workcenterList = result['content']).catch(error => console.log(error));
    //
    // this._workstationSvc.getCategoryList().then(result => {
    //   this.workStationCategoryList = result;
    // }).catch(error => console.log(error));

    let count = 0;
    this._workstationSvc.getStandardKeyList().then(result => {
      this.standardKeyList = result;
      if (count < 2) {
        count++;
        if (count === 2) {
          this.getWorkstationParameterEfficiencyRates();
        }
      }

    }).catch(error => console.log(error));

    this._workstationSvc.getStandardKeyParameterList().then(result => {
      this.standardKeyParameterList = result;
      if (count < 2) {
        count++;
        if (count === 2) {
          this.getWorkstationParameterEfficiencyRates();
        }
      }
    })
    .catch(error => console.log(error));
  }

  public getWorkstationParameterEfficiencyRates() {
    this.workStationEfficiencyList = [];
    this.workstationErpService.getWorkstationPrmtEffcnRates(this.workstationId).then(result => {
      this.workStationEfficiencyList = [];
      const myResult = result as WorkstationEfficiencyDto[];
      // private String wsEffcnCode;
      // private String wsEffcnParameterCode;
      // private double wsEffcnRate;
      myResult.forEach(resultItem => {
        const workstationEfficiencyItemTemp: WorkstationEfficiencyDto = new WorkstationEfficiencyDto();
        for (const sklItem of this.standardKeyList) {
          if (sklItem.standartKey === resultItem.wsEffcnCode) {
            this.standardKeyObject = sklItem;
            this.onChangeStandardKey(this.standardKeyObject);
            workstationEfficiencyItemTemp.wsEffcnCode = Object.assign({}, sklItem);
            break;
          }
        }
        for (const paramItem of this.standardKeyParameterList) {
          if (paramItem.standartKey === resultItem.wsEffcnCode && paramItem.standartParameter === resultItem.wsEffcnParameterCode) {
            workstationEfficiencyItemTemp.wsEffcnParameterCode = Object.assign({}, paramItem);
            break;
          }
        }
        workstationEfficiencyItemTemp.wsEffcnRate = resultItem.wsEffcnRate;
        workstationEfficiencyItemTemp.wsPrmtId = resultItem.wsPrmtId;
        workstationEfficiencyItemTemp.wsId = resultItem.wsId;
        this.workStationEfficiencyList.push(workstationEfficiencyItemTemp);
      });
    }).catch(error => console.log(error));

  }

  // getInitialTabSelectedData() {
  //   this._workcenterSvc.getPlantID().subscribe(plant => {
  //     if (plant.text) {
  //       this.workStation.plantId = plant.text;
  //     }
  //   });
  //   this._workcenterSvc.getWorkCentreID().subscribe(workCentre => {
  //     if (workCentre.text) {
  //       this.workStation.workCenterId = workCentre.text;
  //     }
  //   });
  //   this._workcenterSvc.getWorkCategoryID().subscribe(workCategory => {
  //     if (workCategory.text) {
  //       this.workStation.workstationCategoryCode = workCategory.text;
  //     }
  //   });
  // }

  // reset() {
  //   this.workStation = {
  //       'capacity': null,
  //       'cyclePeriod': null,
  //       'description': null,
  //       'groupCodeId': null,
  //       'kwh': null,
  //       'kwhCost': null,
  //       'mark': null,
  //       'minCapacity': null,
  //       'model': null,
  //       'operationIdx': null,
  //       'plantId': null,
  //       'producer': null,
  //       'productDate': null,
  //       'purchaseDate': null,
  //       'serialNo': null,
  //       'workCenterId': null,
  //       'workStationName': null,
  //       'workStationNo': null,
  //       'workStationTypeId': null,
  //       'workstationCategoryCode': null
  //     }
  // }

  // private initializeList(workstationId) {
  //   // this.workStation.workStationId = this.id;
  //   this.loaderService.showLoader();
  //   this._workstationSvc.getDetail(workstationId)
  //     .then((result: any) => {
  //       this.loaderService.hideLoader();
  //       if ((result.workStationId)) {
  //         this.workStationUpdate.workStationId = result.workStationId;
  //       }
  //       if ((result.workStationName)) {
  //         this.workStation.workStationName = result.workStationName;
  //       }
  //       if ((result.plant.plantId)) {
  //         this.workStation.plantId = result.plant.plantId;
  //       }
  //       if ((result.workCenter.workCenterId)) {
  //         this.workStation.workCenterId = result.workCenter.workCenterId;
  //       }
  //       if ((result.workStationCategory.wsCatCode)) {
  //         this.workStation.workstationCategoryCode = result.workStationCategory.wsCatCode;
  //       }
  //     })
  //     .catch(error => {
  //       this.loaderService.hideLoader();
  //       console.log(error)
  //     });
  // }

  save() {
    const requestArr = [];
    this.workStationEfficiencyList.forEach(item => {
      const requestItem = {
        wsPrmtId: item.wsPrmtId,
        wsId: item.wsId,
        wsEffcnCode: item.wsEffcnCode.standartKey,
        wsEffcnParameterCode: item.wsEffcnParameterCode.standartParameter,
        wsEffcnRate: item.wsEffcnRate
      };
      requestArr.push(requestItem);
    });


    this.loaderService.showLoader();
    this.workstationErpService.saveWorkstationPrmtEffcnRates(requestArr)
      .then(() => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('Workstation Standard Key parameter for ' + ' saved successfully');
        this.getWorkstationParameterEfficiencyRates();
        setTimeout(() => {
          this.resetBasicData();
          // this._workcenterSvc.sendWorkStationId(workStationId);
          // this.saveAction.emit('close');
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

  // save() {
  //   this.loaderService.showLoader();
  //   this._workstationSvc.save(this.workStation)
  //     .then(workStationId => {
  //       this.loaderService.hideLoader();
  //       this.utilities.showSuccessToast('Workstation ' + workStationId + ' saved successfully');
  //       setTimeout(() => {
  //         this.reset();
  //         this._workcenterSvc.sendWorkStationId(workStationId);
  //         this.saveAction.emit('close');
  //       }, environment.DELAY);
  //     })
  //     .catch(error => {
  //       this.loaderService.hideLoader();
  //       this.utilities.showErrorToast(error)
  //     });
  // }

  // update() {
  //   this.loaderService.showLoader();
  //   this.workStationUpdate.workStationName = this.workStation.workStationName;
  //   this.workStationUpdate.capacity = this.workStation.capacity;
  //   this.workStationUpdate.plantId = this.workStation.plantId;
  //   this.workStationUpdate.workStationTypeId = this.workStation.workStationTypeId;
  //   this.workStationUpdate.workCenterId = this.workStation.workCenterId;
  //   this.workStationUpdate.workstationCategoryCode = this.workStation.workstationCategoryCode
  //   this._workstationSvc.update(this.workStationUpdate)
  //     .then(workStationId => {
  //       this.loaderService.hideLoader();
  //       this.utilities.showSuccessToast('Work Station ' + workStationId + ' update successfully');
  //       setTimeout(() => {
  //         this.reset();
  //         this.saveAction.emit('close');
  //       }, environment.DELAY);
  //     })
  //     .catch(error => {
  //       this.loaderService.hideLoader();
  //       this.utilities.showErrorToast(error)
  //     });
  // }

  onChangeStandardKey(value) {
    if ((value.standartKey)) {
      this.filterStandardKeyParameters = this.standardKeyParameterList.filter(res => res.standartKey === value.standartKey);
    }
  }

  saveStandardKey() {
    if (this.stockUnitMessage === 'NEW') {
      this.workstationEfficiencyItem.wsEffcnCode = this.standardKeyObject;
      this.workstationEfficiencyItem.wsId = this.workstationId;
      this.workStationEfficiencyList.push(this.workstationEfficiencyItem);
      this.resetBasicData();
    } else if (this.stockUnitMessage === 'EDIT') {
      this.workStationEfficiencyList.splice(this.standardUnitEditrowId, 1, this.workstationEfficiencyItem);
      this.resetBasicData();
    }
    /*else{
      this.utilities.showInfoToast('Max unit can added only six');
    }*/
  }

 resetBasicData() {
    this.workstationEfficiencyItem = {
     'wsPrmtId': null,
     'wsId': null,
     'wsEffcnCode': null,
     'wsEffcnParameterCode': null,
     'wsEffcnRate': 0
    }
  }

  removeFromDumbStandardKeyList(i) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this.workStationEfficiencyList.splice(i, 1);
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    });
  }

  standardUnitMeasureListShow(i, mesaj) {
    if (mesaj === 'NEW') {
      this.resetBasicData();
      this.stockUnitMessage = mesaj;
      // this.unitOfMeasure.baseUnit = this.stock.baseUnit;
    } else if (mesaj === 'EDIT') {
      // this.dimensionUnit.unit = this.dumbStandardKeyList[i].unit;
      this.workstationEfficiencyItem.wsEffcnCode = this.workStationEfficiencyList[i].standardKey;
      this.workstationEfficiencyItem.wsEffcnParameterCode = this.workStationEfficiencyList[i].standardKeyParameter;
      this.workstationEfficiencyItem.wsEffcnRate = this.workStationEfficiencyList[i].efficiencyRate;
      this.stockUnitMessage = mesaj;
      this.standardUnitEditrowId = i;
    }
    this.myModal.show()
  }

  cancelEfficiencyParameterUpdate() {
    // todo: to be implemented.
    console.log('cancel Button clicked.');
  }


}
