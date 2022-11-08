
import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {StopCauseTypeService} from '../../../../services/dto-services/stop-cause-type/stop-cause-type.service';
import {StopCauseService} from '../../../../services/dto-services/stop-cause/stop-cause.service';
import {LoaderService} from '../../../../services/shared/loader.service';
import {environment} from '../../../../../environments/environment';
import {UtilitiesService} from '../../../../services/utilities.service';
import { ShiftSettingsService } from 'app/services/dto-services/shift-setting/shift-setting.service';
import { UsersService } from 'app/services/users/users.service';

@Component({
  selector: 'causes-new',
  templateUrl: './new.component.html'
})
export class NewCauseComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();
  stopCause = {
    'stopCauseNo': null,
    'stopCauseName': null,
    'stopCauseTypeId': null,
    'shiftId': null,
    'plantId': null,
    'numberOfOccurancePerShift': null,
    'startTime': null,
    'description': null,
    'duration': null,
    'planned': false,
    'costRate': null,
    stopMaster: false,
    affectEmployeePerformance: true,
    affectJobOrderPerformance: true,
    autoActive: false,
    'color': '#d1043e',
    affectOeeAvilability: true,
    affectOeePerformance: false,
    workCenterId: null
  };

  stopCauseTypeList;
  stopCauseStatus;


  daysDuration = 0;
  hoursDuration = 0;
  minutesDuration = 0;
  secondsDuration = 0;
  millsDuration = 0;
  shiftList = [];
  selectedPlant: any;

  constructor(private _router: Router,
              private _stopCauseSvc: StopCauseService,
              private _stopCauseTypeSvc: StopCauseTypeService,
              private shiftService: ShiftSettingsService,
              private _userSvc: UsersService,
              private loaderService: LoaderService, private utilities: UtilitiesService) {
                this.selectedPlant = JSON.parse(this._userSvc.getPlant());
                this.stopCause.plantId = this.selectedPlant ? this.selectedPlant.plantId : null;

  }

  ngOnInit() {

    if (this.selectedPlant) {
      this._stopCauseTypeSvc.getIdNameListByPlant(this.selectedPlant.plantId).then(result3 => this.stopCauseTypeList = result3).catch(error => console.log(error));

      this.shiftService.getShiftSettingsListByPlantId(this.selectedPlant.plantId).then((res: any) => {
        this.shiftList = res;
      }).catch(e => {
        console.error(e);
      });
    } else {
      this.shiftService.getShiftSettingsList().then((res: any) => {
        this.shiftList = res;
      }).catch(e => {
        console.error(e);
      });
    }
  }

  goPage() {
    this._router.navigate(['/settings/causes']);
  }

  reset() {
    this.initializeDurations(0);
    this.stopCause = {
      'stopCauseNo': null,
      'stopCauseName': null,
      'stopCauseTypeId': null,
      'shiftId': null,
      'plantId': this.stopCause.plantId,
      stopMaster: false,
      'numberOfOccurancePerShift': null,
      'costRate': null,
      'startTime': null,
      affectEmployeePerformance: false,
      affectJobOrderPerformance: false,
      autoActive: false,
      'description': null,
      'duration': null,
      'planned': null,
      'color': '#d1043e',
      affectOeeAvilability: false,
      affectOeePerformance: false,
      workCenterId: null
    };
  }

  save() {
    if(this.stopCause.planned) {
      this.stopCause.duration = this.durationsToSingle();
    } else {
      this.stopCause.duration = null;
      this.stopCause.startTime = null;
      this.stopCause.shiftId = null;
      this.stopCause.numberOfOccurancePerShift = null;
    }
    if(this.stopCause.costRate) {
      this.stopCause.costRate = parseFloat((this.stopCause.costRate/100).toFixed(2))
    }
    // this.stopCause.duration = this.durationsToSingle();
    this.loaderService.showLoader();
    this.stopCause.plantId  = this.selectedPlant?.plantId;
    this._stopCauseSvc.save(this.stopCause)
      .then(() => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.reset();
          this.saveAction.emit('close');
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });

  }


  private initializeDurations(duration) {
    if (duration) {
      let val = duration;
      this.daysDuration = Math.floor(val / ( 24 * 60 * 60 * 1000));
      val -= this.daysDuration * ( 24 * 60 * 60 * 1000);
      this.hoursDuration = Math.floor(val / (   60 * 60 * 1000));
      val -= this.hoursDuration * (60 * 60 * 1000);
      this.minutesDuration = Math.floor(val / (   60 * 1000));
      val -= this.minutesDuration * ( 60 * 1000);
      this.secondsDuration = Math.floor(val / ( 1000));
      val -= this.secondsDuration * (1000);
      this.millsDuration = Math.floor(val);
    }

  }

  onSelectPlanned(event) {
    if(event) {
      this.stopCause.affectEmployeePerformance = false;
      this.stopCause.affectJobOrderPerformance = false;
      this.stopCause.affectOeeAvilability = false;
      this.stopCause.affectOeePerformance = false;
      this.stopCause.autoActive = false;
    } else {
      this.stopCause.affectEmployeePerformance = true;
      this.stopCause.affectJobOrderPerformance = true;
      this.stopCause.affectOeeAvilability = true;
      this.stopCause.autoActive = false;
    }
  }


  private durationsToSingle(): number {
    const val = this.daysDuration * ( 24 * 60 * 60 * 1000)
      + this.hoursDuration * (   60 * 60 * 1000)
      + this.minutesDuration * (   60 * 1000)
      + this.secondsDuration * ( 1000)
      + this.millsDuration;

    return val;
  }

  selectWorkCenter(event) {
    if (event && event.hasOwnProperty('workCenterId')) {
      this.stopCause.workCenterId = event.workCenterId;
    } else {
      this.stopCause.workCenterId = null;
    }
  }

}

