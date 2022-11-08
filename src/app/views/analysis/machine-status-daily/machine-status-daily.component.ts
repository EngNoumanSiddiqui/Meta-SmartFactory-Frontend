import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, OnDestroy } from '@angular/core';
import { MachineStatusDailyPayload, MachineStatusDailyDto, PlannedJobOrderDtoList, PlannedStopListDto, MachineStateDailyDto } from '../../../dto/workstation/workstation.model';
import { UtilitiesService } from '../../../services/utilities.service';
import { LoaderService } from '../../../services/shared/loader.service';
import { WorkstationService } from '../../../services/dto-services/workstation/workstation.service';
import * as moment from 'moment';
import { ConvertUtil } from '../../../util/convert-util';
import { AppStateService } from 'app/services/dto-services/app-state.service';

import { ShiftSettingsService } from 'app/services/dto-services/shift-setting/shift-setting.service';
import { ShiftSettingsResponseDto } from 'app/dto/shift/shift.dto';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  templateUrl: './machine-status-daily.html',
  styleUrls: ['./machine-status-daily.scss'],
  encapsulation: ViewEncapsulation.None
})

export class MachineStatusDailyComponent implements OnInit, OnDestroy {
  @ViewChild('chartContainer') container: ElementRef;
  pipe = new DatePipe('en-US');
  filterCon: MachineStatusDailyPayload = {
    workstationId: 0,
    date: null,
    shiftId: null,
    plantId: null,
  };

  chartWidth = 900;
  DAY_SECONDS: number; // each shift day seconds
  dateStatusArray: MachineStatusDailyDto;
  shiftArray = ['06:00', '10:00', '14:00'];
  // shiftArray = ['06:00', '10:00', '14:00', '18:00', '22:00', '02:00', '06:00'];

  leftVlOffset = 150;
  chartRightMargin = 40;
  leftHourOffset = 140;
  barRowHeight = 50; // px
  barHeight = 30; // px
  barMargin = 0; // px
  yAxisHeight = 50; // y axes (shift labels) height
  vLHeight = 150;
  plantId: any;
  shiftListDto: ShiftSettingsResponseDto[] = [];
  isLoading = false;
  sub: Subscription;
  selectedShift: any;
  pixelPerSec: number = 1;

