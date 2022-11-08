import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PlantService} from 'app/services/dto-services/plant/plant.service';
import {LoaderService} from 'app/services/shared/loader.service';
import {UtilitiesService} from 'app/services/utilities.service';
import {environment} from '../../../../../environments/environment';
import {EnumService} from 'app/services/dto-services/enum/enum.service';
import {UsersService} from 'app/services/users/users.service';

@Component({
  selector: 'stop-cause-type-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();
  workcenters: any[];
  payLoadObject =
    {
      stopCauseTypeCode: null,
      stopCauseTypeId: null,
       groupType: null,
       plantId: null,
       orderNo: 0,
      stopCauseTypeName: null
    }
  id;
  EmployeeGroupeList = [];
  selectedPlant: any;


  @Input('data') set zdt(data) {
    if (data) {
      this.payLoadObject = Object.assign(this.payLoadObject, data);
      this.payLoadObject.plantId = this.selectedPlant.plantId;
    }
  };

  constructor(private _industryService: PlantService,
              private loaderService: LoaderService,
              private enumService: EnumService,
              private _userSvc: UsersService,
              private utilities: UtilitiesService,) {
    const setPlant = this._userSvc.getPlant();
    this.selectedPlant = JSON.parse(setPlant);
    if (this.selectedPlant) {
      this.payLoadObject.plantId = this.selectedPlant.plantId;
    }
  }

  ngOnInit() {
    this.enumService.getEmployeeGenericGroupTypeEnum().then(res => this.EmployeeGroupeList = res).catch(err => console.error(err));
  }



  save() {
    this.loaderService.showLoader();
    this._industryService.saveStopCause(this.payLoadObject)
      .then(() => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('updated-success');
        setTimeout(() => {
          this.saveAction.emit('close');
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });

  }

  reset() {
    this.payLoadObject = {
      plantId: this.payLoadObject?.plantId || this.selectedPlant?.plantId,
      stopCauseTypeCode: null,
      stopCauseTypeId: this.payLoadObject.stopCauseTypeId,
      groupType: null,
      orderNo: 0,
      stopCauseTypeName: null
    }
  }

}
