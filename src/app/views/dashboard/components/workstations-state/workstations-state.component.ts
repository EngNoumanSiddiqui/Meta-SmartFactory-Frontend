import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, NgZone, OnInit } from '@angular/core';
import { ResponseWorkstationStateChangeDto } from '../../../../dto/workstation/workstation.model';
import { UtilitiesService } from '../../../../services/utilities.service';
import { LoaderService } from '../../../../services/shared/loader.service';
import { WorkstationDashboardService } from '../../../../services/dto-services/workstation/workstation-dashboard.service';
import { ConvertUtil } from 'app/util/convert-util';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-workstations-state',
  templateUrl: './workstations-state.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./workstations-state.component.scss']
})
export class WorkstationsStateComponent implements OnInit, AfterViewInit {

  DAY_SECONDS = (24 * 60 * 60);
  pixelPerSec: number = 1;
  minHeight: boolean = true;

  overFlow: boolean = true;

  workstationStatusArray: ResponseWorkstationStateChangeDto[] = [];

  //shiftArray = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'];
  shiftArray = ['06:00', '10:00', '14:00', '18:00', '22:00', '02:00', '06:00'];

  // ################ Chart css size options  ####################################################################################################
  chartWidth = 900;
  chartRightMargin = 40; // px left offset of first vertical line

  leftVlOffset = 180; // px left offset of first vertical line
  leftHourOffset = 165; // leftVlOffset-20 px left offset of first y axes label value

  pipe = new DatePipe('en-US');

  barRowHeight = 30; // px  row height  status bar
  barHeight = 30; // barRowHeight * 0.75; px single status bar height
  barMargin = 5; //  barRowHeight * 0.125; px single status bar margin bottom

  containerHeight = 300; //  height of the chart container. initially it is 300px but it calculated through size of workstation status array

  xLabelLeftOffset = 30; // px
  yAxisHeight = 50; // y axes (shift labels) height
  vLHeight = 250; // vertical line height. initially it is equal to containerHeight-yAxisHeight. When container height changed this is also changed

  selectedShift: any;

  @Input('selectedShift') set ss(shiftData){
    this.selectedShift = shiftData; 
  }

  @Input('filterModel') set f(filterModel) {
    this.loadWorkstationStatus(filterModel);
  }

  @Input('minHeight') set mH(minHeight) {
    this.minHeight = minHeight;
  }

  @Input('overFlow') set oF(overFlow: boolean) {
    this.overFlow = overFlow;
  }

  // ################################################################################################################################################
  constructor(private utilities: UtilitiesService, private loader: LoaderService,
    private cdx: ChangeDetectorRef,
    private _ngZone: NgZone,
    private workDashSvc: WorkstationDashboardService) {
    this.leftHourOffset = this.leftVlOffset - 20;
    this.barHeight = this.barRowHeight * 0.75;
    this.barMargin = this.barRowHeight * 0.125;
  }

  ngOnInit() {
    this.normalizeData(this.workstationStatusArray);

    this.containerHeight = this.workstationStatusArray ? (this.workstationStatusArray.length * this.barRowHeight) + this.yAxisHeight : 300;
    this.vLHeight = this.containerHeight - this.yAxisHeight;
  }
  ngAfterViewInit() {
    this.cdx.detach();
  }

  normalizeData(dateStatusArray) {
    if (dateStatusArray) {
      
      // const me = this;
      // dateStatusArray.forEach(item => {

        // let totalDur = 0;

        // item.states.forEach(aItem => {
          /** so here what we do :      chartWidth is correspond to DAY_SECONDS (24*60*60 seconds).
           *  Data come from backend is in second format
           *  offset is equal to how much seconds passed since  first shift time.
           *  durationSeconds is equal to how much time that machine stay in same state ( such as 5 seconds closed state)
           *  To paint the value in correct place we need make a calculation as: if  DAY_SECONDS is correspond to chartWidth,  
           * xSecond should correspond to xWidth
           *  xSecond= (DAY_SECONDS*xWidth)/chartWidth
           *  To paint data in correct place we use offset value as x coordinate ,  and durationSeconds as width
           *
           */

          // aItem.o = aItem.o / me.DAY_SECONDS;
          // // duration seconds is width as px
          // aItem.ds = aItem.ds / me.DAY_SECONDS;
          /**
           *  chartWidth is not a static value, it can change through screen size.  So it re calculated at onResizeContainer() function.
           *  to calculate xSecond as correct we take chartWidth value in calculation on html side.
           *   [style.left]="((aItem.offset*chartWidth)+leftVlOffset+1)+'px'"
           *   [style.width]="(chartWidth*aItem.durationSeconds)+'px'"
           */
        // });

      // });
      this.workstationStatusArray = dateStatusArray;
      
    } else {
      this.workstationStatusArray = null;
    }
    this.loader.hideLoader();
    this.cdx.detectChanges();
  }

