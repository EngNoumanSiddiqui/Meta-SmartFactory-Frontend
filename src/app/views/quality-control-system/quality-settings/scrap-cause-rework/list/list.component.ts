import { Component, OnInit, ViewChild } from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { ScrapCauseService } from 'app/services/dto-services/scrap-services/scrap-cause.service';
import { environment } from 'environments/environment';
import { ConvertUtil } from 'app/util/convert-util';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Subject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { UsersService } from 'app/services/users/users.service';
import { AppStateService } from 'app/services/dto-services/app-state.service';
import { BookType } from 'xlsx/types';

@Component({
  selector: 'app-cause-rework-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ScrapCauseListComponent implements OnInit {
  scrapTypes: any[];
  selectedParts:any;
  @ViewChild('myModal') public myModal: ModalDirective;
  classReOrder = ['asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc'];
  showLoader = false;
  partModal = {
    modal: null,
    id: null
  };


  menuItems:MenuItem[] = [
    {
      label: this._translateSvc.instant('export-csv'), icon: 'fa fa-file-archive-o', 
      command: () => {
        this.exportCSV(false, 'csv');
      }
    },
    {
      label: this._translateSvc.instant('export-excel'), icon: 'fa b-fa-file-excel', 
      command: () => {
        this.exportCSV(false, 'xlsx');
      }
    }
  ];
  selecteMenuItems:MenuItem[] = [
    {
      label: this._translateSvc.instant('export-csv'), icon: 'fa fa-file-archive-o', 
      command: () => {
        this.exportCSV(true, 'csv');
      }
    },
    {
      label: this._translateSvc.instant('export-excel'), icon: 'fa b-fa-file-excel', 
      command: () => {
        this.exportCSV(true, 'xlsx');
      }
    }
  ];

  selectedColumns = [
    {field: 'scrapCauseId', header: 'rework-cause-id', index:1},
    {field: 'scrapCauseName', header: 'rework-cause-name', index:2},
    {field: 'scrapCode', header: 'rework-code', index:3},
    {field: 'scrapDescription', header: 'rework-description', index:3},
    {field: 'scrapType', header: 'rework-type', index:4}
  ];
  
  
  cols = [
    {field: 'scrapCauseId', header: 'scrap-cause-id', index:1},
    {field: 'scrapCauseName', header: 'scrap-cause-name', index:2},
    {field: 'scrapCode', header: 'scrap-code', index:3},
    {field: 'scrapDescription', header: 'scrap-description', index:4},
    {field: 'scrapType', header: 'scrap-type', index:5},
    {field: 'createDate', header: 'create-date', index:6},
    {field: 'updateDate', header: 'update-date', index:7}
  ];
  pageFilter = {
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    scrapCauseId: null,
    scrapCauseName: null,
    scrapCode: null,
    scrapDescription: null,
    scrapTypeId: null,
    scrapTypeName: null,
    query: null,
    type:"REWORK",
    orderByProperty: 'scrapCauseId',
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
  scrapCauses = [];
  selectedCauses = [];
  private searchTerms = new Subject<any>();
  sub: any;
  constructor(
    private scrapCauseService: ScrapCauseService,
    private loaderService: LoaderService,
    private appStateService: AppStateService,
    private _translateSvc: TranslateService,
    private _confirmationSvc: ConfirmationService,
    private utilities: UtilitiesService,
    private _userSvc: UsersService
  ) {
    // const setPlant = this._userSvc.getPlant();
    // let selectedPlant = JSON.parse(setPlant);
    // if (selectedPlant) {
    //   this.pageFilter.plantId = selectedPlant.plantId;
    // }
  }
  ngOnInit() {

    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.scrapCauseService.filterObservable(this.pageFilter))).subscribe(
      (result: any) => {
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.scrapCauses = result['content'];
        this.loaderService.hideLoader();
      },
      error => {
        this.scrapCauses = [];
        this.utilities.showErrorToast(error);
        this.loaderService.hideLoader();
      }
    );

    this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
      if (res) {
        this.pageFilter.plantId = res.plantId;
        this.filter(this.pageFilter);
      }
    });

    // this.filter(this.pageFilter);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = null;
    }
    if (field === 'scrapType') {
      this.pageFilter.scrapTypeName = value;
    } else {
      this.pageFilter[field] = value;
    }

    this.filter(this.pageFilter);
  }

  // FILTERING AREA
  filtingAreaColumns (event) {
    this.selectedColumns.sort(function (a: any, b: any) { return (a.index > b.index) ? 1 : ((b.index > a.index) ? -1 : 0); });
  }
  
  filter(data) {
    this.pageFilter.pageNumber = 1;
    this.search(this.pageFilter);
  }
  search(data) {
    this.loaderService.showLoader();
    const temp: any = {};
    Object.assign(temp, data);
    if (temp.createDate) {
      temp.createDate = ConvertUtil.localDate2UTC(temp.createDate);
    }
    if (temp.updateDate) {
      temp.updateDate = ConvertUtil.localDate2UTC(temp.updateDate);
    }
    this.searchTerms.next(temp);
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
      this.search(this.pageFilter);
    }, 2500);
  }

  modalShow(id, mod: string) {
    // console.log('@call', id, mod);
      this.partModal.id = id;
      this.partModal.modal = mod;
      this.myModal.show();
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
        this.scrapCauseService.delete(id)
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

  exportCSV(selected: boolean = false, type: BookType = 'csv') {
    if(selected) {
      const mappedDAta = this.selectedCauses.map(itm => {
        const obj = {};
        this.selectedColumns.forEach(col => {
          if(col.field === 'scrapType') {
            obj[this._translateSvc.instant(col.header)] = itm.scrapType?.scrapDescription;
          } else if(itm.hasOwnProperty(col.field)) {
              obj[this._translateSvc.instant(col.header)] = itm[col.field];
          }
        });
        return (obj);
      });
      this.appStateService.exportAsFile(mappedDAta, type, 'ScrapCause');
    } else {
      this.loaderService.showLoader();
      this.scrapCauseService.filter({...this.pageFilter, pageNumber: 1, pageSize: this.pagination.totalElements})
      .then(result => {
        const mappedDAta = result['content'].map(itm => {
          const obj = {};
          this.selectedColumns.forEach(col => {
            if(col.field === 'scrapType') {
              obj[this._translateSvc.instant(col.header)] = itm.scrapType?.scrapDescription;
            } else if(itm.hasOwnProperty(col.field)) {
                obj[this._translateSvc.instant(col.header)] = itm[col.field];
            }
          });
          return (obj);
        });
        this.appStateService.exportAsFile(mappedDAta, type, 'ScrapCause');
        this.loaderService.hideLoader();
      }, err => {
        this.utilities.showErrorToast(err);
        this.loaderService.hideLoader();
      })
    }
   
  }
}
