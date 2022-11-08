import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {LoaderService} from 'app/services/shared/loader.service';
import {UtilitiesService} from 'app/services/utilities.service';

import {environment} from 'environments/environment';

import {PlantService} from 'app/services/dto-services/plant/plant.service';
import {EnumService} from 'app/services/dto-services/enum/enum.service';
import {UsersService} from 'app/services/users/users.service';

@Component({
  selector: 'stop-cause-type-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();
  payLoadObject =
    {
      stopCauseTypeCode: null,
       orderNo: null,
      stopCauseTypeId: null,
      groupType: null,
      plantId: null,
      stopCauseTypeName: null
    }
  id;
  params = {
    dialog: {title: '', inputValue: ''}
  };
  EmployeeGroupeList = [];
  selectedPlant: any;

  constructor(private _router: Router,
              private _plantService: PlantService,
              private loaderService: LoaderService,
              private enumService: EnumService,
              private _userSvc: UsersService,
              private utilities: UtilitiesService) {
    const setPlant = this._userSvc.getPlant();
    this.selectedPlant = JSON.parse(setPlant);
    if (this.selectedPlant) {
      this.payLoadObject.plantId = this.selectedPlant.plantId;
    }
  }

  ngOnInit() {

    this.enumService.getEmployeeGenericGroupTypeEnum().then(res => this.EmployeeGroupeList = res).catch(err => console.error(err));
  }

  reset() {
    this.payLoadObject = {
        groupType: null,
        orderNo: null,
        stopCauseTypeCode: null,
        stopCauseTypeId: null,
        plantId: this.payLoadObject.plantId,
        stopCauseTypeName: null
      }

  }

  save() {
    this.loaderService.showLoader();
    this._plantService.saveStopCause(this.payLoadObject)
      .then(result => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.reset();
          this.saveAction.emit(result);
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }

}
