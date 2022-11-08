/**
 * Created by reis on 29.07.2019.
 */
import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import { UtilitiesService } from 'app/services/utilities.service';
import { ProductTreeComponentFeatureService } from 'app/services/dto-services/product-tree/product-tree-component-feature.service';
@Component({
  selector: 'product-tree-component-feature-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ProductTreeComponentFeatureListComponent implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;
  equipmentModal = {
    modal: null,
    data: null,
    id: null
  };

  @Input() productTreeDetailComponentId;
  @Input() detailMode = false;

  @Input() tableData = [];

  @Output() saveEvent = new EventEmitter();


  cols = [
    {field: 'productTreeDetailComponentFeatureId', header: 'component-feature-id'},
    {field: 'productTreeCriteria', header: 'criteria'},
    {field: 'criteriaMinValue', header: 'criteria-min-value'},
    {field: 'criteriaMaxValue', header: 'criteria-max-value'},
    {field: 'criteriaUnit', header: 'criteria-unit'},
  ];

  modal = {active: false};

  constructor(private _confirmationSvc: ConfirmationService,
              private _translateSvc: TranslateService,
              private utilities: UtilitiesService,
              private mOrderTypeTypeSvc: ProductTreeComponentFeatureService) {
  }

  ngOnInit() {
  }


  modalShow(id, mod: string, data) {

    this.equipmentModal.id = id;
    this.equipmentModal.modal = mod;
    this.equipmentModal.data = data;
    const a  = this.tableData;
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
    const clone= this.tableData.map(obj => ({...obj}));

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
