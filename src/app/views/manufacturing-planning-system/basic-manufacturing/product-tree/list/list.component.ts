import { AppStateService } from 'app/services/dto-services/app-state.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, switchMap } from 'rxjs/operators';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { ProductDetailItemCommunicatingService } from '../../product-detail-item.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { environment } from 'environments/environment';
import { Subject, Subscription } from 'rxjs';
import { ConfirmationService, MenuItem } from 'primeng';
import { EnumPOrderStatusService } from 'app/services/dto-services/enum/p-order-status.service';
import { ProductTreeService } from 'app/services/dto-services/product-tree/prod-tree.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';

import { ConvertUtil } from 'app/util/convert-util';
import { BookType } from 'xlsx/types';


// TODO: Status check edilecek hangi enum status

@Component({
  selector: 'product-tree-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListProductTreeComponent implements OnInit, OnDestroy {
  @ViewChild('myModal') public myModal: ModalDirective;
  productTreeModal = {
    modal: null,
    id: null,
    data: null,
    active: false
  };
  pagination = {
    totalElements: 0,
    currentPage: 1,
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    totalPages: 1,
    rows: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    TotalPageLinkButtons: 5,
    RowsPerPageOptions: [10, 20, 30, 50, 100, 1000],
    tag: ''
  };

  menuItems: MenuItem[] = [
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
  selecteMenuItems: MenuItem[] = [
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
    status: null,
    materialId: null,
    productTreeId: null,
    materialName: null,
    revisionNo: null,
    startDate: null,
    expiryDate: null,
    plantId: null,
    query: null,
    orderByProperty: 'productTreeId',
    orderByDirection: 'desc',
    createDate: null,
    description: null,
    updateDate: null
  };

  classReOrder = ['asc', 'asc', 'asc', 'asc'];

  productTreees = [];
  selectedProductTreees = [];
  listProductionTreeStatus;
  showLoader = false;
  private searchTerms = new Subject<any>();
  selectedColumns = [
    { field: 'productTreeId', header: 'product-tree-id' },
    { field: 'materialId', header: 'stock-id' },
    { field: 'materialNo', header: 'stock-no' },
    { field: 'material', header: 'stock-name' },
    { field: 'revisionNo', header: 'revision-no' },
    { field: 'description', header: 'description' },
    { field: 'startDate', header: 'start-date' },
    { field: 'expiryDate', header: 'expiry-date' },
    { field: 'status', header: 'status' }
  ];
  cols = [
    { field: 'productTreeId', header: 'product-tree-id' },
    { field: 'materialId', header: 'stock-id' },
    { field: 'materialNo', header: 'stock-no' },
    { field: 'material', header: 'stock-name' },
    { field: 'startDate', header: 'start-date' },
    { field: 'expiryDate', header: 'expiry-date' },
    { field: 'status', header: 'status' },
    { field: 'revisionNo', header: 'revision-no' },
    { field: 'estimatedCost', header: 'estimated-cost' },
    { field: 'finalCost', header: 'final-cost' },
    { field: 'description', header: 'description' },
    // { field: 'plant', header: 'plant' },
    // { field: 'plantId', header: 'plant-id' },
    { field: 'workstation', header: 'workstation' },
    { field: 'lastModeDate', header: 'last-mode-date' },

  ];
  sub: Subscription;
  savedOrEditedItem = false;
  constructor(private _confirmationSvc: ConfirmationService,
    private _enumPTreeSvc: EnumPOrderStatusService,
    private _productTreeSvc: ProductTreeService,
    private _translateSvc: TranslateService,
    private appStateSvc: AppStateService,
    public prodDetailCommunicatingService: ProductDetailItemCommunicatingService,
    private loaderService: LoaderService, private utilities: UtilitiesService) {

  }

  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = null;
    }
    // if (field === 'materialId') {

    // }
    this.pageFilter[field] = value;

    this.filter(this.pageFilter);
  }

  modalShow(id, mod: string, data) {
    console.log(data)
    this.productTreeModal.id = id;
    this.productTreeModal.modal = mod;
    this.productTreeModal.data = data;
    this.productTreeModal.active = true;

  }
  modalClone(mod: string, data) {
    // this.productTreeModal.id = id;
    this.productTreeModal.modal = mod;
    this.productTreeModal.data = data;
    this.productTreeModal.active = true;
  }
  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this._productTreeSvc.filter(term))).subscribe(
        result => {
          this.pagination.currentPage = result['currentPage'];
          this.pagination.totalElements = result['totalElements'];
          this.pagination.totalPages = result['totalPages'];
          this.selectedProductTreees = [];
          this.productTreees = result['content'];
          this.loaderService.hideLoader();
        },
        error => {
          this.utilities.showErrorToast(error)
          this.loaderService.hideLoader();
        }
      );
    // console.log('PageFilter =====>', this.pageFilter)
    this.sub = this.appStateSvc.plantAnnounced$.subscribe((res: any) => {
      if ((res) && res.plantId) {
        this.pageFilter.plantId = res.plantId;
        this.filter(this.pageFilter);
      }
    });
    this._enumPTreeSvc.getProductTreeStatusEnums().then(result => {
      this.listProductionTreeStatus = result;

    }).catch(error => console.log(error));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  filter(data) {
    this.loaderService.showLoader();
    this.searchTerms.next(data);
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
      status: null,
      materialId: null,
      productTreeId: null,
      materialName: null,
      revisionNo: null,
      startDate: null,
      expiryDate: null,
      plantId: this.pageFilter.plantId,
      query: null,
      orderByProperty: 'productTreeId',
      orderByDirection: 'desc',
      createDate: null,
      description: null,
      updateDate: null
    };
    this.filter(this.pageFilter);
  }

  OnPrdTreeModalClose() {
    this.productTreeModal.active = false;
    if (this.savedOrEditedItem === true) {
      this.productTreeModal.data = null;
      this.productTreeModal.modal = null;
      this.filter(this.pageFilter);
      this.savedOrEditedItem = false;
    }
    this.prodDetailCommunicatingService.seletedProdDTItem = null;
  }

  delete(id) {
    console.log(id);
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this._productTreeSvc.delete(id)
          .then(() => {
            this.utilities.showInfoToast('deleted-success');
            this.filter(this.pageFilter);
          })
          .catch(error => this.utilities.showErrorToast(error));
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    })
  }

  showMaterialDetailDialog(stockId: any) {
    if (stockId) {
      this.loaderService.showDetailDialog(DialogTypeEnum.STOCK, stockId);
    }
  }

  showPlantDetailDialog(plantId: any) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PLANT, plantId);
  }


  exportCSV(selected: boolean = false, type: BookType = 'csv') {
    if (selected) {
      const mappedDAta = this.selectedProductTreees.map(itm => {
        const obj = {};
        this.selectedColumns.forEach(col => {
          if (col.field === 'materialId') {
            obj[this._translateSvc.instant(col.header)] = itm.material?.stockId || '';
          } else if (col.field === 'materialNo') {
            obj[this._translateSvc.instant(col.header)] = itm.material?.stockNo || '';
          } else if (col.field === 'material') {
            obj[this._translateSvc.instant(col.header)] = itm.material?.stockName || '';
          } else if (col.field === 'startDate') {
            obj[this._translateSvc.instant(col.header)] = itm.startDate ? new Date(itm.startDate).toLocaleDateString() : '';
          } else if (col.field === 'expiryDate') {
            obj[this._translateSvc.instant(col.header)] = itm.expiryDate ? new Date(itm.expiryDate).toLocaleDateString() : '';
          } else if (itm.hasOwnProperty(col.field)) {
            obj[this._translateSvc.instant(col.header)] = itm[col.field];
          }
        });
        return (obj);
      });
      this.appStateSvc.exportAsFile(mappedDAta, type, 'ProductTrees');
    } else {
      this.loaderService.showLoader();
      this._productTreeSvc.filter({ ...this.pageFilter, pageNumber: 1, pageSize: this.pagination.totalElements })
        .then(result => {
          const mappedDAta = result['content'].map(itm => {
            const obj = {};
            this.selectedColumns.forEach(col => {
              if (col.field === 'materialId') {
                obj[this._translateSvc.instant(col.header)] = itm.material?.stockId || '';
              } else if (col.field === 'materialNo') {
                obj[this._translateSvc.instant(col.header)] = itm.material?.stockNo || '';
              } else if (col.field === 'material') {
                obj[this._translateSvc.instant(col.header)] = itm.material?.stockName || '';
              } else if (col.field === 'startDate') {
                obj[this._translateSvc.instant(col.header)] = itm.startDate ? new Date(itm.startDate).toLocaleDateString() : '';
              } else if (col.field === 'expiryDate') {
                obj[this._translateSvc.instant(col.header)] = itm.expiryDate ? new Date(itm.expiryDate).toLocaleDateString() : '';
              } else if (itm.hasOwnProperty(col.field)) {
                obj[this._translateSvc.instant(col.header)] = itm[col.field];
              }
            });
            return (obj);
          });
          this.appStateSvc.exportAsFile(mappedDAta, type, 'ProductTrees');
          this.loaderService.hideLoader();
        }, err => {
          this.utilities.showErrorToast(err);
          this.loaderService.hideLoader();
        })
    }
  }
}

