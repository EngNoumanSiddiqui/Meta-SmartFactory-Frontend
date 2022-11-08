import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {StopCauseService} from '../../../../services/dto-services/stop-cause/stop-cause.service';
import {ConfirmationService} from 'primeng';
import {EnumStopCauseStatusService} from '../../../../services/dto-services/enum/stop-cause-status.service';
import {StopCauseTypeService} from '../../../../services/dto-services/stop-cause-type/stop-cause-type.service';
import {environment} from '../../../../../environments/environment';
import {LoaderService} from '../../../../services/shared/loader.service';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {UtilitiesService} from '../../../../services/utilities.service';
import {ConvertUtil} from '../../../../util/convert-util';
import { AppStateService } from 'app/services/dto-services/app-state.service';
import { Subscription } from 'rxjs';

import { ShiftSettingsService } from 'app/services/dto-services/shift-setting/shift-setting.service';
import {WorkcenterTypeService} from '../../../../services/dto-services/workcenter-type/workcenter-type.service';
import * as moment from 'moment';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';

@Component({
  templateUrl: './list.component.html'
})
export class ListCauseComponent implements OnInit, OnDestroy {
  @ViewChild('myModal') public myModal: ModalDirective;
  causesModal = {
    modal: null,
    id: null
  };
  offset = moment().utcOffset();
  workcenterTypeList;
  pagination = {
    totalElements: 0,
    currentPage: 1,
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    totalPages: 1,
    TotalPageLinkButtons: 5,
    RowsPerPageOptions: [10, 20, 30, 50, 100, 1000],
    rows: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    tag: ''
  };
  pageFilter = {
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    plantId: null,
    plantName: null,
    shiftId: null,
    stopCauseTypeName: null,
    stopCauseNo: null,
    stopCauseName: null,
    stopCauseStatus: null,
    planned: null,
    query: null,
    orderByProperty: 'stopCauseId',
    orderByDirection: 'desc',
    workCenterId: null,
    workCenterTypeId: null
  };
  selectedColumns = [
    {field: 'stopCauseId', header: 'stop-cause-id'},
    {field: 'stopCauseName', header: 'stop-cause-name'},
    {field: 'plant', header: 'plant'},
    {field: 'shift', header: 'shift'},
    {field: 'workCenterType', header: 'workcenter-type'},
    {field: 'startTime', header: 'start-time'},
    {field: 'numberOfOccurancePerShift', header: 'no-of-occurences-per-shift'},
    {field: 'duration', header: 'duration'},
    {field: 'stopCauseTypeName', header: 'type'},
    {field: 'planned', header: 'planned'},
    {field: 'color', header: 'color'},
    {field: 'description', header: 'description'},
    // {field: 'affectOeeAvilability', header: 'affect-oee-availability'},
    // {field: 'affectOeePerformance', header: 'affect-oee-performance'},
  ];
  cols = [
    {field: 'stopCauseId', header: 'stop-cause-id'},
    {field: 'stopCauseName', header: 'stopCauseName'},
    {field: 'plant', header: 'plant'},
    {field: 'shift', header: 'shift'},
    {field: 'workCenterType', header: 'workCenterType'},
    {field: 'startTime', header: 'start-time'},
    {field: 'numberOfOccurancePerShift', header: 'no-of-occurences-per-shift'},
    {field: 'duration', header: 'duration'},
    {field: 'stopCauseTypeName', header: 'type'},
    {field: 'planned', header: 'planned'},
    {field: 'color', header: 'color'},
    {field: 'description', header: 'cost-rate'},
    {field: 'costRate', header: 'description'},
    {field: 'affectOeeAvilability', header: 'affect-oee-availability'},
    {field: 'affectOeePerformance', header: 'affect-oee-performance'},
  ];


  classReOrder = ['asc', 'asc', 'asc', 'asc', 'asc', 'asc'];

