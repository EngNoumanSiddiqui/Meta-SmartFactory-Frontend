import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {MachineStatusDailyPayload, MachineStatusDailyDto, PlannedJobOrderDtoList, PlannedStopListDto, MachineStateDailyDto} from '../../../dto/workstation/workstation.model';
import {UtilitiesService} from '../../../services/utilities.service';
import {LoaderService} from '../../../services/shared/loader.service';
import {WorkstationService} from '../../../services/dto-services/workstation/workstation.service';
import * as moment from 'moment';
import {ConvertUtil} from '../../../util/convert-util';
import {AppStateService} from 'app/services/dto-services/app-state.service';
 
import {ShiftSettingsService} from 'app/services/dto-services/shift-setting/shift-setting.service';
import {ShiftSettingsResponseDto} from 'app/dto/shift/shift.dto';
import {DatePipe} from '@angular/common';
import {Subscription} from 'rxjs';
import {WorkCenterAnalysisDash} from 'app/dto/workcenter/workcenter.model';
import {trigger, state, style, transition, animate} from '@angular/animations';

@Component({
  templateUrl: './workcenter-analysis.html',
  styleUrls: ['./workcenter-analysis.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  animations: [
    trigger('rowExpansionTrigger', [
      state('void', style({
        transform: 'translateX(-10%)',
        opacity: 0
      })),
      state('active', style({
        transform: 'translateX(0)',
        opacity: 1
      })),
      transition('* <=> *', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
  ],
  encapsulation: ViewEncapsulation.None
})

export class WorkCenterAnalysisComponent implements OnInit, OnDestroy {
  @ViewChild('chartContainer') container: ElementRef;
  pipe = new DatePipe('en-US');
  filterCon = {
    finishDate: ConvertUtil.date2EndOfDay(new Date()),
    plantId: null,
    startDate: ConvertUtil.date2StartOfDay(new Date()),
    workcenterId: null,
    // shiftId: null
  };

  chartWidth = 900;
  DAY_SECONDS: number; // each shift day seconds
  dateStatusArray: MachineStatusDailyDto;

  shiftArray = ['06:00', '10:00', '14:00'];

  leftVlOffset = 150;
  chartRightMargin = 40;
  leftHourOffset = 140;
  barRowHeight = 50; // px
  barHeight = 30; // px
  barMargin = 0; // px
  yAxisHeight = 50; // y axes (shift labels) height
  vLHeight = 150;
  plant: any;
  shiftListDto: ShiftSettingsResponseDto[] = [];
  isLoading = false;
  sub: Subscription;
  workCenterAnalysis: WorkCenterAnalysisDash[] = [];

  stoplist: null;
  bottleneckList: null;
  cols = [
    {field: 'workstationName', header: 'workstation-name'},
    {field: 'day', header: 'day'},
    {field: 'goodCount', header: 'good-count'},
    {field: 'scrapCount', header: 'scrap-count'}
  ];

  constructor(
    private utilities: UtilitiesService,
    private appStateService: AppStateService,
    private cdx: ChangeDetectorRef,
    private loader: LoaderService,
    private workSvc: WorkstationService,
    private shiftSettings: ShiftSettingsService) {
    this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
      if (!(res)) {
        this.plant = null;
        this.filterCon.plantId = null;
      } else {
        this.plant = res;
        this.filterCon.plantId = this.plant.plantId;
      }
    });
  }

  ngOnInit() {
    // this.shiftList();
    // this.filterCon.finishDate = new Date();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  /**
   * get shifts list
   */
  // shiftList() {
  //   this.shiftSettings.getShiftSettingsList().then((res: ShiftSettingsResponseDto[]) => {
  //     this.shiftListDto = res;
  //     if (res) {
  //       this.setSelectedShift(this.shiftListDto[0]);
  //     }
  //   });
  // }

  // setSelectedWorkStation(event) {
  //   if (event && event.hasOwnProperty('workStationId')) {
  //     this.filterCon.workstationId = event.workStationId;
  //   } else {
  //     this.filterCon.workstationId = null;
  //   }

  // }
  setSelectedWorkCenter(event) {
    if (event) {
      this.filterCon.workcenterId = event.workCenterId;
    } else {
      this.filterCon.workcenterId = null;
    }
  }

  // width: number;
  // height: number;


  analyze() {
    this.loader.showLoader();

    this.filterCon.startDate = ConvertUtil.date2StartOfDay(this.filterCon.finishDate);
    const temp = Object.assign({}, this.filterCon);
    // if (temp.startDate) {
    //   temp.startDate = ConvertUtil.date2StartOfDay(temp.startDate);
    //   temp.startDate = ConvertUtil.localDateShiftAsUTC(temp.startDate);
    // }
    if (temp.finishDate) {
      temp.finishDate = ConvertUtil.date2EndOfDay(temp.finishDate);
      // temp.finishDate = ConvertUtil.localDateShiftAsUTC(temp.finishDate);
    }


    this.workSvc.getAnalysisOfWorkCenter(temp).then((res: WorkCenterAnalysisDash[]) => {
      this.isLoading = true;

      this.workCenterAnalysis = res;
      // this.drawStatusContainerSize(res);
      // this.DAY_SECONDS = (ConvertUtil.getHoursDifference(res.shiftStartTime, res.shiftEndTime) * 60 * 60);
      // this.dateStatusArray = res;
      // this.createHourIntervals();
      this.loader.hideLoader();
      this.cdx.markForCheck();
    }).catch(err => {
      this.loader.hideLoader();
      this.utilities.showErrorToast(err);
      this.cdx.markForCheck();
    });

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

  // setSelectedShift(shift: ShiftSettingsResponseDto) {
  //   this.filterCon.shiftId = shift.shiftId;
  // }

  createHourIntervals() {
    const shiftStartTime = this.dateStatusArray.shiftStartTime;
    const shiftEndTime = this.dateStatusArray.shiftEndTime;
    this.shiftArray = ConvertUtil.getIntervals(shiftStartTime, shiftEndTime, '04:00');
  }

  showJobOrderToolTip(jobOrder: PlannedJobOrderDtoList) {
    let html = '';
    html = `<b>Job Order ${jobOrder.jobOrderId}</b>
           <span style="width:200px"><i class='fa fa-clock-o text-info p-2' aria-hidden='true'></i>${this.pipe.transform(jobOrder.st, 'medium', 'GMT')}</span>
           <span style="width:200px"><i class='fa fa-clock-o text-info p-2' aria-hidden='true'></i>${this.pipe.transform(jobOrder.ft, 'medium', 'GMT')}</span>
           `;

    return html;
  }

  showPlannedStopsToolTip(plannedStop: PlannedStopListDto) {
    let html = '';
    html = `<b>${plannedStop.scn}</b>
           <span style="width:200px"><i class='fa fa-clock-o text-info p-2' aria-hidden='true'></i>${this.pipe.transform(plannedStop.st, 'shortTime', 'GMT')}</span>
           <span style="width:200px"><i class='fa fa-clock-o text-info p-2' aria-hidden='true'></i>${this.pipe.transform(plannedStop.ft, 'shortTime', 'GMT')}</span>
           `;
    return html;
  }


  getReadableTime(time) {
    return ConvertUtil.longDuration2DHHMMSSTime(time)
  }


  changeStart() {
    if (this.filterCon.finishDate) {
      this.filterCon.startDate = ConvertUtil.date2StartOfDay(this.filterCon.finishDate);
    } else {
      this.filterCon.startDate = null;
    }
  }
}
