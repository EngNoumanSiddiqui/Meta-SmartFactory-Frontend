import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { environment } from '../../../../../environments/environment';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng';
import { ConvertUtil } from 'app/util/convert-util';
import { LoginRecordsService } from 'app/services/dto-services/login-records-service/login-records.service';
import { ShiftSettingsService } from 'app/services/dto-services/shift-setting/shift-setting.service';
import { AppStateService } from 'app/services/dto-services/app-state.service';

import { Subscription, Subject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import * as moment from 'moment';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { BookType } from 'xlsx';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'login-records-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})

export class ListComponent implements OnInit, OnDestroy {
  loginRecords: any[];
  selectedParts: any;
  dialogEnums = DialogTypeEnum;
  @ViewChild('myModal') public myModal: ModalDirective;
  @ViewChild('logoutModal') public logoutModal: ModalDirective;
  classReOrder = ['asc', 'asc', 'asc', 'asc', 'desc', 'asc', 'asc', 'asc'];
  showLoader = false;
  selectedLoginRecords: any;
  componentShowModal = {
    modal: null,
    id: null
  };
  selectedColumns = [

    { field: 'employee', header: 'employee-id' },
    { field: 'firstname', header: 'first-name' },
    { field: 'lastname', header: 'last-name' },
    { field: 'actualStartTime', header: 'actual-start-time' },
    { field: 'actualFinishTime', header: 'actual-finish-time' },
    { field: 'shift', header: 'shift' },
    { field: 'workStation', header: 'workstation' },
    { field: 'loginWithRFID', header: 'login-type' },
    { field: 'activeWorking', header: 'status' }

  ];
  cols = [
    { field: 'shift', header: 'shift' },
    { field: 'workStation', header: 'workstation' },
    { field: 'employee', header: 'employee-id' },
    { field: 'firstname', header: 'first-name' },
    { field: 'lastname', header: 'last-name' },
    { field: 'actualStartTime', header: 'actual-start-time' },
    { field: 'actualFinishTime', header: 'actual-finish-time' },
    { field: 'loginWithRFID', header: 'login-type' },
    { field: 'activeWorking', header: 'status' },
    { field: 'workStationOperatorId', header: 'workstation-operator-id' }
  ];
  pageFilter = {
    activeWorking: true,
    employeeFirstName: null,
    employeeId: null,
    employeeLastName: null,
    loginWithRFID: null,
    shiftId: null,
    workStationId: null,
    workStationName: null,
    workStationOperatorId: null,
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    query: null,
    orderByProperty: 'actualStartTime',
    orderByDirection: 'desc',
    plantId: null
  };

  loginRecordDto = {
    'employeeId': null,
    employee: null,
    'loginWithRFID': 'false',
    'password': null,
    'shiftId': null,
    'workStationOperatorId': null,
    'workstationId': null
  };
  logoutRecordDto = {
    'employeeId': null,
    employeeName: null,
    'loginWithRFID': null,
    'password': null,
    'shiftId': null,
    shiftName: null,
    'workStationOperatorId': null,
    'workstationId': null,
    workstationName: null
  };
  shiftname: any;

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
  sub: Subscription;
  shiftList: any;
  private searchTerms = new Subject<any>();
  selectedPlant: any;
  selectedData = [];

  constructor(private loginrecordsSvc: LoginRecordsService,
    private loaderService: LoaderService,
    private shiftService: ShiftSettingsService,
    private appStateService: AppStateService,
    private _translateSvc: TranslateService,
    private _confirmationSvc: ConfirmationService,
    private utilities: UtilitiesService,
    private appStateSvc: AppStateService,
    private datePipe: DatePipe) {
  }
  ngOnInit() {

    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.loginrecordsSvc.filterObservable(term))).subscribe(
        result => {
          this.pagination.currentPage = result['currentPage'];
          this.pagination.totalElements = result['totalElements'];
          this.pagination.totalPages = result['totalPages'];
          this.selectedData = [];
          this.loginRecords = result['content'];
          this.loaderService.hideLoader();
        },
        error => {
          this.loaderService.hideLoader();
          this.utilities.showErrorToast(error);
        }
      );



    this.filter(this.pageFilter);
    this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
      if (!(res)) {
        this.selectedPlant = null;
        this.pageFilter.plantId = null;
        this.getShiftSettingsList();
      } else {
        this.pageFilter.plantId = res.plantId;
        this.selectedPlant = res;
        this.getShiftSettingsListByPlantId(res.plantId);
      }
      this.filter(this.pageFilter);

    });
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  openModal(type, uniqueId) {
    this.loaderService.showDetailDialog(type, uniqueId);
  }

  getShiftSettingsList() {
    this.shiftService.getShiftSettingsList().then((res: any) => {
      this.shiftList = res;
    }).catch(e => {
      console.log(e);
    });
  }
  getShiftSettingsListByPlantId(plantId: number) {
    this.shiftService.getShiftSettingsListByPlantId(plantId).then(res => {
      this.shiftList = res as any;
    }).catch(e => {
      console.log(e);
    });
  }

  filter(data) {
    this.loaderService.showLoader();
    this.searchTerms.next(data);
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
    }, 1000);
  }

  modalShow(id, mod: string) {
    this.reset();
    // this.componentShowModal.id = id;
    // this.componentShowModal.modal = mod;
    const shiftitem = this.shiftList.find(sft => {
      let srtDate = new Date();
      const splittedTime = sft.startTime.split(':');
      srtDate.setHours(splittedTime[0]);
      srtDate.setMinutes(splittedTime[1]);
      srtDate.setSeconds(splittedTime[2]);
      const startmoment = moment(srtDate);
      let endDate = new Date();
      const splittedendTime = sft.endTime.split(':');
      endDate.setHours(splittedendTime[0]);
      endDate.setMinutes(splittedendTime[1]);
      endDate.setSeconds(splittedendTime[2]);
      const endmoment = moment(new Date(endDate));
      return moment(new Date()).isBetween(startmoment, endmoment, null, '[]');
    });
    if (shiftitem) {
      this.loginRecordDto.shiftId = shiftitem.shiftId;
      this.shiftname = shiftitem.shiftName;
    } else {
      this.shiftname = null;
    }
    this.componentShowModal.modal = mod;
    // this.myModal.show();
  }
  logoutModel(rowData) {
    this.reset();
    this.logoutRecordDto = {
      'employeeId': rowData.employee ? rowData.employee.employeeId : null,
      employeeName: rowData.employee ? rowData.employee.firstName + ' ' + rowData.employee.firstName : null,
      'loginWithRFID': rowData.loginWithRFID,
      'password': rowData.password,
      'shiftId': rowData.shift ? rowData.shift.shiftId : null,
      shiftName: rowData.shift ? rowData.shift.shiftName : null,
      'workStationOperatorId': rowData.workStationOperatorId,
      'workstationId': rowData.workStation.workStationId,
      workstationName: rowData.workStation.workStationName
    };
    this.componentShowModal.modal = 'logout';
  }
  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = null;
    }
    this.pageFilter[field] = value;

    this.filter(this.pageFilter);
  }

  setEmployee(event) {
    this.loginRecordDto.employeeId = event.employeeId;
    this.loginRecordDto.employee = event;
  }


  reset() {
    this.loginRecordDto = {
      'employeeId': null,
      employee: null,
      'loginWithRFID': 'false',
      'password': null,
      'shiftId': null,
      'workStationOperatorId': null,
      'workstationId': null
    };
    this.logoutRecordDto = {
      'employeeId': null,
      employeeName: null,
      'loginWithRFID': null,
      'password': null,
      'shiftId': null,
      shiftName: null,
      'workStationOperatorId': null,
      'workstationId': null,
      workstationName: null
    };
  }

  reOrderData(id, item: string) {

    if (this.classReOrder[id] === 'asc') {
      this.classReOrder[id] = 'desc';
    } else {
      this.classReOrder[id] = 'asc';
    }

    this.pageFilter.orderByDirection = this.classReOrder[id];
    this.pageFilter.orderByProperty = item;
    this.filter(this.pageFilter);
  }
  delete(id) {
    // this._confirmationSvc.confirm({
    //   message: this._translateSvc.instant('do-you-want-to-delete'),
    //   header: this._translateSvc.instant('delete-confirmation'),
    //   icon: 'fa fa-trash',
    //   accept: () => {
    //     // change
    //     this.loginrecordsSvc.delete(id)
    //       .then(() => {
    //         this.utilities.showInfoToast('deleted-success');
    //         this.filter(this.pageFilter);
    //       })
    //       .catch(error => this.utilities.showErrorToast(error));
    //   },
    //   reject: () => {
    //     this.utilities.showInfoToast('cancelled-operation');
    //   }
    // });
  }

  logout() {
    this.loaderService.showLoader();
    this.showLoader = true;
    this.loginrecordsSvc.logout(this.logoutRecordDto)
      .then(() => {
        this.loaderService.hideLoader();
        this.showLoader = false;
        this.utilities.showSuccessToast('logout-success');
        this.logoutModal.hide();
        setTimeout(() => {
          this.reset();
          this.filter(this.pageFilter);
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.showLoader = false;
        this.utilities.showErrorToast(error)
      });
  }

  save() {
    this.loaderService.showLoader();
    this.showLoader = true;
    const temp: any = Object.assign({}, this.loginRecordDto);
    if ((temp.loginWithRFID === 'false') || (temp.loginWithRFID === false)) {
      temp.loginWithRFID = false;
    } else {
      temp.loginWithRFID = true;
    }
    this.loginrecordsSvc.login(temp)
      .then(() => {
        this.loaderService.hideLoader();
        this.showLoader = false;
        this.utilities.showSuccessToast('login-success');
        setTimeout(() => {
          this.reset();
          this.filter(this.pageFilter);
          this.myModal.hide();
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.showLoader = false;
        this.utilities.showErrorToast(error)
      });
  }

  rfidStars(rfid) {
    if (rfid) {
      let stars = '';
      for (let index = 0; index < rfid.length; index++) {
        stars = stars + '*';

      }

      return stars;
    }
    return '';
  }

  showDetailDialog(id, type: string) {
    if (type === 'SHIFT') this.loaderService.showDetailDialog(DialogTypeEnum.SHIFTSETTING, id);
    else if (type === 'WORKSTATION') this.loaderService.showDetailDialog(DialogTypeEnum.WORKSTATION, id);
    else if (type === 'EMPLOYEE') this.loaderService.showDetailDialog(DialogTypeEnum.STAFF, id);
  }

  exportCSV(selected: boolean = false, type: BookType) {
    if (selected) {
      const mappedDAta = this.selectedData.map(itm => {
        const obj = {};
        this.selectedColumns.forEach(col => {
          if (col.field == "employee") {
            obj[this._translateSvc.instant(col.header)] = itm.employee?.employeeId;
          } else if (col.field == "firstName") {
            obj[this._translateSvc.instant(col.header)] = itm.employee.firstName;
          } else if (col.field == "lastName") {
            obj[this._translateSvc.instant(col.header)] = itm.employee.lastName;
          } else if (col.field == "actualStartTime") {
            obj[this._translateSvc.instant(col.header)] = this.datePipe.transform(itm.actualStartTime, 'MM/dd/yyyy, HH:mm');
          } else if (col.field == "actualFinishTime") {
            obj[this._translateSvc.instant(col.header)] = this.datePipe.transform(itm.actualFinishTime, 'MM/dd/yyyy, HH:mm');
          } else if (col.field == "shift") {
            obj[this._translateSvc.instant(col.header)] = itm.shift?.shiftName;
          } else if (col.field == "workStation") {
            obj[this._translateSvc.instant(col.header)] = itm.workStation.workStationName;
          } else if (col.field == "loginWithRFID") {
            obj[this._translateSvc.instant(col.header)] = itm.loginWithRFID ? 'RFID' : 'PASSWORD';
          } else if (col.field == "activeWorking") {
            obj[this._translateSvc.instant(col.header)] = itm.activeWorking ? 'LOGIN' : 'LOGOUT';
          }
        });
        return (obj);
      });
      this.appStateSvc.exportAsFile(mappedDAta, type, 'LoginRecordList');
    } else {
      this.loaderService.showLoader();
      this.loginrecordsSvc.filterObservable({ ...this.pageFilter, pageNumber: 1, pageSize: this.pagination.totalElements })
        .subscribe(result => {
          const mappedDAta = result['content'].map(itm => {
            const obj = {};
            this.selectedColumns.forEach(col => {
              if (col.field == "employee") {
                obj[this._translateSvc.instant(col.header)] = itm.employee?.employeeId;
              } else if (col.field == "firstName") {
                obj[this._translateSvc.instant(col.header)] = itm.employee.firstName;
              } else if (col.field == "lastName") {
                obj[this._translateSvc.instant(col.header)] = itm.employee.lastName;
              } else if (col.field == "actualStartTime") {
                obj[this._translateSvc.instant(col.header)] = this.datePipe.transform(itm.actualStartTime, 'MM/dd/yyyy, HH:mm');
              } else if (col.field == "actualFinishTime") {
                obj[this._translateSvc.instant(col.header)] = this.datePipe.transform(itm.actualFinishTime, 'MM/dd/yyyy, HH:mm');
              } else if (col.field == "shift") {
                obj[this._translateSvc.instant(col.header)] = itm.shift?.shiftName;
              } else if (col.field == "workStation") {
                obj[this._translateSvc.instant(col.header)] = itm.workStation.workStationName;
              } else if (col.field == "loginWithRFID") {
                obj[this._translateSvc.instant(col.header)] = itm.loginWithRFID ? 'RFID' : 'PASSWORD';
              } else if (col.field == "activeWorking") {
                obj[this._translateSvc.instant(col.header)] = itm.activeWorking ? 'LOGIN' : 'LOGOUT';
              }
            });
            return (obj);
          });
          this.appStateSvc.exportAsFile(mappedDAta, type, 'LoginRecordList');
          this.loaderService.hideLoader();
        }, err => {
          this.utilities.showErrorToast(err);
          this.loaderService.hideLoader();
        })
    }
  }

  getReadableTime(time) {
    return ConvertUtil.longDuration2DHHMMSSsssTime(time)
  }


}
