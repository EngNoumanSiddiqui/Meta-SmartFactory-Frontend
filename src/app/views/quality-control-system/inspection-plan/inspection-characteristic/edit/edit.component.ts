import {Component, EventEmitter, Input, OnInit, Output, AfterViewInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
 
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { InspectionCharOpService } from 'app/services/dto-services/inspection-plan/inspection-characteristic.service';
import { environment } from 'environments/environment';
import { InspectionService } from 'app/services/dto-services/inspection-charateristics/inspection.service';
import { InspectionMethodService } from 'app/services/dto-services/inspection-method/inspection-method.service';
import { SamplingProcedureService } from 'app/services/dto-services/sampling-procedure/sampling-procedure.service';
import { UsersService } from 'app/services/users/users.service';
@Component({
  selector: 'edit-inspection-characteristic',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditInspectionCharOp implements OnInit, AfterViewInit {
  @Input() plantId = null;
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
  id;
  selectedPlant: any;

  // tableTypeForImg = TableTypeEnum.COMPANY;
  // @ViewChild(ImageAdderComponent, {static: false}) imageAdderComponent: ImageAdderComponent;
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
  inspectionCharList = [];

  inspectionMethods = [];
  
  samplingProcedures = [];

  @Output() saveAction = new EventEmitter<any>();
  lastAccountNos;

  constructor(
              private _route: ActivatedRoute,
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private _inspectionService: InspectionService,
              private _inspectionMethodSrv: InspectionMethodService,
              private _qualitySmaplingProcSvc: SamplingProcedureService,
              private _userSvc: UsersService,
              private _inspectionCharOpService: InspectionCharOpService) {
                const setPlant = this._userSvc.getPlant();
    this.selectedPlant = JSON.parse(setPlant);
  }

  ngOnInit() {
    this._route.params.subscribe((params) => {
      this.id = params['id'];
      if (this.id) {
        this.inspectionCharOp.inspectionCharacteristicOperationId = this.id;
        this.initialize(this.id);
      }
    });

    this._inspectionService.filterInspCharacteristic({pageNumber: 1, pageSize: 9999}).then((res: any) => this.inspectionCharList = res['content']);
    this._inspectionMethodSrv.filterInspectionMethod({pageNumber: 1, pageSize: 9999, plantId: this.selectedPlant ? this.selectedPlant.plantId : null }).then((res: any) => {
      this.inspectionMethods = res['content'];
    });
    this._qualitySmaplingProcSvc.filterSamplingProcedure({ pageNumber: 1, pageSize: 9999 }).then((res: any) => this.samplingProcedures = res['content']);
  }

  ngAfterViewInit() {
    // this.showImages();
  }

  private initialize(id) {
    this.inspectionCharOp.inspectionCharacteristicOperationId = this.id;
    this.loaderService.showLoader();

    this._inspectionCharOpService.detail(id).then(
      result => {
        this.loaderService.hideLoader();
        this.inspectionCharOp = {
          createDate: result['createDate'],
          inspectionCharacteristicOperationId: result['inspectionCharacteristicOperationId'],
          inspectionCharacteristicOperationCode: result['inspectionCharacteristicOperationCode'],
          lowerSpecificLimit: result['lowerSpecificLimit'],
          plantId: this.plantId,
          qualityInspectionCharacteristicId: result['qualityInspectionCharacteristic']?.inspectionCharacteristicId,
          qualityInspectionMethodId: result['qualityInspectionMethod']?.inspectionMethodId,
          qualityInspectionPlanOperationId: result['qualityInspectionPlanOperation']?.inspectionPlanOperationId,
          qualitySamplingProcedureId: result['qualitySamplingProcedure']?.samplingProcedureId,
          shortText: result['shortText'],
          updateDate: result['updateDate'],
          upperLimit: result['upperLimit'],
        };
      }).catch(
      error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
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
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }

  cancel() {
    this.saveAction.emit('close');
  }
}
