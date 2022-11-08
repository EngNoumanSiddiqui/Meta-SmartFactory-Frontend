import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, NgZone, OnInit } from '@angular/core';
import { ResponseWorkstationStateChangeDto } from '../../../../dto/workstation/workstation.model';
import { UtilitiesService } from '../../../../services/utilities.service';
import { LoaderService } from '../../../../services/shared/loader.service';
import { WorkstationDashboardService } from '../../../../services/dto-services/workstation/workstation-dashboard.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { ConvertUtil } from 'app/util/convert-util';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-workstations-status',
  templateUrl: './workstations-status.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./workstations-status.component.scss']
})
export class WorkstationsStatusComponent implements OnInit, AfterViewInit {

  DAY_SECONDS = 24 * 60 * 60;

  minHeight: boolean = true;
  pipe = new DatePipe('en-US');

  overFlow: boolean = true;

  workstationStatusArray: ResponseWorkstationStateChangeDto[] = null;

  //shiftArray = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'];
  shiftArray = ['06:00', '10:00', '14:00', '18:00', '22:00', '02:00', '06:00'];

  // ################ Chart css size options  ####################################################################################################
  chartWidth = 900;
  chartRightMargin = 40; // px left offset of first vertical line

  leftVlOffset = 180; // px left offset of first vertical line
  leftHourOffset = 165; // leftVlOffset-20 px left offset of first y axes label value


  barRowHeight = 30; // px  row height  status bar
  barHeight = 30; // barRowHeight * 0.75; px single status bar height
  barMargin = 5; //  barRowHeight * 0.125; px single status bar margin bottom

  containerHeight = 300; //  height of the chart container. initially it is 300px but it calculated through size of workstation status array

  xLabelLeftOffset = 30; // px
  yAxisHeight = 50; // y axes (shift labels) height
  vLHeight = 250; // vertical line height. initially it is equal to containerHeight-yAxisHeight. When container height changed this is also changed
  pixelPerSec: number = 1;
  // ################################################################################################################################################

  @Input('filterModel') set f(filterModel) {
    this.loadWorkstationStatus(filterModel);
  }

  @Input('minHeight') set mH(minHeight) {
    this.minHeight = minHeight;
  }

  @Input('overFlow') set oF(overFlow: boolean) {
    this.overFlow = overFlow;
  }

  constructor(
    private utilities: UtilitiesService,
    private loader: LoaderService,
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
      this.workstationStatusArray = dateStatusArray;

      const me = this;

      dateStatusArray.forEach(item => {

        // let totalDur = 0;

        item.states.forEach(aItem => {
          /** so here what we do :      chartWidth is correspond to DAY_SECONDS (24*60*60 seconds).
           *  Data come from backend is in second format
           *  offset is equal to how much seconds passed since  first shift time.
           *  durationSeconds is equal to how much time that machine stay in same state ( such as 5 seconds closed state)
           *  To paint the value in correct place we need make a calculation as: if  DAY_SECONDS is correspond to chartWidth,  xSecond should correspond to xWidth
           *  xSecond= (DAY_SECONDS*xWidth)/chartWidth
           *  To paint data in correct place we use offset value as x coordinate ,  and durationSeconds as width
           *
           */

          // aItem.o = aItem.o / me.DAY_SECONDS;
          // // duration seconds is width as px
          // aItem.ds = aItem.ds / me.DAY_SECONDS;
          // const kmmm = Object.assign({}, aItem);
          // kmmm.st = new Date(kmmm.st).toLocaleTimeString();
          // kmmm.ft = new Date(kmmm.ft).toLocaleTimeString();
          // console.log(kmmm)
          /**
           *  chartWidth is not a static value, it can change through screen size.  So it re calculated at onResizeContainer() function.
           *  to calculate xSecond as correct we take chartWidth value in calculation on html side.
           *   [style.left]="((aItem.offset*chartWidth)+leftVlOffset+1)+'px'"
           *   [style.width]="(chartWidth*aItem.durationSeconds)+'px'"
           */
        });

      });
      
    } else {
      this.workstationStatusArray = null;
    }
    this.loader.hideLoader();
    this.cdx.detectChanges();
  }


  onResizeContainer(event) {
    this.chartWidth = event.newWidth - this.leftVlOffset - this.chartRightMargin;
    // this.height = event.newHeight;

    this.pixelPerSec = (this.chartWidth) / this.DAY_SECONDS;
    // this.pixelPerSec = (this.chartWidth - this.leftVlOffset - this.chartRightMargin - 55) / this.DAY_SECONDS;

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
    // if(this.minHeight){
    this.containerHeight = this.workstationStatusArray ? (this.workstationStatusArray.length * this.barRowHeight) + this.yAxisHeight : 300;
    this.vLHeight = this.containerHeight - this.yAxisHeight;

    this.cdx.detectChanges();
    // }else{
    //   this.containerHeight = 500;
    //   this.vLHeight = 470;
    // }

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


  private loadWorkstationStatus(filterModel: any) {
    this.workstationStatusArray = null;
    if (filterModel) {
      // TODO: pagenum and pagesize shouldn be required at here. Then you may fix the logic or backend
      const tempFilter = Object.assign({}, filterModel, { pageNumber: null, pageSize: null });

      this._ngZone.runOutsideAngular(() => {
        this.workDashSvc.getMachineStatusOfWorkstation(tempFilter).then((res: any) => {
          this._ngZone.run(() => {
            if (this.minHeight) {
              let containerHeight = res.responseMachineStateChangeDtoList ? (res.responseMachineStateChangeDtoList.length * this.barRowHeight) + this.yAxisHeight : 300;
              let vLHeight = containerHeight - this.yAxisHeight;
              if (containerHeight >= 250) {
                this.containerHeight = containerHeight;
                this.vLHeight = vLHeight;
              }
            } else {
              this.containerHeight = 500;
              this.vLHeight = 470;
            }
            if(res.shiftStartTime && res.shiftEndTime){
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

  initWorkstatus(res) {

    if (res) {
      this.normalizeData(res.responseMachineStateChangeDtoList);
    }

  }

  showWorkStationDetailModal(workstation) {
    this.loader.showDetailDialog(DialogTypeEnum.WORKSTATION, workstation.workstationId);
  }
}
