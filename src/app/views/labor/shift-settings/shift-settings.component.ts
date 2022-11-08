import {ConfirmationService} from 'primeng/api';
import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {UtilitiesService} from '../../../services/utilities.service';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {ShiftSettingsRequestDto, ShiftSettingsResponseDto} from '../../../dto/shift/shift.dto';
import {ShiftSettingsService} from '../../../services/dto-services/shift-setting/shift-setting.service';
import {environment} from 'environments/environment';
import * as moment from 'moment';
import { AppStateService } from 'app/services/dto-services/app-state.service';

import { Subscription } from 'rxjs';
import { LoaderService } from 'app/services/shared/loader.service';
import {ConvertUtil} from '../../../util/convert-util';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'shift-settings',
  templateUrl: './shift-settings.component.html',
  styles: [],
  providers: [ConfirmationService]
})
export class ShiftSettingsComponent implements OnInit, OnDestroy {
  offset = moment().utcOffset();
  @ViewChild('myModal') public myModal: ModalDirective;
  @ViewChild('myModalEdit') public myModalEdit: ModalDirective;
  selectedColumns = [
    {field: 'shiftNo', header: 'shift-no'},
    {field: 'shiftName', header: 'shift-name'},
    {field: 'shiftOrderNo', header: 'shift-order-no'},
    {field: 'plant', header: 'plant'},
    {field: 'startTime', header: 'start-time'},
    {field: 'finishTime', header: 'finish-time'},
    {field: 'description', header: 'description'},
    {field: 'maxChangeOverCount', header: 'schedule-max-change-over-count'},
  ];
  shiftRequestDto: ShiftSettingsRequestDto = new ShiftSettingsRequestDto();
  takenShiftList: ShiftSettingsResponseDto[];
  updateShiftData: ShiftSettingsResponseDto = new ShiftSettingsResponseDto();
  editID: number;
  sub: Subscription;
  selectedPlant: any;
  isDetailMode =  false;

  constructor(private utilities: UtilitiesService,
    private appStateService: AppStateService,
    private loadingService: LoaderService,
    private _confirmationSvc: ConfirmationService,
    private _translateSvc: TranslateService,
    private shiftService: ShiftSettingsService) {
    // this.shiftRequestDto.startTime = new Date();
    // this.shiftRequestDto.startTime.setHours(6);
    // this.shiftRequestDto.startTime.setMinutes(0);
    // this.shiftRequestDto.startTime.setSeconds(0);
    // this.shiftRequestDto.endTime = new Date();
    // this.shiftRequestDto.endTime.setHours(14);
    // this.shiftRequestDto.endTime.setMinutes(0);
    // this.shiftRequestDto.endTime.setSeconds(0);
  }


