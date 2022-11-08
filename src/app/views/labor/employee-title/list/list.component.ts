import { EmployeeTitleService } from './../../../../services/dto-services/employee-title/employee-title.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ScrapTypeService } from 'app/services/dto-services/scrap-type.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import {environment} from '../../../../../environments/environment';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {ConfirmationService} from 'primeng';
import { ConvertUtil } from 'app/util/convert-util';
import { UsersService } from 'app/services/users/users.service';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})

export class ListComponent implements OnInit {
  employeeTitle: any[];
  selectedParts: any;
  @ViewChild('myModal') public myModal: ModalDirective;
  classReOrder = ['asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc'];
  showLoader = false;

  componentShowModal = {
    modal: null,
    id: null
  };
  selectedColumns = [
    {field: 'employeeTitleId', header: 'employee-title-id'},
    {field: 'employeeTitleName', header: 'employee-title-name'},
    {field: 'employeeTitleCode', header: 'employee-title-code'},
    {field: 'panelMaster', header: 'panel-master'},
    
    {field: 'employeeTitleDescription', header: 'employee-title-description'},

  ];
  cols = [
    {field: 'employeeTitleId', header: 'employee-title-id'},
    {field: 'employeeTitleName', header: 'employee-title-name'},
    {field: 'employeeTitleCode', header: 'employee-title-code'},
    {field: 'panelMaster', header: 'panel-master'},
    {field: 'stopMaster', header: 'stop-master'},
    {field: 'scrapMaster', header: 'scrap-master'},
    {field: 'setupMaster', header: 'setup-master'},
    {field: 'reworkMaster', header: 'rework-master'},
    {field: 'maintenanceMaster', header: 'maintenance-master'},
    {field: 'employeeTitleDescription', header: 'employee-title-description'},
  ];
  pageFilter = {
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    query: null,
    orderByProperty: null,
    orderByDirection: 'desc',
    employeeTitleCode: null,
    employeeTitleDescription: null,
    employeeTitleId: null,
    employeeTitleName: null,
    employeeTitleParentId: null,
    plantId: null
  };

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

constructor(private employeeTitleService: EmployeeTitleService,
    private loaderService: LoaderService,
     private _translateSvc: TranslateService,
    private _confirmationSvc: ConfirmationService,
    private utilities: UtilitiesService,
    private _userSvc: UsersService) {
        const selectedPlant = JSON.parse(this._userSvc.getPlant());
        this.pageFilter.plantId = selectedPlant ? selectedPlant.plantId : null;
      }

  ngOnInit() {
    this.filter(this.pageFilter);
  }

filter(data) {
    this.loaderService.showLoader();
    this.employeeTitleService.filter(data)
      .then(result => {
        console.log('@title', result);
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.employeeTitle = result['content'];
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
    }, 2500);
  }

modalShow(id, mod: string) {
  console.log('@call', id, mod);
    this.componentShowModal.id = id;
    this.componentShowModal.modal = mod;
    this.myModal.show();
}
  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = null;
    }
    this.pageFilter[field] = value;

    this.filter(this.pageFilter);
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
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        // change
        this.employeeTitleService.delete(id)
          .then(() => {
            this.utilities.showInfoToast('deleted-success');
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