  showWorkStationStatusToolTip(workstation , name: string) {
    let html = '';
    // if (workstation[name] === 'STOPPED') {
    //   html = `<b>${workstation.scn}</b>
    //   <span style="width:200px"><i class='fa fa-clock-o text-info p-2' aria-hidden='true'></i>Start Time: ${this.pipe.transform(workstation.st, 'shortTime')}</span>
    //   <span style="width:200px"><i class='fa fa-clock-o text-info p-2' aria-hidden='true'></i>End Time: ${this.pipe.transform(workstation.ft, 'shortTime')}</span>
    //   `;
    // } else {
      html = `<b>${workstation[name]}</b>
      <span style="width:200px"><i class='fa fa-clock-o text-info p-2' aria-hidden='true'></i>Start Time: ${this.pipe.transform(workstation.st, 'shortTime')}</span>
      <span style="width:200px"><i class='fa fa-clock-o text-info p-2' aria-hidden='true'></i>End Time: ${this.pipe.transform(workstation.ft, 'shortTime')}</span>
      `;
    // }

    return html;
  }

  onResizeContainer(event) {

    this.chartWidth = event.newWidth - this.leftVlOffset - this.chartRightMargin;
    this.pixelPerSec = (this.chartWidth) / this.DAY_SECONDS;
    // this.height = event.newHeight;
    if (this.chartWidth > 1400) {
      this.barRowHeight = 50;
    } else if (this.chartWidth > 1200 && this.chartWidth <= 1400) {
      this.barRowHeight = 40;
    } else if (this.chartWidth > 900 && this.chartWidth <= 1200) {
      this.barRowHeight = 30;
    } else if (this.chartWidth > 600 && this.chartWidth <= 900) {
      this.barRowHeight = 25;
    } else {
      this.barRowHeight = 20;
    }

    this.barHeight = this.barRowHeight * 0.75;
    this.barMargin = this.barRowHeight * 0.125;
    // if (this.minHeight) {
    //   this.containerHeight = this.workstationStatusArray ? (this.workstationStatusArray.length * this.barRowHeight) + this.yAxisHeight : 300;
    //   this.vLHeight = this.containerHeight - this.yAxisHeight;
    // } else {
    //   this.containerHeight = 500;
    //   this.vLHeight = 470;
    // }
    this.containerHeight = this.workstationStatusArray ? (this.workstationStatusArray.length * this.barRowHeight) + this.yAxisHeight : 300;
    this.vLHeight = this.containerHeight - this.yAxisHeight;

    this.cdx.detectChanges();
  }


  // getWidth(aItem) {
  //   let width = 0;
  //   if(((this.chartWidth*aItem.ds) + ((aItem.o*this.chartWidth)+this.leftVlOffset+1)) > (this.chartWidth + this.leftVlOffset)){
  //     width = ((this.chartWidth + this.leftVlOffset) - ((aItem.o*this.chartWidth)+this.leftVlOffset+1));
  //   } else {
  //     width = this.chartWidth * aItem.ds;
  //   }

  //   return width;
  // }

