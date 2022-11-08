import {EmployeeGroupService} from './../../../../services/dto-services/employee-group.service';
import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {ConfirmationService, Message} from 'primeng';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {UtilitiesService} from 'app/services/utilities.service';
import {LoaderService} from 'app/services/shared/loader.service';
import {environment} from '../../../../../environments/environment';
import {ConvertUtil} from 'app/util/convert-util';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { EmployeeGenericGroupService } from 'app/services/dto-services/employee-generic-group.service';
import { AppStateService } from 'app/services/dto-services/app-state.service';

import { Subscription } from 'rxjs';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class EmployeeGeneralGroupListComponent implements OnInit, OnDestroy {

  @ViewChild('myModal') public myModal: ModalDirective;
  employeeGroupModal = {
    modal: null,
    id: null
  };
  /********* DataTable settings*************/
  selectedEmpGroup;
  showLoader = false;
  selectedColumns = [
    {field: 'employeeGenericGroupId', header: 'group-id'},
    {field: 'groupCode', header: 'group-code'},
    {field: 'groupName', header: 'group-name'},
    {field: 'groupType', header: 'group-type'},
    {field: 'groupSubTypeEnum', header: 'group-sub-type'},
    {field: 'referenceItemDto', header: 'reference-item'},
    {field: 'plant', header: 'plant'},
  ];
  cols = [
    {field: 'employeeGenericGroupId', header: 'group-id'},
    {field: 'groupCode', header: 'group-code'},
    {field: 'groupName', header: 'group-name'},
    {field: 'groupType', header: 'group-type'},
    {field: 'plant', header: 'plant'},
    {field: 'groupSubTypeEnum', header: 'group-sub-type'},
    {field: 'workUnderSupervision', header: 'work-under-supervisor'},
    {field: 'referenceItemDto', header: 'reference-item'}
  ];
  classReOrder = ['asc', 'asc', 'asc', 'asc'];
  employees = [] = [];

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
      groupSubType: null,
      groupType: null,
      plantId: null, plantName: null,
      workUnderSupervision: null,
      parentGroup: null,
      referenceItemId: null,
      orderByDirection: 'desc',
      orderByProperty: 'employeeGenericGroupId',
      query: null
    };
  sub: Subscription;

  enableExchangeGroup: boolean = false;
  filteredEmployeeSubGroup: any[];
  employeeAllGenericGroupTypes: any;
  employeeGenericGroupTypes: any[];
  /********* DataTable settings*************/
  constructor(private _confirmationSvc: ConfirmationService,
              private _router: Router,
              private _translateSvc: TranslateService,
              private _employeeSvc: EmployeeGroupService,
              private _empGeneralSvc: EmployeeGenericGroupService,
              private appStateService: AppStateService,
              private utilities: UtilitiesService,
              private loaderService: LoaderService) {
                
  }

  ngOnInit() {
    // this.filter(this.pageFilter);

    this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
      if (!(res)) {
        this.pageFilter.plantId = null;
        this.pageFilter.plantName = null;
      } else {
        // this.pageFilter.plantName = res.plantName;
        this.pageFilter.plantId = res.plantId;
        this.filter(this.pageFilter);
      }
      
    });

    this._empGeneralSvc.getEmployeeGenericGroupTypes().then(res => {
      this.employeeAllGenericGroupTypes = res as any[];
      if (this.employeeAllGenericGroupTypes.length > 0) {
        this.separateGenericGroupTypes(this.employeeAllGenericGroupTypes);
      }
    });
  }

  separateGenericGroupTypes(employeeGenericGroupTypes: any[] = []) {
    this.employeeGenericGroupTypes = [];
    employeeGenericGroupTypes.forEach(item => {
      if ((item)) {
        this.employeeGenericGroupTypes.push(item);
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onRowSelect(event){
    if(this.selectedEmpGroup.length > 2){
      this.enableExchangeGroup = false;
    }else{
      // console.log('@slectedEmpGroup', this.selectedEmpGroup)
      const genericGroup = [...new Map(this.selectedEmpGroup.map(item => [item.groupType && item.groupSubTypeEnum.id, item])).values()];
      // console.log('@genericGroup', genericGroup);
      if(genericGroup.length < this.selectedEmpGroup.length){
        this.enableExchangeGroup = true;
      }else{
        this.enableExchangeGroup = false;
      }
    }
  }

  onRowUnselect(event){
    this.onRowSelect(event);
  }

  exchangeGroups(){
    
  }

  filter(data) {
    this.loaderService.showLoader();
    this._empGeneralSvc.filter(data)
      .then(result => {
        console.log('gridData', result);
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.employees = result['content'];

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

  filterSubGroups() {
    const me = this;
    me.filteredEmployeeSubGroup = [];
    if (this.pageFilter.groupType) {
      this.employeeAllGenericGroupTypes.forEach(item => {
        if (this.pageFilter.groupType === item.groupType.message || this.pageFilter.groupType === item.groupType) {
          item.groupSubType.forEach(subGroupItem => {
              me.filteredEmployeeSubGroup.push(subGroupItem);
          });
        }
      });
    }
  }

  modalShow(id, mod: string) {
    console.log('@OnEdit', id, mod);
    this.employeeGroupModal.id = id;
    this.employeeGroupModal.modal = mod;
    this.myModal.show();
  }

  delete(id) {
    console.log(id);
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this._empGeneralSvc.delete(id)
          .then(() => {
            this.utilities.showSuccessToast('deleted-success');
            this.filter(this.pageFilter);
          })
          .catch(error => this.utilities.showErrorToast(error));
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    });
  }
}
