import {Component, Input, OnInit} from '@angular/core';
import {ConfirmationService} from 'primeng/api';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import {MeasuringDocumentService} from '../../../../../../services/dto-services/measuring/measuring-document.service';

@Component({
  selector: 'job-order-sensor-data-list',
  templateUrl: './sensor-data.component.html',
})

export class JobOrderSensorDataListComponent implements OnInit {
  jobOrderOperationId = 0;
  tableData = [];

  @Input('jobOrderOperationId') set jobOrderOperation(jobOrderOperationId) {
    if (jobOrderOperationId) {
      this.jobOrderOperationId = jobOrderOperationId;
      this.initialize(jobOrderOperationId);
    } else {
      this.jobOrderOperationId = null;
      this.tableData = [];
    }
  }

  cols = [
    {field: 'equipmentId', header: 'equipment-id'},
    {field: 'equipmentNo', header: 'equipment-no'},
    {field: 'equipmentName', header: 'equipment-name'}
  ];

  constructor(private _confirmationSvc: ConfirmationService,
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private measuringDocumentService: MeasuringDocumentService) {
  }

  ngOnInit() {
  }

  public initialize(jobOrderOperationId) {
    this.loaderService.showLoader();
    this.measuringDocumentService.getJobOrderOperationEquipmentSensorDataList(jobOrderOperationId)
      .then(result => {
        if ( Array.isArray(result) ) {
          this.tableData = result;
        }
        this.loaderService.hideLoader();
      })
      .catch(error => {
        this.tableData = [];
        this.utilities.showErrorToast(error);
        this.loaderService.hideLoader();
      });
  }
}
