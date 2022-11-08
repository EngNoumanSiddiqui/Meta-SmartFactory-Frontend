import {Component, OnInit, ViewChild} from '@angular/core';
import {LoaderService} from 'app/services/shared/loader.service';
import {UtilitiesService} from 'app/services/utilities.service';
import {environment} from '../../../../../../environments/environment';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {TranslateService} from '@ngx-translate/core';
import {ConfirmationService} from 'primeng';
import {ConvertUtil} from 'app/util/convert-util';
import {CmsTypeService} from '../../../../../services/dto-services/print/cms-type.service';
import {AppStateService} from '../../../../../services/dto-services/app-state.service';

@Component({
  selector: 'common-template-type-list',
  templateUrl: './common-template-type-list.component.html',
  styleUrls: ['./common-template-type-list.component.scss']
})
export class CommonTemplateTypeListComponent implements OnInit {
  cmsTypes: any[];
  selectedParts: any;
  @ViewChild('myModal') public myModal: ModalDirective;
  classReOrder = ['asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc'];
  showLoader = false;

  partModal = {
    modal: null,
    id: null
  };

  selectedColumns = [
    {field: 'commonTempleteTypeId', header: 'common-template-type-id'},
    {field: 'commonTempleteTypeCode', header: 'common-template-type-code'},
    {field: 'commonTempleteTypeDescription', header: 'description'}
  ];

  cols = [
    {field: 'commonTempleteTypeId', header: 'common-template-type-id'},
    {field: 'commonTempleteTypeCode', header: 'common-template-type-code'},
    {field: 'commonTempleteTypeDescription', header: 'description'},
    {field: 'createDate', header: 'create-date'},
    {field: 'updateDate', header: 'update-date'},
  ];

  pageFilter = {
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    query: null,
    orderByProperty: null,
    orderByDirection: 'desc',
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

  sub: any;

  constructor(private cmsTypeSvc: CmsTypeService,
              private loaderService: LoaderService,
              private _translateSvc: TranslateService,
              private _confirmationSvc: ConfirmationService,
              private utilities: UtilitiesService,
              private appStateSvc: AppStateService) {
    this.sub = this.appStateSvc.plantAnnounced$.subscribe(res => {
      if (!res) {
        this.pageFilter.plantId = null;
      } else {
        this.pageFilter.plantId = res.plantId;
        this.filter(this.pageFilter);
      }
    });
  }

  ngOnInit() {
    this.filter(this.pageFilter);
  }

  filter(data) {
    this.loaderService.showLoader();
    this.cmsTypeSvc.filter(data)
      .then(result => {
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.cmsTypes = result['content'];
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
    this.partModal.id = id;
    this.partModal.modal = mod;
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
        this.cmsTypeSvc.delete(id)
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
