import { Component, Output, EventEmitter, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EmployeeGroupService } from 'app/services/dto-services/employee-group.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { environment } from 'environments/environment';
import { ConvertUtil } from 'app/util/convert-util';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';

import { Subject, Subscription } from "rxjs";
import { AppStateService } from '../../../../services/dto-services/app-state.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import { BookType } from 'xlsx/types';
import { ItemService } from 'app/services/dto-services/quality-notification/item/item.service';
import { NullTemplateVisitor } from '@angular/compiler';
import { ObjectTypesDetailComponent } from 'app/views/maintenance/equipment-technical-objects/object-types/detail/detail.component';
import * as moment from 'moment';
@Component({
  selector: 'emp-shift-group-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
// tslint:disable-next-line: component-class-suffix
export class ListComponent implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;
  @ViewChild('myExchangeModal') public myExchangeModal: ModalDirective;
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

  @Output() saveAction = new EventEmitter<any>();
  /*******formModle*******/
  employeeShift = {
    active: true,
    employeeGenericGroupId: null,
    employeeGroupId: null,
    employeeIdList: null,
    startDate: null,
    startTime: null,
    finishDate: null,
    finishTime: null,
    groupCode: null,
    groupName: null,
    shiftId: null,
    plantId: NullTemplateVisitor
    // groupSubType: null,
    // groupType: null,
    // workUnderSupervision: null
  };

  showEmployees = false;

  showMembers = false;
  menuItems: MenuItem[] = [
    {
      label: this._translateSvc.instant('export-csv'), icon: 'fa fa-file-archive-o',
      command: () => {
        this.exportCSV(false, 'csv');
      }
    },
    {
      label: this._translateSvc.instant('export-excel'), icon: 'fa b-fa-file-excel',
      command: () => {
        this.exportCSV(false, 'xlsx');
      }
    }
  ];
  selecteMenuItems: MenuItem[] = [
    {
      label: this._translateSvc.instant('export-csv'), icon: 'fa fa-file-archive-o',
      command: () => {
        this.exportCSV(true, 'csv');
      }
    },
    {
      label: this._translateSvc.instant('export-excel'), icon: 'fa b-fa-file-excel',
      command: () => {
        this.exportCSV(true, 'xlsx');
      }
    }
  ];
  /********* DataTable settings*************/
  showLoader = false;
  selectedEmpGroup;
  selectedAllEmpGroup;
  selectedColumns = [
    { field: 'employeeGroupId', header: 'group-id' },
    { field: 'groupName', header: 'group-name' },
    { field: 'shift', header: 'shift-group' },
    { field: 'startDate', header: 'start-date' },
    { field: 'finishDate', header: 'finish-date' },
    { field: 'startTime', header: 'start-time' },
    { field: 'finishTime', header: 'end-time' },
  ];
  cols = [
    { field: 'employeeGroupId', header: 'group-id' },
    { field: 'groupName', header: 'group-name' },
    { field: 'groupCode', header: 'group-code' },
    { field: 'shift', header: 'shift-group' },
    { field: 'startDate', header: 'start-date' },
    { field: 'finishDate', header: 'finish-date' },
    { field: 'startTime', header: 'start-time' },
    { field: 'finishTime', header: 'end-time' },
  ];
  classReOrder = ['asc', 'asc', 'asc', 'asc', 'asc'];
  employees = [];
  populatedEmployees = [];
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
      groupCode: null,
      groupName: null,
      orderByDirection: 'desc',
      orderByProperty: 'employeeGroupId',
      query: null,
      plantId: null,
      startDate: null,
      finishDate: null
    };

  selectedPlant: any;
  sub: Subscription;
  private searchTerms = new Subject<any>();
  employeeList = [];
  sourceEmployeeList;
  targetEmployeeList;
  selectedGroupList = [{ id: 1, name: 'test' }];
  selectedShift = null;

  constructor(private _confirmationSvc: ConfirmationService,
    private _router: Router,
    private _translateSvc: TranslateService,
    private _employeeSvc: EmployeeGroupService,
    private utilities: UtilitiesService,
    private loaderService: LoaderService,
    private appStateService: AppStateService) {
    // const selectedPlant = JSON.parse(this._userSvc.getPlant());
    // this.pageFilter.plantId = selectedPlant ? selectedPlant.plantId : null;

  }

  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(600),
      switchMap(term => this._employeeSvc.filter(term)))
      .subscribe(result => {
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.employees = result['content'];
        this.selectedEmpGroup = [];
        this.selectedAllEmpGroup = [];
        this.employees.forEach(emp => {
          emp.startTime = ConvertUtil.UTCTime2LocalTime(emp.startTime);
          emp.finishTime = ConvertUtil.UTCTime2LocalTime(emp.finishTime);
        });
        if (this.showEmployees) {
          this.populatedEmployees = [...this.employees.map(emp => emp.members.map(m => ({ ...m, ...emp })))]
            .reduce((acc, curVal) => {
              return acc.concat(curVal)
            }, []);

        } else {
          this.populatedEmployees = [...this.employees];
        }
        // this.employees.forEach((item: any ) => {
        //   if (item.shiftDto == null) {
        //     return;
        //   }
        //   const shiftDto = item.shiftDto;

        //   if ( shiftDto['startTime']) {
        //     shiftDto.startTime = ConvertUtil.UTCTime2LocalTime(shiftDto['startTime']);
        //   }
        //   if ( shiftDto['endTime']) {
        //     shiftDto.endTime = ConvertUtil.UTCTime2LocalTime(shiftDto['endTime']);
        //   }
        // });
        this.loaderService.hideLoader();
      }, error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
    // this.filter(this.pageFilter);


    this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
      if ((res)) {
        this.pageFilter.plantId = res.plantId;
        this.selectedPlant = res;
        this.filter(this.pageFilter);
      } else {
        this.pageFilter.plantId = null;
        this.selectedPlant = null;
      }

    });
  }


  onShowEmployeeChecked(event) {
    if (this.showEmployees) {
      this.selectedColumns = [
        { field: 'employeeGroupId', header: 'group-id' },
        { field: 'groupName', header: 'group-name' },
        { field: 'shift', header: 'shift-group' },
        { field: 'employeeNo', header: 'employee-no' },
        { field: 'firstName', header: 'first-name' },
        { field: 'lastName', header: 'last-name' },
        { field: 'startDate', header: 'start-date' },
        { field: 'finishDate', header: 'finish-date' },
        { field: 'startTime', header: 'start-time' },
        { field: 'finishTime', header: 'end-time' },
      ];

      this.populatedEmployees = [...this.employees.map(emp => emp.members.map(m => ({ ...m, ...emp })))]
        .reduce((acc, curVal) => {
          return acc.concat(curVal)
        }, []);

    } else {
      this.selectedColumns = [
        { field: 'employeeGroupId', header: 'group-id' },
        { field: 'groupName', header: 'group-name' },
        { field: 'shift', header: 'shift-group' },
        { field: 'employeeNo', header: 'employee-no' },
        { field: 'startDate', header: 'start-date' },
        { field: 'finishDate', header: 'finish-date' },
        { field: 'startTime', header: 'start-time' },
        { field: 'finishTime', header: 'end-time' },
      ];

      this.populatedEmployees = [...this.employees];

    }
  }

  change(event) {
  }

  exportPDF() {
    const exportedCols = this.selectedColumns.map(col => ({ title: this._translateSvc.instant(col.header), dataKey: col.field }));
    const mappedDAta = this.populatedEmployees.map(itm => {
      const obj = {};
      this.selectedColumns.forEach(col => {
        if (col.field === 'shift') {
          obj[col.field] = itm.shift?.shiftName || '';
        } else if (col.field === 'employeeNo') {
          obj[col.field] = itm.employeeNo || '';
        } else if (col.field === 'startDate' || col.field === 'finishDate') {
          obj[col.field] = new Date(itm[col.field]).toLocaleDateString();
        } else if (itm.hasOwnProperty(col.field)) {
          obj[col.field] = itm[col.field];
        }
      });
      return (obj);
    });
    this.appStateService.exportPdf(exportedCols, mappedDAta, 'EmployeeshiftGroup');
  }

  filter(data) {
    this.loaderService.showLoader();
    this.searchTerms.next(data);
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

  modalExchangeShow(groupId, employeeId, mod: string) {
    this.employeeList = [];
    console.log('@seletecId', groupId, employeeId);
    this.employeeGroupModal.groupId = groupId;
    this.employeeGroupModal.employeeId = employeeId;
    this.employeeGroupModal.modal = mod;
    // this.employeeList.push(this.selectedEmpGroup.map(x => x.members));
    this.selectedEmpGroup.filter(empGroup => {
      empGroup.SelectedGroupMembers = [];
      this.employeeList = [...this.employeeList, ...empGroup.members];
    });
    this.selectedAllEmpGroup.filter(empGroup => {
      empGroup.SelectedGroupMembers = [];
      this.employeeList = [...this.employeeList, ...empGroup.members];
    });
    this.selectedShift = null;
    this.myExchangeModal.show();
  }
  modalEmplShow(empId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.STAFF, empId);
  }

  delete(groupId, employeeId) {

    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        if (groupId) {
          this.deleteGroupShift(groupId);
        }
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }

    });
  }

  deleteGroupShift(groupId) {
    this._employeeSvc.delete(groupId)
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

  showStaffDetail(id) {
    this.loaderService.showDetailDialog(DialogTypeEnum.STAFF, id);
  }

  showShiftDetail(id) {
    this.loaderService.showDetailDialog(DialogTypeEnum.STAFF, id);
  }


  exportCSV(selected: boolean = false, type: BookType = 'csv') {
    if (selected) {
      let selectedEmpGroupsWithEmployees = [];
      this.selectedEmpGroup.map(itm =>
        selectedEmpGroupsWithEmployees.push(...this.populatedEmployees.filter(pop => pop.employeeGroupId == itm.employeeGroupId)));

      const mappedDAta = selectedEmpGroupsWithEmployees.map(itm => {
        const obj = {};
        this.selectedColumns.forEach(col => {
          if (col.field === 'shift') {
            obj[col.field] = itm.shift?.shiftName || '';
          } else if (col.field === 'startDate') {
            obj[this._translateSvc.instant(col.header)] = itm.startDate ? new Date(itm.startDate).toLocaleDateString() : '';
          } else if (col.field === 'finishDate') {
            obj[this._translateSvc.instant(col.header)] = itm.finishDate ? new Date(itm.finishDate).toLocaleDateString() : '';
          } else if (col.field === 'employeeNo') {
            obj[this._translateSvc.instant(col.header)] = itm.employeeNo;
          }


          else if (itm.hasOwnProperty(col.field)) {
            obj[this._translateSvc.instant(col.header)] = itm[col.field];
          }
        });
        return (obj);
      });
      this.appStateService.exportAsFile(mappedDAta, type, 'Employee Shift Groups');
    } else {
      this.loaderService.showLoader();
      this._employeeSvc.filter({ ...this.pageFilter, pageNumber: 1, pageSize: this.pagination.totalElements })
        .then(result => {
          const employees = result['content'] || [];
          let populatedEmployees = [];
          if (this.showEmployees) {

            populatedEmployees = [...employees.map(emp => emp.members.map(m => ({ ...m, ...emp })))]
              .reduce((acc, curVal) => {
                return acc.concat(curVal)
              }, []);

          } else {
            populatedEmployees = [...employees];
          }
          const mappedDAta = populatedEmployees.map(itm => {
            const obj = {};
            this.selectedColumns.forEach(col => {
              if (col.field === 'shift') {
                obj[col.field] = itm.shift?.shiftName || '';
              } else if (col.field === 'startDate') {
                obj[this._translateSvc.instant(col.header)] = itm.startDate ? new Date(itm.startDate).toLocaleDateString() : '';
              } else if (col.field === 'finishDate') {
                obj[this._translateSvc.instant(col.header)] = itm.finishDate ? new Date(itm.finishDate).toLocaleDateString() : '';
              } else if (col.field === 'employeeNo') {
                obj[this._translateSvc.instant(col.header)] = itm.employeeNo;
              } else if (itm.hasOwnProperty(col.field)) {
                obj[this._translateSvc.instant(col.header)] = itm[col.field];
              }
            });
            return (obj);
          });
          this.appStateService.exportAsFile(mappedDAta, type, 'Employee Shift Groups');
          this.loaderService.hideLoader();
        }, err => {
          this.utilities.showErrorToast(err);
          this.loaderService.hideLoader();
        })
    }

  }
  allowDrop(ev) {
    ev.preventDefault();
  }

  drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
  }

  drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
  }

  transfer() {
    if (this.selectedShift) {
      let selectedMembers = [];
      this.selectedEmpGroup.filter(empGroup => {
        if (empGroup.selectedMembers) {

          selectedMembers = [...selectedMembers, ...empGroup.selectedMembers];
        }
      });
      if (selectedMembers && selectedMembers.length > 0) {
        this.selectedEmpGroup.filter(empGroup => {
          if (empGroup.employeeGroupId == this.selectedShift) {
            empGroup.SelectedGroupMembers = [...empGroup.SelectedGroupMembers, ...selectedMembers];
          }
          selectedMembers.filter(selectedMem => {
            const index = empGroup.members.findIndex(x => x.employeeId == selectedMem.employeeId);
            if (index > -1) {
              empGroup.members.splice(index, 1);
            }
          });
        });
      }
      this.selectedEmpGroup.filter(empGroup => {
        empGroup.selectedMembers = [];
      });
    }
  }

  save() {
    // console.log('@beforeSaved', this.employeeShift);return;
    this.selectedEmpGroup.filter(empGroup => {


      const temp = Object.assign({}, this.employeeShift);
      // const selectedGroup = this.selectedEmpGroup.find(x => x.employeeGroupId == this.selectedShift);
      temp.employeeGenericGroupId = empGroup.employeeGenericGroup.employeeGenericGroupId;
      if (empGroup && empGroup.SelectedGroupMembers && empGroup.SelectedGroupMembers.length > 0) {
        temp.employeeIdList = [...empGroup.members.map(x => x.employeeId), ...empGroup.SelectedGroupMembers.map(x => x.employeeId)];
      } else {
        temp.employeeIdList = empGroup.members.map(x => x.employeeId);
      }
      temp.groupCode = empGroup.groupCode;
      temp.groupName = empGroup.groupName;
      temp.shiftId = empGroup.shift.shiftId;
      temp.plantId = this.selectedPlant.plantId;
      temp.employeeGroupId = empGroup.employeeGroupId;
      temp.startDate = empGroup.startDate;
      temp.finishDate = empGroup.finishDate;

      var splitFinishDate = empGroup.finishDate.split("T");
      var combinedFinishTime = moment(splitFinishDate[0] + ' ' + empGroup.finishTime);

      var splitStartDate = empGroup.startDate.split("T");
      var combinedStartTime = moment(splitStartDate[0] + ' ' + empGroup.startTime);

      temp.startTime = combinedStartTime;
      temp.finishTime = combinedFinishTime;
      this.loaderService.showLoader();
      this._employeeSvc.save(temp)
        .then((empShift: any) => {
          this.loaderService.hideLoader();
          this.utilities.showSuccessToast('saved successfully');
          this.myExchangeModal.hide();
          this.filter(this.pageFilter);
        })
        .catch(error => {
          this.loaderService.hideLoader();
          this.utilities.showErrorToast(error)
        });
    });

  }

  shiftGroupChange(event) {
    this.selectedEmpGroup.filter(empGroup => {
      empGroup.selectedMembers = [];
    })
  }

}
