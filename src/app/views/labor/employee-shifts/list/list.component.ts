import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {ConfirmationService} from 'primeng/api';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {EmployeeGroupService} from 'app/services/dto-services/employee-group.service';
import {UtilitiesService} from 'app/services/utilities.service';
import {LoaderService} from 'app/services/shared/loader.service';
import {environment} from 'environments/environment';
import {ConvertUtil} from 'app/util/convert-util';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { UsersService } from 'app/services/users/users.service';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
// tslint:disable-next-line: component-class-suffix
export class ListEmployeeShift implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;
  mergeArrayAll: any[] = [];
  finalArray: any[] = [];
  shiftDto: any[] = [];
  empDto: any[] = [];
  empGroupDto: any[] = [];
  employeeGroupModal = {
    modal: '',
    groupId: null,
    employeeId: null
  };
  /********* DataTable settings*************/
  showLoader = false;
  selectedEmpGroup;
  selectedColumns = [
    {field: 'employeeDto', header: 'employee-name'},
    {field: 'employeeGroupDto', header: 'employee-group'},
    {field: 'shiftDto', header: 'shift-name'},
    {field: 'startTime', header: 'start-time'},
    {field: 'endTime', header: 'finish-time'},
  ];
  cols = [
    {field: 'employeeDto', header: 'employee-name'},
    {field: 'employeeGroupDto', header: 'employee-group'},
    {field: 'shiftDto', header: 'shift-name'},
    {field: 'startTime', header: 'start-time'},
    {field: 'endTime', header: 'finish-time'},
  ];
  classReOrder = ['asc', 'asc', 'asc', 'asc'];
  employees = [] = [];
  /********* DataTable settings*************/
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

  pageFilter =
    {
      pageNumber: 1,
      pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
      employeeGroupId: null,
      employeeId: null,
      orderByDirection: null,
      orderByProperty: null,
      query: null,
      shiftId: null,
      plantId: null
    };

  constructor(private _confirmationSvc: ConfirmationService,
    private _router: Router,
    private _translateSvc: TranslateService,
    private _employeeSvc: EmployeeGroupService,
    private utilities: UtilitiesService,
    private loaderService: LoaderService,
    private _userSvc: UsersService) {
    const selectedPlant = JSON.parse(this._userSvc.getPlant());
    this.pageFilter.plantId = selectedPlant ? selectedPlant.plantId : null;
  }
  
  ngOnInit() {
    this.filter(this.pageFilter);
  }

  filter(data) {
    this.loaderService.showLoader();
    this._employeeSvc.filterEmployeeShift(data)
      .then(result => {
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.employees = result['content'];
        this.employees.forEach((item: any ) => {
          if (item.shiftDto == null) {
            return;
          }
          const shiftDto = item.shiftDto;

          if ( shiftDto['startTime']) {
            shiftDto.startTime = ConvertUtil.UTCTime2LocalTime(shiftDto['startTime']);
          }
          if ( shiftDto['endTime']) {
            shiftDto.endTime = ConvertUtil.UTCTime2LocalTime(shiftDto['endTime']);
          }
        });
        this.loaderService.hideLoader();
      }).catch(error => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(error)
    });
  }



  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = null;
    }
    this.pageFilter[field] = value;
    this.filter(this.pageFilter);
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

  // fix require
  reOrderData(id, item: string) {
    if (item === 'employeeTitleName') {
      this.pageFilter.orderByProperty = 'et.employeeTitleName';
    } else {
      this.pageFilter.orderByProperty = item;
    }
    if (this.classReOrder[id] === 'asc') {
      this.classReOrder[id] = 'desc';
    } else {
      this.classReOrder[id] = 'asc';
    }
    this.pageFilter.orderByDirection = this.classReOrder[id];
    this.filter(this.pageFilter);
  }

  modalShow(groupId, employeeId, mod: string) {
    console.log('@seletecId', groupId, employeeId);
    this.employeeGroupModal.groupId = groupId;
    this.employeeGroupModal.employeeId = employeeId;
    this.employeeGroupModal.modal = mod;
    this.myModal.show();
  }

  delete(groupId, employeeId) {
    console.log(groupId, employeeId);
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        if (groupId) {
          this.deleteGroupShift(groupId);
        } else {
          this.deleteEmployeeShift(employeeId);
        }
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }

    });
  }

  deleteGroupShift(groupId) {
    this._employeeSvc.deleteGroupShift(groupId)
      .then(() => {
        this.utilities.showSuccessToast('deleted-success');
        this.filter(this.pageFilter);
      })
      .catch(error => this.utilities.showErrorToast(error));
  }
  deleteEmployeeShift(employeeId) {
    this._employeeSvc.deleteEmployeeShift(employeeId)
      .then(() => {
        this.utilities.showSuccessToast('deleted-success');
        this.filter(this.pageFilter);
      })
      .catch(error => this.utilities.showErrorToast(error));
  }

  showStaffDetail(id){
    this.loaderService.showDetailDialog(DialogTypeEnum.STAFF, id);
  }

  showShiftDetail(id){
    this.loaderService.showDetailDialog(DialogTypeEnum.STAFF, id);
  }
}
