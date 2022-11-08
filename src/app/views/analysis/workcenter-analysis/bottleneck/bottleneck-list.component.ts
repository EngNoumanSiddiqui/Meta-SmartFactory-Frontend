import {Component, Input, OnInit} from '@angular/core';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { LoaderService } from 'app/services/shared/loader.service';
import {WorkCenterAnalysisDash, WorkstationAnalysisList} from '../../../../dto/workcenter/workcenter.model';
import {ConvertUtil} from '../../../../util/convert-util';

@Component({
  selector: 'bottleneck-list',
  templateUrl: './bottleneck-list-component.html'
})
export class BottleneckListComponent implements OnInit {

  bottlenecks = [
    // {
    //   workstationId: 1, workstationName: 'aa', activeTime: 1
    // }
  ];

  @Input('workstationAnl') set setworkstationAnl(workstationAnl) {
    this.initTable(workstationAnl);
  }


  cols = [
    {field: 'workstationId', header: 'workstation-id'},
    {field: 'workstationName', header: 'workstation-name'},
    {field: 'activeTime', header: 'active-time'},
    {field: 'stopTime', header: 'stop-time'},
    {field: 'mtbf', header: 'mtbf'},
    {field: 'mttr', header: 'mttr'},
    {field: 'starved', header: 'starved'},
    {field: 'blocked', header: 'blocked'},
    {field: 'activeThroughput', header: 'active-throughput'},
    {field: 'totalThroughput', header: 'total-throughput'},
  ];

  constructor(private loaderService: LoaderService) {
  }

  ngOnInit() {
  }

  private initTable(workstationAnl: WorkCenterAnalysisDash) {
    const bottlenecks = [];
    if (workstationAnl && workstationAnl.workstationAnalysisList && workstationAnl.workstationAnalysisList.length > 0) {

      workstationAnl.workstationAnalysisList.forEach(item => {
        bottlenecks.push(this.getField(item));
      });
    }
    this.bottlenecks = bottlenecks;

  }

  showWsDetail(id){
    this.loaderService.showDetailDialog(DialogTypeEnum.WORKSTATION, id);
  }

  private getField(item: WorkstationAnalysisList) {
    return {
      workstationId: item.workstationId,
      workstationName: item.workstationName,
      activeThroughput: item.activeThroughput,
      totalThroughput: item.totalThroughput,
      stopTime: ConvertUtil.secondDuration2DHHMMSSTime(item.stopTime),
      activeTime: ConvertUtil.secondDuration2DHHMMSSTime(item.activeTime),
      starved: ConvertUtil.secondDuration2DHHMMSSTime(item.starvedTime),
      blocked: ConvertUtil.secondDuration2DHHMMSSTime(item.blockedTime),
      mtbf: item.stopCount > 0 ? ConvertUtil.fix(item.productionTime / item.stopCount, 1) : 0,
      mttr: item.stopCount > 0 ? ConvertUtil.fix(item.stopTime / item.stopCount, 1) : 0,
    }

  }

}
