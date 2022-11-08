/**
 * Created by reis on 29.07.2019.
 */
import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import { UtilitiesService } from 'app/services/utilities.service';
@Component({
  selector: 'job-order-component-feature-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class JobOrderComponentFeatureListComponent implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;
  equipmentModal = {
    modal: null,
    data: null,
    id: null
  };

  @Input() jobOrderStockId;
  @Input() detailMode = false;
  tableData = [];

  @Input('tableData') set x(tableData) {
    if (tableData) {
      this.tableData = tableData;
    }
  }

  @Output() saveEvent = new EventEmitter();


  cols = [
    {field: 'jobOrderComponentFeatureId', header: 'component-feature-id'},
    {field: 'productTreeCriteria', header: 'criteria'},
    {field: 'criteriaMinValue', header: 'criteria-min-value'},
    {field: 'criteriaMaxValue', header: 'criteria-max-value'},
    {field: 'criteriaUnit', header: 'criteria-unit'},
  ];

  modal = {active: false};

  constructor(private _confirmationSvc: ConfirmationService,
              private _translateSvc: TranslateService,
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
    const clone = this.tableData.map(obj => ({...obj}));

    this.saveEvent.next(clone);
  }


  addOrUpdate(item) {

    if (this.equipmentModal.data) {// edit event
      this.equipmentModal.data.criteriaMinValue = item.criteriaMinValue;
      this.equipmentModal.data.criteriaMaxValue = item.criteriaMaxValue;
      this.equipmentModal.data.criteriaUnit = item.criteriaUnit;
      this.equipmentModal.data.productTreeCriteria = item.productTreeCriteria;
      this.equipmentModal.data.productTreeCriteriaId = item.productTreeCriteriaId;
    } else {// new event
      this.tableData = [item, ...this.tableData];
    }
    this.onTableDataChange();
  }

}
