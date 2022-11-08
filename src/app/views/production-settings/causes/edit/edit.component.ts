import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {StopCauseService} from '../../../../services/dto-services/stop-cause/stop-cause.service';
import {StopCauseTypeService} from '../../../../services/dto-services/stop-cause-type/stop-cause-type.service';

import {LoaderService} from '../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../services/utilities.service';
import {environment} from '../../../../../environments/environment';
import { ShiftSettingsService } from 'app/services/dto-services/shift-setting/shift-setting.service';
import * as moment from 'moment';
import { UsersService } from 'app/services/users/users.service';
@Component({
  selector: 'causes-edit',
  templateUrl: './edit.component.html'
})
export class EditCauseComponent implements OnInit {
  @Output()saveAction= new EventEmitter<any>();

  id;
  shiftList = [];
  selectedPlant: any;
  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };
  offset = moment().utcOffset();

  stopCause = {
    'stopCausesId': null,
    'stopCauseNo': null,
    'stopCauseName': null,
    'stopCauseTypeId': null,
    'shiftId': null,
    costRate: null,
    'plantId': null,
    'numberOfOccurancePerShift': null,
    'startTime': null,
    'description': null,
    stopMaster: false,
    affectEmployeePerformance: false,
    affectJobOrderPerformance: false,
    autoActive: false,
    'duration': null,
    'planned': null,
    'color': null,
    affectOeeAvilability: false,
    affectOeePerformance: false,
    workCenterId: null
  };

  stopCauseTypeList;
  stopCauseStatus;

  constructor(
              private _stopCauseSvc: StopCauseService,
              private _stopCauseTypeSvc: StopCauseTypeService,
              private shiftService: ShiftSettingsService,
              private _userSvc: UsersService,
              private loaderService: LoaderService, private utilities: UtilitiesService,
              private _router: Router) {

                this.selectedPlant = JSON.parse(this._userSvc.getPlant());
                // this.stopCause.plantId = this.selectedPlant ? this.selectedPlant.plantId : null;

   /* this._route.params.subscribe((params) => {
      this.id = params['id'];
      this.initialize(this.id);
      this.stopCause['stopCausesId'] = this.id;
    });*/
  }

  private initialize(id) {
    this.loaderService.showLoader();
    this.stopCause.stopCausesId = this.id;
    this._stopCauseSvc.getUpdateDetail(id)
      .then(result => {
        this.loaderService.hideLoader();
        if ((result['stopCauseNo'])) {
          this.stopCause['stopCauseNo'] = result['stopCauseNo'];
        }
        if ((result['stopCauseName'])) {
          this.stopCause['stopCauseName'] = result['stopCauseName'];
        }
        if ((result['stopCauseTye'])) {
          this.stopCause['stopCauseTypeId'] = result['stopCauseTye'].stopCauseTypeId;
        }
        if ((result['description'])) {
          this.stopCause['description'] = result['description'];
        }
        if (result['costRate']) {
          this.stopCause.costRate = parseInt(result['costRate'] * 100 + '')
        }
        if ((result['duration'])) {
          this.stopCause['duration'] = result['duration'];
          this.initializeDurations(result['duration']);
        }
        if ((result['planned'])) {
          this.stopCause['planned'] = result['planned'];
        } else {
          this.stopCause['planned'] = false;
        }
        if ((result['color'])) {
          this.stopCause['color'] = result['color'];
        }
        this.stopCause.stopMaster = result['stopMaster'];
        if ((result['plant'])) {
          this.stopCause['plantId'] = result['plant'].plantId;
        }
        if ((result['startTime'])) {
          this.stopCause['startTime'] = moment(result['startTime'].toString(), 'HH:mm:ss').add(this.offset, 'minutes').toDate();
        }
        if ((result['numberOfOccurancePerShift'])) {
          this.stopCause['numberOfOccurancePerShift'] = result['numberOfOccurancePerShift'];
        }
        if ((result['shift'])) {
          this.stopCause['shiftId'] = result['shift'].shiftId;
        }
        this.stopCause.affectEmployeePerformance = result['decreaseEmployeePerformance'] ? result['decreaseEmployeePerformance'] : false;
        this.stopCause.affectJobOrderPerformance = result['decreaseJobPerformance'] ? result['decreaseJobPerformance'] : false;
        this.stopCause.autoActive = result['autoActive'] ? result['autoActive'] : false;
        this.stopCause.affectOeeAvilability = result['affectOeeAvilability'] ? true : false;
        this.stopCause.affectOeePerformance = result['affectOeePerformance'] ? true : false;
        if ((result['workCenter'])) {
          this.stopCause['workCenterId'] = result['workCenter'].workCenterId;
        }
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
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

  cancel() {
    this._router.navigate(['/settings/causes']);
  }

  save() {
      this.loaderService.showLoader();
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
      if (this.selectedPlant) {
        this.stopCause.plantId = this.selectedPlant.plantId;
      }
      this._stopCauseSvc.update(this.stopCause)
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



  daysDuration = 0;
  hoursDuration = 0;
  minutesDuration = 0;
  secondsDuration = 0;
  millsDuration = 0;


  private durationsToSingle(): number {

    const val = this.daysDuration * ( 24 * 60 * 60 * 1000)
      + this.hoursDuration * (   60 * 60 * 1000)
      + this.minutesDuration * (   60 * 1000)
      + this.secondsDuration * ( 1000)
      + this.millsDuration;

    return val;
  }

  onSelectPlanned(event) {
    if(event) {
      this.stopCause.affectEmployeePerformance = false;
      this.stopCause.affectJobOrderPerformance = false;
      this.stopCause.affectOeeAvilability = false;
      this.stopCause.affectOeePerformance = false;
      this.stopCause.autoActive = false;
    } else {
      // this.stopCause.affectEmployeePerformance = true;
      // this.stopCause.affectJobOrderPerformance = true;
      // this.stopCause.affectOeeAvilability = true;
      // this.stopCause.autoActive = false;
    }
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

  selectWorkCenter(event) {
    if (event && event.hasOwnProperty('workCenterId')) {
      this.stopCause.workCenterId = event.workCenterId;
    } else {
      this.stopCause.workCenterId = null;
    }
  }

}