  private loadWorkstationStatus(filterModel: any) {
    this.workstationStatusArray = null;
    if (filterModel) {
      // TODO: pagenum and pagesize shouldn be required at here. Then you may fix the logic or backend
      // const tempFilter = Object.assign({}, filterModel, { pageNumber: 1, pageSize: 50 })
      const tempFilter = Object.assign({}, filterModel, { pageNumber: null, pageSize: null });
      this._ngZone.runOutsideAngular(() => {
        this.workDashSvc.getProductionStatusOfWorkstation(tempFilter).then((res: any) => {
          this._ngZone.run(() => {
            if (this.minHeight) {
              //this.DAY_SECONDS = (ConvertUtil.getHoursDifference(res.shiftHours[0], res.shiftHours[res.shiftHours.length - 1]) * 60 * 60);
              //this.createHourIntervals(res.shiftHours[0], res.shiftHours[res.shiftHours.length - 1]);
              let containerHeight = res.responseProductionStateChangeDtoList ? (res.responseProductionStateChangeDtoList.length * this.barRowHeight) + this.yAxisHeight : 300;
              let vLHeight = containerHeight - this.yAxisHeight;
              if (containerHeight >= 250) {
                this.containerHeight = containerHeight;
                this.vLHeight = vLHeight;
              }
            } else {
              this.containerHeight = 500;
              this.vLHeight = 470;
            }
    // console.log('@selectedShift', this.selectedShift)
            if(this.selectedShift){
              // this.DAY_SECONDS = (ConvertUtil.getHoursDifference(ConvertUtil.UTCTime2LocalTime(this.selectedShift.startTime), ConvertUtil.UTCTime2LocalTime(this.selectedShift.endTime)) * 60 * 60);
              this.shiftArray = ConvertUtil.getIntervalV3(ConvertUtil.UTCTime2LocalTime(this.selectedShift.startTime), ConvertUtil.UTCTime2LocalTime(this.selectedShift.endTime));
              // this.shiftArray = ConvertUtil.getIntervalV3(shiftStartTime, shiftEndTime);
              // const hours = ConvertUtil.getHoursDifference(this.shiftArray[0], this.shiftArray[this.shiftArray.length -1]);
              // let hours = ConvertUtil.getIntervals(this.selectedShift.startTime, this.selectedShift.endTime, "01:00").length;
              let hours = ConvertUtil.getTotalHours(this.selectedShift.startTime, this.selectedShift.endTime);
              if(hours % 2 !== 0) {
                hours = hours+1;
              }
              this.DAY_SECONDS = ( hours * 60 * 60);
              this.pixelPerSec = (this.chartWidth) / this.DAY_SECONDS;
            }else if(res.shiftStartTime && res.shiftEndTime){
              const shiftStartTime = ConvertUtil.UTCTime2LocalTime(res.shiftStartTime);
              // const shiftEndTime = ConvertUtil.UTCTime2LocalTime(res.shiftEndTime);
              // this.DAY_SECONDS = (ConvertUtil.getHoursDifference(shiftStartTime, shiftEndTime) * 60 * 60);
              // this.shiftArray = ConvertUtil.getIntervals(shiftStartTime, shiftEndTime, '04:00');

              let shiftEndTime =  ConvertUtil.UTCTime2LocalTime(res.shiftEndTime);
              this.shiftArray = ConvertUtil.getIntervalV3(shiftStartTime, shiftEndTime);
              // let hours = ConvertUtil.getIntervals(shiftStartTime, shiftEndTime, "01:00").length;
              let hours = ConvertUtil.getTotalHours(shiftStartTime, shiftEndTime);
              if(hours % 2 !== 0) {
                hours = hours+1;
              }
              this.DAY_SECONDS = ( hours * 60 * 60);
              this.pixelPerSec = (this.chartWidth) / this.DAY_SECONDS;
            }
            this.initWorkstatus(res);
          });
        });
      });
    }
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

  createHourIntervals(shiftStartTime, shiftEndTime) {
    this.shiftArray = ConvertUtil.getIntervals(shiftStartTime, shiftEndTime, '04:00');
  }

  initWorkstatus(res) {
    if (res) {
      this.normalizeData(res.responseProductionStateChangeDtoList);
    }
  }

  showWorkStationDetailModal(workstation) {
    this.loader.showDetailDialog(DialogTypeEnum.WORKSTATION, workstation.workstationId);
  }
}
