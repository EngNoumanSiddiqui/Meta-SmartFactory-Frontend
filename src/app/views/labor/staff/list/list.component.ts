import { PlantService } from 'app/services/dto-services/plant/plant.service';
import { AppStateService } from './../../../../services/dto-services/app-state.service';
import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {EmployeeService} from '../../../../services/dto-services/employee/employee.service';
import { ConfirmationService, MenuItem } from 'primeng';
import {environment} from '../../../../../environments/environment';
import {LoaderService} from '../../../../services/shared/loader.service';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {UtilitiesService} from '../../../../services/utilities.service';
import {EnumGenderService} from '../../../../services/dto-services/enum/gender.service';
import {EnumBloodGroupService} from '../../../../services/dto-services/enum/blood-group.service';
import {ConvertUtil} from '../../../../util/convert-util';

import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { Subscription } from 'rxjs';
import { EmployeeTitleService } from 'app/services/dto-services/employee-title/employee-title.service';
import { BookType } from 'xlsx';
@Component({
  selector: 'staff-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListStaffComponent implements OnInit, OnDestroy {

  @ViewChild('myModal') public myModal: ModalDirective;
  staffModal = {
    modal: null,
    id: null,
    active: false
  };

  employeeGroupModal = {
    modal: null,
    id: null,
    active: false
  };

  employeeGroupModalHide = {
    modal: null,
    id: null,
    active: false
  };

  filteredPlantList: any[] = [];
  genderList;
  bloodList;
  plantListDisable: boolean;
  selectedStaffs = [];
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
    plantId:null,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    employeeNo: null,
    employeeTitleName: null,
    firstName: null,
    lastName: null,
    bloodGroup: null,
    query: null,
    gender: null,
    rfid: null,
    orderByProperty: 'employeeId',
    orderByDirection: 'desc'
  };

  menuItems:MenuItem[] = [
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
  selecteMenuItems:MenuItem[] = [
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

  classReOrder = ['asc', 'asc', 'asc', 'asc'];
  employees = [];
  showLoader = false;
  selectedColumns = [
    {field: 'employeeId', header: 'employee-id'},
    {field: 'employeeNo', header: 'employee-no'},
    {field: 'firstName', header: 'first-name'},
    {field: 'lastName', header: 'last-name'},
    {field: 'employeeTitleName', header: 'title'},
    // {field: 'rfid', header: 'rf-id'},
    {field: 'plant', header: 'plant-name'},
    {field: 'email', header: 'email'},
    {field: 'identity', header: 'Identity'},

  ];

  cols = [
    {field: 'employeeNo', header: 'employee-no'},
    {field: 'firstName', header: 'first-name'},
    {field: 'lastName', header: 'last-name'},
    {field: 'gender', header: 'gender'},
    {field: 'gsm', header: 'gsm'},
    // {field: 'rfid', header: 'rf-id'},
    {field: 'plant', header: 'plant-name'},

    {field: 'address1', header: 'address1'},
    {field: 'address2', header: 'address2'},
    {field: 'bloodGroup', header: 'blood-type'},
    {field: 'city', header: 'city'},
    {field: 'employeeCostRate', header: 'cost-rate'},
    {field: 'country', header: 'country'},
    {field: 'description', header: 'description'},
    {field: 'email', header: 'email'},
    {field: 'employeeTitleName', header: 'title'},
    {field: 'identity', header: 'Identity'},
    {field: 'phone', header: 'phone'}
  ];
  EmployeeTitleList = [];

  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = null;
    }
    this.pageFilter[field] = value;
    this.pageFilter.pageNumber=1;
    this.filter(this.pageFilter);
  }
  

  employeeGroupModalShow(id, mod: string) {
    this.employeeGroupModal.id = id;
    this.employeeGroupModal.modal = mod;
    this.employeeGroupModal.active = true;
    // this.myModal.show();
  }

  employeeGroupModalRemove(id, mod: string) {
    this.employeeGroupModalHide.id = id;
    this.employeeGroupModalHide.modal = mod;
    this.employeeGroupModalHide.active = true;
    // this.myModal.show();
  }

  modalShow(id, mod: string) {
    this.staffModal.id = id;
    this.staffModal.modal = mod;
    this.staffModal.active = true;
    // this.myModal.show();
  }

  cloneModalShow(mod: string) {
    this.staffModal.id = this.selectedStaffs[0].employeeId;
    this.staffModal.modal = mod;
    this.staffModal.active = true;
    // this.myModal.show();
  }

  plantsListSubscription: Subscription;
  sub: Subscription;

  constructor(
    private _confirmationSvc: ConfirmationService,
    private _router: Router,
    private _translateSvc: TranslateService,
    private _plantSvc:PlantService,
    private genderService: EnumGenderService,
    private bloodService: EnumBloodGroupService,
    private _employeeSvc: EmployeeService,
    private _empTitleSvc: EmployeeTitleService,
    private appStateService:AppStateService,
    private utilities: UtilitiesService,
    private loaderService: LoaderService) {


      // this.getAllPlants();

  }

  // getAllPlants(){
  //   this.plantsListSubscription = this.appStateService.plantListSubscription$.subscribe((res)=>{
  //     this.filteredPlantList = res;
  //   })
  // }
  ngOnInit() {
    // this._plantSvc.getAllPlants().then((res: any) => {
    // this.filteredPlantList = res;
    // });
    // this.filter(this.pageFilter);
    this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
      if (!(res)) {
       this.pageFilter.plantId = null;
        this.plantListDisable = false;
      } else {
        this.pageFilter.plantId = res.plantId;
        this.plantListDisable = true;
        this.filter(this.pageFilter);
        this._empTitleSvc.getIdNameListByPlantId(this.pageFilter.plantId)
        .then((result:any) => this.EmployeeTitleList = result)
        .catch(error => console.log(error));
      }
    });
    this.genderService.getEnumList().then(r => {
      this.genderList = r
    }).catch(e => {
      this.utilities.showWarningToast('Gender list taken error')
    });
    this.bloodService.getEnumList().then(r => {
      this.bloodList = r
    }).catch(e => {
      this.utilities.showWarningToast('Blood Group list taken error')
    });

  }

  filter(data) {
    this.loaderService.showLoader();
    this._employeeSvc.filter(data)
      .then(result => {
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.selectedStaffs = [];
        this.employees = result['content'];

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

  resetFilter() {
    this.pageFilter = {
      pageNumber: 1,
      pageSize: this.pageFilter.pageSize,
      plantId: null,
      employeeNo: null,
      employeeTitleName: null,
      firstName: null,
      lastName: null,
      query: null,
      bloodGroup: null,
      gender: null,
      rfid: null,
      orderByProperty: null,
      orderByDirection: 'desc'
    };
    this.filter(this.pageFilter);
  }

  delete(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this._employeeSvc.delete(id)
          .then(() => {
            this.utilities.showInfoToast('deleted-success');
            this.filter(this.pageFilter);
          })
          .catch(error => this.utilities.showErrorToast(error));
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    })
  }

  showPlantDetail(id) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PLANT, id);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    if (this.plantsListSubscription) {
      this.plantsListSubscription.unsubscribe();
    }
  }


  // tslint:disable-next-line: no-unused-expression
  getRfid (rfid: any): any {
    if (rfid) {
      // tslint:disable-next-line: no-construct
      let stars = '';
      const nrfid = new String(rfid);
      for (let index = 0; index < nrfid.length; index++) {
        stars =  stars + '*';
      }

      return stars
    }
    return '';
  }




  exportCSV(selected: boolean = false, type:BookType) {
    if(selected) {
      const mappedDAta = this.selectedStaffs.map(itm => {
        const obj = {};
        this.selectedColumns.forEach(col => {
          if(col.field=="employeeId") {
            obj[this._translateSvc.instant('employee-id')] = itm.employeeId;
          } else if(col.field=="employeeNo") {
            obj[this._translateSvc.instant(col.header)] = itm.employeeNo;
          }else if(col.field=="firstName") {
            obj[this._translateSvc.instant(col.header)] = itm.firstName;
          }else if(col.field=="lastName") {
            obj[this._translateSvc.instant(col.header)] = itm.lastName;
          }else if(col.field=="employeeTitleName") {
            obj[this._translateSvc.instant(col.header)] = itm.employeTitle?.employeeTitleName
          }else if(col.field=="plant") {
            obj[this._translateSvc.instant(col.header)] = itm.plant?.plantName;;
          }else if(col.field=="email") {
            obj[this._translateSvc.instant(col.header)] = itm.email;
          }else if(col.field=="identity") {
            obj[this._translateSvc.instant(col.header)] = itm.identity;
          }

          else if(itm.hasOwnProperty(col.field)) {
            obj[this._translateSvc.instant(col.header)] = itm[col.field];
          }
        });
        return (obj);
      });
      this.appStateService.exportAsFile(mappedDAta, type, 'employees');
    } else {
      this.loaderService.showLoader();
      this._employeeSvc.filter({...this.pageFilter, pageNumber: 1, pageSize: this.pagination.totalElements})
      .then(result => {
        const mappedDAta = result['content'].map(itm => {
          const obj = {};
          this.selectedColumns.forEach(col => {
            if(col.field=="employeeId") {
              obj[this._translateSvc.instant('employee-id')] = itm.employeeId;
            } else if(col.field=="employeeNo") {
              obj[this._translateSvc.instant(col.header)] = itm.employeeNo;
            }else if(col.field=="firstName") {
              obj[this._translateSvc.instant(col.header)] = itm.firstName;
            }else if(col.field=="lastName") {
              obj[this._translateSvc.instant(col.header)] = itm.lastName;
            }else if(col.field=="employeeTitleName") {
              obj[this._translateSvc.instant(col.header)] = itm.employeTitle?.employeeTitleName; 
            }else if(col.field=="plant") {
              obj[this._translateSvc.instant(col.header)] = itm.plant?.plantName;
            }else if(col.field=="email") {
              obj[this._translateSvc.instant(col.header)] = itm.email;
            }else if(col.field=="identity") {
              obj[this._translateSvc.instant(col.header)] = itm.identity;
            }

            else if(itm.hasOwnProperty(col.field)) {
              obj[this._translateSvc.instant(col.header)] = itm[col.field];
            }
          });
          return (obj);
        });
        this.appStateService.exportAsFile(mappedDAta, type, 'employees');
        this.loaderService.hideLoader();
      }, err => {
        this.utilities.showErrorToast(err);
        this.loaderService.hideLoader();
      })
    }
  }











}
