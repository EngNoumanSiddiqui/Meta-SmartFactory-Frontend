import {Component, EventEmitter, Input, OnInit, Output, ViewChild, AfterViewInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
 
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { InspectionService } from 'app/services/dto-services/inspection-charateristics/inspection.service';
import { environment } from 'environments/environment';
import { UsersService } from 'app/services/users/users.service';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
@Component({
  selector: 'edit-inspection',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditInspectionComponent implements OnInit, AfterViewInit {
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

  id;
  selectedPlant: any;
  inspCharTypeList: any;

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

  constructor(
              private _router: Router,
              private _route: ActivatedRoute,
              private loaderService: LoaderService,
              private _userSvc: UsersService,
              private utilities: UtilitiesService,
              private _enumSvc: EnumService,
              private _inspSvc: InspectionService) {

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
    this._route.params.subscribe((params) => {
      this.id = params['id'];
      if (this.id) {
        this.inspChar.inspectionCharacteristicId = this.id;
        this.initialize(this.id);
      }
    });
  }

  ngAfterViewInit() {
    // this.showImages();
  }

  private initialize(id) {
    this.inspChar.inspectionCharacteristicId = this.id;
    this.loaderService.showLoader();

    this._inspSvc.detailInspCharacteristic(id).then(
      (result: any) => {
        this.loaderService.hideLoader();
        this.inspChar = {
          createDate: result.createDate ,
          inspectionCharacteristicCode: result.inspectionCharacteristicCode,
          inspectionCharacteristicId: result.inspectionCharacteristicId,
          inspectionCharacteristicName: result.inspectionCharacteristicName,
          inspectionCharacteristicShortText: result.inspectionCharacteristicShortText,
          inspectionCharacteristicStatus: result.inspectionCharacteristicStatus,
          plantId: result.plant ? result.plant.plantId : this.selectedPlant.plantId,
          qualityCatalogGroupList: result.qualityCatalogGroupList,
          qualityCharacteristicControlIndicatorList: result.qualityCharacteristicControlIndicatorList,
          qualityInspectionCharacteristicMethodList: result.qualityInspectionCharacteristicMethodList,
          qualityInspectionCharacteristicTypeId: result.qualityControlIndicatorTypeId,
          qualityInspectionCharacteristicType: result.qualityInspectionCharacteristicType,
          updateDate: result.updateDate,
          validFrom: result.validFrom ? new Date(result.validFrom) : null
        };
      },
      error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

  setSelectedPlant(event) {
    if (event) {
      this.inspChar.plantId = event;
    } else {
      this.inspChar.plantId = null;
    }
  }

  save() {
    this.loaderService.showLoader();
    if (!this.inspChar.inspectionCharacteristicStatus) {
      this.inspChar.inspectionCharacteristicStatus = 'READY';
    }
    this._inspSvc.saveInspCharacteristic(this.inspChar).then(
      result => {

        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.saveAction.emit('close');
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
