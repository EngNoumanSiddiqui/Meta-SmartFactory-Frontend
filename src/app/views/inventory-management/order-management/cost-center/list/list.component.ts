import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { environment } from 'environments/environment';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Subscription } from 'rxjs';
import { ConvertUtil } from 'app/util/convert-util';
import { debounceTime, switchMap } from 'rxjs/operators';
import { LocationService } from 'app/services/dto-services/location/location.service';
import { AppStateService } from 'app/services/dto-services/app-state.service';
import { CostCenterService } from 'app/services/dto-services/cost-center/cost-center.service';

@Component({
  selector: 'cost-center-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit , OnDestroy{

  @ViewChild('myModal') public myModal: ModalDirective;
  classReOrder = ['desc', 'asc', 'asc', 'asc', 'asc'];

  private searchLocationTerms = new Subject<any>();

  showLoader = false;
  locations: any = [];
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
    costCenterCode:null,
    costCenterId:null,
    costCenterName:null,
    orderByDirection: 'desc',
    orderByProperty: 'costCenterId',
    plantId: null,
    query: null,
  };
  locationModal ? = {
    modal: null,
    data: null,
    id: null
  };
  cols = [
    {field: 'costCenterId', header: 'cost-center-id'},
    {field: 'costCenterCode', header: 'cost-center-code'},
    {field: 'costCenterName', header: 'cost-center-name'},
    
  ];
  selectedColumns = [
    {field: 'costCenterId', header: 'cost-center-id'},
    {field: 'costCenterCode', header: 'cost-center-code'},
    {field: 'costCenterName', header: 'cost-center-name'},
    
  ];
  sub: Subscription;

  constructor(
    private costCenterService: CostCenterService,
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private appStateService: AppStateService,
             private _confirmationSvc: ConfirmationService,
             private _translateSvc: TranslateService,
              ) {
               

}

  ngOnInit() {

    this.searchLocationTerms.pipe(
      debounceTime(600),
      switchMap(term => this.costCenterService.filterObservable(term))).subscribe(result => {
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.locations = result['content'];
        this.loaderService.hideLoader();

      }, error => {
        this.loaderService.hideLoader();

        this.utilities.showErrorToast(error)
      });

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
      this.search();
    }, 500);
  }
  //please uncomment when api change is done
  // getOperationTypeById(plantId){
  //   this.wsTypesrv.getIdNameList().then((res:any)=>{
  //     this.workstationTypes = res;
  //   });
  // }

  filter() {
    this.pageFilter.pageNumber = 1;
    this.search();
  }
  search() {
    this.loaderService.showLoader();
    this.searchLocationTerms.next(this.pageFilter);
  }

  modalShow(id, mod: string, data) {
    this.locationModal.id = id;
    this.locationModal.modal = mod;
    this.locationModal.data = data;
    this.myModal.show();
  }

  reOrderData(id, item: string) {

    if (this.classReOrder[id] === 'asc') {
      this.classReOrder[id] = 'desc';
    } else {
      this.classReOrder[id] = 'asc';
    }
  
    this.pageFilter.orderByProperty = item;
    this.pageFilter.orderByDirection = this.classReOrder[id];
    this.filter();
  }

  delete(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this.costCenterService.delete(id)
          .then(() => {
            this.utilities.showInfoToast('deleted-success');
            this.search();
          })
          .catch(error => this.utilities.showErrorToast(error));

      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    })
  }
}
