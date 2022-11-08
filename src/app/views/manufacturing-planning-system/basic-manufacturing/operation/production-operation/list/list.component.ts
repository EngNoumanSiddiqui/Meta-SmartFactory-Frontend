/**
 * Created by reis on 29.07.2019.
 */
import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import { LoaderService } from 'app/services/shared/loader.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { UtilitiesService } from 'app/services/utilities.service';
import { ProductTreeOperationService } from 'app/services/dto-services/product-tree/prouduct-tree-operation.service';
import { ConvertUtil } from 'app/util/convert-util';
@Component({
  selector: 'product-tree-operation-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ProductTreeOperationListComponent implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;
  equipmentModal = {
    modal: null,
    data: null,
    id: null
  };

  @Input() componentList = [];
  @Input() productTreeDetailId;
  @Input() detailMode = false;
  @Input() isParent = false;
  @Input() workstationId ;
  tableData = [];
  parentPresent = false;

  @Input('tableData') set x(tableData) {
    if (tableData) {
      this.tableData = tableData;
    }
  }

  @Output() saveEvent = new EventEmitter();

  modalType: any;
  @Input('openModalType') set onmodal(openModalType) {
    this.modalType = openModalType;
    if (openModalType) {
      setTimeout(() => {
        this.modalShow(null, 'NEW', null);
      }, 1000);
    }
  }
  cols = [
    {field: 'productTreeDetailOperationId', header: 'product-tree-operation-id'},
    {field: 'operation', header: 'operation'},
    {field: 'quantity', header: 'quantity'},
    {field: 'singleDuration', header: 'single-duration'},
    {field: 'parent', header: 'parent'},
    {field: 'workStation', header: 'workstation'},
    {field: 'operationOrder' , header: 'operation-order'},
    {field: 'neededPerson' , header: 'needed-person'},
    {field: 'description', header: 'description'},
  ];

  modal = {active: false};

  constructor(private _confirmationSvc: ConfirmationService,
              private _translateSvc: TranslateService,
              private utilities: UtilitiesService,
              private loaderService: LoaderService,
              private mOrderTypeTypeSvc: ProductTreeOperationService) {
  }

  ngOnInit() {
  }


  modalShow(id, mod: string, data) {

    this.equipmentModal.id = id;
    this.equipmentModal.modal = mod;
    this.equipmentModal.data = data;

    this.modal.active = true;

    if (!data) {
      if (this.tableData.find(itm => itm.parent === true)) {
        this.parentPresent = true;
      } else {
        this.parentPresent = false;
      }
    } else {
      if (this.tableData.find(itm => itm.parent === true && data.parent !== true)) {
        this.parentPresent = true;
      } else {
        this.parentPresent = false;
      }
    }
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
              this.loaderService.hideLoader();
              this.utilities.showErrorToast(error);
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
    if(this.tableData && this.tableData.length > 0) {
      this.tableData = this.tableData.sort((a, b) => a.operationOrder - b.operationOrder);
    }
    this.saveEvent.next(this.tableData);
  }


  addOrUpdate(item) {

    if (this.equipmentModal.data) {// edit event
      this.equipmentModal.data.defaultStock = item.defaultStock;
      this.equipmentModal.data.defaultStockId = item.defaultStockId;
      this.equipmentModal.data.description = item.description;
      this.equipmentModal.data.maxSingleStandbyDuration = item.maxSingleStandbyDuration;
      this.equipmentModal.data.operationId = item.operationId;
      this.equipmentModal.data.operationOrder = item.operationOrder;
      this.equipmentModal.data.operationRepeat = item.operationRepeat;
      this.equipmentModal.data.parent = item.parent;
      this.equipmentModal.data.plannedCycleQuantity = item.plannedCycleQuantity;
      this.equipmentModal.data.fixedCost = item.fixedCost;
      this.equipmentModal.data.neededPerson = item.neededPerson;
      this.equipmentModal.data.laborCost = item.laborCost;
      this.equipmentModal.data.variableCost = item.variableCost;
      this.equipmentModal.data.currency = item.currency;
      this.equipmentModal.data.processControlFrequency = item.processControlFrequency;
      this.equipmentModal.data.productTreeDetailId = item.productTreeDetailId;
      this.equipmentModal.data.componentList = item.componentList;
      this.equipmentModal.data.productTreeDetailOperationId = item.productTreeDetailOperationId;
      this.equipmentModal.data.productTreeDetailWorkstationProgramList = item.productTreeDetailWorkstationProgramList;
      this.equipmentModal.data.quantity = item.quantity;
      this.equipmentModal.data.singleDuration = item.singleDuration;
      this.equipmentModal.data.singleSetupDuration = item.singleSetupDuration;
      this.equipmentModal.data.singleTotalDuration = item.singleTotalDuration;
      this.equipmentModal.data.workStationId = item.workStationId;
      this.equipmentModal.data.workStation = item.workStation;
      this.equipmentModal.data.operation = item.operation;
    } else {// new event
      this.tableData = [...this.tableData, item];
    }
    this.onTableDataChange();
  }

  OpenOperationDetails(operation) {
    if (operation) {
      this.loaderService.showDetailDialog(DialogTypeEnum.OPERATION, operation.operationId);
    }
  }

  operationOrderChanged(event, index) {
    if (this.isParent) {
      if (this.tableData[index].operationOrder === 1) {
        this.tableData[index].parent = true;
      } else {
        this.tableData[index].parent = false;
      }
    }
  }

  getdurationTime(time) {
    return ConvertUtil.longDuration2DHHMMSSsssTime(time);
  }

  setSelectedWorkstation(equipment, rowData) {
    if (equipment) {
      rowData.workStationId = equipment.workStationId;
      rowData.workStation = equipment;
    } else {
      rowData.workStationId = null;
      rowData.workStation = null;
    }
  }

  OpenWorkstationDetails(workstationId) {
    if (workstationId) {
      this.loaderService.showDetailDialog(DialogTypeEnum.WORKSTATION, workstationId);
    }
  }
}
