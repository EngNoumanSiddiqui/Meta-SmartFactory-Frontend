import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {environment} from '../../../../../../environments/environment';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { InspectionMethodService } from 'app/services/dto-services/inspection-method/inspection-method.service';
import { UsersService } from 'app/services/users/users.service';
import { InspectionCharacteristicMethodService } from 'app/services/dto-services/inspection-method/inspection-characteristic-method.service';
@Component({
  selector: 'quality-inspection-characteristic-method-new',
  templateUrl: './new.component.html'
})
export class NEWQualityInspectionCharacteristicMethodComponent implements OnInit {

  @ViewChild('myModal') public myModal: ModalDirective;
  @Output() saveAction = new EventEmitter<any>();

  @Input() qualityInspectionCharacteristicId = null;




  dataModel = {
    createDate: null,
    inspectionCharacteristicMethodId: null,
    qualityInspectionCharacteristicId: null,
    qualityInspectionMethodId: this.qualityInspectionCharacteristicId,
    updateDate: null,
  };
  inspectionMethodList: any;
  selectedPlant: any;

  id;
  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  @Input('data') set x(data) {
    if (data) {
      this.dataModel = data;
    }
  };

  constructor(private loaderService: LoaderService,
              private inspectionMethodSrv: InspectionMethodService,
              private inspectionCharacteristicMethodSrv: InspectionCharacteristicMethodService,
              private _userSvc: UsersService,
              private utilities: UtilitiesService) {
                const setPlant = this._userSvc.getPlant();
                this.selectedPlant = JSON.parse(setPlant);
                // if (this.selectedPlant) {
                //   this.dataModel.planningPlantId = this.selectedPlant.plantId;
                // }
  }

  ngOnInit() {

    this.inspectionMethodSrv.filterInspectionMethod({pageNumber: 1, pageSize: 9999, plantId: this.selectedPlant ? this.selectedPlant.plantId : null }).then((res: any) => {
      this.inspectionMethodList = res['content'];
    });

  }

  save() {

    if (!this.dataModel.qualityInspectionMethodId) {

      this.utilities.showWarningToast('inspection-method-must-be-selected');
      return;
    }

    this.dataModel.qualityInspectionMethodId = +this.dataModel.qualityInspectionMethodId;

    this.loaderService.showLoader();
    this.dataModel.qualityInspectionCharacteristicId = this.qualityInspectionCharacteristicId;
    // if qualityInspectionCharacteristicId  is not null, that mean this MEthod will be saved  or update standalone
    // if (this.qualityInspectionCharacteristicId) {
    //   this.inspectionCharacteristicMethodSrv.saveinspectionCharacteristicMethod(this.dataModel)
    //     .then((result: any) => {
    //       this.loaderService.hideLoader();
    //       this.utilities.showSuccessToast('saved-success');
    //       setTimeout(() => {
    //         if (result.qualityInspectionCharacteristic) {
    //           result.qualityInspectionCharacteristicId = result.qualityInspectionCharacteristic.inspectionCharacteristicId;
    //         }
    //         if (result.qualityInspectionMethod) {
    //           result.qualityInspectionMethodId = result.qualityInspectionMethod.inspectionMethodId;
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


  private initialize(id) {
    // this.controlIndicator.controlIndicatorId = this.id;
    this.loaderService.showLoader();

    this.inspectionCharacteristicMethodSrv.detailinspectionCharacteristicMethod(id).then(
      (result: any) => {
        this.loaderService.hideLoader();

        this.dataModel = {
          createDate: result.createDate,
          inspectionCharacteristicMethodId: result.inspectionCharacteristicMethodId,
          qualityInspectionCharacteristicId: result.qualityInspectionCharacteristicId || this.qualityInspectionCharacteristicId,
          qualityInspectionMethodId: result.qualityInspectionMethod?.inspectionMethodId,
          updateDate: result.updateDate,
        };
      },
      error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

}
