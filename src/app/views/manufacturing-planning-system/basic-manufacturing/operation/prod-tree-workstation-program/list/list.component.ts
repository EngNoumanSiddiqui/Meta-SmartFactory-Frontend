/**
 * Created by reis on 29.07.2019.
 */
import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import { UtilitiesService } from 'app/services/utilities.service';
import { ProductTreeWorkstationProgramService } from 'app/services/dto-services/product-tree/product-tree-workstation-program.service';
@Component({
  selector: 'product-tree-workstation-program-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ProductTreeWorkstationProgramListComponent implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;
  equipmentModal = {
    modal: null,
    data: null,
    id: null
  };

  @Input() productTreeDetailId;
  @Input() detailMode = false;
  @Input() productTreeDetailOperationId;
  @Input() isCombineOperation = false;

  tableData = [];

  @Input('tableData') set x(tableData) {
    if (tableData) {
      console.log('tableData', tableData)
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
    {field: 'operationOrder', header: 'operation-order'},
    {field: 'productTreeDetailWorkstationProgramId', header: 'product-tree-workstation-program-id'},
    {field: 'workstationProgram', header: 'workstation-program'},
    {field: 'description', header: 'name'},
    {field: 'plcCode', header: 'plc-code'},
    {field: 'plcValue', header: 'plc-value'},
    {field: 'unit', header: 'unit'},
  ]

  modal = {active: false};

  constructor(private _confirmationSvc: ConfirmationService,
              private _translateSvc: TranslateService,
              private utilities: UtilitiesService,
              private mOrderTypeTypeSvc: ProductTreeWorkstationProgramService) {
  }

  ngOnInit() {
    if (this.isCombineOperation) {
      this.cols = [
        {field: 'operationOrder', header: 'operation-order'},
        {field: 'workstationProgram', header: 'workstation-program'},
        {field: 'description', header: 'name'},
        {field: 'plcCode', header: 'plc-code'},
        {field: 'plcValue', header: 'plc-value'},
        {field: 'unit', header: 'unit'},
      ]
    }
  }


  modalShow(id, mod: string, data) {

    this.equipmentModal.id = id;
    this.equipmentModal.modal = mod;
    this.equipmentModal.data = data;

    this.modal.active = true;
  }


  delete(id, index) {
    if (id) {
      this._confirmationSvc.confirm({
        message: this._translateSvc.instant('do-you-want-to-delete'),
        header: this._translateSvc.instant('delete-confirmation'),
        icon: 'fa fa-trash',
        accept: () => {
          this.mOrderTypeTypeSvc.delete(id)
            .then(() => {
              this.utilities.showSuccessToast('deleted-success');
              this.tableData.splice(index, 1);
              this.tableData = [...this.tableData];
              this.onTableDataChange();
            })
            .catch(error => this.utilities.showErrorToast(error));
        },
        reject: () => {
          this.utilities.showInfoToast('cancelled-operation');
        }
      })
    } else {
      this.tableData.splice(index, 1);
      this.tableData = [...this.tableData];
      this.onTableDataChange();
    }
  }

  onTableDataChange() {
    this.saveEvent.next(this.tableData);
  }


  addOrUpdate(item) {

    if (this.equipmentModal.data) {// edit event
      this.equipmentModal.data.description = item.description;
      this.equipmentModal.data.workstationProgramId = item.workstationProgramId;
      this.equipmentModal.data.workstationProgram = item.workstationProgram;
    } else {// new event
      this.tableData = [item, ...this.tableData];
    }

    this.tableData.forEach((it, index) => {
      it.operationOrder = index + 1;
    });

    this.onTableDataChange();
  }

}
