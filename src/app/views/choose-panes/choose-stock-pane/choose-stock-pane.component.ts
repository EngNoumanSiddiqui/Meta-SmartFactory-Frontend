import {Component, EventEmitter, OnInit, Output, ViewChild, Input, OnDestroy} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

import {Subject, Subscription} from 'rxjs';
import {debounceTime, switchMap} from 'rxjs/operators'
import {ModalDirective} from 'ngx-bootstrap/modal';
import {environment} from '../../../../environments/environment';
import {LoaderService} from '../../../services/shared/loader.service';
import {UtilitiesService} from '../../../services/utilities.service';
import {StockCardService} from '../../../services/dto-services/stock/stock.service';
import {StockTypeService} from '../../../services/dto-services/stock-type/stock-type.service';
import {EnumStockStatusService} from '../../../services/dto-services/enum/stock-status.service';
import {ConfirmationService} from 'primeng/api';
import {ConvertUtil} from '../../../util/convert-util';
import {DialogTypeEnum} from '../../../services/shared/dialog-types.enum';
import { ProductionOrderMaterialService } from 'app/services/dto-services/production-order/production-order-material.service';
import { ProductDetailItemCommunicatingService } from 'app/views/manufacturing-planning-system/basic-manufacturing/product-detail-item.service';
import { UsersService } from 'app/services/users/users.service';
@Component({
  selector: 'choose-stock-pane',
  templateUrl: './choose-stock-pane.component.html',
  styles: [`
    td > span {
      overflow: hidden;
      word-break: break-all;
      display: block;
    }
  `]
})
export class ChooseStockPaneComponent implements OnInit, OnDestroy {
  selectedItems: any[] = [];
  selectedPlant: any;
  @Input('isAuxiliaryMaterial') set aux(isAuxiliaryMaterial) {
    if (isAuxiliaryMaterial) {
      // this.pageFilter.includeMaterialTypeList = [0];
      this.pageFilter.stockTypeName = 'Auxiliary Materials';
    } else {
      // this.pageFilter.includeMaterialTypeList = null;
      this.pageFilter.stockTypeName = null;
    }
  }
  @Input('stockTypeName') set setstockTypeName(stockTypeName) {
    if (stockTypeName) {
      this.pageFilter.stockTypeName = stockTypeName;
    } else {
      this.pageFilter.stockTypeName = null;
    }
    // this.filter(this.pageFilter);
  }
  @Input() fromProductTreeMaterial = false;
  @Input() onlyAddButton = false;
  @Input('excludeRawMaterial')
  set raw(excludeRawMaterial) {
    if (excludeRawMaterial) {
      this.pageFilter.excludeMaterialType = 1;
    } else {
      this.pageFilter.excludeMaterialType = null;
    }
    this.searchTerms.next(this.pageFilter);
  }
  @Input('modalType') set modalTypeset(modalType) {
    if (modalType=== 'auxiliary-material') {
      // for auxiliary type
      this.pageFilter.stockTypeName = 'Auxiliary Materials';
      this.modalType = 'auxiliary-material';
    } else {
      this.modalType = modalType;
      this.pageFilter.stockTypeName = null;
    }
  }
  @Input('direction') set directiony(direction) {
    if (direction) {
      this.direction = +direction;
      if(this.direction === 1) {
        // material
        this.pageFilter.autoCreated=false;
        this.pageFilter.includeMaterialTypeList= [3,9];
      } else if(this.direction === -1) {
        // components
        this.pageFilter.autoCreated=false;
        this.pageFilter.includeMaterialTypeList= [1,2,3,5,6,7,8,9,11,12];
      } else {
        this.pageFilter.autoCreated=null;
      }
      this.filter(this.pageFilter);
    } else {
      this.direction = null;
      this.pageFilter.autoCreated=null;
      this.pageFilter.includeMaterialTypeList = null;
    }
    // this.filter(this.pageFilter);
  }
  @Input('plantId')
  set plantIdy(plantId) {
    if (plantId) {
      this.pageFilter.plantId = plantId;
    } else {
      this.pageFilter.plantId = null;
    }
    // this.filter(this.pageFilter);
  }

  @Input('includeMaterials') set include(materials) {
    if (materials) {
      this.pageFilter.includeMaterialTypeList = materials;
      this.searchTerms.next(this.pageFilter);
    }

  }

  @Input('excludeMaterial') set exclude(material){
    if (material) {
      this.pageFilter.excludeMaterialType = material
    } else {
      this.pageFilter.excludeMaterialType = null;
    }
    this.searchTerms.next(this.pageFilter);
  }
  @Input() removeTopButtons = false;
  @ViewChild('myModal') public myModal: ModalDirective;
  materialCardModal = {
    modal: null,
    data:null,
    id: null
  };
  direction: any;
  modalType: string;

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
  modal = {active: false};
  pageFilter = {
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? environment.filterRowSize : 10,
    stockTypeName: null,
    stockId: null,
    autoCreated: false,
    plantId: null,
    stockManagement: null,
    stockName: null,
    stockGroupName: null,
    includeMaterialTypeList: null,
    excludeMaterialType: null,
    baseUnit: null,
    query: null,
    orderByProperty: 'stockId',
    orderByDirection: 'desc'
  };

