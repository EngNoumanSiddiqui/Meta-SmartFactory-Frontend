import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { ControlIndicatorService } from 'app/services/dto-services/inspection-charateristics/control-indicator/controlIndicator.service';
import { EnumService } from 'app/services/dto-services/enum/enum.service';

@Component({
  selector: 'new-control-indicator',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewControlIndicator implements OnInit {
  @Input() fromAutoComplete = false;
  controlIndicatorTypeList: any;
  
  @Input('inspectionCharacteristicId') qualityInspectionCharacteristicId =null;
  @Output() saveAction = new EventEmitter<any>();


  id;
  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };
  @Input('data') set setzdata(data) {
    if (data) {
        this.controlIndicator = {
          characteristicControlIndicatorCode: data.characteristicControlIndicatorCode,
          characteristicControlIndicatorId: data.characteristicControlIndicatorId,
          createDate: data.createDate,
          qualityControlIndicatorResultId: data.qualityControlIndicatorResultId,
          qualityControlIndicatorResult: data.qualityControlIndicatorResult,
          qualityControlIndicatorSampleId: data.qualityControlIndicatorSampleId,
          qualityControlIndicatorSample: data.qualityControlIndicatorSample,
          qualityCharacteristicControlIndicatorType: data.qualityCharacteristicControlIndicatorType,
          qualityInspectionCharacteristicId: this.qualityInspectionCharacteristicId || data.qualityInspectionCharacteristic?.qualityInspectionCharacteristicId,
          updateDate: data.updateDate
        };
    }
  };


  controlIndicator = {
    characteristicControlIndicatorCode: null,
    characteristicControlIndicatorId: null,
    createDate: null,
    qualityControlIndicatorResultId: null,
    qualityControlIndicatorResult: null,
    qualityControlIndicatorSampleId: null,
    qualityControlIndicatorSample: null,
    qualityCharacteristicControlIndicatorType: null,
    qualityInspectionCharacteristicId: this.qualityInspectionCharacteristicId,
    updateDate: null
  };

  constructor(
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _controlIndicator: ControlIndicatorService,
    private enumService: EnumService,
  ) {}

  ngOnInit() {
    this.enumService.getQualityCharacteristicControlIndicatorTypeEnum().then((res: any) => this.controlIndicatorTypeList = res);
    
  }


  save() {
    this.controlIndicator.qualityInspectionCharacteristicId = this.qualityInspectionCharacteristicId;
    // if (this.controlIndicator.qualityInspectionCharacteristicId) {
    //   this.loaderService.showLoader();
    //   this._controlIndicator.saveControlIndicator(this.controlIndicator).then(
    //     result => {
    //       this.loaderService.hideLoader();
    //       this.utilities.showSuccessToast('saved-success');
    //       setTimeout(() => {
    //         this.saveAction.emit(result);
    //       }, environment.DELAY);
    //     },
    //     error => {
    //       this.utilities.showErrorToast(error);
    //       this.loaderService.hideLoader();
    //     }
    //   );
    // } else {
      this.saveAction.emit(this.controlIndicator);
    // }
  }

  private initialize(id) {
    // this.controlIndicator.controlIndicatorId = this.id;
    this.loaderService.showLoader();

    this._controlIndicator.detailControlIndicator(id).then(
      (result: any) => {
        this.loaderService.hideLoader();
        this.controlIndicator = {
          characteristicControlIndicatorCode: result.characteristicControlIndicatorCode,
          characteristicControlIndicatorId: result.characteristicControlIndicatorId,
          createDate: result.createDate,
          qualityControlIndicatorResultId: result.qualityControlIndicatorResultId,
          qualityControlIndicatorResult: result.qualityControlIndicatorResult,
          qualityControlIndicatorSampleId: result.qualityControlIndicatorSampleId,
          qualityControlIndicatorSample: result.qualityControlIndicatorSample,
          qualityCharacteristicControlIndicatorType: result.qualityCharacteristicControlIndicatorType,
          qualityInspectionCharacteristicId: this.qualityInspectionCharacteristicId || result.qualityInspectionCharacteristic?.qualityInspectionCharacteristicId,
          updateDate: result.updateDate
        };
      },
      error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

  onSelectControlIndicatorSample(event) {
    if (event) {
      this.controlIndicator.qualityControlIndicatorSample = event;
      this.controlIndicator.qualityControlIndicatorSampleId = event.controlIndicatorSampleId;
    } else {
      this.controlIndicator.qualityControlIndicatorSample = null;
      this.controlIndicator.qualityControlIndicatorSampleId = null;
    }
  }
  onSelectControlIndicatorResult(event) {
    if (event) {
      this.controlIndicator.qualityControlIndicatorResult = event;
      this.controlIndicator.qualityControlIndicatorResultId = event.controlIndicatorSampleId;
    } else {
      this.controlIndicator.qualityControlIndicatorResult = null;
      this.controlIndicator.qualityControlIndicatorResultId = null;
    }
  }
}
