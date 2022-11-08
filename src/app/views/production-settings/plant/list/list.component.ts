import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {PlantService} from 'app/services/dto-services/plant/plant.service';
import {LoaderService} from 'app/services/shared/loader.service';
import {UtilitiesService} from 'app/services/utilities.service';
import {environment} from 'environments/environment';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { AppStateService } from 'app/services/dto-services/app-state.service';

import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {
  @ViewChild('myModal') public myModal: ModalDirective;

  plantStatus:any=[]=[
    {
      Id:1,
      value:'ACTIVE'
    },
    {
      Id:2,
      value:'INACTIVE'
    }

  ];
  classReOrder = ['asc', 'asc', 'asc', 'asc', 'asc'];
  showLoader = false;
  workcenters: any = []; // change name
  // change name
  workcenterModal = {
    modal: null,
    data: null,
    id: null
  };
  // data table content
  pageFilter={
    status:null
  }
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
    {field: 'plantId', header: 'plant-Id'},
    {field: 'plantName', header: 'plant-full-name'},
    {field: 'plantCode', header: 'plant-code'},
    {field: 'countryName', header: 'country'},
    {field: 'cityName', header: 'city'},
    {field: 'address', header: 'plant-address'},
    {field: 'companyAddress', header: 'company-address'},
    {field: 'PostCode', header: 'post-code'}

  ];

  selectedColumns = [
    {field: 'plantId', header: 'plant-id'},
    {field: 'plantName', header: 'plant-full-name'},
    {field: 'plantCode', header: 'plant-code'},
    {field: 'countryName', header: 'country'},
    {field: 'cityName', header: 'city'}
  ];
  plantId: any;
  Allworkcenters = [];
  sub: Subscription;

  constructor(private _plantService: PlantService,
    private _confirmationSvc: ConfirmationService,
    private _translateSvc: TranslateService,
    private appStateService: AppStateService,
              private loaderService: LoaderService,
              private utilities: UtilitiesService, ) {
                this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
                  if (!(res)) {
                   this.plantId = null;
                   this.workcenters = Object.assign([], this.Allworkcenters);
                  } else {
                    this.plantId = res.plantId;
                    this.workcenters = this.Allworkcenters ? this.Allworkcenters.filter(itm => this.plantId === itm.plantId) : null;
                  }
                });
  }

  ngOnInit() {
    this.filter();
  }
  ngOnDestroy() {
      this.sub.unsubscribe();
  }

  filter() {
    this._plantService.getAllPlants().then((result: any) => {
      this.loaderService.hideLoader();
      this.Allworkcenters = result;
      if (this.plantId) {
        this.workcenters = result ? result.filter(itm => this.plantId === itm.plantId) : null;
      } else {
        this.workcenters = Object.assign([], this.Allworkcenters);
      }
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

  plantChanged() {
    this.appStateService.$plantchanged.next('changed');
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
    setTimeout(() => {
      // this.filter(this.pageFilter)
    }, 500);
  }

  delete(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this._plantService.deleteplant(id)
          .then(() => {
            this.utilities.showInfoToast('deleted-success');
            this.filter();
          })
          .catch(error => this.utilities.showErrorToast(error));
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    })
  }
  showCountryDetail(id){
    this.loaderService.showDetailDialog(DialogTypeEnum.COUNTRY, id);
  }

  showCityDetail(id){
    this.loaderService.showDetailDialog(DialogTypeEnum.CITY, id);
  }
}
