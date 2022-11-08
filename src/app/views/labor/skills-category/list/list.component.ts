import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService, Message} from 'primeng';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {UtilitiesService} from 'app/services/utilities.service';
import {LoaderService} from 'app/services/shared/loader.service';
import {environment} from '../../../../../environments/environment';
import {ConvertUtil} from 'app/util/convert-util';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { SkillCategoryService } from 'app/services/dto-services/employee/skill-category.service';
import { switchMap, debounceTime } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { AppStateService } from 'app/services/dto-services/app-state.service';

@Component({
  selector: 'skill-category-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class SkillCategoryListComponent implements OnInit, OnDestroy {

  @ViewChild('myModal') public myModal: ModalDirective;
  categoryModal = {
    modal: null,
    id: null
  };
  selectedskillcategory;
  selectedColumns = [
    {field: 'skillMatrixCategoryId', header: 'category-id'},
    {field: 'skillMatrixCategoryCode', header: 'category-code'},
    {field: 'groupType', header: 'group-type'},
    
    {field: 'skillMatrixCategoryDescription', header: 'description'},
    {field: 'createDate', header: 'create-date'},
    {field: 'updateDate', header: 'update-date'}
  ];
  cols = [
    {field: 'skillMatrixCategoryId', header: 'category-id'},
    {field: 'skillMatrixCategoryCode', header: 'category-code'},
    {field: 'groupType', header: 'group-type'},
    {field: 'skillMatrixCategoryDescription', header: 'description'},
    {field: 'createDate', header: 'create-date'},
    {field: 'updateDate', header: 'update-date'}
  ];
  classReOrder = ['asc', 'asc', 'asc', 'asc'];
  skillcategories = [] = [];
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
    orderByDirection: null,
    orderByProperty: null,
    query: null,
    createDate: null,
    plantId: null,
    groupType: null,
    skillMatrixCategoryCode: null,
    skillMatrixCategoryDescription: null,
    skillMatrixCategoryId: null
  };
  private searchTerms = new Subject<any>();
  sub: Subscription;
  selectedPlant: any;
  constructor(private _confirmationSvc: ConfirmationService,
              private _router: Router,
              private _translateSvc: TranslateService,
              private skillCategorySrv: SkillCategoryService,
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
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.skillCategorySrv.filterObservable(term))).subscribe(result => {
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.skillcategories = result['content'];
        this.loaderService.hideLoader();
      }, error => {
        this.loaderService.hideLoader();
        this.skillcategories = [];
      }
    );
    this.filter(this.pageFilter);
  }
  ngOnDestroy() {
    if(this.sub) {
      this.sub.unsubscribe();
    }
  }


  filter(data) {
    this.pageFilter.pageNumber = 1;
    this.search(data);
  }
  search(data) {
    this.loaderService.showLoader();

    const temp = Object.assign({}, data);

    if (temp.createDate) {
      temp.createDate = ConvertUtil.localDateShiftAsUTC(temp.createDate);
    } if (temp.endDate) {
      temp.endDate = ConvertUtil.date2EndOfDay(temp.endDate);
      temp.endDate = ConvertUtil.localDateShiftAsUTC(temp.endDate);
    }
    this.searchTerms.next(temp);
  }

  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = null;
    }
    this.pageFilter[field] = value;
    this.filter(this.pageFilter);
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
    this.search(this.pageFilter);
  }

  reOrderData(id, item: string) {
    if (item === 'capabilityCode') {
      this.pageFilter.orderByProperty = 'et.capabilityCode';
    } else {
      this.pageFilter.orderByProperty = item;
    }
    if (this.classReOrder[id] === 'asc') {
      this.classReOrder[id] = 'desc';
    } else {
      this.classReOrder[id] = 'asc';
    }
    this.pageFilter.orderByDirection = this.classReOrder[id];
    this.filter(this.pageFilter);
  }

  modalShow(id, mod: string) {
    console.log('@OnEdit', id, mod);
    this.categoryModal.id = id;
    this.categoryModal.modal = mod;
    this.myModal.show();
  }

  delete(id) {
    console.log(id);
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this.skillCategorySrv.delete(id)
          .then(() => {
            this.utilities.showSuccessToast('deleted-success');
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
