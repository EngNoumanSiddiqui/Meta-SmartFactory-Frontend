/**
 * Created by reis on 29.07.2019.
 */
import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {UtilitiesService} from '../../../../../services/utilities.service';
@Component({
  selector: 'quality-inspection-characteristic-catalog-group-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class QualityInspectionCharacteristicCatalogGroupListComponent implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;
  inspCatalogModal = {
    modal: null,
    data: null,
    id: null
  };

  @Input() detailMode = false;
  @Input() inspectionCharacteristicId;

  tableData = [];

  @Input('tableData') set x(tableData) {
    if (tableData) {
      this.tableData = tableData;
    }
  }

  @Output() saveEvent = new EventEmitter();
  cols = [
    // {field: 'inspectionCharacteristicId', header: 'inspection-characteristic-id'},
    {field: 'catalogGroupId', header: 'catalog-group-id'},
    {field: 'catalogGroupName', header: 'catalog-group-name'},
    {field: 'catalogGroupCode', header: 'catalog-group-code'},
    {field: 'catalogGroupTypeId', header: 'catalog-group-type'},
  ];

  modal = {active: false};

  constructor(private _confirmationSvc: ConfirmationService,
              private _translateSvc: TranslateService,
              private utilities: UtilitiesService) {
  }

  ngOnInit() {
  }


  modalShow(id, mod: string, data) {

    this.inspCatalogModal.id = id;
    this.inspCatalogModal.modal = mod;
    this.inspCatalogModal.data = data;

    this.modal.active = true;
  }


  delete(id, index) {

    if (id) {
      this._confirmationSvc.confirm({
        message: this._translateSvc.instant('do-you-want-to-delete'),
        header: this._translateSvc.instant('delete-confirmation'),
        icon: 'fa fa-trash',
        accept: () => {
          // this.mOrderTypeTypeSvc.delete(id)
          //   .then(() => {
          //     this.utilities.showSuccessToast('deleted-success');
          //     this.tableData.splice(index, 1)
          //     this.tableData = [...this.tableData];
          //     this.onTableDataChange();
          //   })
          //   .catch(error => this.utilities.showErrorToast(error));
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
    if (this.inspCatalogModal.data) {// edit event
      this.tableData.splice(this.tableData
      .findIndex(itm => itm.catalogGroupId === this.inspCatalogModal.data.catalogGroupId), 1, item);
    } else {// new event
      this.tableData = [item, ...this.tableData];
    }
    this.onTableDataChange();
  }

}
