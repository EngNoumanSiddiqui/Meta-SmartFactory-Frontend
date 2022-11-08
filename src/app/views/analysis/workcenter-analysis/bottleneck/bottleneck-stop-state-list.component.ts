import {Component, OnInit, Input, EventEmitter, Output, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import { WorkCenterAnalysisDash } from 'app/dto/workcenter/workcenter.model';
import { DatePipe } from '@angular/common';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { LoaderService } from 'app/services/shared/loader.service';


@Component({
    selector: 'bottleneck-stop-state-list-item',
    template: `

     <!--legend area-->
     <div class="row d-flex justify-content-around mt-4">
          <div class="" *ngFor="let stop of stoplist">
            <span class="legend-box" [style.border]="'1px solid ' + stop.color"
            [style.background-color]="stop.color">
            </span> {{stop.name |translate}}
          </div>
          <!-- <div class=""><span class="legend-box closed"></span> {{'automatic-stop'|translate}}</div> -->
    </div>
    <!--endof legend area-->
    <hr>
    <!--chart drawing begin-->
<div class="row  status-container" [style.minHeight]="'120px'" [style.maxHeight]="'250px'" [style.height]="(vLHeight)? vLHeight+'px': '270'" style="overflow-y: scroll;"
     (resized)="onResizeContainer($event)">

  <!--here we draw shiftArray.length vertical lines for hour 00:00 to 24:00-->
  <!--on left side we left leftVlOffset px, this leftVlOffset px will be used to draw workstations label-->
  <ng-container *ngFor="let item of shiftArray; let index=index;">
    <div class="vl vl-bolder" [style.height]="vLHeight+'px'" [style.minHeight]="(vLHeight)? vLHeight+'px': '300px'"  [ngStyle]="{'left':((chartWidth/(shiftArray.length-1))*index+leftVlOffset)+'px'}"
         [ngClass]="{'vl-bolder':(index%2)==0}"></div>

  </ng-container>
  <!--        <div class="vl vl-bolder" [ngStyle]="{'left':((chartWidth/6)*0+leftVlOffset)+'px'}"></div>-->
  <!--        <div class="vl" [ngStyle]="{'left':((chartWidth/6)*1+leftVlOffset)+'px'}"></div>-->

  <!--end of vertical lines-->

  <!--horizontal line begin-->
  <div class="hl" [style.left]="leftVlOffset+'px'" [style.minHeight]="(vLHeight)? vLHeight+'px': '300px'" [style.maxHeight] = "'600px'" [ngStyle]="{'width':(chartWidth+2)+'px'}"></div>
  <!--horizontal line end-->

  <!--here we draw x axes horizontal label that defined in hourArray -->

  <ng-container *ngFor="let item of shiftArray; let index=index;">
        <span class="position-absolute hour-span hour-bold" [style.top]="(vLHeight)? vLHeight+'px': '300px'"
              [ngClass]="{'hour-bold':(index%2)==0}"
              [ngStyle]="{'left':((chartWidth/(shiftArray.length-1))*index+leftHourOffset)+'px'}"
        >{{item}}</span>
  </ng-container>
  <!--        <span class="position-absolute hour-span hour-bold" [ngStyle]="{'left':(leftHourOffset)+'px'}">06:00</span>-->
  <!--        <span class="position-absolute hour-span" [ngStyle]="{'left':((chartWidth/6)+leftHourOffset)+'px'}">10:00</span>-->
  <!--        <span class="position-absolute hour-span hour-bold" [ngStyle]="{'left':((chartWidth/6)*2+leftHourOffset)+'px'}">14:00</span>-->
  <!--        <span class="position-absolute hour-span" [ngStyle]="{'left':((chartWidth/6)*3+leftHourOffset)+'px'}">18:00</span>-->
  <!--        <span class="position-absolute hour-span hour-bold" [ngStyle]="{'left':((chartWidth/6)*4+leftHourOffset)+'px'}">22:00</span>-->
  <!--        <span class="position-absolute hour-span" [ngStyle]="{'left':((chartWidth/6)*5+leftHourOffset)+'px'}">02:00</span>-->
  <!--        <span class="position-absolute hour-span hour-bold" [ngStyle]="{'left':((chartWidth/6)*6+leftHourOffset)+'px'}">06:00</span>-->
  <!--end of x axes horizontal labels-->


  <ng-container *ngFor="let item of workstationStatusArray; let index=index;">

        <span class="position-absolute"
              [style.left]="xLabelLeftOffset+'px'"
              [style.top]="((index*barRowHeight)+(barMargin*1.8))+'px'">

              <!-- <a href="javascript:;" (click)="showWsDetail(item.workstationId)">
                {{item.workstationName && item.workstationName.length>20?item.workstationName.substring(0,20):item.workstationName}}
                <span *ngIf="item.workstationName && item.workstationName.length>20" style="cursor: pointer" [pTooltip]="item.workstationName " >...</span>
              </a> -->

              <a href="javascript:;" (click)="showWsDetail(item.workstationId)" [pTooltip]="item.workstationName" tooltipPosition="top">
                {{item.workstationName && item.workstationName.length>9?item.workstationName.substring(0,7):item.workstationName}}
                <span *ngIf="item.workstationName && item.workstationName.length>9" 
                  style="cursor: pointer">...</span>
              </a>
          
        
        </span>
    <div class="position-absolute" [ngStyle]="{'top':((index*barRowHeight)+barMargin)+'px'}">

      <ng-container *ngFor="let aItem of item.bottleneckStateList">
            <span [style.height]="barHeight+'px'"
            [pTooltip]="showWorkStationStatusToolTip(aItem, 'scn')" [escape]="false" tooltipPosition="top"
                  [style.left]="((aItem.o*chartWidth)+leftVlOffset+1)+'px'"
                  [style.width]="(((chartWidth*aItem.ds) + ((aItem.o*chartWidth)+leftVlOffset+1)) > (chartWidth + leftVlOffset) ? ((chartWidth + leftVlOffset) - ((aItem.o*chartWidth)+leftVlOffset+1)):  chartWidth*aItem.ds)+'px'"
                  class="position-absolute span_opacity"
                  [style.background-color]="getcolor(aItem.scn)"
                  ></span>

      </ng-container>
    </div>
</ng-container>
</div>
  `,
  styles: [`

.status-container{
  position: relative;
  //height: 300px;
}
.vl {
  border-left: 1px dashed #bababa;
  //height: 250px;
  position: absolute;
  opacity: 0.5;

}
.vl-bolder{
  border-left: 2px solid #6c808c !important;
}
.hour-span {
  //top: 250px;
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
  //left: 100px;
  //top: 250px;

}

.legend-box{
  height: 15px;
  width: 20px!important;
  padding:0 9px;
  border-radius: 2px;
  opacity: 0.75;
  margin-right: 1px;
}



.span_opacity {
  opacity: 0.75;
}


  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class BottleneckStopStateListItemComponent implements OnInit {

  @Output() setStopList = new EventEmitter<any>();
    pipe = new DatePipe('en-US');
    workstationAnl: WorkCenterAnalysisDash;
    workstationStatusArray: any;
    @Input('workstationAnl') set setworkstationAnl (workstationAnl) {
        this.workstationAnl = workstationAnl;
        this.initWorkstatus(this.workstationAnl);
        let stops = [];
        this.workstationAnl.workstationAnalysisList.forEach(wrk => {
          if (!wrk.bottleneckStateTotalDurationList || wrk.bottleneckStateTotalDurationList.length === 0) { return 0; }
               wrk.bottleneckStateTotalDurationList.forEach(item => {
            stops.push(item.name);
          });
        });
        // assing distinct values
        stops = [...new Set(stops)];
        stops.forEach(item => {
          this.stoplist.push({name: item, color: this.getRandomColor()});
        });
        this.setStopList.next(this.stoplist);
    }

    shiftArray = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'];
    DAY_SECONDS = 24 * 60 * 60;
    stoplist = [];
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
    getRandomColor() {
      var letters = '0123456789ABCDEF';
      var color = '#';
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }

    getcolor = (scn) => {
      const stop = this.stoplist.find(itm =>  itm.name === scn);
      if (stop) {
        return stop.color;
      } else {
        return '';
      }
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
    showWorkStationStatusToolTip(workstation , name: string) {
        let html = '';
        html = `<b>${workstation[name]}</b>
               <span style="width:200px"><i class='fa fa-clock-o text-info p-2' aria-hidden='true'></i>Start Time: ${this.pipe.transform(workstation.st, 'shortTime', 'GMT')}</span>
               <span style="width:200px"><i class='fa fa-clock-o text-info p-2' aria-hidden='true'></i>End Time: ${this.pipe.transform(workstation.ft, 'shortTime', 'GMT')}</span>
               `;
        return html;
      }
    normalizeData(dateStatusArray) {
      if (dateStatusArray) {
        this.workstationStatusArray = dateStatusArray;
        // this.workstationAnl.workstationAnalysisList[0].bottleneckStateList[0].stopCauseName
        const me = this;

        dateStatusArray.forEach(item => {
          // let totalDur = 0;
          if(!item.bottleneckStateList) return;
          item.bottleneckStateList.forEach(aItem => {
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


    showWsDetail(id){
      this.loaderService.showDetailDialog(DialogTypeEnum.WORKSTATION, id);
    }


    initWorkstatus(res) {
      if (res) {
        this.normalizeData(res.workstationAnalysisList);
      }
      this.cdx.markForCheck();
    }
}

