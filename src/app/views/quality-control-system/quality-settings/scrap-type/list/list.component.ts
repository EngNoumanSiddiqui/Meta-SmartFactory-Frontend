import { Component, OnInit, ViewChild } from '@angular/core';
import { ScrapTypeService } from 'app/services/dto-services/scrap-type.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MenuItem } from 'primeng';
import { ConvertUtil } from 'app/util/convert-util';
import { environment } from 'environments/environment';
import { UsersService } from 'app/services/users/users.service';
import { AppStateService } from 'app/services/dto-services/app-state.service';
import { BookType } from 'xlsx/types';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})

export class ListComponent implements OnInit {
  scrapTypes: any[];
  selectedParts: any;
  @ViewChild('myModal') public myModal: ModalDirective;
  classReOrder = ['asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc'];
  showLoader = false;

  partModal = {
    modal: null,
    id: null
  };
  selectedColumns = [
    { field: 'scrapTypeId', header: 'scrap-type-id' },
    { field: 'scrapCode', header: 'scrap-code' },
    { field: 'typeScrap', header: 'type-scrap' },
    { field: 'typeRework', header: 'type-rework' },
    { field: 'scrapDescription', header: 'scrap-description' }
  ];
  cols = [
    { field: 'scrapTypeId', header: 'scrap-type-Id' },
    { field: 'scrapCode', header: 'scrap-code' },
    { field: 'typeScrap', header: 'type-scrap' },
    { field: 'typeRework', header: 'type-rework' },
    { field: 'scrapDescription', header: 'scrap-description' }
  ];

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

  pageFilter = {
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    query: null,
    typeScrap: null,
    typeRework: null,
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

  constructor(private scrapTypeSvc: ScrapTypeService,
    private loaderService: LoaderService,
    private _translateSvc: TranslateService,
    private _confirmationSvc: ConfirmationService,
    private utilities: UtilitiesService,
    private appStateService: AppStateService,
    private _userSvc: UsersService) {
    // const setPlant = this._userSvc.getPlant();
    // let selectedPlant = JSON.parse(setPlant);
    // if (selectedPlant) {
    //   this.pageFilter.plantId = selectedPlant.plantId;
    // }
  }
  ngOnInit() {
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


  filter(data) {
    this.loaderService.showLoader();
    this.scrapTypeSvc.filter(data)
      .then(result => {
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.scrapTypes = result['content'];
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
        this.scrapTypeSvc.delete(id)
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

  IsaddnewDisabled = () => {
    if (!this.scrapTypes) {
      return false;
    }
    if (this.scrapTypes.length === 0) { return false; }
    const a = this.scrapTypes.filter(itm => itm.typeScrap === true);
    if (a.length >= 5) {
      return true;
    }
    const b = this.scrapTypes.filter(itm => itm.typeScrap === true);
    if (b.length >= 5) {
      return true;
    }
    return false;
    // return (this.scrapTypes.filter(itm => itm.typeScrap === true).length >= 4) || (this.scrapTypes.filter(itm => itm.typeRework === true).length >= 4)
  }


  exportCSV(selected: boolean = false, type: BookType = 'csv') {
    if(selected) {
      const mappedDAta = this.selectedParts.map(itm => {
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
      this.scrapTypeSvc.filter({...this.pageFilter, pageNumber: 1, pageSize: this.pagination.totalElements})
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
