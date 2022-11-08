import {Component, EventEmitter, Input, OnInit, Output, AfterViewInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
 
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { InspectionPlanOperationService } from 'app/services/dto-services/inspection-plan/inspection-plan-operation.service';
import { environment } from 'environments/environment';
import { QualityControlKeyServiceService } from 'app/services/dto-services/quality-control-key/quality-control-key-service.service';
@Component({
  selector: 'edit-inspection-plan-operation',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditInspectionPlanOperation implements OnInit {
  @Input() plantId = null;
  inspectionPlanOperation = {
    createDate: null,
    inspectionPlanOperationId: null,
    inspectionPlanOperationCode: null,
    description: null,
    qualityControlKeyId: null,
    plantId: null,
    qualityInspectionOperationId: null,
    qualityInspectionPlanId: null,
    workCenterId: null,
    workCenter: null,
    updateDate: null,
  };

  activeIndex = 0;
  controlKeys = [];
  inspectionPlanList = [];
  inspectionOperationList = [];

  constructor(
    private _route: ActivatedRoute,
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _inspectionPlanOperationService: InspectionPlanOperationService,
    private _qualityControlKeyServiceService: QualityControlKeyServiceService,
    
  ) {}

  ngOnInit() {
    this._route.params.subscribe((params) => {
      this.id = params['id'];
      if (this.id) {
        this.inspectionPlanOperation.inspectionPlanOperationId = this.id;
        this.initialize(this.id);
      }
    });
    this._qualityControlKeyServiceService.filter({pageNumber: 1, pageSize: 9999}).then((res: any) => this.controlKeys = res['content']);
    // this._inspectionOperationsService.filterInspectionOperation({pageNumber: 1, pageSize: 9999}).then((res: any) => this.inspectionOperationList = res['content']);
    // this._inspectionPlanService.filterInspectionPlan({pageNumber: 1, pageSize: 9999}).then((res: any) => this.inspectionPlanList = res['content']);
  }

  id;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  myModal;

  params = {
    cityDisabled: true,
    dialog: {
      title: '',
      inputText: '',
      inputValue: ''
    },
    displayDialog: false,
  };

  @Output() saveAction = new EventEmitter<any>();
  lastAccountNos;

  private initialize(id) {
    this.inspectionPlanOperation.inspectionPlanOperationId = this.id;
    this.loaderService.showLoader();

    this._inspectionPlanOperationService.detailInsPlanOperation(id).then(
      (result: any) => {
        this.loaderService.hideLoader();

        this.inspectionPlanOperation = {
          createDate: result.createDate,
          plantId: this.plantId,
          inspectionPlanOperationId: result.inspectionPlanOperationId,
          inspectionPlanOperationCode: result.inspectionPlanOperationCode,
          description: result.description,
          qualityControlKeyId: result.qualityControlKey ? result.qualityControlKey.qmControlKeyId : null,
          qualityInspectionOperationId: result.qualityInspectionOperation ? result.qualityInspectionOperation.inspectionOperationId : null,
          qualityInspectionPlanId: result.qualityInspectionPlan ? result.qualityInspectionPlan.inspectionPlanId : null,
          workCenterId: result.workCenter ? result.workCenter.workCenterId : null,
          workCenter: result.workCenter,
          updateDate: result.updateDate,
        };
        
      },
      error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

  save() {
    this.loaderService.showLoader();
    this.inspectionPlanOperation.plantId = this.plantId;
    this._inspectionPlanOperationService.updateInsPlanOperation(this.inspectionPlanOperation).then(
      result => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.saveAction.emit('close');
          this.activeIndex = 1;
        }, environment.DELAY);
      },
      error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }

  cancel() {
    this.saveAction.emit('close');
  }
}
