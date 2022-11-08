import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {environment} from 'environments/environment';
import {PlantService} from 'app/services/dto-services/plant/plant.service';
import {LoaderService} from 'app/services/shared/loader.service';
import {UtilitiesService} from 'app/services/utilities.service';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {AppStateService} from 'app/services/dto-services/app-state.service';
 
import {OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';

@Component({
  selector: 'stop-cause-type-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {

  @ViewChild('myModal') public myModal: ModalDirective;
  classReOrder = ['asc', 'asc', 'asc', 'asc', 'asc'];
  showLoader = false;
  stopTypes: any = [];

  //change name
  stopTypeModal = {
    modal: null,
    data: null,
    id: null
  };
  //data table content
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
  

  cols = [
    {field: 'stopCauseTypeId', header: 'stop-cause-id'},
    {field: 'stopCauseTypeName', header: 'stop-cause-name'},
    {field: 'stopCauseTypeCode', header: 'stop-cause-code'},
    {field: 'orderNo', header: 'order-no'},
    {field: 'groupType', header: 'related-department'},


  ];
  selectedColumns = [
    {field: 'stopCauseTypeId', header: 'stop-cause-id'},
    {field: 'stopCauseTypeName', header: 'stop-cause-name'},
    {field: 'stopCauseTypeCode', header: 'stop-cause-code'},
    {field: 'orderNo', header: 'order-no'},
    {field: 'groupType', header: 'related-department'},

  ];
  sub: Subscription;
  selectedPlant: any;

  constructor(private _industryService: PlantService,
              private loaderService: LoaderService,
              private appStateService: AppStateService,
              private utilities: UtilitiesService,
              private _confirmationSvc: ConfirmationService,
              private _translateSvc: TranslateService,
  ) {

  }

  ngOnInit() {
    this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
      if (!(res)) {

      } else {
        this.selectedPlant = res;
        this.filter();
      }

    });
    // this.filter();
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  filter() {
    this._industryService.getAllStopCauseTypes(this.selectedPlant?.plantId).then(result => {
      this.loaderService.hideLoader();
      this.stopTypes = result;
    })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }

  modalShow(id, mod: string, data) {
    this.stopTypeModal.id = id;
    this.stopTypeModal.modal = mod;
    this.stopTypeModal.data = data;
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
    //this.pageFilter.pageNumber = this.pagination.pageNumber;
    //this.pageFilter.pageSize = this.pagination.pageSize;
    //this.pageFilter.query = this.pagination.tag;
    setTimeout(() => {
      //this.filter(this.pageFilter)
    }, 500);
  }

  delete(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this._industryService.deleteStopCause(id)
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
