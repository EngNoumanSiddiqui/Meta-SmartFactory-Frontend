import {Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import { WorkCenterAnalysisDash } from 'app/dto/workcenter/workcenter.model';
import { DatePipe } from '@angular/common';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { LoaderService } from 'app/services/shared/loader.service';


@Component({
    selector: 'production-status-item',
    templateUrl: './production-state-item-graph.html',
  styles: [`

.status-container{
    position: relative;
    height: 500px;
  }
  .vl {
    border-left: 1px dashed #bababa;
    //height: 450px;
    position: absolute;
    opacity: 0.5;

  }
  .vl-bolder{
    border-left: 2px solid #6c808c !important;
  }
  .hour-span {
    top: 450px;
    font-size: 12px;
  }
  .hour-bold{
    font-weight: 700;
    font-size: 13px;
  }
  .hl {
    border-bottom: 2px solid #666666;
    width: 900px;
    position: absolute;
    opacity: 0.5;
    left: 150px;
    //top: 450px;
    //top:200px;
  }



  .span_opacity {
    opacity: 0.75;
  }


  .closed_black{
    background-color: black;
    border: 1px solid black;
    opacity: inherit;
  }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ProductionStatusItemComponent implements OnInit {

    pipe = new DatePipe('en-US');
  workstationAnl: WorkCenterAnalysisDash;
  workstationStatusArray: any;
    @Input('workstationAnl') set setworkstationAnl (workstationAnl) {
        this.workstationAnl = workstationAnl;
        this.initWorkstatus(this.workstationAnl);
    }

    shiftArray = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'];
    // shiftArray = ['06:00', '10:00', '14:00', '18:00', '22:00', '02:00', '06:00'];
    DAY_SECONDS = 24 * 60 * 60;
    // ################ Chart css size options  ####################################################################################################
    chartWidth = 900;
    chartRightMargin = 40; // px left offset of first vertical line

    leftVlOffset = 100; // px left offset of first vertical line
    leftHourOffset = 165; // leftVlOffset-20 px left offset of first y axes label value


    barRowHeight = 30; // px  row height  status bar
    barHeight = 30; // barRowHeight * 0.75; px single status bar height
    barMargin = 5; //  barRowHeight * 0.125; px single status bar margin bottom

    containerHeight = 300; //  height of the chart container. initially it is 300px but it calculated through size of workstation status array

    xLabelLeftOffset = 30; // px
    yAxisHeight = 50; // y axes (shift labels) height
    vLHeight = 350; // vertical line height. initially it is equal to containerHeight-yAxisHeight. When container height changed this is also changed
    // ################################################################################################################################################
    constructor(private cdx: ChangeDetectorRef, private loaderService: LoaderService) {
        this.leftHourOffset = this.leftVlOffset - 20;
        this.barHeight = this.barRowHeight * 0.75;
        this.barMargin = this.barRowHeight * 0.125;
     }

    ngOnInit() {
        // this.DAY_SECONDS = (ConvertUtil.getHoursDifference(res.shiftStartTime, res.shiftEndTime) * 60 * 60);
    }
    onResizeContainer(event) {

      this.chartWidth = event.newWidth - this.leftVlOffset - this.chartRightMargin;
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
      this.containerHeight = this.workstationAnl.workstationAnalysisList ? (this.workstationAnl.workstationAnalysisList.length * this.barRowHeight) + this.yAxisHeight : 300;
      this.vLHeight = this.containerHeight - this.yAxisHeight;
      this.cdx.markForCheck();
    }
    normalizeData(dateStatusArray) {
      if (dateStatusArray) {
        this.workstationStatusArray = dateStatusArray;

        const me = this;

        dateStatusArray.forEach(item => {

          // let totalDur = 0;
          if(!item.productionStateList) return;

          item.productionStateList.forEach(aItem => {
            /** so here what we do :      chartWidth is correspond to DAY_SECONDS (24*60*60 seconds).
             *  Data come from backend is in second format
             *  offset is equal to how much seconds passed since  first shift time.
             *  durationSeconds is equal to how much time that machine stay in same state ( such as 5 seconds closed state)
             *  To paint the value in correct place we need make a calculation as: if  DAY_SECONDS is correspond to chartWidth,  xSecond should correspond to xWidth
             *  xSecond= (DAY_SECONDS*xWidth)/chartWidth
             *  To paint data in correct place we use offset value as x coordinate ,  and durationSeconds as width
             *
             */

            aItem.o = aItem.o / me.DAY_SECONDS;
            // duration seconds is width as px
            aItem.ds = aItem.ds / me.DAY_SECONDS;
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
    }

    initWorkstatus(res) {
      if (res) {
        this.normalizeData(res.workstationAnalysisList);
      }
      this.cdx.markForCheck();
    }
    showWsDetail(id){
      this.loaderService.showDetailDialog(DialogTypeEnum.WORKSTATION, id);
    }
    showWorkStationStatusToolTip(workstation , name: string) {
        let html = '';
        if (workstation[name] === 'STOPPED') {
          html = `<b>${workstation.scn}</b>
          <span style="width:200px"><i class='fa fa-clock-o text-info p-2' aria-hidden='true'></i>Start Time: ${this.pipe.transform(workstation.st, 'shortTime')}</span>
          <span style="width:200px"><i class='fa fa-clock-o text-info p-2' aria-hidden='true'></i>End Time: ${this.pipe.transform(workstation.ft, 'shortTime')}</span>
          `;
        } else {
          html = `<b>${workstation[name]}</b>
          <span style="width:200px"><i class='fa fa-clock-o text-info p-2' aria-hidden='true'></i>Start Time: ${this.pipe.transform(workstation.st, 'shortTime')}</span>
          <span style="width:200px"><i class='fa fa-clock-o text-info p-2' aria-hidden='true'></i>End Time: ${this.pipe.transform(workstation.ft, 'shortTime')}</span>
          `;
        }

        return html;
      }
}

