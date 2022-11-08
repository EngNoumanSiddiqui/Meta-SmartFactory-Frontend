import { AppStateService } from './../../../../services/dto-services/app-state.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { environment } from 'environments/environment';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { WorkstationTypeService } from 'app/services/dto-services/workstation-type/workstation-type.service';
import { Subscription } from 'rxjs';
import { ConvertUtil } from 'app/util/convert-util';

@Component({
  selector: 'workstation-type-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit , OnDestroy{

  @ViewChild('myModal') public myModal: ModalDirective;
  classReOrder = ['asc', 'asc', 'asc', 'asc', 'asc'];
  showLoader = false;
  workstationTypes: any = [];
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
    "workStationTypeId": null,
    "workStationTypeName": null,
    plantId: null,
    plantName: null,
    query: null,
    orderByProperty: null,
    orderByDirection: 'desc',
    description: null,
  };
  workstationtypeModal ? = {
    modal: null,
    data: null,
    id: null
  };
  cols = [
    {field: 'workStationTypeId', header: 'workstation-type-id'},
    {field: 'workStationTypeName', header: 'workstation-type-name'},
    

    
  ];
  selectedColumns = [
    {field: 'workStationTypeId', header: 'workstation-type-id'},
    {field: 'workStationTypeName', header: 'workstation-type-name'},
    
  ];
  sub: Subscription;

  constructor(
    private wsTypesrv: WorkstationTypeService,
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private appStateService:AppStateService,
             private _confirmationSvc: ConfirmationService,
             private _translateSvc: TranslateService,
              ) {
               

}

  ngOnInit() {
    this.sub = this.appStateService.plantAnnounced$.subscribe(res=>{
      if(res){
        this.pageFilter.plantId = res.plantId;
        this.filter();
      }
      else{
        this.pageFilter.plantId = null;
        
      }
    });//uncomment when api is changed
    // this.filter();
  }

  ngOnDestroy() {
    if(this.sub){
      this.sub.unsubscribe();
    }
  }
  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = null;
    }
      this.pageFilter[field] = value;
      this.filter();
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
      this.filter()
    }, 500);
  }
  //please uncomment when api change is done
  // getOperationTypeById(plantId){
  //   this.wsTypesrv.getIdNameList().then((res:any)=>{
  //     this.workstationTypes = res;
  //   });
  // }

  filter() {
    this.wsTypesrv.filter(this.pageFilter).then(result => {
      this.loaderService.hideLoader();
      this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.workstationTypes = result['content'];
    })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }

  modalShow(id, mod: string, data) {
    this.workstationtypeModal.id = id;
    this.workstationtypeModal.modal = mod;
    this.workstationtypeModal.data = data;
    this.myModal.show();
  }

  delete(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this.wsTypesrv.delete(id)
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