  constructor(
    private utilities: UtilitiesService,
    private appStateService: AppStateService,
    private loader: LoaderService,
    private cdx: ChangeDetectorRef,
    private workSvc: WorkstationService,
    private shiftSettings: ShiftSettingsService) {
    // this.subscribePlant();
    this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
      if (!(res)) {
        this.plantId = null;
        this.filterCon.plantId = null;
      } else {
        this.plantId = res.plantId;
        this.filterCon.plantId = res.plantId;
        this.shiftList();
      }
    });
      // this.leftHourOffset = this.leftVlOffset - 20;
      // this.barHeight = this.barRowHeight * 0.75;
      // this.barMargin = this.barRowHeight * 0.125;
  }

  /**
   * if plant is already selected from header dropdown set the specific plant
  * */
  subscribePlant() {

  }

  ngOnInit() {
    // this.shiftList();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  /**
   * get shifts list
   */
  shiftList() {
    this.shiftSettings.getShiftSettingsListByPlantId(this.plantId).then((res: ShiftSettingsResponseDto[]) => {
      this.shiftListDto = res;
      // if (res) {
      //   this.setSelectedShift(this.shiftListDto[0]);
      // }
      this.shiftSettings.getShiftByPlantAndCurrentDate(this.plantId).then((res: any) => {
        if(res && this.shiftListDto && this.shiftListDto.length) {
          this.selectedShift = this.shiftListDto.find((shft) => shft.shiftId === res.shiftId);
        }
        
        this.setSelectedShift(this.selectedShift);
        // this.filterCon.shiftId = this.selectedShift.shiftId;
        // this.shiftArray = ConvertUtil.getIntervals(ConvertUtil.UTCTime2LocalTime(this.selectedShift.startTime),
        // ConvertUtil.UTCTime2LocalTime( this.selectedShift.endTime), '04:00');
      }).catch(err =>  console.error(err));

    });
    
  }

  setSelectedWorkStation(event) {
    if (event && event.hasOwnProperty('workStationId')) {
      this.filterCon.workstationId = event.workStationId;
    } else {
      this.filterCon.workstationId = null;
    }

  }

  // width: number;
  // height: number;


  onResizeContainer(event) {

    // this.width = event.newWidth;
    this.chartWidth = event.newWidth - this.leftVlOffset - this.chartRightMargin;
    this.pixelPerSec = (this.chartWidth) / this.DAY_SECONDS;
    // this.height = event.newHeight;
    // if (this.chartWidth > 1400) {
    //   this.barRowHeight = 50;
    // } else if (this.chartWidth > 1200 && this.chartWidth <= 1400) {
    //   this.barRowHeight = 40;
    // } else if (this.chartWidth > 900 && this.chartWidth <= 1200) {
    //   this.barRowHeight = 30;
    // } else if (this.chartWidth > 600 && this.chartWidth <= 900) {
    //   this.barRowHeight = 25;
    // } else {
    //   this.barRowHeight = 20;
    // }

    // this.barHeight = this.barRowHeight * 0.75;
    // this.barMargin = this.barRowHeight * 0.125;
    // this.containerHeight = this.workstationAnl.workstationAnalysisList ? (this.workstationAnl.workstationAnalysisList.length * this.barRowHeight) + this.yAxisHeight : 300;
    // this.vLHeight = this.containerHeight - this.yAxisHeight;
    this.cdx.markForCheck();
  }

  analyze() {
//    this.filterCon = { "workstationId": 10,  "shiftId": 94, "date": "2020-01-09", plantId: this.plantId };
    this.loader.showLoader();

    const temp = Object.assign({}, this.filterCon);
    temp.date = ConvertUtil.localDateShiftAsUTC(this.filterCon.date);

    this.workSvc.getDailyMachineStatusOfWorkstation(temp).then((res: MachineStatusDailyDto) => {
      this.isLoading = true;
      // this.DAY_SECONDS = (ConvertUtil.getHoursDifference(res.shiftStartTime, res.shiftEndTime) * 60 * 60);
      
      const shiftStartTime =  ConvertUtil.UTCTime2LocalTime(res.shiftStartTime);
      let shiftEndTime =  ConvertUtil.UTCTime2LocalTime(res.shiftEndTime);
      this.shiftArray = ConvertUtil.getIntervalV3(shiftStartTime, shiftEndTime);
      // let hours = ConvertUtil.getIntervals(shiftStartTime, shiftEndTime, "01:00").length;
      let hours = ConvertUtil.getTotalHours(shiftStartTime, shiftEndTime);
      if(hours % 2 !== 0) {
        hours = hours+1;
      }
      this.DAY_SECONDS = ( hours * 60 * 60);
      this.pixelPerSec = (this.chartWidth) / this.DAY_SECONDS;
      this.drawStatusContainerSize(res);
      this.loader.hideLoader();
      this.dateStatusArray = res;
    }).catch(err => {
      this.loader.hideLoader();
      this.utilities.showErrorToast(err);

    });

  }

  getLeft = (aItem) => {
    const left = ((aItem.o*this.pixelPerSec)+this.leftVlOffset+1)+'px';
    return left;
  }

  getWidth = (aItem) => {
    // const conif= ((this.chartWidth*aItem.ds) + ((aItem.o*this.chartWidth)+this.leftVlOffset+1));
    // const fullWidth = (this.chartWidth + this.leftVlOffset);
    // const trueCond = ((this.chartWidth + this.leftVlOffset) - ((aItem.o*this.chartWidth)+this.leftVlOffset+1));
    // const falsCond = this.chartWidth*aItem.ds;
    // return ( conif > fullWidth ? trueCond: falsCond)+'px'
    return (this.pixelPerSec * aItem.ds + 'px');
  }

  drawStatusContainerSize(state: MachineStatusDailyDto) {

    if (state.stopCauseGroupList.length > 0) {
      const length = state.stopCauseGroupList.length;
      this.vLHeight = (((length + 3) * this.barRowHeight) + (this.barMargin * 2));
      this.vLHeight = this.vLHeight - 15;
    } else {
      this.vLHeight = 135;
    }

  }

  // getWidth (aItem) {
  //   let width = 0;
  //   if((((this.chartWidth*(aItem.ds/this.DAY_SECONDS)) + (((aItem.o/this.DAY_SECONDS)*this.chartWidth)+this.leftVlOffset+1)) > (this.chartWidth + this.leftVlOffset))) {
  //     width =  ((this.chartWidth + this.leftVlOffset) - (((aItem.o/this.DAY_SECONDS)*this.chartWidth)+this.leftVlOffset+1));
  //   } else {
  //       width = this.chartWidth*(aItem.ds /this.DAY_SECONDS);
  //   }

  //   return width;
  // }

  setSelectedShift(shift: ShiftSettingsResponseDto) {
    this.filterCon.shiftId = shift.shiftId;
  }

  showJobOrderToolTip(jobOrder: PlannedJobOrderDtoList) {
    let html = '';
    const startTime = new Date(jobOrder.st);
    const finishTime = new Date(jobOrder.ft);
    html = `<b>Job Order ${jobOrder.jobOrderId}</b>
           <span style="width:200px"><i class='fa fa-clock-o text-info p-2' aria-hidden='true'></i>${this.pipe.transform(startTime , 'medium')}</span>
           <span style="width:200px"><i class='fa fa-clock-o text-info p-2' aria-hidden='true'></i>${this.pipe.transform(finishTime, 'medium')}</span>
           `;

    return html;
  }

  showPlannedStopsToolTip(plannedStop: PlannedStopListDto) {
    let html = '';
    html = `<b>${plannedStop.scn}</b>
           <span style="width:200px"><i class='fa fa-clock-o text-info p-2' aria-hidden='true'></i>${this.pipe.transform(new Date(plannedStop.st), 'shortTime')}</span>
           <span style="width:200px"><i class='fa fa-clock-o text-info p-2' aria-hidden='true'></i>${this.pipe.transform(new Date(plannedStop.ft), 'shortTime')}</span>
           `;
    return html;
  }

  showWorkStationStatusToolTip(workstation: PlannedStopListDto, name: string) {
    let html = '';
    html = `<b>${workstation[name]}</b>
           <span style="width:200px"><i class='fa fa-clock-o text-info p-2' aria-hidden='true'></i>Start Time: ${this.pipe.transform(new Date(workstation.st), 'shortTime')}</span>
           <span style="width:200px"><i class='fa fa-clock-o text-info p-2' aria-hidden='true'></i>End Time: ${this.pipe.transform(new Date(workstation.ft), 'shortTime')}</span>
           `;
    return html;
  }

  getReadableTime(time) {
    return ConvertUtil.longDuration2DHHMMSSTime(time)
  }


}
