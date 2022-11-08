/**
 * Created by reis on 29.07.2019.
 */
import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {ConfirmationService} from 'primeng/api';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
@Component({
  selector: 'job-order-equipment-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class JobOrderEquipmentListComponent implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;
  equipmentModal = {
    modal: null,
    data: null,
    id: null
  };

  @Input() detailMode = false;

  tableData = [];

  @Input('tableData') set x(tableData) {
    if (tableData) {
      this.tableData = tableData;
    }
  }

  @Output() saveEvent = new EventEmitter();


  cols = [
    {field: 'jobOrderEquipmentId', header: 'job-order-equipment-id'},
    // {field: 'stockNo', header: 'equipment-no'},
    {field: 'stock', header: 'equipment'},
    {field: 'count', header: 'quantity'},
  ];

  modal = {active: false};

  constructor(private _confirmationSvc: ConfirmationService,
    private loaderService: LoaderService,
              private utilities: UtilitiesService) {
  }

  ngOnInit() {
    if (this.detailMode) {
      this.cols = [
        {field: 'jobOrderEquipmentId', header: 'job-order-equipment-id'},
        {field: 'stockNo', header: 'equipment-no'},
        {field: 'stockName', header: 'equipment'},
        {field: 'count', header: 'quantity'},
        {field: 'capacity', header: 'capacity'},
      ]
    }
  }


  modalShow(id, mod: string, data) {

    this.equipmentModal.id = id;
    this.equipmentModal.modal = mod;
    this.equipmentModal.data = data;

    this.modal.active = true;
  }

  showEquipmentDetail(equipmentId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.STOCK, equipmentId);
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
      this.equipmentModal.data.count = item.count;
      this.equipmentModal.data.equipment = item.equipment;
      this.equipmentModal.data.equipmentId = item.equipmentId;
    } else {// new event
      this.tableData = [item, ...this.tableData];
    }
    this.onTableDataChange();
  }

}
