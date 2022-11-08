import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ConfirmationService} from 'primeng';
import {environment} from '../../../../../environments/environment';
import {LoaderService} from '../../../../services/shared/loader.service';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {UtilitiesService} from '../../../../services/utilities.service';
import {ConvertUtil} from '../../../../util/convert-util';
import * as moment from 'moment';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
import { SkillMatrixSamplingValueService } from 'app/services/dto-services/skill-matrix-report/skill-matrix-sampling-value.service';
import { AppStateService } from 'app/services/dto-services/app-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'skill-matrix-sampling-value-list',
  templateUrl: './list.component.html'
})
export class ListSkillMatrixSamplingValueComponent implements OnInit, OnDestroy {
  @ViewChild('myModal') public myModal: ModalDirective;
  skillMatrixSamplingModal = {
    modal: null,
    id: null
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
  pageFilter = {
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    groupType: null,
    skillMatrixSamplingValueId: null,
    query: null,
    plantId: null,
    orderByProperty: 'skillMatrixSamplingValueId',
    orderByDirection: 'desc'
  };
  selectedColumns = [
    {field: 'skillMatrixSamplingValueId', header: 'skill-matrix-sampling-id'},
    {field: 'groupType', header: 'group-type'},
    {field: 'min', header: 'min'},
    {field: 'max', header: 'max'},
    {field: 'value', header: 'value'},
    {field: 'color', header: 'color'}
  ];
  cols = [
    {field: 'skillMatrixSamplingValueId', header: 'skill-matrix-sampling-id'},
    {field: 'groupType', header: 'group-type'},
    {field: 'min', header: 'min'},
    {field: 'max', header: 'max'},
    {field: 'value', header: 'value'},
    {field: 'color', header: 'color'}
  ];


  classReOrder = ['asc', 'asc', 'asc', 'asc', 'asc', 'asc'];

  skillMatrixSamplingList = [];
  selectedSkillMatrixSampling = [];
  SkillMatrixTypes = [];
  sub: Subscription;
  selectedPlant: any;

  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = null;
    }
    this.pageFilter[field] = value;

    this.filter(this.pageFilter);
  }

  modalShow(id, mod: string) {

    this.skillMatrixSamplingModal.id = id;
    this.skillMatrixSamplingModal.modal = mod;

    this.myModal.show();
  }

  constructor(private _confirmationSvc: ConfirmationService,
              private _enumService: EnumService,
              private _translateSvc: TranslateService,
              private skillSamplingSrvc: SkillMatrixSamplingValueService,
              private utilities: UtilitiesService,
              private appStateService: AppStateService,
              private loaderService: LoaderService) {
                this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
                  if (res) {
                   this.selectedPlant = res;
                   this.pageFilter.plantId = res?.plantId;
                   this.filter(this.pageFilter);
                  } else {
                    this.selectedPlant = null;
                    this.pageFilter.plantId = null;
                  }
                });
  }


  ngOnInit() {
    // this.filter(this.pageFilter);
    this._enumService.getSkillMatrixGroupTypeEnum().then(result => this.SkillMatrixTypes = result).catch(error => console.log(error));
    
  }
  ngOnDestroy() {
    if(this.sub) {
      this.sub.unsubscribe();
    }
  }


  filter(data) {
    this.loaderService.showLoader();
    this.skillSamplingSrvc.filter(data)
      .then(result => {
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.skillMatrixSamplingList = result['content'];
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
    this.pageFilter.orderByProperty = item;
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
      pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
      groupType: null,
      skillMatrixSamplingValueId: null,
      query: null,
      plantId: this.pageFilter.plantId,
      orderByProperty: 'skillMatrixSamplingValueId',
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
        this.skillSamplingSrvc.delete(id)
          .then(() => {
            this.utilities.showSuccessToast('deleted-success');
            this.filter(this.pageFilter);
          })
          .catch(error => this.utilities.showErrorToast(error));
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    })
  }
}