  causes = [];
  selectedCauses = [];
  listStatus;
  listTypes;
  showLoader = false;
  sub: Subscription;
  shiftList: any;

  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = null;
    }
    this.pageFilter[field] = value;

    this.filter(this.pageFilter);
  }

  modalShow(id, mod: string) {

    this.causesModal.id = id;
    this.causesModal.modal = mod;

    this.myModal.show();
  }

  constructor(private _confirmationSvc: ConfirmationService,
              private _enumCauseStatus: EnumStopCauseStatusService,
              private _translateSvc: TranslateService,
              private _causeTypesSvc: StopCauseTypeService,
              private appStateService: AppStateService,
              private shiftService: ShiftSettingsService,
              private _causeSvc: StopCauseService, private utilities: UtilitiesService,
              private workCenterTypeService: WorkcenterTypeService,
              private loaderService: LoaderService) {


  }

  ngOnInit() {
    this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
      if (!(res)) {
        this.pageFilter.plantName = null;
        this.pageFilter.plantId = null;
      } else {
        this.pageFilter.plantName = res.plantName;
        this.pageFilter.plantId = res.plantId;
        this.filter(this.pageFilter);
        this._causeTypesSvc.getIdNameListByPlant(this.pageFilter.plantId).then(result3 => this.listTypes = result3).catch(error => console.log(error));
      }
      if (this.pageFilter.plantId) {
        this.shiftService.getShiftSettingsListByPlantId(this.pageFilter.plantId).then((res: any) => {
          this.shiftList = res;
        }).catch(e => {
          console.error(e);
        });
      } else {
        this.shiftService.getShiftSettingsList().then((res: any) => {
          this.shiftList = res;
        }).catch(e => {
          console.error(e);
        });
      }

      if (this.pageFilter.plantId) {
        this.workCenterTypeService.getWorkCentreTypeByPlantId(this.pageFilter.plantId).then(result => this.workcenterTypeList = result).catch(error => console.log(error));
      }

    });
    // this.filter(this.pageFilter);
    // if (this.pageFilter.plantId) {
    //   this.shiftService.getShiftSettingsListByPlantId(this.pageFilter.plantId).then((res: any) => {
    //     this.shiftList = res;
    //   }).catch(e => {
    //     console.error(e);
    //   });
    // } else {
    //   this.shiftService.getShiftSettingsList().then((res: any) => {
    //     this.shiftList = res;
    //   }).catch(e => {
    //     console.error(e);
    //   });
    // }
    this._enumCauseStatus.getEnumList().then(result => this.listStatus = result).catch(error => console.log(error));

  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  filter(data) {
    this.loaderService.showLoader();

    this._causeSvc.filter(data)
      .then(result => {
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.causes = result['content'];
        this.causes.forEach(item => {
          if (item.startTime ) {
            item.startTime = moment(item.startTime.toString(), 'HH:mm:ss').add(this.offset, 'minutes').toDate();
          }
          // console.log(this.offset);
        });
        this.loaderService.hideLoader();
        
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

  myChanges(event) {
    this.pagination.currentPage = event.currentPage;
    this.pagination.pageNumber = event.pageNumber;
    this.pagination.totalElements = event.totalElements;
    this.pagination.pageSize = event.pageSize;
    this.pagination.TotalPageLinkButtons = event.totalPageLinkButtons;
    if (this.pagination.tag !== event.searchItem) {
      this.pagination.pageNumber = 1;
    }
    this.pagination.tag = event.searchItem;

    this.pageFilter.pageNumber = this.pagination.pageNumber;
    this.pageFilter.pageSize = this.pagination.pageSize;
    this.pageFilter.query = this.pagination.tag;

    setTimeout(() => {
      this.filter(this.pageFilter)
    }, 500);
  }

  reOrderData(id, item: string) {

    this.pageFilter.orderByProperty = item;


    if (this.classReOrder[id] === 'asc') {
      this.classReOrder[id] = 'desc';
    } else {
      this.classReOrder[id] = 'asc';
    }

    this.pageFilter.orderByDirection = this.classReOrder[id];
    this.filter(this.pageFilter);
  }

  resetFilter() {
    this.pageFilter = {
      pageNumber: 1,
      pageSize: this.pageFilter.pageSize,
      stopCauseTypeName: null,
      stopCauseNo: null,
      shiftId: null,
      stopCauseName: null,
      plantId: null,
      plantName: null,
      stopCauseStatus: null,
      query: null,
      planned: null,
      orderByProperty: 'stopCauseId',
      orderByDirection: 'desc',
      workCenterId: null,
      workCenterTypeId: null
    };
    this.filter(this.pageFilter);
  }

  delete(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this._causeSvc.delete(id)
          .then(() => {
            this.utilities.showSuccessToast('deleted-success');
            this.filter(this.pageFilter);
          })
          .catch(error => this.utilities.showErrorToast(error));
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    })
  }

  getReadableTime(time) {
    return ConvertUtil.longDuration2DHHMMSSTime(time)
  }

  showDetailDialog(id, modal){
    if(modal == 'PLANT'){
      this.loaderService.showDetailDialog(DialogTypeEnum.PLANT, id);
    }else if(modal == 'SHIFT'){
      this.loaderService.showDetailDialog(DialogTypeEnum.SHIFTSETTING,id);
    }else if(modal == 'CAUSETYPE'){
      this.loaderService.showDetailDialog(DialogTypeEnum.STOPCAUSETYPE,id);
    } else if(modal == 'WORKCENTERTYPE'){
      this.loaderService.showDetailDialog(DialogTypeEnum.WORKCENTERTYPE,id);
    } 
  }
}

