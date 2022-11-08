import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';

@Component({
  selector: 'job-order-operation-new',
  templateUrl: './new.component.html'
})
export class NewJobOrderOperationComponent implements OnInit {


  @Output() saveAction = new EventEmitter<any>();

  @Input() productTreeDetailId;

  @Input('data') set x(data) {
    if (data) {
      this.dataModel = data;
    }
  };


  dataModel = {
    jobOrderOperationId: null,
    quantity: null,
    description: null,
    operationId: null,
    operationName: null,
    operation: null,

  };

  constructor(private loaderService: LoaderService,
    private utilities: UtilitiesService) {

  }

  ngOnInit() {

  }

  save() {

    if (!this.dataModel.operationId) {
      this.utilities.showWarningToast('operation-must-be-selected');
      return;
    }

console.log('operation Id selected', this.dataModel.operationId)

    this.loaderService.showLoader();
    this.saveAction.emit(this.dataModel);
    this.loaderService.hideLoader();
    this.utilities.showSuccessToast('saved-success');



  }

  setSelectedStock(operation) {
    if (operation) {
      this.dataModel.operationId = operation.operationId;
      this.dataModel.operationName = operation.operationName;
      this.dataModel.operation = operation;
    } else {
      this.dataModel.operationId = null;
      this.dataModel.operationName = null;
      this.dataModel.operation = null;
    }
  }


}