  ngOnInit() {
    this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
      if (res) {
        this.selectedPlant = res;
        this.shiftRequestDto.plantId = res.plantId;
        this.getShiftSettingsListByPlantId(res.plantId);
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  getShiftSettingsList() {
    const me = this;
    this.loadingService.showLoader();
    this.shiftService.getShiftSettingsList().then(res => {
      this.takenShiftList = res as ShiftSettingsResponseDto[];
      this.takenShiftList.forEach(item => {
        item.startTime = ConvertUtil.UTCTime2LocalTime(item.startTime);
        item.endTime = ConvertUtil.UTCTime2LocalTime(item.endTime);
      });
      this.loadingService.hideLoader();
      // this.takenShiftList.forEach(item => {
      //   item.startTime = moment(item.startTime.toString(), 'HH:mm:ss').add(me.offset, 'minutes').toDate();
      //   item.endTime = moment(item.endTime.toString(), 'HH:mm:ss').add(me.offset, 'minutes').toDate();
      // });
      // return me.takenShiftList;
    }).catch(e => {
      this.loadingService.hideLoader();
    });
  }
  showPlant(plantId) {
    if (plantId) {
      this.loadingService.showDetailDialog(DialogTypeEnum.PLANT, plantId);
    }
  }
  getShiftSettingsListByPlantId(plantId: number) {
    const me = this;
    this.loadingService.showLoader();
    this.shiftService.getShiftSettingsListByPlantId(plantId).then(res => {
      this.takenShiftList = res as ShiftSettingsResponseDto[];
      this.takenShiftList.forEach(item => {
        item.startTime = ConvertUtil.UTCTime2LocalTime(item.startTime);
        item.endTime = ConvertUtil.UTCTime2LocalTime(item.endTime);
      });
      this.loadingService.hideLoader();
      // this.takenShiftList.forEach(item => {
      //   item.startTime = moment(item.startTime.toString(), 'HH:mm:ss').add(me.offset, 'minutes').toDate();
      //   item.endTime = moment(item.endTime.toString(), 'HH:mm:ss').add(me.offset, 'minutes').toDate();
      // });
      // return me.takenShiftList;
    }).catch(e => {
      this.loadingService.hideLoader();
    });
  }

  saveShiftSetting(myModal) {
    if (this.shiftRequestDto) {
      // this.shiftRequestDto.startTime = <any> moment(this.shiftRequestDto.startTime.toString()).format('HH:mm:ss');
      // this.shiftRequestDto.endTime = <any> moment(this.shiftRequestDto.endTime.toString()).format('HH:mm:ss');
      // const mydate = new Date().toISOString();
      // const splitedDate = mydate.split('T');
      // this.shiftRequestDto.startTime = <any> ( splitedDate[0] + 'T' + this.shiftRequestDto.startTime + 'Z');
      // this.shiftRequestDto.endTime = <any> ( splitedDate[0] + 'T' + this.shiftRequestDto.endTime + 'Z');
      this.loadingService.showLoader();
      this.shiftService.saveShiftSettings(this.shiftRequestDto).then(r => {
        this.loadingService.hideLoader();
        this.utilities.showSuccessToast('Save Success');
        this.getShiftSettingsListByPlantId(this.selectedPlant.plantId);
        myModal.hide();
        setTimeout(() => {
          this.reset();
        }, environment.DELAY);

      })
        .catch(e => {
          this.utilities.showErrorToast('Save not success!!');
          this.loadingService.hideLoader();
        });
    }

  }

  updateShiftSettings(myModalEdit) {
    // this.updateShiftData.startTime = <any> moment(this.updateShiftData.startTime.toString()).format('HH:mm:ss');
    // this.updateShiftData.endTime = <any> moment(this.updateShiftData.endTime.toString()).format('HH:mm:ss');
    // const mydate = new Date().toISOString();
    // const splitedDate = mydate.split('T');
    // this.updateShiftData.startTime = <any> ( splitedDate[0] + 'T' + this.updateShiftData.startTime + 'Z');
    // this.updateShiftData.endTime = <any> ( splitedDate[0] + 'T' + this.updateShiftData.endTime + 'Z');

    this.loadingService.showLoader();
    this.shiftService.updateShiftSettings(this.updateShiftData).then(r => {
      this.loadingService.hideLoader();
      this.utilities.showSuccessToast('Save Success')
      this.getShiftSettingsListByPlantId(this.selectedPlant.plantId);
      myModalEdit.hide();
      setTimeout(() => {
        this.reset();
      }, environment.DELAY);

    })
      .catch(e => {
        this.utilities.showErrorToast('Save not success!!');
        this.loadingService.hideLoader();
      });
  }

  deleteShiftSetting(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this.shiftService.delete(id).then(() => {
          this.utilities.showSuccessToast('deleted-success');
          this.getShiftSettingsListByPlantId(this.selectedPlant.plantId);
        }).catch(e => {
          this.utilities.showErrorToast('Error on Delete request!!');
        });
      },
      reject: () => {
        this.utilities.showInfoToast('canceled-operation');
      }
    })
  }

  modalShow() {
    this.myModal.show();
  }

  reset() {
    this.shiftRequestDto.description = null;
    this.shiftRequestDto.startTime = null;
    this.shiftRequestDto.endTime = null;
    this.shiftRequestDto.shiftNo = null;
    this.shiftRequestDto.shiftName = null;
  }

  editModal(i, isdetail= false) {
    this.editID = i;
    // console.log('@formatCheck', this.takenShiftList);
    this.updateShiftData.shiftId = this.takenShiftList[i].shiftId;
    this.updateShiftData.shiftName = this.takenShiftList[i].shiftName;
    this.updateShiftData.shiftNo = this.takenShiftList[i].shiftNo;
    this.updateShiftData.shiftOrderNo = this.takenShiftList[i].shiftOrderNo;
    this.updateShiftData.plantId = this.takenShiftList[i].plant ? this.takenShiftList[i].plant.plantId : null;
    this.updateShiftData.description = this.takenShiftList[i].description;
    this.updateShiftData.maxChangeOverCount = this.takenShiftList[i].maxChangeOverCount;
    if (isdetail) {
      this.isDetailMode = true;
      this.updateShiftData.startTime = this.takenShiftList[i].startTime;
      this.updateShiftData.endTime = this.takenShiftList[i].endTime;
    } else {
      this.isDetailMode = false;
      this.updateShiftData.startTime = moment(this.takenShiftList[i].startTime.toString(), 'HH:mm:ss').toDate();
      this.updateShiftData.endTime = moment(this.takenShiftList[i].endTime.toString(), 'HH:mm:ss').toDate();
    }
    this.myModalEdit.show();
  }

  openPlantModal(plantId) {
    this.loadingService.showDetailDialog(DialogTypeEnum.PLANT, plantId);
  }


  getReadableTime(time) {
    const millisecond = new Date(time).getTime();
    return ConvertUtil.longDuration2DHHMMSSTime(millisecond);
  }
}
