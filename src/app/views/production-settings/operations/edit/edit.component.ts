import {Component, EventEmitter, Input, OnInit, Output, OnDestroy} from '@angular/core';
import { Router} from '@angular/router';
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
  selector: 'operation-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditOperationComponent implements OnInit, OnDestroy {
  selectedPlant:any;
  operation = {
    'operationId': null,
    'plantId':null,
    locationId: null,
    'operationNo': null,
    'operationName': null,
    operationCostRate: null,
    currency: null,
    unit: null,
    singleDuration: null,
    singleSetupDuration: null,
    maxSingleStandbyDuration: null,
    factoryCalendarId: null,
    outsource: false,
    postponeNextOperation: false,
    transfer: false,
    'operationTypeId': null,
    'description': null,
    operationWorkStationList: []
  };

  selectedWorkStationIdList = [];
  @Output() saveAction = new EventEmitter<any>();
  id;
  subscription: Subscription;
  factoryCalenderList = [];

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  @Input() isFromChoosePane = false;

  TypeList;
  factoryPageFilter = {
    pageNumber: 1,
    plantId: null,
    pageSize: 20,
    query: null,
    orderByProperty: null,
    orderByDirection: 'desc'
  };
  WorkStationList;

  params = {
    buttonDisabled: false,
    dialog: {title: '', inputValue: ''}
  };

  filterWorkStation = {pageNumber: 1, operationTypeId: null, pageSize: 500, workStationName: '', plantId: null};

  constructor(
             private _operationTypeSvc: OperationService,
              private _operationSvc: OperationService,
              private _router: Router,
              private _userSvc: UsersService,
              private _confirmationSvc: ConfirmationService,
              private _translateSvc: TranslateService,
              private loaderService: LoaderService, private utilities: UtilitiesService,
              private _wStationSvc: WorkstationService) {
                this.selectedPlant = JSON.parse(this._userSvc.getPlant());
                this.operation.plantId = this.selectedPlant ? this.selectedPlant.plantId : null;
                this.filterWorkStation.plantId = this.selectedPlant ? this.selectedPlant.plantId : null;
                this.factoryPageFilter.plantId = this.selectedPlant ? this.selectedPlant.plantId : null;

    /*this._route.params.subscribe((params) => {
     this.id = params['id'];
     this.operation.operationId = this.id;
     this.initialize(this.id);
     });*/
  }

  private initialize(id) {
    this.loaderService.showLoader();
    this.operation.operationId = this.id;

    this._operationSvc.getDetail(id)
      .then(result => {
        this.loaderService.hideLoader();
        if ((result['operationNo'])) {
          this.operation['operationNo'] = result['operationNo'];
        }
        if ((result['plant'])) {
          this.operation['plantId'] = result['plant'].plantId;
          this.filterWorkStation.plantId = this.operation.plantId;
        }

        this.operation.singleDuration = result['singleDuration'];
        this.operation.singleSetupDuration = result['singleSetupDuration'];
        this.operation.maxSingleStandbyDuration = result['maxSingleStandbyDuration'];
        this.operation.locationId = result['location']?.locationId;
        this.operation.currency = result['currency'];
        this.operation.unit= result['unit'];
        if ((result['operationName'])) {
          this.operation['operationName'] = result['operationName'];
        }
        this.operation.operationCostRate = result['operationCostRate'];
        
        if ((result['outsource'])) {
          this.operation.outsource = result['outsource'];
        }
        if ((result['transfer'])) {
          this.operation.transfer = result['transfer'];
        }
        if ((result['postponeNextOperation'])) {
          this.operation.postponeNextOperation = result['postponeNextOperation'];
        }
        if ((result['factoryCalendar'])) {
          this.operation.factoryCalendarId = result['factoryCalendar'].factoryCalendarId;
        }
        if ((result['operationType'])) {
          this.operation['operationTypeId'] = result['operationType'].operationTypeId;
        }
        if ((result['description'])) {
          this.operation['description'] = result['description'];
        }
        if ((result['operationWorkStationList'])) {
          this.operation['operationWorkStationList'] = result['operationWorkStationList'];
          this.selectedWorkStationIdList = this.operation.operationWorkStationList;
        }
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

  ngOnInit() {
    if (this.selectedPlant.plantId) {
      this._operationTypeSvc.getDetailByPlantId(this.operation.plantId).then( (result: any) => {
        this.TypeList = result;
     }).catch(error => console.log(error));
    }
    this._wStationSvc.filter(this.filterWorkStation).then(result => this.WorkStationList = result['content']).catch(error => console.log(error));
    this.subscription = this._operationSvc.saveAction$.asObservable().subscribe(rs => {
      this.save();
    });


    this._wStationSvc.getFilterFactoryCalendarList(this.factoryPageFilter)
    .then(res => this.factoryCalenderList = res['content']).catch(err => console.error(err));
  }
  setSelectedPlant(event) {
    this.operation.plantId = event.plantId;
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  deleteWorkStationFromList(i) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        if(this.selectedWorkStationIdList[i].operationWorkStationId) {
          this.loaderService.showLoader();
          this._operationSvc.deleteWorkstationOperation(this.selectedWorkStationIdList[i].operationWorkStationId).then(() => {
            this.loaderService.hideLoader();
            this.selectedWorkStationIdList.splice(i, 1);
            this.utilities.showSuccessToast('deleted-success');
          }).catch(err => {
            this.loaderService.hideLoader();
            this.utilities.showErrorToast(err);
          });
        } else {
          this.selectedWorkStationIdList.splice(i, 1);
        }
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    })
    // this.operation.workStationIdList = this.operation.workStationIdList.filter(wstation => wstation.workStationId !== item['workStationId']);
  }



  onOperationTypeSelect(event) {
    // this.filterWorkStation.operationTypeId = +event;
    // this._wStationSvc.filter(this.filterWorkStation).then(result => {
    //   this.WorkStationList = result['content'];
    // }).catch(error => console.log(error));
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
      operationId: this.operation.operationId,
      operationWorkStationId: null,
      updateDate: null,
      workStationId: item.workStationId,
      workStationNo: item.workStationNo,
      workStationTypeName: item.workStationTypeName,
      workStationName: item.workStationName,
    });
    myModal.hide();
  }

  getWorkStationItems() {
    this._wStationSvc.filter(this.filterWorkStation)
      .then(result => this.WorkStationList = result['content'])
      .catch(error => console.log(error));
  }

  save() {
  
    this.operation.operationWorkStationList = JSON.parse(JSON.stringify(this.selectedWorkStationIdList));
    if (!this.operation.operationWorkStationList || (this.operation.operationWorkStationList && this.operation.operationWorkStationList.length < 1)) {
      this.utilities.showWarningToast('add-atleast-one-workstation');
      return 0;
    }
    this.loaderService.showLoader();
    if (this.operation.operationTypeId) {
      this.operation.operationTypeId = +this.operation.operationTypeId;
    }
    if (this.operation.factoryCalendarId) {
      this.operation.factoryCalendarId = +this.operation.factoryCalendarId;
    }

    this._operationSvc.update(this.operation)
      .then(() => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('updated-success');
        setTimeout(() => {
          this.saveAction.emit('close');
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }

}
