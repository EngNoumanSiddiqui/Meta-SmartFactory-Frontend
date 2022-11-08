import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { environment } from 'environments/environment';
import { ProductTreeDetailQualityPlanCharacCreateDto } from 'app/dto/product-tree/quality-plan.dto';
import { SamplingProcedureService } from 'app/services/dto-services/sampling-procedure/sampling-procedure.service';
import { ProductTreeDetailQualityPlanCharacService } from 'app/services/dto-services/product-tree/prod-tree-quality-plan-charac-service';

@Component({
  selector: 'product-tree-quality-plan-characteristic-new',
  templateUrl: './new.component.html'
})

export class ProductTreeQualityPlanCharacteristicNewComponent implements OnInit {

  @Output() saveAction = new EventEmitter<any>();

  @Input('data') set x(data) {
    console.log('@data', data)
    if (data) {
      this.dataModel.productTreeDetailQualityPlanCharacOperationId = data.productTreeDetailQualityPlanCharacOperationId;
      this.dataModel.productTreeDetailQualityPlanCharacOperationCode = data.productTreeDetailQualityPlanCharacOperationCode;
      this.dataModel.lowerSpecific = data.lowerSpecific;
      this.dataModel.upperLimit = data.upperLimit;
      if(data.qualityInspectionCharacteristic)
        this.dataModel.qualityInspectionCharacteristicId = data.qualityInspectionCharacteristic.inspectionCharacteristicId;
      if(data.qualityInspectionMethod)
        this.dataModel.qualityInspectionCharacteristicId = data.qualityInspectionCharacteristic.inspectionMethodId;
      if(data.qualitySamplingProcedure)
        this.dataModel.qualitySamplingProcedureId = data.qualitySamplingProcedure.samplingProcedureId;
    }
  };

  dataModel: ProductTreeDetailQualityPlanCharacCreateDto = {
    createDate: null,
    lowerSpecific: null,
    productTreeDetailQualityPlanCharacOperationCode: null,
    productTreeDetailQualityPlanCharacOperationId: null,
    qualityInspectionCharacteristicId: null,
    qualityInspectionMethodId: null,
    qualityPlanOperationId: null,
    qualitySamplingProcedureId: null,
    updateDate: null,
    upperLimit: null

  };

  samplingProcedures = [];

  constructor(
    private loaderService: LoaderService,
    private _utilitiesSvc: UtilitiesService,
    private _pTreeDEtailQualityPlanCharacSvc: ProductTreeDetailQualityPlanCharacService,
    private _qualitySmaplingProcSvc: SamplingProcedureService) { }

  ngOnInit() {
    this._qualitySmaplingProcSvc.filterSamplingProcedure({ pageNumber: 1, pageSize: 9999 }).then((res: any) => this.samplingProcedures = res['content']);
  }

  save() {
    this.loaderService.showLoader();
    this._pTreeDEtailQualityPlanCharacSvc.save(this.dataModel)
      .then(result => {
        this.loaderService.hideLoader();
        this._utilitiesSvc.showSuccessToast('saved-success');
        setTimeout(() => {
          this.saveAction.emit(result);
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this._utilitiesSvc.showErrorToast(error);
      });
  }

  onSelectedInspChar(inspCharac){
    if(inspCharac)
    this.dataModel.qualityInspectionCharacteristicId = inspCharac.inspCharId
  }
}
