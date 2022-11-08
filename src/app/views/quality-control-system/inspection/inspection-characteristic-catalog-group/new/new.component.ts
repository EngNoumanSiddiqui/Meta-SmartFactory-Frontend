import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {environment} from '../../../../../../environments/environment';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { UsersService } from 'app/services/users/users.service';
import { QualityCatalogGroupService } from 'app/services/dto-services/quality-catalog-group/quality-catalog-group.service';
@Component({
  selector: 'quality-inspection-characteristic-catalog-group-new',
  templateUrl: './new.component.html'
})
export class NEWQualityInspectionCharacteristicCatalogGroupComponent implements OnInit {

  @ViewChild('myModal') public myModal: ModalDirective;
  @Output() saveAction = new EventEmitter<any>();

  @Input() qualityInspectionCharacteristicId = null;




  dataModel = {
    catalogGroupCode : null,
    catalogGroupId : null,
    catalogGroupName : null,
    catalogGroupTypeId : null,
    createDate: null,
    inspectionCharacteristicId: this.qualityInspectionCharacteristicId,
    updateDate: null,
  };
  inspectionMethodList: any;
  selectedPlant: any;

  @Input('data') set x(data) {
    if (data) {
      this.dataModel = data;
    }
  };

  constructor(private loaderService: LoaderService,
              private qualityCatalogSvc: QualityCatalogGroupService,
              private _userSvc: UsersService,
              private utilities: UtilitiesService) {
                const setPlant = this._userSvc.getPlant();
                this.selectedPlant = JSON.parse(setPlant);
                // if (this.selectedPlant) {
                //   this.dataModel.planningPlantId = this.selectedPlant.plantId;
                // }
  }

  ngOnInit() {

  }

  save() {

    // if (!this.dataModel.inspectionCharacteristicId) {

    //   this.utilities.showWarningToast('inspection-method-must-be-selected');
    //   return;
    // }

    this.loaderService.showLoader();

    // if qualityInspectionCharacteristicId  is not null, that mean this MEthod will be saved  or update standalone
    this.dataModel.inspectionCharacteristicId = this.qualityInspectionCharacteristicId;
    // if (this.qualityInspectionCharacteristicId) {
    //   this.qualityCatalogSvc.savecatalogGroup(this.dataModel)
    //     .then((result: any) => {
    //       this.loaderService.hideLoader();
    //       this.utilities.showSuccessToast('saved-success');
    //       setTimeout(() => {
    //         if (result.qualityCatalogGroupType) {
    //           result.catalogGroupTypeId = result.qualityCatalogGroupType.catalogGroupTypeId;
    //         }
    //         if (result.qualityInspectionCharacteristic) {
    //           result.inspectionCharacteristicId = result.qualityInspectionCharacteristic.inspectionCharacteristicId;
    //         }
            
    //         this.saveAction.emit(result);
    //       }, environment.DELAY);
    //     })
    //     .catch(error => {
    //       this.loaderService.hideLoader();
    //       this.utilities.showErrorToast(error);
    //     });
    // } else { 
      this.saveAction.emit(this.dataModel);
      this.loaderService.hideLoader();
      this.utilities.showSuccessToast('saved-success');
    // }


  }

}
