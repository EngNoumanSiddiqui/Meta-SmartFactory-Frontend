import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { WorkstationService } from 'app/services/dto-services/workstation/workstation.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { environment } from 'environments/environment';
import * as moment from 'moment';
import { UsersService } from 'app/services/users/users.service';
import { ShiftSettingsService } from 'app/services/dto-services/shift-setting/shift-setting.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';

@Component({
  selector: 'factory-calendar-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class FactoryCalendarNewComponent implements OnInit {
  selectedPlant: any;
  events: any[];
  options: any;
  selectedIndex = -1;
  shiftList = [];
  workDayList = [
    {workday: 1, workdayName: 'Monday' },
    {workday: 1, workdayName: 'Tuesday' },
    {workday: 1, workdayName: 'Wednesday' },
    {workday: 1, workdayName: 'Thursday' },
    {workday: 1, workdayName: 'Friday' },
    {workday: 1, workdayName: 'Saturday' },
    {workday: 1, workdayName: 'Sunday' },
  ];
  reqDto = {
    factoryCalendarId: null,
    category: null,
    code: null,
    plantId: null,
    factoryCalendarDetailList: [],
    defaultCalendar: false
  }

  reqDetailDto = {
    code: null,
    createDate: null,
    description: null,
    endTime: null,
    factoryCalendarCode: null,
    factoryCalendarDetailId: null,
    // factoryCalendarId: null,
    holiday: null,
    shiftId: null,
    startTime: null,
    updateDate: null,
    workday: null,
    workdayName: null,
  };
  pDialog = {
    visible: false,
    title: ''
  };
  @Output() saveAction = new EventEmitter<any>();
  calendarHoliday = {
    description: '',
    endTime: null,
    factoryCalendarCode: '',
    workstationId : null,
    workstationName: null,
    factoryCalendarId: null,
    factoryCalendarDetailId: null,
    startTime: null,
    code: null,
    holiday: false,
    shiftId: null,
    workday: null,
    workdayName: null,
  };
  constructor(private workstationService: WorkstationService,
    private utilities: UtilitiesService,
    private shiftService: ShiftSettingsService,
    private _userSvc: UsersService,
    private loaderService: LoaderService,
    ) { 
      const setPlant = this._userSvc.getPlant();
      this.selectedPlant = JSON.parse(setPlant);
      if (this.selectedPlant) {
        this.reqDto.plantId = this.selectedPlant.plantId;
      }
    }
  ngOnInit() {
  
    if (this.selectedPlant) {
      this.shiftService.getShiftSettingsListByPlantId(this.selectedPlant.plantId).then((res: any) => {
        this.shiftList = res;
      });
    } else {
      this.shiftService.getShiftSettingsList().then((res: any) => {
        this.shiftList = res;
      });
    }
    
  }

  resetReqDto() {
    this.reqDto = {
      factoryCalendarId: null,
      category: null,
      code: null,
      plantId: null,
      factoryCalendarDetailList: [],
      defaultCalendar: true
    }
  }
  resetCalendarHolidayDto() {
    this.calendarHoliday = {
      code: null,
      workstationId: null,
      workstationName: null,
      shiftId: null,
      factoryCalendarId: null,
      holiday: null,
      workday: null,
      workdayName: null,
      description: '',
      endTime: null,
      factoryCalendarCode: null,
      factoryCalendarDetailId: null,
      startTime: null
    };
  }
  setSelectedPlant(selectedPlantEvent) {
    if (selectedPlantEvent) {
      this.selectedPlant = selectedPlantEvent;
      this.reqDto.plantId = selectedPlantEvent.plantId;
    } else {
      this.reqDto.plantId = null;
    }
  }

  deleteHoliday(holiday, i) {
    this.reqDto.factoryCalendarDetailList.splice(i, 1);
    this.reqDto.factoryCalendarDetailList = [... this.reqDto.factoryCalendarDetailList];
  }
  openEditDialog(holiday, i) {
    this.selectedIndex = i;
    this.calendarHoliday = {
      code: holiday.code,
      factoryCalendarId: holiday.factoryCalendarId,
      shiftId: holiday.shiftId,
      workstationId: holiday.workstationId,
      workstationName: holiday.workstationName,
      holiday: holiday.holiday,
      workday: holiday.workday,
      workdayName: holiday.workdayName,
      description: holiday.description,
      startTime: holiday.startTime ? new Date(holiday.startTime) : null,
      endTime: holiday.endTime ? new Date(holiday.endTime) : null,
      factoryCalendarCode: holiday.factoryCalendarCode,
      factoryCalendarDetailId: holiday.factoryCalendarDetailId
    };
    this.pDialog.title = 'factory-calendar-detail-information';
    this.pDialog.visible = true;
  }
  // onWorkDayChanged(event) {
  //   if (event) {
  //     this.calendarHoliday.workdayName = this.workDayList.find(itm => itm.workday === +event)?.workdayName;
  //   } else {
  //     this.calendarHoliday.workdayName = null;
  //   }
  // }
  // onWorkDaysChanged(dayName: string, event) {
  //   if (event) {
  //     this.reqDto.workDays[dayName] = event;
  //   } else {
  //     if (this.reqDto.workDays[dayName]) {
  //       delete this.reqDto.workDays[dayName];
  //     }
  //   }
  // }
  addFactoryCalendar() {
    this.loaderService.showLoader();
    this.workstationService.saveFactoryCalendar(this.reqDto).then(dt => {
      this.utilities.showSuccessToast('saved-success');
      this.loaderService.hideLoader();
      setTimeout(() => {
        this.resetReqDto();
        this.saveAction.emit('close');
      }, environment.DELAY);
    }).catch(err => {
      this.utilities.showErrorToast(err);
      this.loaderService.hideLoader();
    })
  }

  openShiftModal(shiftId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.SHIFTSETTING, shiftId);
  }

  addCalendarHoliday() {
    // this.loaderService.showLoader();
    if (this.calendarHoliday.shiftId) {
      this.calendarHoliday.shiftId = +this.calendarHoliday.shiftId;
    }
    if (this.calendarHoliday.holiday) {
      this.calendarHoliday.workday = 0;
      this.calendarHoliday.workdayName = null;
      this.calendarHoliday.holiday = true;
    } else {
      this.calendarHoliday.workday = 1;
      this.calendarHoliday.holiday = false;
    }
    // this.calendarHoliday.factoryCalendarCode = this.reqDto.code;
    this.calendarHoliday.factoryCalendarId = this.reqDto.factoryCalendarId;
    const clonedItem = JSON.parse(JSON.stringify(this.calendarHoliday));
    // clonedItem.startTime = clonedItem.startTime ? moment(clonedItem.startTime).format('HH:mm:ss') : null;
    // clonedItem.endTime = clonedItem.endTime ? moment(clonedItem.endTime).format('HH:mm:ss') : null;
    if (this.selectedIndex !== -1) {
      this.reqDto.factoryCalendarDetailList.splice(this.selectedIndex, 1, clonedItem);
    } else {
      this.reqDto.factoryCalendarDetailList.push(clonedItem);
    }
    this.pDialog.visible = false;
    // // this.calendarHoliday.startTime = ConvertUtil.localDate2UTC(this.calendarHoliday.startTime);
    // // this.calendarHoliday.endTime = ConvertUtil.localDate2UTC(this.calendarHoliday.endTime);
    // this.workstationService.saveFactoryCalendarHoliday(this.calendarHoliday).then(dt => {
    //   this.utilities.showSuccessToast('saved-success');
    //   this.loaderService.hideLoader();
    //   setTimeout(() => {
    //     this.resetCalendarHolidayDto();
    //     // this.saveAction.emit('close');
    //     this.pDialog.visible = false;
    //   }, environment.DELAY);
    // }).catch(err => {
    //   this.utilities.showErrorToast(err);
    //   this.loaderService.hideLoader();
    // });
  }

}