  classReOrder = ['asc', 'asc', 'asc'];
  selectedColumns = [];

  cols = [
    {field: 'stockId', header: 'stock-id'},
    {field: 'stockNo', header: 'stock-no'},
    {field: 'stockName', header: 'stock-name'},
    {field: 'stockName2', header: 'stock-name-2'},
    {field: 'stockName3', header: 'stock-name-3'},
    {field: 'productTreeId', header: 'product-tree'},
    {field: 'baseUnit', header: 'base-unit'},
    {field: 'stockGroupName', header: 'material-group'},
    {field: 'stockTypeName', header: 'type'},
    {field: 'grossWeight', header: 'gross-weight'},
    {field: 'netWeight', header: 'net-weight'},
    {field: 'volume', header: 'volume'},
    {field: 'volumeUnit', header: 'volume-unit'},
    {field: 'thickness', header: 'thickness'},
    {field: 'length', header: 'length'},
    {field: 'height', header: 'height'},
    {field: 'dimensionUnit', header: 'dimension-unit'},
  ];
  materials = [];

  listStockStatus;
  listStockTypes;
  materialGroupList;
  showLoader = false;
  hideCaption: boolean = true;
  @Input('hideCaption') set h(caption){
    console.log('Caption', caption)
    this.hideCaption = caption;
  };

  @Input() showStockManagement = false;

  private searchTerms = new Subject<any>();

  @Output() selectedEvent = new EventEmitter();
  excludeDuplicateComponents = [];
  excludeDuplicateAuxialiary = [];
  excludeDuplicateComponentSubscription: Subscription;
  excludeDuplicateAxuialiarySubscription: Subscription;

  constructor(private _confirmationSvc: ConfirmationService,
              private _enumStockStatus: EnumStockStatusService,
              private _translateSvc: TranslateService,
              private _stockTypesSvc: StockTypeService,
              private _stockSvc: StockCardService,
              private prodDetailCommunicatingService: ProductDetailItemCommunicatingService,
              private utilities: UtilitiesService,
              private loaderService: LoaderService,
              private userSvc: UsersService,
              private productionOrderMaterialService: ProductionOrderMaterialService) {
                this.selectedPlant = JSON.parse(this.userSvc.getPlant());
                this.pageFilter.plantId = this.selectedPlant?.plantId;
  }
  subscribeExcludeMaterail(){
      this.excludeDuplicateComponentSubscription = this.productionOrderMaterialService.componentMaterialChanged().subscribe((materials)=>{
        this.filterExcludeMaterials(materials)
      });

      this.excludeDuplicateAxuialiarySubscription = this.productionOrderMaterialService.auxiliaryMaterialChanged().subscribe((materials)=>{
        this.filterExcludeMaterials(materials)
      })
  }

  filterExcludeMaterials(excludeMaterials) {
    if (excludeMaterials && excludeMaterials.length > 0) {
      this.materials = ConvertUtil.getUniqueArrays(this.materials, excludeMaterials, 'stockId');
    }
  }

  onAddSelectedRow(){
    if(this.selectedItems){
      console.log('this.selectedItems: ', this.selectedItems);
    }
  }

  onRowSelectedItems(event){
    this.selectedItems.push(event);
  }

  onRowSelect(event) {
    // event.data
    this.selectedEvent.next(event);

    this.utilities.showInfoToast(event.stockName + ' added');

  }

  modalShow(id, mod: string, data=null) {

    this.materialCardModal.id = id;
    this.materialCardModal.modal = mod;
    this.materialCardModal.data = data;

    this.modal.active = true;
  }

