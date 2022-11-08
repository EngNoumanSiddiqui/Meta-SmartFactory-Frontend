import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { WorkstationService } from 'app/services/dto-services/workstation/workstation.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { environment } from 'environments/environment';
import * as moment from 'moment';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { UsersService } from 'app/services/users/users.service';
import { ShiftSettingsService } from 'app/services/dto-services/shift-setting/shift-setting.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
@Component({
  selector: 'factory-calendar-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class FactoryCalendarEditComponent implements OnInit {
  selectedPlant: any;
  
  @Output() saveAction = new EventEmitter<any>();
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
  factoryCalenderId = null;
  selectedIndex = -1;
  @Input('id') set calenderId (id) {
    if (id) {
      this.factoryCalenderId = id;
      this.initialize(id);
    }
  }
  @Input('data') set calenderdata (data) {
    if (data) {
      this.factoryCalenderId = data.factoryCalendarId;
      this.initializeData(data);
    }
  }
  events: any[];
  options: any;
  reqDto = {
    plantId: null,
    category: null,
    code: null,
    factoryCalendarId: null,
    factoryCalendarDetailList: [],
    defaultCalendar: false

  };
  calendarHoliday = {
    description: '',
    endTime: null,
    factoryCalendarCode: '',
    factoryCalendarId: null,
    factoryCalendarDetailId: null,
    startTime: null,
    code: null,
    workstationId: null,
    workstationName: null,
    holiday: false,
    shiftId: null,
    shiftName: null,
    workday: null,
    workdayName: null,
  };
  pDialog = {
    visible: false,
    title: ''
  };
  constructor(
    private workstationService: WorkstationService,
    private utilities: UtilitiesService,
    private _confirmationSvc: ConfirmationService,
    private _translateSvc: TranslateService,
    private _userSvc: UsersService,
    private shiftService: ShiftSettingsService,
    private loaderService: LoaderService,
  ) { 
    const setPlant = this._userSvc.getPlant();
    this.selectedPlant = JSON.parse(setPlant);
    // if (this.selectedPlant) {
    //   this.reqDto.plantId = this.selectedPlant.plantId;
    // }
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

  private initialize(id: string) {
    this.loaderService.showLoader();
    this.workstationService.getFactoryCalendarById(id).then(result => {
      this.loaderService.hideLoader();
      this.reqDto = result as any;
      if (this.reqDto.factoryCalendarDetailList) {
        this.reqDto.factoryCalendarDetailList.forEach(item => {
          if (item.shift) {
            item.shiftId = item.shift.shiftId;
            item.shiftName = item.shift.shiftName;
          }
          if(item.workstation) {
            item.workstationId =  item.workstation?.workStationId;
            item.workstationName = item.workstation?.workStationName;
          }
          // item.startTime = item.startTime ? moment(item.startTime).format('HH:mm:ss') : null;
          // item.endTime = item.endTime ? moment(item.endTime).format('HH:mm:ss') : null;
        })
      }
      // this.reqDto.plantId = result['plant'] ? result['plant'].plantId : null;
    }).catch(error => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(error);
    });
  }
  private initializeData(data) {
    
    const clonedData = JSON.parse(JSON.stringify(data));
    clonedData.plantId = clonedData?.plant?.plantId;
    
    delete clonedData?.plant;
    this.reqDto = JSON.parse(JSON.stringify(clonedData));
    if (this.reqDto.factoryCalendarDetailList) {
      this.reqDto.factoryCalendarDetailList.forEach(item => {
        if (item.shift) {
          item.shiftId = item.shift.shiftId;
          item.shiftName = item.shift.shiftName;
        }
        // item.startTime = item.startTime ? moment(item.startTime).format('HH:mm:ss') : null;
        // item.endTime = item.endTime ? moment(item.endTime).format('HH:mm:ss') : null;
      })
    }
    
  }

  openShiftModal(shiftId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.SHIFTSETTING, shiftId);
  }

  deleteHoliday(holiday, i) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        if (holiday.factoryCalendarDetailId) {
        this.workstationService.deleteFactoryCalendarHoliday(holiday.factoryCalendarDetailId)
          .then(() => {
            this.utilities.showSuccessToast('deleted-success');
            this.reqDto.factoryCalendarDetailList.splice(i, 1);
            this.reqDto.factoryCalendarDetailList = [... this.reqDto.factoryCalendarDetailList];
          })
          .catch(error => this.utilities.showErrorToast(error));
        } else {
          this.reqDto.factoryCalendarDetailList.splice(i, 1);
          this.reqDto.factoryCalendarDetailList = [... this.reqDto.factoryCalendarDetailList];
        }
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    })
  }
  setSelectedPlant(selectedPlantEvent) {
    if (selectedPlantEvent) {
      this.selectedPlant = selectedPlantEvent;
      this.reqDto.plantId = selectedPlantEvent.plantId;
    } else {
      this.reqDto.plantId = null;
    }
  }
  resetReqDto() {
    this.reqDto = {
      category: null,
      factoryCalendarId: this.reqDto.factoryCalendarId,
      code: null,
      plantId: this.selectedPlant ?  this.selectedPlant.plantId : null, 
      factoryCalendarDetailList : [],
      defaultCalendar: true
    }
  }
  resetCalendarHolidayDto() {
    this.calendarHoliday = {
      code: null,
      shiftId: null,
      shiftName: null,
      factoryCalendarId: this.factoryCalenderId,
      holiday: null,
      workstationId: null,
      workstationName: null,
      workday: null,
      workdayName: null,
      description: '',
      endTime: null,
      factoryCalendarCode: null,
      factoryCalendarDetailId: null,
      startTime: null
    };
  }
  openEditDialog(holiday, i) {
    this.selectedIndex = i;
    this.calendarHoliday = {
      code: holiday.code,
      factoryCalendarId: holiday.factoryCalendarId,
      shiftId: holiday.shiftId,
      workstationId: holiday.workstationId,
      workstationName: holiday.workstationName,
      shiftName: holiday.shiftName,
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
  
  onWorkDayChanged(event) {
    if (event) {
      this.calendarHoliday.workday = +event;
      this.calendarHoliday.workdayName = this.workDayList.find(itm => itm.workday === +event)?.workdayName;
    } else {
      this.calendarHoliday.workday = null;
      this.calendarHoliday.workdayName = null;
    }
  }
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
    });
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
    this.calendarHoliday.factoryCalendarCode = this.reqDto.code;
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
