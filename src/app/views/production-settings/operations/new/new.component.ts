import {Component, EventEmitter, OnInit, Output, Input, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {OperationService} from '../../../../services/dto-services/operation/operation.service';
import {WorkstationService} from '../../../../services/dto-services/workstation/workstation.service';
import {LoaderService} from '../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../services/utilities.service';
import {environment} from '../../../../../environments/environment';
import { Subscription } from 'rxjs';
import { UsersService } from 'app/services/users/users.service';
import { ConfirmationService } from 'primeng';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'operation-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewOperationComponent implements OnInit, OnDestroy {
  @Output() saveAction = new EventEmitter<any>();
  selectedPlant: any;
  operation = {
    'operationNo': null,
    operationId: null,
    currency: null,
    'plantId': null,
    locationId: null,
    'operationName': null,
    operationCostRate: null,
    unit: null,
    'operationTypeId': null,
    'description': null,
    factoryCalendarId: null,
    postponeNextOperation: false,
    transfer: false,
    singleDuration: null,
    singleSetupDuration: null,
    maxSingleStandbyDuration: null,
    outsource: false,
    operationWorkStationList: [
      // {
      //   "active": true,
      //   "createDate": "2020-08-25T09:38:32.456Z",
      //   "defaultOperation": true,
      //   "operationId": 0,
      //   "operationWorkStationId": 0,
      //   "updateDate": "2020-08-25T09:38:32.456Z",
      //   "workStationId": 0
      // }
    ]
  };

  @Input() workstationId;
  @Input() isFromChoosePane = false;
  TypeList: any[] = [];
  WorkStationList;

  params = {
    buttonDisabled: false,
    dialog: {title: '', inputValue: ''}
  };

  selectedWorkStationIdList = [];
  sub: Subscription;
  filterWorkStation = {
    pageNumber: 1, pageSize: 500, workStationName: null,
    operationTypeId: null,
    plantId: null,
    operationTypeName: null };
  subscription: Subscription;
  counter = 1;

  factoryPageFilter = {
    pageNumber: 1,
    plantId: null,
    pageSize: 20,
    query: null,
    orderByProperty: null,
    orderByDirection: 'desc'
  };
  factoryCalenderList = [];

  constructor(
              private _operationTypeService: OperationService,
              private _operationSvc: OperationService,
              private _router: Router,
              private _userSvc: UsersService,
              private _confirmationSvc: ConfirmationService,
              private _translateSvc: TranslateService,
              private _wStationSvc: WorkstationService, private utilities: UtilitiesService,
              private loaderService: LoaderService) {
                this.selectedPlant = JSON.parse(this._userSvc.getPlant());
                this.operation.plantId = this.selectedPlant ? this.selectedPlant.plantId : null;
                this.factoryPageFilter.plantId = this.selectedPlant ? this.selectedPlant.plantId : null;
                this.filterWorkStation.plantId = this.selectedPlant ? this.selectedPlant.plantId : null;
  }

  ngOnInit() {
    if (this.operation.plantId) {
      this._operationTypeService.getDetailByPlantId(this.operation.plantId).then( (result: any) => {
        this.TypeList = result;
     }).catch(error => console.log(error));
    }
    this._wStationSvc.filter(this.filterWorkStation).then(result => {
      this.WorkStationList = result['content'];
      if (this.workstationId) {
        this.WorkStationList.forEach(ws => {
          if (this.workstationId === ws.workStationId) {
            this.selectedWorkStationIdList.push(ws);
          }
        });
      }
    }).catch(error => console.log(error));

    this._wStationSvc.getFilterFactoryCalendarList(this.factoryPageFilter)
    .then(res => this.factoryCalenderList = res['content']).catch(err => console.error(err));
    this.subscription = this._operationSvc.saveAction$.asObservable().subscribe(rs => {
      this.operation.operationWorkStationList = JSON.parse(JSON.stringify(this.selectedWorkStationIdList));
      if (!this.operation.operationWorkStationList || (this.operation.operationWorkStationList && this.operation.operationWorkStationList.length < 1)) {
        this.utilities.showWarningToast('add-atleast-one-workstation');
        return 0;
      }
      if (this.counter === 1) {
        this.save();
        this.counter = this.counter + 1;
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }


  deleteWorkStationFromList(i) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this.selectedWorkStationIdList.splice(i, 1);
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    })
    // this.selectedWorkStationIdList.splice(i, 1);
    // this.selectedWorkStationIdList = this.selectedWorkStationIdList.filter(wstation => wstation.workStationId !== item['workStationId']);
  }

  onOperationTypeSelect(event) {
    // this.filterWorkStation.operationTypeId = +event;
    // this.filterWorkStation.operationTypeName = this.TypeList.find(itm => itm.operationTypeId === +event).operationTypeName;
    // this._wStationSvc.filter(this.filterWorkStation).then(result => {
    //   this.WorkStationList = result['content'];
    // }).catch(error => console.log(error));
  }

  reset() {
    this.operation = {
      'plantId': null,
      'operationNo': null,
      operationId: null,
      locationId: null,
      operationCostRate: null,
      currency: null,
      factoryCalendarId: null,
      unit:null,
      singleDuration: null,
    singleSetupDuration: null,
    maxSingleStandbyDuration: null,
      outsource: false,
      postponeNextOperation: false,
      transfer: false,
      'operationName': null,
      'operationTypeId': null,
      'description': null,
      operationWorkStationList: []
    };
  }

  goPage() {
    this._router.navigate(['/settings/operations']);
  }

  /********** MODAL DETAILS ***************************/
  addList(item, myModal) {
    const workst = this.selectedWorkStationIdList.find(itm => itm.workStationId === item.workStationId);
    if (workst) {
      return;
    }
    this.selectedWorkStationIdList.push({
      active: true,
      createDate: null,
      defaultOperation: false,
      operationId: null,
      operationWorkStationId: null,
      updateDate: null,
      operationCostCoefficient: null,
      workStationId: item.workStationId,
      workStationNo: item.workStationNo,
      workStationTypeName: item.workStationTypeName,
      workStationName: item.workStationName,
    });
    myModal.hide();
  }
  setSelectedPlant(event) {
    console.log('##event', event);
    if (event === null) {
      this.operation.plantId = null;
    } else {
      this.operation.plantId = event.plantId;
    }
  }

  getWorkStationItems() {
    this._wStationSvc.filter(this.filterWorkStation)
      .then(result => this.WorkStationList = result['content'])
      .catch(error => console.log(error));
  }

  save() {
    
    this.loaderService.showLoader();
    if (this.operation.operationTypeId) {
      this.operation.operationTypeId = +this.operation.operationTypeId;
    }
    if (this.operation.factoryCalendarId) {
      this.operation.factoryCalendarId = +this.operation.factoryCalendarId;
    }
    // this.operation.operationTypeId=1;
    this._operationSvc.save(this.operation)
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


}