  ngOnInit() {
    this.setSelectedColumns();
    this._enumStockStatus.getEnumList().then(result => this.listStockStatus = result).catch(error => console.log(error));
    this._stockTypesSvc.getIdNameList().then(result => {
       this.listStockTypes = result;
       if (this.listStockTypes && this.modalType && (this.modalType === 'auxiliary-material')) {
         this.listStockTypes = this.listStockTypes.filter(itm => itm.stockTypeId === 4);
       }

       if (this.listStockTypes && this.pageFilter.includeMaterialTypeList &&
        this.pageFilter.includeMaterialTypeList.length > 0) {
        const populatedListType = [];
        if (this.pageFilter.includeMaterialTypeList.find(i => i === 9)) {
          this.pageFilter.includeMaterialTypeList.push(2);

          // Add stock type of id 12, 16
          if ( this.listStockTypes?.length > 0 ) {
            this.listStockTypes.forEach( (item, index) => {
              if ( item?.stockTypeId === 12 || item?.stockTypeId === 16 ) {
                this.pageFilter.includeMaterialTypeList.push(index);
              }
            })
          }
        }
        for (let index = 0; index < this.pageFilter.includeMaterialTypeList.length; index++) {
          const typeId = this.pageFilter.includeMaterialTypeList[index];
          const stocktype = this.listStockTypes.find(item => item.stockTypeId === typeId);
          if (stocktype) {
            populatedListType.push(stocktype);
          }
        }
        this.listStockTypes = populatedListType;
       }


      }).catch(error => console.log(error));
    this._stockSvc.getMaterialGroupList().then(result => this.materialGroupList = result).catch(error => console.log(error));

    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this._stockSvc.filterObservable(term))).subscribe(
      result => {
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.materials = result['content'];
        // if (this.direction && this.direction < 0) {
        //   this.materials = this.materials.filter(itm => (itm.stockTypeId !== 3) && (itm.stockTypeId !== 4))
        // }
        // if ((this.modalType && this.modalType === 'material') || (this.direction === 1) ) {
        //   this.materials = this.materials.filter(itm => (itm.stockTypeId === 2) || (itm.stockTypeId === 3) || (itm.stockTypeId === 9))
        // }
        // if ((this.modalType && this.modalType === 'component') || (this.direction < 0)) {
        //   this.materials = this.materials.filter(itm => itm.stockTypeId !== 10);
        // }
        if (this.prodDetailCommunicatingService.hasOwnProperty('seletedProdDTItem') && this.prodDetailCommunicatingService.seletedProdDTItem) {
          for (const arr of this.prodDetailCommunicatingService.seletedProdDTItem.componentList) {
              this.materials = arr.component ? (this.materials.filter(itm => itm.stockId !== arr.component.stockId)) : this.materials;
          }
        }
        if (this.fromProductTreeMaterial) {
          this.materials = this.materials.filter(st => (st.stockTypeId === 2) || (st.stockTypeId === 3) || (st.stockTypeId === 9) || (st.stockTypeId === 10))
        }
        this.subscribeExcludeMaterail();



        this.loaderService.hideLoader();
      },
      error => {
        this.utilities.showErrorToast(error);
        this.loaderService.hideLoader();
        this.materials = [];
      }
    );
    this.filter(this.pageFilter);

  }
  setSelectedColumns(){
   
    if(this.hideCaption){
      this.selectedColumns = [
        {field: 'stockId', header: 'stock-id'},
        {field: 'stockNo', header: 'stock-no'},
        {field: 'stockName', header: 'stock-name'},
        {field: 'stockName2', header: 'stock-name-2'},
        {field: 'stockName3', header: 'stock-name-3'},
        {field: 'productTreeId', header: 'product-tree'},
        {field: 'baseUnit', header: 'base-unit'},
        {field: 'stockGroupName', header: 'material-group'},
        {field: 'stockTypeName', header: 'type'},
      ];
    } else if(this.showStockManagement) {
      this.selectedColumns = [
        {field: 'stockId', header: 'stock-id'},
        {field: 'stockNo', header: 'stock-no'},
        {field: 'stockName', header: 'stock-name'},
        {field: 'stockName2', header: 'stock-name-2'},
        {field: 'stockName3', header: 'stock-name-3'},
        {field: 'productTreeId', header: 'product-tree'},
        {field: 'baseUnit', header: 'base-unit'},
        {field: 'stockGroupName', header: 'material-group'},
        {field: 'stockManagement', header: 'stock-management'},
        {field: 'stockTypeName', header: 'type'},
      ];
    }else{
      this.selectedColumns = [
        {field: 'stockId', header: 'stock-id'},
        {field: 'stockNo', header: 'stock-no'},
        {field: 'stockName', header: 'stock-name'},
        {field: 'stockName2', header: 'stock-name-2'},
        {field: 'stockName3', header: 'stock-name-3'},
        {field: 'baseUnit', header: 'base-unit'},
        {field: 'stockGroupName', header: 'material-group'},
        {field: 'stockTypeName', header: 'type'},
      ];
    }
  }

  filter(data) {
    this.pageFilter.pageNumber = 1;
    this.search(data);
  }

  search(data) {
    this.loaderService.showLoader();

    const tempDto = Object.assign({}, data);
    tempDto.stockTypeName = null;
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

  resetFilter() {
    this.pageFilter = {
      pageNumber: 1,
      pageSize: this.pageFilter.pageSize,
      stockTypeName: null,
      stockId: null,
      stockManagement: null,
      autoCreated: false,
      stockName: null,
      plantId: this.pageFilter.plantId,
      baseUnit: null,
      stockGroupName: null,
      includeMaterialTypeList: this.pageFilter.includeMaterialTypeList,
      excludeMaterialType: this.pageFilter.excludeMaterialType,
      query: null,
      orderByProperty: 'stockId',
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
        this._stockSvc.delete(id)
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
  showProductTreeDetail(productTreeId){
    this.loaderService.showDetailDialog(DialogTypeEnum.PRODUCTTREE, productTreeId);

  }

  ngOnDestroy() {
    if (this.excludeDuplicateComponentSubscription) {
      this.excludeDuplicateComponentSubscription.unsubscribe();
    }
    if (this.excludeDuplicateAxuialiarySubscription) {
      this.excludeDuplicateAxuialiarySubscription.unsubscribe();
    }
  }

}

