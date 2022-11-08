import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {LoaderService} from 'app/services/shared/loader.service';
import {UtilitiesService} from 'app/services/utilities.service';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {TranslateService} from '@ngx-translate/core';
import {ConfirmationService} from 'primeng';
import {ConvertUtil} from 'app/util/convert-util';
import { environment } from 'environments/environment';
import { RequestPrintDto } from 'app/dto/print/print.model';
import { CmsService } from 'app/services/dto-services/print/cms.service';
import { AppStateService } from 'app/services/dto-services/app-state.service';

@Component({
  selector: 'choose-common-template-pane',
  templateUrl: './choose-commontemplate-pane.component.html',
  styleUrls: ['./choose-commontemplate-pane.component.scss']
})
export class ChooseCommonTemplateComponent implements OnInit {
  cmsList: any[];
  selectedParts: any;
  @ViewChild('myModal') public myModal: ModalDirective;
  classReOrder = ['asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc'];
  showLoader = false;
  @Output() selectedEvent = new EventEmitter();
  @Input() choosePane = false;

  @Input() commonTemplateType = null;

  partModal = {
    modal: null,
    id: null
  };
  selectedTemplate: any;

  selectedColumns = [
    {field: 'templeteId', header: 'common-template-id'},
    {field: 'langCode', header: 'lang-code'},
    {field: 'templeteTitle', header: 'common-template-title'},
    {field: 'commonTemplateType', header: 'common-template-type'},
    {field: 'templeteText', header: 'common-template-text'},
    {field: 'templetePrintSize', header: 'common-template-print-size'},
    {field: 'actName', header: 'customer-name'},
    {field: 'defaultTemplate', header: 'default'}
  ];

  cols = [
    {field: 'templeteId', header: 'common-template-id'},
    {field: 'templeteTitle', header: 'common-template-title'},
    {field: 'templeteText', header: 'common-template-text'},
    {field: 'commonTemplateType', header: 'common-template-type'},
    {field: 'templetePrintSize', header: 'common-template-print-size'},
    {field: 'langCode', header: 'lang-code'},
    {field: 'actNo', header: 'customer-no'},
    {field: 'actName', header: 'customer-name'},
    {field: 'createDate', header: 'create-date'},
    {field: 'updateDate', header: 'update-date'},
    {field: 'defaultTemplate', header: 'default'}
  ];

  pageFilter = {
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    query: null,
    orderByProperty: null,
    commonTemplateType: null,
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

  requestPrintDto: RequestPrintDto = new RequestPrintDto();
  // requestPrintDto = {
  //   templateId: null,
  //   templateText: null,
  //   templateTypeId: null,
  //   itemId: null,
  //   plantId: null
  // };
  printComponent = {active: false};

  sub: any;

  constructor(private cmsSvc: CmsService,
              private loaderService: LoaderService,
              private _translateSvc: TranslateService,
              private _confirmationSvc: ConfirmationService,
              private utilities: UtilitiesService,
              private appStateSvc: AppStateService) {
    
  }

  ngOnInit() {
    this.sub = this.appStateSvc.plantAnnounced$.subscribe(res => {
      if (!res) {
        this.pageFilter.plantId = null;
        this.requestPrintDto.plantId = null;
      } else {
        this.pageFilter.plantId = res.plantId;
        this.requestPrintDto.plantId = res.plantId;
        this.pageFilter.commonTemplateType = this.commonTemplateType;
        this.filter(this.pageFilter);
      }
    });
    // this.filter(this.pageFilter);
  }

  filter(data) {
    this.loaderService.showLoader();
    this.cmsSvc.filter(data)
      .then(result => {
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.cmsList = result['content'];
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
    // console.log('@call', id, mod);
    // if (mod === 'DETAIL') {
    //   this.selectedTemplate = id;
    //   this.partModal.id = id.templeteId;
    // } else {
    //   this.partModal.id = id;
    // }
    // this.partModal.modal = mod;
    // this.myModal.show();
  }

  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = null;
    }

    if (field === 'commonTempleteTypeId') {
      this.pageFilter['cmsTypeId'] = value;
    } else if (field === 'commonTempleteTypeCode') {
      this.pageFilter['cmsTypeCode'] = value;
    } else if (field === 'commonTempleteTypeDescription') {
      this.pageFilter['cmsTypeDescription'] = value;
    } else {
      this.pageFilter[field] = value;
    }

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

  onRowSelect(event) {
    this.selectedEvent.next(event);
  }


  delete(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this.cmsSvc.delete(id)
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

  getPrintHtmlDocument() {
    console.log('requestdPrintHtml', this.selectedTemplate)
    this.requestPrintDto.templateId = this.selectedTemplate.templeteId;
    this.requestPrintDto.templateText = this.selectedTemplate.templeteText;
    this.requestPrintDto.templateTypeId = this.selectedTemplate.cmsType.commonTempleteTypeId;
    this.requestPrintDto.itemId = -1;
    this.printComponent.active = true;
  }

}
