/**
 * Created by reis on 29.07.2019.
 */
import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { ProductTreeComponentService } from 'app/services/dto-services/product-tree/prouduct-tree-component.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { environment } from 'environments/environment';
@Component({
  selector: 'product-tree-component-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ProductTreeComponentListComponent implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;
  equipmentModal = {
    modal: null,
    data: null,
    id: null
  };

  @Input() productTreeDetailId;
  @Input() productTreeDetailOperationId;
  @Input() plant;
  @Input() detailMode = false;
  @Input() manualProdOrder = false;
  @Input() isAuxiliaryMaterial = false;
  @Input() isComponentMaterial = false;
  @Input() isMaterialMaterial = false;

  @Input() isCombineOperation = false;
  quantity = 1;
  @Input('quantity') set setquantity(quantity) {
    if(quantity) {
      this.quantity = quantity;
      if(this.isMaterialMaterial && this.tableData.length) {
          this.tableData.forEach(itm => {
            itm.quantity = this.quantity;
          });
      }
    }
  }; 

  @Input() saleOrderQuantity= null;
  modalType: any;
  materialPresent = false;
  @Input('openModalType') set onmodal(openModalType) {
    if (openModalType !== null && openModalType !== undefined) {
      this.modalType = openModalType;
      setTimeout(() => {
        this.modalShow(null, 'NEW', null, openModalType);
      }, 1000);
    }
  }
  tableData = [];

  @Input('tableData') set x(tableData) {
    if (tableData) {
      console.log('@product-tree-component-listtableData', tableData)
      this.tableData = tableData;
    }
  }

  @Output() saveEvent = new EventEmitter();


  cols = [
    {field: 'productTreeDetailComponentId', header: 'product-tree-component-id'},
    {field: 'direction', header: 'direction'},
    {field: 'position', header: 'position'},
    {field: 'componentNo', header: 'component-no'},
    {field: 'component', header: 'component'},
    {field: 'quantity', header: 'quantity'},
    {field: 'quantityUnit', header: 'quantity-unit'},
    {field: 'materialCost', header: 'material-cost'},
    {field: 'scrapCost', header: 'scrap-cost'},
  ];

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

  constructor(private _confirmationSvc: ConfirmationService,
              private _translateSvc: TranslateService,
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private mOrderTypeTypeSvc: ProductTreeComponentService) {
  }

  ngOnInit() {
    if (this.isCombineOperation) {
      this.cols = [
        // {field: 'jobOrderId', header: 'job-order-id'},
        {field: 'direction', header: 'direction'},
        {field: 'component', header: 'component'},
        {field: 'quantity', header: 'quantity'},
        {field: 'quantityUnit', header: 'quantity-unit'},
      ];
    }
    
  }


  modalShow(id, mod: string, data, openModalType?) {

    this.equipmentModal.id = id;
    this.equipmentModal.modal = mod;
    this.equipmentModal.data = data;
    this.materialPresent = true;
    if (mod === 'NEW') {
      const itm: any = this.tableData.find(it => it.direction === 1);
      if (!itm && this.tableData.length > 0) {
        this.materialPresent = false;
      }
    }
    this.modal.active = true;
    this.modalType = (openModalType !== null || openModalType !== undefined) ? openModalType : null;
  }


  delete(id, index) {

    if (id) {
      this._confirmationSvc.confirm({
        message: this._translateSvc.instant('do-you-want-to-delete'),
        header: this._translateSvc.instant('delete-confirmation'),
        icon: 'fa fa-trash',
        accept: () => {
          this.loaderService.showLoader();
          this.mOrderTypeTypeSvc.delete(id)
            .then(() => {
              this.loaderService.hideLoader();
              this.utilities.showSuccessToast('deleted-success');
              this.tableData.splice(index, 1)
              this.tableData = [...this.tableData];
              this.onTableDataChange();
            })
            .catch(error => {
              this.utilities.showErrorToast(error);
              this.loaderService.hideLoader();
            });
        },
        reject: () => {
          this.utilities.showInfoToast('cancelled-operation');
        }
      })
    } else {
      this.tableData.splice(index, 1)
      this.tableData = [...this.tableData];
      this.onTableDataChange();
    }
  }

  onTableDataChange() {
    // if (this.isAuxiliaryMaterial) {
    //   this.tableData = this.tableData.filter(itm => itm.direction === 0);
    // } else {
    //   this.tableData = this.tableData.filter(itm => itm.direction !== 0);
    // }
    this.tableData.forEach(dt => {
      if (dt.component && !dt.componentId) {
        dt.componentId = dt.component.stockId;
      }
    });
    this.saveEvent.next(this.tableData);
  }
  addOrUpdate(item) {
    if (this.equipmentModal.data) {// edit event
      this.equipmentModal.data.quantity = item.quantity;
      this.equipmentModal.data.neededQuantity = item.neededQuantity || null;
      this.equipmentModal.data.baseQuantity = item.baseQuantity || null;
      this.equipmentModal.data.quantityUnit = item.quantityUnit;
      this.equipmentModal.data.unit = item.quantityUnit;
      this.equipmentModal.data.direction = item.direction;
      this.equipmentModal.data.description = item.description;
      this.equipmentModal.data.component = item.component;
      this.equipmentModal.data.materialCost = item.materialCost;
      this.equipmentModal.data.materialCostRate = item.materialCostRate;
      this.equipmentModal.data.scrapCost = item.scrapCost;
      this.equipmentModal.data.currency = item.currency;
      this.equipmentModal.data.extraProductionPercentage = item.extraProductionPercentage;
      this.equipmentModal.data.position = item.position;
      this.equipmentModal.data.componentId = item.componentId;
    } else {// new event
      this.tableData = [item, ...this.tableData];
    }
    this.onTableDataChange();
  }
  showProductTreeDetail(productTreeId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PRODUCTTREE, productTreeId);
  }
  showStockDetail(stockId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.STOCK, stockId);
  }

  public get getDirection(): any {
    if (this.isAuxiliaryMaterial) {
      return 0;
    } else if (this.isComponentMaterial) {
      return -1;
    } else if (this.isMaterialMaterial) {
      return 1;
    } else {
      return -1;
    }
  }
}
