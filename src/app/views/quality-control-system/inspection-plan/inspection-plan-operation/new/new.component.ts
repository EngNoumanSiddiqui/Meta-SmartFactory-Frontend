import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { InspectionPlanOperationService } from 'app/services/dto-services/inspection-plan/inspection-plan-operation.service';
import { QualityControlKeyServiceService } from 'app/services/dto-services/quality-control-key/quality-control-key-service.service';

@Component({
  selector: 'new-inspection-plan-operation',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewInspectionPlanOperation implements OnInit{
  @Output() saveAction = new EventEmitter<any>();
  
  @Input('inspectionPlanId') set setinspectionPlanId (inspectionPlanId) {
    if (inspectionPlanId) {
      this.inspectionPlanOperation.qualityInspectionPlanId = inspectionPlanId;
    }
  }

  @Input() plantId = null;

  inspectionPlanOperation = {
    createDate: null,
    inspectionPlanOperationId: null,
    inspectionPlanOperationCode: null,
    description: null,
    qualityControlKeyId: null,
    qualityInspectionOperationId: null,
    qualityInspectionPlanId: null,
    workCenterId: null,
    plantId: this.plantId,
    updateDate: null,
  };

  activeIndex = 0;
  controlKeys = [];
  inspectionPlanList = [];
  inspectionOperationList = [];

  constructor(
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _inspectionPlanOperationService: InspectionPlanOperationService,
    private _qualityControlKeyServiceService: QualityControlKeyServiceService,
    
    
  ) {}

  ngOnInit() {
    this._qualityControlKeyServiceService.filter({pageNumber: 1, pageSize: 9999}).then((res: any) => this.controlKeys = res['content']);
    // this._inspectionOperationsService.filterInspectionOperation({pageNumber: 1, pageSize: 9999}).then((res: any) => this.inspectionOperationList = res['content']);
    // this._inspectionPlanService.filterInspectionPlan({pageNumber: 1, pageSize: 9999}).then((res: any) => this.inspectionPlanList = res['content']);
  }

  // setSelectedPlant(event) {
  //   if (event) {
  //     this.inspectionPlanOperation.plantId = event;
  //   } else {
  //     this.inspectionPlanOperation.plantId = null;
  //   }
  // }

  save() {
    this.loaderService.showLoader();
    this.inspectionPlanOperation.plantId = this.plantId;
    this._inspectionPlanOperationService.saveInsPlanOperation(this.inspectionPlanOperation).then(
      (result: any) => {
        this.loaderService.hideLoader();
        this.inspectionPlanOperation.inspectionPlanOperationId = result.inspectionPlanOperationId;
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.saveAction.emit('close');
          this.activeIndex = 1;
        }, environment.DELAY);
      },
      error => {
        this.utilities.showErrorToast(error);
        this.loaderService.hideLoader();
      }
    );
  }
}
