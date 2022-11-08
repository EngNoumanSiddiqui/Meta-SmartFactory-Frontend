import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { environment } from 'environments/environment';
import { ProductTreeDetailQualityPlanOperationCreateDto } from 'app/dto/product-tree/quality-plan.dto';
import { QualityControlKeyServiceService } from 'app/services/dto-services/quality-control-key/quality-control-key-service.service';
import { ProductTreeDetailQualityPlanOperationService } from 'app/services/dto-services/product-tree/prod-tree-quality-plan-operation-service';

@Component({
  selector: 'product-tree-quality-plan-operation-new',
  templateUrl: './new.component.html'
})

export class ProductTreeQualityPlanOperationNewComponent implements OnInit {

  @Output() saveAction = new EventEmitter<any>();

  @Input('data') set x(data) {
    console.log('@ProductTreeQualityPlanOperationData', data)
    if (data) {
      this.referenceItemDto = data;
      this.dataModel.createDate = data.createDate;
      this.dataModel.description = data.description;
      this.dataModel.productTreeDetailQualityPlanOperationCode = data.productTreeDetailQualityPlanOperationCode;
      this.dataModel.productTreeDetailQualityPlanOperationId = data.productTreeDetailQualityPlanOperationId;
      if (data.qualityControlKey) {
        this.dataModel.qualityControlKeyId = data.qualityControlKey.qmControlKeyId;
      if (data.qualityInspectionOperation) {
        this.dataModel.qualityInspectionOperationId = data.qualityInspectionOperation.qualityInspectionOperationId;
      }
      if (data.qualityPlan) {
        this.dataModel.qualityPlanId = data.qualityPlan.qualityPlanId;
      }
      if (data.workCenter) {
        this.dataModel.workCenterId = data.workCenter.workCenterId;
      }
      }

    }
  };

  @Input() productTreeDetailId;
  dataModel: ProductTreeDetailQualityPlanOperationCreateDto = {
    createDate: null,
    description: null,
    productTreeDetailQualityPlanOperationCode: null,
    productTreeDetailQualityPlanOperationId: null,
    qualityControlKeyId: null,
    qualityInspectionOperationId: null,
    qualityPlanId: null,
    updateDate: null,
    workCenterId: null

  };

  referenceItemDto: any;

  controlKeys = [];

  constructor(private loaderService: LoaderService,
    private _utilitiesSvc: UtilitiesService,
    private _qualityControlKeySvc: QualityControlKeyServiceService,
    private _pTreeDetailQualityPlanOperationSvc: ProductTreeDetailQualityPlanOperationService) { }

  ngOnInit() {
    this._qualityControlKeySvc.filter({ pageNumber: 1, pageSize: 9999 }).then((res: any) => this.controlKeys = res['content']);
  }

  save() {
    this.loaderService.showLoader();
    this._pTreeDetailQualityPlanOperationSvc.save(this.dataModel)
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
}
