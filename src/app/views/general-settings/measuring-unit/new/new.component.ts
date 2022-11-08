import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {Message} from 'primeng';
import {LoaderService} from '../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../services/utilities.service';
import {environment} from '../../../../../environments/environment';
import { UsersService } from 'app/services/users/users.service';
import { MeasuringUnitService } from 'app/services/dto-services/measuring/measuring-unit.service';

@Component({
  selector: 'measuring-unit-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewMeasuringUnitComponent implements OnInit {
  msgs: Message[] = [];
@Output() saveAction = new EventEmitter<any>();
  measuringUnitDto = {
    alternativeUnit: null,
    baseUnit: null,
    createDate: null,
    denominator: null,
    equipmentId: null,
    numerator: null,
    stockId: null,
    stockUnitMeasureId: null,
    unitType: null,
    updateDate: null,
    workStationId: null
  };
  selectedPlant: any;
  measuringUnitList: any;


  constructor(private _router: Router,
              private _translateSvc: TranslateService,
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private _userSvc: UsersService,
              private _measuringUnitSvc: MeasuringUnitService) {
                const setPlant = this._userSvc.getPlant();
                this.selectedPlant = JSON.parse(setPlant);
  }

  ngOnInit() {

    this._measuringUnitSvc.getMeasuringUnitList().then((res: any) => {
      this.measuringUnitList = res;
    }).catch(err => console.error(err));

  }

  onmeasuringUnitSelected(event) {
    if (event === 'TIME') {
      this.measuringUnitDto.baseUnit = 'MINUTE';

    } else if (event === 'DISTANCE') {
      this.measuringUnitDto.baseUnit = 'MM';

    } else if (event === 'WEIGHT') {
      this.measuringUnitDto.baseUnit = 'GR';

    }
  }

  reset() {
    this.measuringUnitDto = {
      alternativeUnit: null,
      baseUnit: null,
      createDate: null,
      denominator: null,
      equipmentId: null,
      numerator: null,
      stockId: null,
      stockUnitMeasureId: null,
      unitType: null,
      updateDate: null,
      workStationId: null
    };
  }


  save() {
    this.loaderService.showLoader();
    this._measuringUnitSvc.save(this.measuringUnitDto)
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

  /************************* TOASTR & PRIME NG Messages  *************************/
  // Prime NG Growl in other ways Toaster
  showMessage(severity: string, summary: string, detail: string) {
    this.msgs.push({
      severity: severity,
      summary: this._translateSvc.instant(summary),
      detail: this._translateSvc.instant(detail)
    });
    setTimeout(() => {
      this.clearMessage();
    }, 1500);
  }

  clearMessage() {
    this.msgs = [];
  }

  showError(error) {
    let mess = '';
    if (error.toString().indexOf('fieldErrors') > 0) {
      error = JSON.parse(error);
    }
    if (error['fieldErrors'] && error['fieldErrors'].length > 0) {
      for (const msg of error['fieldErrors']) {
        mess += this.msgs + '<strong>' + msg['field'].toString() + '</strong> :' + msg['message'].toString() + '</br>';
      }
      this.showMessage('error', 'error', mess);
    } else if (error['errorCode']) {
      this.showMessage('error', 'error', error['errorCode']);
    } else {
      this.showMessage('error', 'error', error);
    }
  }

  // setSelectedWarehouse(event) {
  //   if (event && event.hasOwnProperty('wareHouseId')) {
  //     this.wareHouse.parentId = event.wareHouseId;
  //   } else {
  //     this.wareHouse.parentId = null;
  //   }

  // }
}
