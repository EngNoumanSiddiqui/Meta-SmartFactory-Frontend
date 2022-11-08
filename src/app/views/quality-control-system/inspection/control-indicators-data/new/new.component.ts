import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import { environment } from 'environments/environment';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { ControlIndicatorDataService } from 'app/services/dto-services/inspection-charateristics/control-indicator-data/controlIndicatorData.service';

@Component({
  selector: 'new-control-indicator-data',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewControlIndicatorDataComponent implements OnInit {
  @Input() fromAutoComplete = false;
  @Output() saveAction = new EventEmitter<any>();
  @Input() isUpperLimitChecked: boolean;
  @Input() qualityCharacteristicControlIndicatorId: any = null;
  @Input() characteristicControlIndicatorId: any;

  controlIndicatorData = {
    characteristicControlIndicatorDataCode: null,
    characteristicControlIndicatorDataId: null,
    characteristicControlIndicatorId: null,
    createDate: null,
    decimalPlaces: null,
    decimalPlacesUnit: null,
    lowerSpecificLimit: null,
    qualityCharacteristicControlIndicatorId: this.qualityCharacteristicControlIndicatorId,
    targetValue: null,
    updateDate: null,
    upperLimit: null,
  };
  id: any;


  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  constructor(
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _controlIndicatorData: ControlIndicatorDataService,
  ) {
  }

  ngOnInit(): void {
    this.controlIndicatorData.characteristicControlIndicatorId = this.characteristicControlIndicatorId;
    this.controlIndicatorData.qualityCharacteristicControlIndicatorId = this.qualityCharacteristicControlIndicatorId;
  }

  private initialize(id) {
    this.controlIndicatorData.characteristicControlIndicatorDataId = this.id;
    this.loaderService.showLoader();

    this._controlIndicatorData.detailControlIndicatorData(id).then(
      (result: any) => {
        this.loaderService.hideLoader();
        this.controlIndicatorData = {
          characteristicControlIndicatorDataCode: result.characteristicControlIndicatorDataCode,
          characteristicControlIndicatorDataId: result.characteristicControlIndicatorDataId,
          characteristicControlIndicatorId: result.characteristicControlIndicatorId,
          createDate: result.createDate,
          decimalPlaces: result.decimalPlaces,
          decimalPlacesUnit: result.decimalPlacesUnit,
          lowerSpecificLimit: result.lowerSpecificLimit,
          qualityCharacteristicControlIndicatorId: result.qualityCharacteristicControlIndicator ? result.qualityCharacteristicControlIndicator.characteristicControlIndicatorId : this.characteristicControlIndicatorId,
          targetValue: result.targetValue,
          updateDate: result.updateDate,
          upperLimit: result.upperLimit,
        };

      },
      error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }


  setSelectedUnit(unit) {
    if (unit) {
      this.controlIndicatorData.decimalPlacesUnit = unit;
    } else {
      this.controlIndicatorData.decimalPlacesUnit = null;
    }
  }

  save() {
    this.controlIndicatorData.qualityCharacteristicControlIndicatorId = this.qualityCharacteristicControlIndicatorId;
    // if (this.qualityCharacteristicControlIndicatorId) {
    //   this.loaderService.showLoader();
    //   this._controlIndicatorData.saveControlIndicatorData(this.controlIndicatorData).then(
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
      this.saveAction.emit(this.controlIndicatorData);
    // }
  }
}
