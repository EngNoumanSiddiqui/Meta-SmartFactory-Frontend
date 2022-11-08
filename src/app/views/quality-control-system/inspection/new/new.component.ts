import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'environments/environment';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { InspectionService } from 'app/services/dto-services/inspection-charateristics/inspection.service';
import { UsersService } from 'app/services/users/users.service';
import { InspectionCharacteristicTypeService } from 'app/services/dto-services/inspection-charateristics/inspection-characteristice-type.service';
import { EnumService } from 'app/services/dto-services/enum/enum.service';

@Component({
  selector: 'new-inspection',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewInspectionComponent implements OnInit {
  @Input() fromAutoComplete = false;
  @Output() saveAction = new EventEmitter<any>();

  inspChar = {
    createDate: null,
    inspectionCharacteristicCode: null,
    inspectionCharacteristicId: null,
    inspectionCharacteristicName: null,
    inspectionCharacteristicShortText: null,
    inspectionCharacteristicStatus: 'READY',
    plantId: null,
    validFrom: null,
    qualityCatalogGroupList: [
      // {
      //   catalogGroupCode: null,
      //   catalogGroupId: null,
      //   catalogGroupName: null,
      //   catalogGroupTypeId: null,
      //   createDate: null,
      //   inspectionCharacteristicId: null,
      //   updateDate: null
      // }
    ],
    qualityCharacteristicControlIndicatorList: [
      // {
      //   characteristicControlIndicatorCode: null,
      //   characteristicControlIndicatorId: null,
      //   createDate: null,
      //   qualityControlIndicatorResultId: null,
      //   qualityControlIndicatorSampleId: null,
      //   qualityControlIndicatorTypeId: null,
      //   qualityInspectionCharacteristicId: null,
      //   updateDate: null
      // }
    ],
    qualityInspectionCharacteristicMethodList: [
      // {
      //   createDate: null,
      //   inspectionCharacteristicMethodId: null,
      //   qualityInspectionCharacteristicId: null,
      //   qualityInspectionMethodId: null,
      //   updateDate: null
      // }
    ],
    qualityInspectionCharacteristicTypeId: null,
    qualityInspectionCharacteristicType: null,
    updateDate: null
  };
  selectedPlant: any;
  inspCharTypeList = [];


  constructor(
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _userSvc: UsersService,
    private _inspSvc: InspectionService,
    private _inspTypeSvc: InspectionCharacteristicTypeService,
    private _enumSvc: EnumService
  ) {
    const setPlant = this._userSvc.getPlant();
    this.selectedPlant = JSON.parse(setPlant);
    if (this.selectedPlant) {
      this.inspChar.plantId = this.selectedPlant.plantId;
    }
  }

  ngOnInit() {
    this._enumSvc.getQualityInspectionCharacteristicTypeEnum().then((res: any) => {
      this.inspCharTypeList = res;
    })
  }

  save() {
    this.loaderService.showLoader();
    this._inspSvc.saveInspCharacteristic(this.inspChar).then(
      result => {    
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.saveAction.emit('close');
        }, environment.DELAY);
      },
      error => {
        this.utilities.showErrorToast(error);
        this.loaderService.hideLoader();
      }
    );
  }
}
