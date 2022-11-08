/**
 * Created by reis on 29.07.2019.
 */
import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {UtilitiesService} from '../../../../../services/utilities.service';
import { InspectionCharacteristicMethodService } from 'app/services/dto-services/inspection-method/inspection-characteristic-method.service';
@Component({
  selector: 'quality-inspection-characteristic-method-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class QualityInspectionCharacteristicMethodListComponent implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;
  inspMethodModal = {
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
    // {field: 'qualityInspectionCharacteristicId', header: 'inspection-characteristic-id'},
    {field: 'inspectionCharacteristicMethodId', header: 'inspection-characteristic-method-id'},
    {field: 'qualityInspectionMethodId', header: 'inspection-method-id'},
    {field: 'createDate', header: 'create-date'},
  ];

  modal = {active: false};

  constructor(private _confirmationSvc: ConfirmationService,
    private inspectionCharacteristicMethod: InspectionCharacteristicMethodService,
              private _translateSvc: TranslateService,
              private utilities: UtilitiesService) {
  }

  ngOnInit() {
  }


  modalShow(id, mod: string, data) {

    this.inspMethodModal.id = id;
    this.inspMethodModal.modal = mod;
    this.inspMethodModal.data = data;

    this.modal.active = true;
  }


  delete(id, index) {

    if (id) {
      this._confirmationSvc.confirm({
        message: this._translateSvc.instant('do-you-want-to-delete'),
        header: this._translateSvc.instant('delete-confirmation'),
        icon: 'fa fa-trash',
        key: 'control-indicator-method',
        accept: () => {
          this.inspectionCharacteristicMethod.deleteinspectionCharacteristicMethod(id)
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
    if (this.inspMethodModal.data) {// edit event
      this.tableData.splice(this.tableData
        .findIndex(itm => itm.inspectionCharacteristicMethodId === this.inspMethodModal.data.inspectionCharacteristicMethodId), 1, item);
    } else {// new event
      this.tableData = [item, ...this.tableData];
    }
    this.onTableDataChange();
  }

}
