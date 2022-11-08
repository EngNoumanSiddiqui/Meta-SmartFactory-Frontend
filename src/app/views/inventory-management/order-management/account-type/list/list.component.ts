import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { environment } from 'environments/environment';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

import { Subscription } from 'rxjs';
import { AppStateService } from 'app/services/dto-services/app-state.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { ActTypeService } from 'app/services/dto-services/act-type/act-type.service';

@Component({
  selector: 'app-account-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class AccountListComponent implements OnInit, OnDestroy {

  @ViewChild('myModal') public myModal: ModalDirective;
  classReOrder = ['asc', 'asc', 'asc', 'asc', 'asc'];
  showLoader = false;
  workcenters: any = []; // change name
  filteredPlantList: any[] = [];
  // change name
  workcenterModal = {
    modal: null,
    data: null,
    id: null
  };
  pageFilter = {
    plantId: null,
    plantName: null,
  }
  // data table content
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

  cols = [
    {field: 'actTypeId', header: 'account-type-id'},
    {field: 'actTypeNo', header: 'account-type-no'},
    {field: 'actTypeName', header: 'account-type-name'},
    {field: 'accountPosition', header: 'account-position'},
    {field: 'plantId', header: 'plant'},

    // {field: 'createDate', header: 'create-Date'},
    // {field: 'updateDate', header: 'update-Date'},

  ];
  selectedColumns = [

    {field: 'actTypeId', header: 'account-type-id'},
    {field: 'actTypeNo', header: 'account-type-no'},
    {field: 'actTypeName', header: 'account-type-name'},
    {field: 'accountPosition', header: 'account-position'},
    // {field: 'plantId', header: 'plant'},



  ];


  constructor(private accountTypeService: ActTypeService,
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
             private _confirmationSvc: ConfirmationService,
             private _translateSvc: TranslateService,
             private appState: AppStateService,
              ) {
                this.sub = this.appState.plantAnnounced$.subscribe(res => {
                  if ((res) && res.plantId) {
                    this.pageFilter.plantId = res.plantId;
                    this.pageFilter.plantName = res.plantName;
                    this.getAccountTypeById(this.pageFilter.plantId);
                  } else {
                    this.pageFilter.plantId = null;
                    // this.filter();
                  }
                });
  }

  ngOnInit() {
    // this.filter();

  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getAccountTypeById(plantId: any) {
    if ((plantId)) {
      this.accountTypeService.getbyPlantId(plantId).then(result => {
        this.workcenters = result;
      });
    }
  }

  filter() {
    if (this.pageFilter.plantId) {
      this.getAccountTypeById(this.pageFilter.plantId);
    } else {
    this.accountTypeService.getIdNameList().then(result => {
      this.loaderService.hideLoader();
      this.workcenters = result;
      // if (this.pageFilter.plantId) {
      //   this.workcenters.filter(itm => this.pageFilter.plantId === itm.plantId);
      // }
    })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
    }
  }

  modalShow(id, mod: string, data) {
    this.workcenterModal.id = id;
    this.workcenterModal.modal = mod;
    this.workcenterModal.data = data;
    this.myModal.show();
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
    // this.pageFilter.pageNumber = this.pagination.pageNumber;
    // this.pageFilter.pageSize = this.pagination.pageSize;
    // this.pageFilter.query = this.pagination.tag;
    // setTimeout(() => {
    //   this.filter()
    // }, 500);
  }
  showPlantDetail(plantId){
    this.loaderService.showDetailDialog(DialogTypeEnum.PLANT, plantId);
  }
  delete(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this.accountTypeService.delete(id)
          .then(() => {
            this.utilities.showInfoToast('deleted-success');
            this.filter()
          })
          .catch(error => this.utilities.showErrorToast(error));
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    })
  }

}
