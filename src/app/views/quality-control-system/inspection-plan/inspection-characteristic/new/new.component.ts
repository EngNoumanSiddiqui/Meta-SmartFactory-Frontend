import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { InspectionCharOpService } from 'app/services/dto-services/inspection-plan/inspection-characteristic.service';
import { InspectionService } from 'app/services/dto-services/inspection-charateristics/inspection.service';
import { InspectionMethodService } from 'app/services/dto-services/inspection-method/inspection-method.service';
import { UsersService } from 'app/services/users/users.service';
import { SamplingProcedureService } from 'app/services/dto-services/sampling-procedure/sampling-procedure.service';


@Component({
  selector: 'new-inspection-characteristic',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewInspectionCharOp implements OnInit {

  @Input() fromAutoComplete = false;
  @Input() plantId = null;
  
  @Input('qualityInspectionPlanOperationId') set setqualityInspectionPlanOperationId(qualityInspectionPlanOperationId) {
    if (qualityInspectionPlanOperationId) {
      this.inspectionCharOp.qualityInspectionPlanOperationId = qualityInspectionPlanOperationId;
    }
  }

  @Output() saveAction = new EventEmitter<any>();

  inspectionCharOp = {
    createDate: null,
    inspectionCharacteristicOperationId: null,
    inspectionCharacteristicOperationCode: null,
    lowerSpecificLimit: null,
    qualityInspectionCharacteristicId: null,
    qualityInspectionMethodId: null,
    qualityInspectionPlanOperationId: null,
    qualitySamplingProcedureId: null,
    plantId: null,
    shortText: null,
    updateDate: null,
    upperLimit: null,
  };

  inspectionCharList = [];

  inspectionMethods = [];
  
  samplingProcedures = [];

  selectedPlant: any;

  constructor(
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _inspectionCharOpService: InspectionCharOpService,
    private _inspectionService: InspectionService,
    private _inspectionMethodSrv: InspectionMethodService,
    private _userSvc: UsersService,
    private _qualitySmaplingProcSvc: SamplingProcedureService
  
  ) {
    const setPlant = this._userSvc.getPlant();
    this.selectedPlant = JSON.parse(setPlant);
  }

  ngOnInit() {
    this._inspectionService.filterInspCharacteristic({pageNumber: 1, pageSize: 9999}).then((res: any) => this.inspectionCharList = res['content']);
    this._inspectionMethodSrv.filterInspectionMethod({pageNumber: 1, pageSize: 9999, plantId: this.selectedPlant ? this.selectedPlant.plantId : null }).then((res: any) => {
      this.inspectionMethods = res['content'];
    });
    this._qualitySmaplingProcSvc.filterSamplingProcedure({ pageNumber: 1, pageSize: 9999 }).then((res: any) => this.samplingProcedures = res['content']);
  }

  save() {
    this.loaderService.showLoader();
    this.inspectionCharOp.plantId = this.selectedPlant.plantId;
    this._inspectionCharOpService.save(this.inspectionCharOp).then(
      result => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.saveAction.emit('close');
        }, environment.DELAY);
      }).catch(
      error => {
        this.utilities.showErrorToast(error);
        this.loaderService.hideLoader();
      }
    );
  }
}
