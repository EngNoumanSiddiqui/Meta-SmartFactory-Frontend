import { AppStateService } from 'app/services/dto-services/app-state.service';
import { Component, OnInit, ViewChild, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { debounceTime, switchMap } from 'rxjs/operators';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { environment } from 'environments/environment';
import { Subject, Subscription } from 'rxjs';
import { EnumPOrderStatusService } from 'app/services/dto-services/enum/p-order-status.service';
import { ProductTreeService } from 'app/services/dto-services/product-tree/prod-tree.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';

import { ConvertUtil } from 'app/util/convert-util';


// TODO: Status check edilecek hangi enum status

@Component({
  selector: 'product-tree-pane',
  templateUrl: './product-tree-pane.component.html',
  styleUrls: ['./product-tree-pane.component.scss']
})
export class ProductTreePaneComponent implements OnInit, OnDestroy {
  @ViewChild('myModal') public myModal: ModalDirective;

  @Output() selectedEvent = new EventEmitter<any>();

  @Input('materialId') set setmaterialId( materialId ) {
    this.pageFilter.materialId = materialId;
    this.filter(this.pageFilter);
  };
  @Input('materialName') set setmaterialName( materialName ) {
    this.pageFilter.materialName = materialName;
    this.filter(this.pageFilter);
  };

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
    pageSize: 10,
    totalPages: 1,
    rows: 10,
    TotalPageLinkButtons: 5,
    RowsPerPageOptions: [10, 20, 30, 50, 100, 1000],
    tag: ''
  };

  pageFilter = {
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    status: 'ACTIVE',
    materialId: null,
    productTreeId: null,
    materialName: null,
    revisionNo: null,
    startDate: null,
    expiryDate: null,
    plantId: null,
    plantName: null,

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
    { field: 'description', header: 'description' },
    { field: 'plant', header: 'plant' },
    { field: 'plantId', header: 'plant-id' },
    { field: 'workstation', header: 'workstation' },
    { field: 'lastModeDate', header: 'last-mode-date' },

  ];
  sub: Subscription;
  savedOrEditedItem = false;


  constructor(
    private _enumPTreeSvc: EnumPOrderStatusService,
    private _productTreeSvc: ProductTreeService,
    private appStateSvc: AppStateService,
    private loaderService: LoaderService, private utilities: UtilitiesService) {
    this.sub = this.appStateSvc.plantAnnounced$.subscribe((res: any) => {
      if ((res) && res.plantId) {
        this.pageFilter.plantName = res.plantName;
        this.filter(this.pageFilter);
      } else {
        this.resetFilter();
        this.filter(this.pageFilter);
      }
    });
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

  onRowSelect(event) {
    // event.data
    this.selectedEvent.next(event);

    this.utilities.showInfoToast(event.productTreeId + ' added');

  }
  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this._productTreeSvc.filter(term))).subscribe(
      result => {
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.productTreees = result['content'];
        this.loaderService.hideLoader();
      },
      error => {
        this.utilities.showErrorToast(error)
        this.loaderService.hideLoader();
      }
    );
    // console.log('PageFilter =====>', this.pageFilter)
    this.filter(this.pageFilter);
    this._enumPTreeSvc.getProductTreeStatusEnums().then(result => this.listProductionTreeStatus = result).catch(error => console.log(error));
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
      status: 'ACTIVE',
      materialId: null,
      productTreeId: null,
      materialName: null,
      revisionNo: null,
      startDate: null,
      expiryDate: null,
      plantId: null,
      plantName: null,
      query: null,
      orderByProperty: 'productTreeId',
      orderByDirection: 'desc',
      createDate: null,
      description: null,
      updateDate: null
    };
    this.filter(this.pageFilter);
  }

  showMaterialDetailDialog(stockId: any) {
    if(stockId){
      this.loaderService.showDetailDialog(DialogTypeEnum.STOCK, stockId);
    }
  }
  showProductTreeDetailDialog (productTreeId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PRODUCTTREE, productTreeId);
  }

  showPlantDetailDialog(plantId: any) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PLANT, plantId);
  }
}

