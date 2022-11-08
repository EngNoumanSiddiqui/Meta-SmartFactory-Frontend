import { Component, Input, OnInit } from '@angular/core';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { LoaderService } from 'app/services/shared/loader.service';
import { ConvertUtil } from '../../../../util/convert-util';

@Component({
  selector: 'app-production-analysis',
  templateUrl: './production-analysis.component.html',
  styleUrls: ['./production-analysis.component.scss']
})
export class ProductionAnalysisComponent implements OnInit {

  @Input('data') set d(data) {
    if (data) {
      this.treeData = this.detailList2Node(data);
    }
  }

  cols = [
    { field: 'workstationName', header: 'dimension' },
    { field: 'availability', header: 'availability' },
    { field: 'performance', header: 'performance' },
    { field: 'quality', header: 'quality' },
    { field: 'oee', header: 'oee' },
    { field: 'plannedProductionTime', header: 'planned-product-time' },
    { field: 'runTime', header: 'run-time' },
    { field: 'netRunTime', header: 'net-run-time' },
    { field: 'fullyProductiveTime', header: 'fully-productive-time' },
  ];

  treeData;

  constructor(
    private _loaderSvc: LoaderService
  ){}

  ngOnInit() { }

  compare(a, b) {
    const bandA = a.data.dimension.toUpperCase();
    const bandB = b.data.dimension.toUpperCase();

    let comparison = 0;
    if (bandA > bandB) {
      comparison = 1;
    } else if (bandA < bandB) {
      comparison = -1;
    }
    return comparison;
  }

  getReadableTime(time) {
    return ConvertUtil.longDuration2DHHMMSSTime(time)
  }

  detail2Node(detail) {
    const me = this;
    let node = null;
    if (detail) {
      node = {
        data: Object.assign({}, detail,
          { availability: this.getPercentage(detail.availability) },
          { quality: this.getPercentage(detail.quality) },
          { performance: this.getPercentage(detail.performance) },
          { oee: this.getPercentage(detail.oee) },
          { plannedProductionTime: this.getReadableTime(detail.plannedProductionTime * 1000) },
          { productionTime: this.getReadableTime(detail.productionTime * 1000) },
          { runTime: this.getReadableTime(detail.runTime * 1000) },
          { netRunTime: this.getReadableTime(detail.netRunTime * 1000) },
          { fullyProductiveTime: this.getReadableTime(detail.fullyProductiveTime * 1000) },
          { children: null }
        ),
        children: detail.innerList ? me.detailList2Node(detail.innerList) : [],
        key:
          ConvertUtil.getSimpleUId(),
        expanded: !!detail.expanded
      };
      return node;
    }
    return node;

  }

  detailList2Node(detailList) {
    const me = this;
    const list = [];

    if (detailList) {

      detailList.forEach((item) => {
        if(item.dimension === "Job Order 0" || item.availability == 0 || item.performance == 0 || item.quality == 0) {
        } else {
          const treeNode = me.detail2Node(item);
          list.push(treeNode);
        }
        // const treeNode = me.detail2Node(item);
        // list.push(treeNode);
      });

    }
    return list;
  }

  getPercentage(val) {
    if (val) {
      return (val * 100).toFixed(2) + '%';
    }
    return '';
  }
  
  showWorkStationDetailModal(workstation, rowNode){
    // console.log('@workstation', workstation)
    // console.log('@rowNode', rowNode)
    this._loaderSvc.showDetailDialog(DialogTypeEnum.WORKSTATION, workstation.workstationId);
    
    // if(rowNode.level === 0){
    //   this._loaderSvc.showDetailDialog(DialogTypeEnum.WORKSTATION, workstation.workstationId);
    // }else if(rowNode.level === 1 ){
    //   this._loaderSvc.showDetailDialog(DialogTypeEnum.SHIFTSETTING, workstation.workstationId);
    // }else if(rowNode.level === 2){

    // }
  }
  showJobOrderDetailModal(joborder){
    // console.log('@workstation', workstation)
    // console.log('@rowNode', rowNode)
    this._loaderSvc.showDetailDialog(DialogTypeEnum.JOBORDER, joborder.dimension.substr(10));
    
    // if(rowNode.level === 0){
    //   this._loaderSvc.showDetailDialog(DialogTypeEnum.WORKSTATION, workstation.workstationId);
    // }else if(rowNode.level === 1 ){
    //   this._loaderSvc.showDetailDialog(DialogTypeEnum.SHIFTSETTING, workstation.workstationId);
    // }else if(rowNode.level === 2){

    // }
  }
}
