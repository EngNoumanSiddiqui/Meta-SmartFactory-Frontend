import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { WorkstationService } from 'app/services/dto-services/workstation/workstation.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { ProductTreeWorkstationProgramService } from 'app/services/dto-services/product-tree/product-tree-workstation-program.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { environment } from 'environments/environment';
@Component({
  selector: 'product-tree-workstation-program-new',
  templateUrl: './new.component.html'
})

export class NewProductTreeWorkstationProgramComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();

  @Input() productTreeDetailId;
  @Input() productTreeDetailOperationId;

  @Input('data') set x(data) {
    if (data) {
      if (data.workstationProgram) {
        data.workstationProgramId = data.workstationProgram.workstationProgramId;
      }
      this.dataModel = data;
    }
  };

  dataModel = {
    productTreeDetailWorkstationProgramId: null,
    workstationProgramId: null,
    workstationProgram: null,
    description: null,
    productTreeDetailOperationId: null,
    operationOrder: null,
    productTreeDetailId: null,
    plcCode: null,
    plcValue: null,
    unit: null

  };

  constructor(private loaderService: LoaderService,
    private _compSvc: ProductTreeWorkstationProgramService,
    private utilities: UtilitiesService,
    private _workStationService: WorkstationService) {

  }

  ngOnInit() {}

  save() {

    if (!this.dataModel.workstationProgramId) {

      this.utilities.showWarningToast('workstation-program-must-be-selected');
      return;
    }
    if(this.dataModel.plcValue){
      this.dataModel.plcValue = parseInt(this.dataModel.plcValue);
    }
    this.loaderService.showLoader();

    // if product tree detail id or operation  id is not null, that mean this workstation program  will be saved  or update standalone
    // if (this.productTreeDetailOperationId || this.productTreeDetailId) {
      this.dataModel.productTreeDetailOperationId = this.productTreeDetailOperationId;
      this.dataModel.productTreeDetailId = this.productTreeDetailId;
    //   console.log('@save', this.dataModel);
    //   this._compSvc.save(this.dataModel)
    //     .then(result => {
    //       this.loaderService.hideLoader();
    //       this.utilities.showSuccessToast('saved-success');
    //       setTimeout(() => {
    //         this.saveAction.emit(result);
    //       }, environment.DELAY);
    //     })
    //     .catch(error => {
    //       this.loaderService.hideLoader();
    //       this.utilities.showErrorToast(error);
    //     });
    // } else { // this mean feature will be saved after criteria saved
      this.saveAction.emit(this.dataModel);
      this.loaderService.hideLoader();
      this.utilities.showSuccessToast('saved-success');
    // }


  }


  setSelectedWorkstationProgram(criteria) {
    console.log('criteria', criteria)
    this.dataModel.workstationProgram = criteria;
    if (criteria) {
      this.dataModel.workstationProgramId = criteria.workstationProgramId;
      this.dataModel.description = criteria.description;
      this.dataModel.plcCode = criteria.plcCode;
      this.dataModel.plcValue = criteria.plcValue;
      this.dataModel.unit = criteria.unit;
    } else {
      this.dataModel.workstationProgramId = null;
    }

  }


}
