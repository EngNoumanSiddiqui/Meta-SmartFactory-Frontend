import {Component, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ActService} from '../../../services/dto-services/act/act.service';
import {ConfirmationService} from 'primeng';
import {EnumActStatusService} from '../../../services/dto-services/enum/act-status.service';
import {ActTypeService} from '../../../services/dto-services/act-type/act-type.service';
import {environment} from '../../../../environments/environment';
import {LoaderService} from '../../../services/shared/loader.service';
import {Subject} from 'rxjs';
import {debounceTime, switchMap} from 'rxjs/operators'

import {ModalDirective} from 'ngx-bootstrap/modal';
import {UtilitiesService} from '../../../services/utilities.service';
import {EnumActPositionService} from '../../../services/dto-services/enum/act-position.service';
import {ConvertUtil} from '../../../util/convert-util';
import { CompanyService } from 'app/services/dto-services/company/company.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
@Component({
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [ConfirmationService]
})
export class ListCompanyComponent implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;
  companyModal = {
    modal: null,
    data: null,
    id: null
  };


  selectedColumns = [
    {field: 'companyId', header: 'company-id'},
    {field: 'companyName', header: 'company-name'},
    {field: 'companyCode', header: 'company-code'},
    {field: 'countryName', header: 'country'},
    {field: 'cityName', header: 'city'},
    // {field: 'companyAddress', header: 'company-address'},
    {field: 'postcode', header: 'post-code'},
    {field: 'address', header: 'address'}
  ];
  cols = [
    {field: 'companyId', header: 'company-id'},
    {field: 'companyName', header: 'company-name'},
    {field: 'companyCode', header: 'company-code'},
    {field: 'countryName', header: 'country'},
    {field: 'cityName', header: 'city'},
    {field: 'companyAddress', header: 'company-address'},
    {field: 'postcode', header: 'post-code'},
    {field: 'address', header: 'address'}
  ];

  showLoader = false;
  // pagination = {
  //   totalElements: 0,
  //   currentPage: 1,
  //   pageNumber: 1,
  //   pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
  //   totalPages: 1,
  //   rows: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
  //   TotalPageLinkButtons: 5,
  //   RowsPerPageOptions: [10, 20, 30, 50, 100, 1000],
  //   tag: ''
  // };

  // pageFilter = {
  //   pageNumber: 1,
  //   pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
  //   actName: null,
  //   actNo: null,
  //   actStatus: null,
  //   actTypeName: null,
  //   contactName: null,
  //   accountPosition: null,
  //   query: null,
  //   orderByProperty: null,
  //   orderByDirection: 'desc'
  // };

  classReOrder = ['asc', 'asc', 'asc', 'asc'];

  companies = [];
  listActStatus;
  listActTypes;
  listAccountPosition;
  modal = {active: false};
  display = false;

  selectedcompanies = [];
  private searchTerms = new Subject<any>();
  isSaveAndNew: boolean;

  modalShow(id, mod: string, data?) {
    this.companyModal.id = id;
    this.companyModal.modal = mod;
    this.companyModal.data = data;
    this.modal.active = true;
  }

  SaveActionFire(isSaveAndNew: boolean) {
    this.companyService.saveAction$.next();
    this.isSaveAndNew = isSaveAndNew;
  }

  modalClone(mod: string, data) {
    // this.productTreeModal.id = id;
    this.companyModal.modal = mod;
    this.companyModal.data = data[0].stockId;
    this.modal.active = true;
  }
  onSaveSuccessful(event, myModal) {
    myModal.hide();
    this.filter();
    if (this.isSaveAndNew) {
      this.modal.active = true;
      this.companyModal.modal = 'NEW';
      myModal.show();
    }
    this.companyModal.id = null;
    this.isSaveAndNew = false;
    this.selectedcompanies = null;
  }
  constructor(private _confirmationSvc: ConfirmationService,
              private _translateSvc: TranslateService,
              private companyService: CompanyService,
              private loaderService: LoaderService,
              private utilities: UtilitiesService) {

  }

  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.companyService.getAllCompaniesObservable())).subscribe(
      result => {
        this.companies = result;
        this.loaderService.hideLoader();
      },
      error => {
        this.utilities.showErrorToast(error);
        this.loaderService.hideLoader();
        this.companies = [];
      }
    );
    this.filter();


  }
  filter() {
    // this.pageFilter.pageNumber = 1;
    this.search();
  }

  search() {
    this.loaderService.showLoader();
    this.searchTerms.next();
  }
  delete(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this.companyService.delete(id)
          .then(() => {
            this.utilities.showSuccessToast('deleted-success');
            this.filter();
          })
          .catch(error => this.utilities.showErrorToast(error));
      },
      reject: () => {
        this.utilities.showWarningToast('cancelled-operation');
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

