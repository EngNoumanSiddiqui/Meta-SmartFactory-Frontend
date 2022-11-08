/**
 * Created by reis on 29.07.2019.
 */
import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import { UtilitiesService } from 'app/services/utilities.service';
@Component({
  selector: 'job-order-workstation-program-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class JobOrderWorkstationProgramListComponent implements OnInit {
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
    {field: 'operationOrder', header: 'operation-order'},
    // {field: 'jobOrderWorkstationProgramId', header: 'job-order-workstation-program-id'},
    {field: 'workstationProgram', header: 'workstation-program'},
    {field: 'description', header: 'description'},
  ]

  modal = {active: false};

  constructor(private _confirmationSvc: ConfirmationService,
              private _translateSvc: TranslateService,
              private utilities: UtilitiesService) {
  }

  ngOnInit() {
    if (this.detailMode) {
      this.cols = [
        {field: 'jobOrderWorkstationProgramId', header: 'job-order-workstation-program-id'},
        {field: 'workstationProgramId', header: 'workstation-program-id'},
        {field: 'description', header: 'description'},
        {field: 'operationOrder', header: 'operation-order'},
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

      this.tableData.splice(index, 1);
      this.tableData = [...this.tableData];
      this.onTableDataChange();
  }

  onTableDataChange() {
    this.saveEvent.next(this.tableData);
  }


  addOrUpdate(item) {

    if (this.equipmentModal.data) {// edit event
      this.equipmentModal.data.description = item.description;
      this.equipmentModal.data.workstationProgramId = item.workstationProgramId;
      this.equipmentModal.data.workstationProgramDescription = item.workstationProgramDescription;
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
