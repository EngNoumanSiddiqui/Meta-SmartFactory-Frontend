import {Component, OnInit, ViewChild, ChangeDetectorRef} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { ProductTreeService } from 'app/services/dto-services/product-tree/prod-tree.service';
import { AppStateService } from 'app/services/dto-services/app-state.service';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { environment } from 'environments/environment';
import { Subject } from 'rxjs';
import { ConfirmationService, MenuItem } from 'primeng';
import { EnumStockStatusService } from 'app/services/dto-services/enum/stock-status.service';
import { StockTypeService } from 'app/services/dto-services/stock-type/stock-type.service';
import { StockCardService } from 'app/services/dto-services/stock/stock.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import { ConvertUtil } from 'app/util/convert-util';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { BookType } from 'xlsx/types';
@Component({
  selector: 'material-list-page',
  templateUrl: './list.component.html'
})
export class ListMaterialCardComponent implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;
  isCloneDisable = false;
  materialCardModal = {
    modal: null,
    id: null,
    data: null
  };
  treeListDialog = false;
  productTreeListForDialog = [];
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
  isSaveAndNew: boolean;
  modal = {active: false};
  selectedStocks: any = [];
  pageFilter = {
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? environment.filterRowSize : 10,
    stockTypeName: null,
    stockTypeId: null,
    stockId: null,
    autoCreated: false,
    plantId: null,
    stockName: null,
    stockGroupName: null,
    baseUnit: null,
    query: null,
    orderByProperty: 'stockId',
    orderByDirection: 'desc',
    status: 'ACTIVE'
  };

  classReOrder = ['asc', 'asc', 'asc'];
  selectedColumns = [
    {field: 'stockId', header: 'stock-id'},
    {field: 'stockNo', header: 'stock-no'},
    {field: 'stockName', header: 'stock-name'},
    {field: 'stockName2', header: 'stock-name-2'},
    {field: 'stockName3', header: 'stock-name-3'},
    // {field: 'locationNo', header: 'location-no'},
    {field: 'stockTypeName', header: 'type'},
    {field: 'stockStatus', header: 'status'},
    {field: 'baseUnit', header: 'base-unit'},
    {field: 'buy/make', header: 'buy/make'},
    // {field: 'productTreeList', header: 'product-tree-list'},
    // {field: 'stockGroupName', header: 'material-group'},
    // {field: 'grossWeight', header: 'gross-weight'},
    // {field: 'dimensionUnit', header: 'dimension-unit'},

  ];

  cols = [
    {field: 'stockId', header: 'stock-id'},
    {field: 'stockTypeOneName', header: 'class-2'},
    {field: 'stockTypeTwoName', header: 'class-3'},
    {field: 'locationNo', header: 'location-no'},
    {field: 'stockName', header: 'stock-name'},
    {field: 'stockName2', header: 'stock-name-2'},
    {field: 'stockName3', header: 'stock-name-3'},
    {field: 'stockNo', header: 'stock-no'},
    {field: 'autoCreated', header: 'auto-created'},
    
    {field: 'productTreeList', header: 'product-tree-list'},
    {field: 'baseUnit', header: 'base-unit'},
    {field: 'stockGroupName', header: 'material-group'},
    {field: 'stockTypeName', header: 'type'},
    {field: 'grossWeight', header: 'gross-weight'},
    {field: 'netWeight', header: 'net-weight'},
    {field: 'volume', header: 'volume'},
    {field: 'volumeUnit', header: 'volume-unit'},
    {field: 'thickness', header: 'thickness'},
    {field: 'buy/make', header: 'buy/make'},
    {field: 'length', header: 'length'},
    {field: 'height', header: 'height'},
    {field: 'dimensionUnit', header: 'dimension-unit'},
    {field: 'stockStatus', header: 'status'},
  ];
  materials = [];

  listStockStatus;
  listStockTypes;
  materialGroupList;
  showLoader = false;

  
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

  private searchTerms = new Subject<any>();
  constructor(private _confirmationSvc: ConfirmationService,
              private _enumStockStatus: EnumStockStatusService,
              private _translateSvc: TranslateService,
              private _stockTypesSvc: StockTypeService,
              private _stockSvc: StockCardService,
              private utilities: UtilitiesService,
              private cdx: ChangeDetectorRef,
              private svcProductTree: ProductTreeService,
              private appStateService: AppStateService,
              private loaderService: LoaderService) {
            
  }

  modalShow(id, mod: string, data) {
    this.materialCardModal.id = id;
    this.materialCardModal.modal = mod;
    this.materialCardModal.data = data;
    this.selectedStocks = [];
    this.selectedStocks.push({...data});

    this.modal.active = true;
  }

  modalClone(mod: string, data) {
    // this.productTreeModal.id = id;
    this.materialCardModal.modal = mod;
    this.materialCardModal.data = data[0];
    this.modal.active = true;
  }
  cloneActivate(event) {
    if (event === true) {
      this.isCloneDisable = true;
    }
     console.log('rowActivate', event);
    // this.modalShow(id,'CLONE');
  }

  ngOnInit() {
    this._enumStockStatus.getEnumList().then(result => this.listStockStatus = result).catch(error => console.log(error));
    this._stockTypesSvc.getIdNameList().then(result => this.listStockTypes = result).catch(error => console.log(error));
    this._stockSvc.getMaterialGroupList().then(result => this.materialGroupList = result).catch(error => console.log(error));

    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this._stockSvc.filterObservable(term))).subscribe(
      result => {
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.materials = result['content'];
        // if (this.selectedStocks) {
          this.selectedStocks = [];
        // }
        if (this.materials.length > 0 && this.pageFilter.stockTypeName === 'Finished Products') {
          this.materials = this.materials.filter(itm => itm.stockTypeName !== 'Semifinished Products');
        }
        this.cdx.markForCheck();
        this.loaderService.hideLoader();
      },
      error => {
        this.utilities.showErrorToast(error);
        this.loaderService.hideLoader();
        this.materials = [];
      }
    );
    // this.filter(this.pageFilter);

    this.appStateService.plantAnnounced$.subscribe(res => {
      if ((res) && res.plantId) {
        this.pageFilter.plantId = res.plantId;
        this.filter(this.pageFilter);
      } else {
        this.pageFilter.plantId = null;
      }
      
    });

  }

  filter(data) {
    this.pageFilter.pageNumber = 1;
    this.search(data);
  }

  search(data) {
    this.loaderService.showLoader();

    const tempDto = Object.assign({}, data);
    tempDto.stockTypeName = null;
    tempDto.stockTypeId = null;
    this.searchTerms.next(tempDto);
  }

  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = null;
    }
    if(field === 'stockTypeName' && value) {
      this.pageFilter['includeMaterialTypeList'] = [+value];
    } else if(field === 'stockTypeName' && !value) {
      this.pageFilter['includeMaterialTypeList'] = null;
    } else {
      this.pageFilter[field] = value;
    }

    this.filter(this.pageFilter);
  }

  SaveActionFire(isSaveAndNew: boolean) {
    this._stockSvc.saveAction$.next();
    this.isSaveAndNew = isSaveAndNew;
  }

  onSaveSuccessful(event, myModal) {
    if(this.selectedStocks) {
      this.selectedStocks.length = 0;
    }
    if (this.isSaveAndNew) {
      this.modal.active = true;
      this.materialCardModal.modal = 'NEW';
      myModal.show();
      this.isSaveAndNew = false;
    } else {
      myModal.hide();
    }
    this.search(this.pageFilter);
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

    this.search(this.pageFilter)
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

  onModalHide() {
   if (this.materialCardModal.modal !== 'DETAIL') {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-save-before-exit'),
      header: this._translateSvc.instant('close-confirmation'),
      icon: 'fa fa-info',
      accept: () => {
        this._stockSvc.saveAction$.next();
      },
      reject: () => {
        this.myModal.hide();
        this.modal.active = false;
      }
    });
   } else {
     this.myModal.hide();
   }
  }
  resetFilter() {
    this.pageFilter = {
      pageNumber: 1,
      pageSize: this.pageFilter.pageSize,
      stockTypeName: null,
      stockTypeId: null,
      stockId: null,
      autoCreated: false,
      plantId: this.pageFilter.plantId,
      stockName: null,
      baseUnit: null,
      stockGroupName: null,
      query: null,
      orderByProperty: 'stockId',
      orderByDirection: 'desc',
      status: null
    };
    this.filter(this.pageFilter);
  }

  delete(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this._stockSvc.delete(id)
          .then(() => {
            this.utilities.showInfoToast('deleted-success');
            this.search(this.pageFilter);
          })
          .catch(error => this.utilities.showErrorToast(error));
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    })
  }
  showProductTreeDetail(materialId) {
    // this.productTreeListForDialog = productTreeList;
    // this.treeListDialog = true;
    this.loaderService.showLoader();
    // // this.treeListDialog = true;

    this.svcProductTree.filter({materialId: materialId, pageNumber: 1, pageSize: 9999}).then(res => {
      this.productTreeListForDialog = res['content'];
      this.treeListDialog = true;
      this.loaderService.hideLoader();
    }).catch(err => { console.error(err); this.loaderService.hideLoader(); });
    // forkJoin(this.productTreeListForDialog.map(prdTree => this.svcProductTree.getObservable(prdTree.productTreeId)))
    // // .pipe(
    // //   tap(productTrees => console.log('product Treess', JSON.stringify(productTrees)))
    // // );
    // .subscribe(trees => {
    //   this.productTreeListForDialog = trees;
    //   this.loaderService.hideLoader();
    //   this.treeListDialog = true;
    // })
    // first we will show list of product tree and then use will click on any item in list
    // then this details Product tree will open by productTreeId
    // this.loaderService.showDetailDialog(DialogTypeEnum.PRODUCTTREE, productTreeId);

  }
  OpenProductTreeDetails(productTreeId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PRODUCTTREE, productTreeId);
  }
  OpenMaterialDetails(stockId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.STOCK, stockId);
  }
  OpenWorkSDetails(wsId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.WORKSTATION, wsId);
  }

  exportCSV(selected=false, type: BookType) {
    if(selected) {
        const mappedDAta = this.selectedStocks.map(itm => {
          const obj = {};
          this.selectedColumns.forEach(col => {
            if(itm.hasOwnProperty(col.field)) {
              obj[this._translateSvc.instant(col.header)] = itm[col.field] ? itm[col.field] : '';
            }
          })
          return (obj);
        });
        this.appStateService.exportAsFile(mappedDAta, type, 'material-masters');
    } else {
      this.loaderService.showLoader();
      this._stockSvc.filterObservable({...this.pageFilter, pageNumber: 1,
        pageSize: this.pagination.totalElements}).subscribe(result => {
          this.loaderService.hideLoader();
          const mappedDAta = result['content'].map(itm => {
            const obj = {};
            this.selectedColumns.forEach(col => {
              if(itm.hasOwnProperty(col.field)) {
                obj[this._translateSvc.instant(col.header)] = itm[col.field] ? itm[col.field] : '';
              }
            })
            return (obj);
          });
          this.appStateService.exportAsFile(mappedDAta, type, 'material-masters');
        }, err => {
          this.utilities.showErrorToast(err);
          this.loaderService.hideLoader();
        });
    }
  }

}

