/**
 * Created by reis on 29.07.2019.
 */
import {Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {ConfirmationService} from 'primeng/api';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { ConvertUtil } from 'app/util/convert-util';
import { ImageAdderComponent } from 'app/views/image/image-adder/image-adder.component';
import { TableTypeEnum } from 'app/dto/table-type-enum';
@Component({
  selector: 'job-order-operation-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class JobOrderOperationListComponent implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;
  @ViewChildren(ImageAdderComponent) imageAdderComponent: QueryList<ImageAdderComponent>;
  equipmentModal = {
    modal: null,
    data: null,
    id: null
  };

  @Input() detailMode = false;

  tableData = [];
  selectedTabIndex = 0;
  expandedRows = {};

  @Input('tableData') set x(tableData) {
    if (tableData) {
      // tableData.jobOrderOperations.map(element => {
      //   element['jobOrderStockAuxList'] = tableData.jobOrderStockAuxList;
      //   element['jobOrderStockProduceList'] = tableData.jobOrderStockProduceList;
      //   element['jobOrderStockUseList'] = tableData.jobOrderStockUseList;
      // });
      if ( Array.isArray(tableData) ) {
        this.tableData = tableData;
      } else {
        this.tableData = tableData.jobOrderOperations ? tableData.jobOrderOperations : [];
      }
      if(this.tableData) {
        this.tableData.forEach(op => {
          if(op.actualFixedCost) {
            op.actualFixedCost = op.actualFixedCost.toFixed(2);
          }
          if(op.fixedCost) {
            op.fixedCost = op.fixedCost.toFixed(2);
          }
          if(op.actualLaborCost) {
            op.actualLaborCost = op.actualLaborCost.toFixed(2);
          }
          if(op.laborCost) {
            op.laborCost = op.laborCost.toFixed(2);
          }
          if(op.actualVariableCost) {
            op.actualVariableCost = op.actualVariableCost.toFixed(2);
          }
          if(op.variableCost) {
            op.variableCost = op.variableCost.toFixed(2);
          }
          if(op.stopCostRate) {
            op.stopCostRate = op.stopCostRate.toFixed(2);
          }
          if(op.actualOperationCost) {
            op.actualOperationCost = op.actualOperationCost.toFixed(2);
          }
          if(op.totalCost) {
            op.totalCost = op.totalCost.toFixed(2);
          }
          if(op.actualTotalCost) {
            op.actualTotalCost = op.actualTotalCost.toFixed(2);
          }
        })
      }
      if(this.tableData && this.tableData.length === 1) {
        this.expandedRows[this.tableData[0].operationName] = true;
      }

      setTimeout(() => {
        if (this.imageAdderComponent && this.imageAdderComponent.length) {
          this.tableData.forEach((op, index) => {
            this.imageAdderComponent.toArray()[index].initImages(op.jobOrderOperationId, TableTypeEnum.JOB_ORDER_OPERATION);
          });
          // this.imageAdderComponent.initImages(this.jobDetail.prodOrder?.prodOrderId, TableTypeEnum.PRODUCTION_ORDER);
        }
      }, 700);
      // console.log('@joborderOperationData', this.tableData)
    }
  }

  @Output() saveEvent = new EventEmitter();


  cols = [
    {field: 'jobOrderOperationId', header: 'job-order-operation-id'},
    {field: 'operationName', header: 'operation-name'},
    {field: 'plannedCycleQuantity', header: 'planned-quantity'},
    {field: 'currentQuantity', header: 'produced-quantity'},
    {field: 'singleTotalDuration', header: 'total-duration'},
    {field: 'parent', header: 'parent'},
    {field: 'workStationName', header: 'workstation'},
    {field: 'individualCapacity', header: 'individual-capacity'},
    {field: 'operationStatus', header: 'operation-status'},
    // {field: 'actualFinish', header: 'actual-finish'},
  ];

  modal = {active: false};

  constructor(private _confirmationSvc: ConfirmationService,
              private loaderService: LoaderService,
              private utilities: UtilitiesService) {
  }

  ngOnInit() {
  }


  modalShow(id, mod: string, data) {

    this.equipmentModal.id = id;
    this.equipmentModal.modal = mod;
    this.equipmentModal.data = data;

    this.modal.active = true;
  }


  delete(id, index) {


    this.tableData.splice(index, 1)
    this.tableData = [...this.tableData];
    this.onTableDataChange();

  }

  onTableDataChange() {
    this.saveEvent.next(this.tableData);
  }


  addOrUpdate(item) {

    if (this.equipmentModal.data) {// edit event
      this.equipmentModal.data.quantity = item.quantity;
      this.equipmentModal.data.operation = item.operation;
      this.equipmentModal.data.operationName = item.operationName;
      this.equipmentModal.data.operationId = item.operationId;
    } else {// new event
      this.tableData = [item, ...this.tableData];
    }
    this.onTableDataChange();
  }

  showOperationDetail(operationId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.OPERATION, operationId);
  }

  getReadableTime(time) {
    if(time) {
      return ConvertUtil.longDuration2DHHMMSSsssTime(time)
    } else {
      return '';
    }
  }

  showWorkstationDetail(id){
    this.loaderService.showDetailDialog(DialogTypeEnum.WORKSTATION, id);
  }
  showJobOrderDetail(id) {
    this.loaderService.showDetailDialog(DialogTypeEnum.JOBORDER, id)
  }
  showJobOrderOperationDetail(id) {
    this.loaderService.showDetailDialog(DialogTypeEnum.JOBORDEROPERATION, id);
  }

  handleTabChange(e) {
    this.selectedTabIndex = e.index;
  }
}
