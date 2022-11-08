import {Component, ElementRef, HostListener, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {MachineStateEnum, WorkStationMachineStatusDto} from '../../../dto/workstation/workstation.model';
import {UtilitiesService} from '../../../services/utilities.service';
import {LoaderService} from '../../../services/shared/loader.service';
import {WorkstationService} from '../../../services/dto-services/workstation/workstation.service';
import * as moment from 'moment';
import {ConvertUtil} from '../../../util/convert-util';
import { AppStateService } from 'app/services/dto-services/app-state.service';

import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  templateUrl: './workstation-status.component.html',
  styleUrls: ['./workstation-status.component.scss']
})
export class WorkstationStatusComponent implements OnInit, OnDestroy {
  @ViewChild('chartContainer') container: ElementRef;
  filterCon = {
    workstationId: null,
    startDate: null,
    reportType: 'WEEKLY'
  };
  chartWidth = 900;
  DAY_SECONDS = 24 * 60 * 60;
  dateStatusArray: WorkStationMachineStatusDto[];

  pipe = new DatePipe('en-US');

  shiftArray = ['06:00', '10:00', '14:00', '18:00', '22:00', '02:00', '06:00'];

  leftVlOffset = 100;
  chartRightMargin = 40;
  leftHourOffset = 85;
  barRowHeight = 65; // px
  barHeight = 40; // px
  barMargin = 10; // px
  plantId: any;
  sub: Subscription;

  constructor(private utilities: UtilitiesService, private appStateService: AppStateService,
    private loader: LoaderService, private workSvc: WorkstationService) {
    this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
      if (!(res)) {
       this.plantId = null;
      } else {
        this.plantId = res.plantId;
      }
    });
  }

  ngOnInit() {
    this.normalizeData(this.dateStatusArray);

  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  normalizeData(dateStatusArray) {
    if (dateStatusArray) {

      dateStatusArray = dateStatusArray.filter(item => ConvertUtil.date2StartOfDay(item.day).getTime() <= new Date(this.filterCon.startDate).getTime());
      this.dateStatusArray = dateStatusArray;
      const me = this;
      if(dateStatusArray.length > 0) {
        const startTime = this.pipe.transform(new Date(dateStatusArray[0].day), 'hh:mm:ss');
        // const shiftEndTime =  ConvertUtil.UTCTime2LocalTime(startTime);
        this.DAY_SECONDS = (ConvertUtil.getHoursDifferenceV2(startTime, startTime) * 60 * 60);
        this.shiftArray = ConvertUtil.getIntervalsV2(startTime, startTime, '04:00');
      }
      dateStatusArray.forEach(item => {

        // let totalDur = 0;

        item.statusArray.forEach(aItem => {
          // start offset is x px coordinate from left
          aItem.o = aItem.o / me.DAY_SECONDS;
          // duration seconds is width as px
          // totalDur += aItem.durationSeconds;
          aItem.ds = aItem.ds / me.DAY_SECONDS
        });

      });
    } else {
      this.dateStatusArray = null;
    }
    this.loader.hideLoader();
  }

  showMachineToolTip(machine) {
    let html = '';
    const startTime = new Date(machine.st);
    const finishTime = new Date(machine.ft);
    html = `<b>${machine.s}</b>
           <span style="width:200px"><i class='fa fa-clock-o text-info p-2' aria-hidden='true'></i>${this.pipe.transform(startTime , 'medium')}</span>
           <span style="width:200px"><i class='fa fa-clock-o text-info p-2' aria-hidden='true'></i>${this.pipe.transform(finishTime, 'medium')}</span>
           `;

    return html;
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
    // this.height = event.newHeight;
  }

  analyze() {
    this.loader.showLoader();

    const temp = Object.assign({}, this.filterCon);


    temp.startDate = ConvertUtil.localDateShiftAsUTC(this.filterCon.startDate);

    this.workSvc.getMachineStatus(temp).then(res => {
      this.normalizeData(res);

    }).catch(err => {
      this.utilities.showErrorToast(err);
      this.normalizeData(null);
    });

  }

}
