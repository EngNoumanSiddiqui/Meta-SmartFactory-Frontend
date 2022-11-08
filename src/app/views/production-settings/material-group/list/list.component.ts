import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { environment } from 'environments/environment';
import { PlantService } from 'app/services/dto-services/plant/plant.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { AppStateService } from 'app/services/dto-services/app-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {

  @ViewChild('myModal') public myModal: ModalDirective;
  classReOrder = ['asc', 'asc', 'asc', 'asc', 'asc'];
  showLoader = false;
  workcenters: any = [];//change name

  //change name
  workcenterModal = {
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
    {field: 'groupCode', header: 'group-code'},
    {field: 'groupDescription', header: 'group-description'},
    {field: 'stockGroupId', header: 'stock-group-id'},

  ];
  selectedColumns = [
    {field: 'groupCode', header: 'group-code'},
    {field: 'groupDescription', header: 'group-description'},
    {field: 'stockGroupId', header: 'stock-group-id'},

  ];
  selectedPlant: any;
  sub:Subscription;

  constructor(private _industryService: PlantService,
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private appStateService: AppStateService,
             private _confirmationSvc: ConfirmationService,
             private _translateSvc: TranslateService,

              ) {
  }

  ngOnInit() {
    // this.filter();
    this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
      if (!(res)) {
       this.selectedPlant = null;
      } else {
        this.selectedPlant = res;
        this.filter();
      }
      
    });
  }

  ngOnDestroy() {
    if(this.sub) {
      this.sub.unsubscribe();
    }
  }

  filter() {
    this._industryService.getSelectedPlantMaterialGroup(this.selectedPlant?.plantId).then(result => {
      console.log("@industry",result);
      this.loaderService.hideLoader();
      this.workcenters = result;
    })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
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
        this._industryService.deleteMaterial(id)
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
