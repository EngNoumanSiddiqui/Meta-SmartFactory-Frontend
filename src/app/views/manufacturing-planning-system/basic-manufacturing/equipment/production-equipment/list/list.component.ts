/**
 * Created by reis on 29.07.2019.
 */
import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import { UtilitiesService } from 'app/services/utilities.service';
import { ProductTreeEquipmentService } from 'app/services/dto-services/product-tree/prouduct-tree-equipment.service';
@Component({
  selector: 'product-tree-equipment-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ProductTreeEquipmentListComponent implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;
  equipmentModal = {
    modal: null,
    data: null,
    id: null
  };

  @Input() detailMode = false;
  @Input() productTreeDetailId;

  tableData = [];

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
    {field: 'productTreeDetailEquipmentId', header: 'product-tree-equipment-id'},
    {field: 'stock', header: 'equipment'},
    {field: 'count', header: 'quantity'},
    {field: 'capacity', header: 'capacity'},
    
  ];

  modal = {active: false};

  constructor(private _confirmationSvc: ConfirmationService,
              private _translateSvc: TranslateService,
              private utilities: UtilitiesService,
              private mOrderTypeTypeSvc: ProductTreeEquipmentService) {
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

    if (id) {
      this._confirmationSvc.confirm({
        message: this._translateSvc.instant('do-you-want-to-delete'),
        header: this._translateSvc.instant('delete-confirmation'),
        icon: 'fa fa-trash',
        accept: () => {
          this.mOrderTypeTypeSvc.delete(id)
            .then(() => {
              this.utilities.showSuccessToast('deleted-success');
              this.tableData.splice(index, 1)
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
      this.tableData.splice(index, 1)
      this.tableData = [...this.tableData];
      this.onTableDataChange();
    }
  }

  onTableDataChange() {
    this.saveEvent.next(this.tableData);
  }


  addOrUpdate(item) {

    if (this.equipmentModal.data) {// edit event
      this.equipmentModal.data.count = item.count;
      this.equipmentModal.data.stock = item.stock;
      this.equipmentModal.data.stockId = item.stockId;
      this.equipmentModal.data.capacity = item.capacity;
    } else {// new event
      this.tableData = [item, ...this.tableData];
    }
    this.onTableDataChange();
  }

}
