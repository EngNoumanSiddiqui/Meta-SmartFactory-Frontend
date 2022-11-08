import {Component, OnInit, OnDestroy, ViewEncapsulation} from '@angular/core';
import {ConvertUtil} from '../../util/convert-util';
import { AppStateService } from 'app/services/dto-services/app-state.service';

import { WorkCenterListDto } from 'app/dto/workcenter/workcenter.model';
import { Subscription } from 'rxjs';
import { OeeReportDashboardDto, OeeReportDtoResponse } from 'app/dto/oee/oee.model';
import { OeeService } from 'app/services/dto-services/oee/oee-service';
import * as moment from 'moment';
import { ShiftSettingsService } from 'app/services/dto-services/shift-setting/shift-setting.service';

// import { Router } from '@angular/router';

@Component({
  templateUrl: 'dashboard.component.html',
  styles: [`
  .graph-btn{
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1000;
    margin-right: 15px;
    }
    body .ui-dialog .ui-dialog-content{
      padding-bottom: 2em !important;
    }
  `],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit, OnDestroy {

  filterModel = {
    day: new Date(),
    workcenterId: null,
    workstationId: null,
    plantId: null,
    pageSize: 50,
    pageNumber: 1,
    orderByDirection: null,
    orderByProperty: null,
    query: null,
    shiftId: null
  };

  pageFilter: OeeReportDashboardDto = {
    pageNumber: 1,
    pageSize: 99999,
    orderByProperty: null,
    orderByDirection: 'desc',
    oeeReportId: 0,
    plantId: 0,
    query: null,
    rangeStart: null,
    rangeEnd: new Date(),
    shiftId: null,
    workcenterId: 0,
    workstationId: 0
  };


  filterChangeData;
  selectedPlant = null;

  selectedWorkCenter: WorkCenterListDto = {
    workCenterId: null,
    workCenterName: 'All'
  };
  sub: Subscription;
  slctdWorkCenter: any;

  modal = {
    active: false,
    type: null
  }
  reportDashboardData;
  zIndex: boolean = true;
  shiftList = [];
  selectedShift = null;
  filteredShift: any[];

  constructor(
    private appStateService: AppStateService,
    private shiftService: ShiftSettingsService,
    private oeeService: OeeService) {

      this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
        if (!(res)) {
          this.setSelectedPlant(null);
        } else {
          this.setSelectedPlant(res);
        }
      });
  }

  ngOnInit() {

  }

  onShiftChanged(shift) {
    this.filterModel.shiftId = shift.shiftId;
    const day = ConvertUtil.localDateShiftAsUTC(this.filterModel.day);
    this.filterChangeData = Object.assign({}, this.filterModel, {day: day});
    // this.selectedShift = shift;
  }

  filterShift(event) {
    const filtered: any[] = [];
    const query = event.query;
    for (let i = 0; i < this.shiftList.length; i++) {
      const shift = this.shiftList[i];
      if (shift.shiftName.toLowerCase().indexOf(query.toLowerCase()) === 0) {
          filtered.push(shift);
      }
    }
    this.filteredShift = filtered;
  }
  handleDropdownClickForShift() {
    this.filteredShift = [...this.shiftList];
  }

  getOeeReportDashboard() {
    this.pageFilter.workcenterId = this.filterModel.workcenterId;
    this.pageFilter.workstationId = this.filterModel.workstationId;
    this.pageFilter.plantId = this.filterModel.plantId;
    this.pageFilter.shiftId = this.filterModel.shiftId;


    // this.pageFilter.rangeStart = ConvertUtil.date2StartOfDay(this.filterModel.day);
    // this.pageFilter.rangeEnd = ConvertUtil.date2EndOfDay(this.filterModel.day);

    this.oeeService.getOeeReportDashboard(this.pageFilter).then((result: OeeReportDtoResponse[]) => {
      this.reportDashboardData = result;
    });
  }
  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  analyze() {
    this.pageFilter.rangeStart = ConvertUtil.localDateShiftAsUTC(moment(this.filterModel.day).startOf('day').toDate());
    this.pageFilter.rangeEnd = ConvertUtil.localDateShiftAsUTC(moment(this.filterModel.day).endOf('day').toDate());

    const day = ConvertUtil.localDateShiftAsUTC(this.filterModel.day);
    this.filterChangeData = Object.assign({}, this.filterModel, {day: day});

    this.getOeeReportDashboard();
  }

  setSelectedPlant(event) {
    if (event) {
      this.selectedPlant = event;
      this.filterModel.plantId = event.plantId;
      this.filterModel.shiftId = null;
      this.shiftService.getShiftSettingsListByPlantId(this.selectedPlant.plantId).then((res: any) => {
        this.shiftList = res;
      });
      this.selectedShift = null;
      this.shiftService.getShiftByPlantAndCurrentDate(this.selectedPlant.plantId).then((res: any) => {
        this.selectedShift = res;
        this.filterModel.shiftId = this.selectedShift.shiftId;
        this.analyze();
      }).catch(err =>  this.analyze());
    } else {
      this.filterModel.plantId = null;
      this.selectedPlant = null;
    }

    // this.analyze();
  }

  setSelectedWorkstation(event) {
    if (event) {
      this.filterModel.workstationId = event.workStationId;
    } else {
      this.filterModel.workstationId = null;

    }
  }

  setSelectedWorkCenter(event) {
    if (event) {
      this.slctdWorkCenter = event;
      this.filterModel.workcenterId = event.workCenterId;
    } else {
      this.filterModel.workcenterId = null;
      this.slctdWorkCenter = event;

    }
  }

  onViewGraph(graph: string){
    this.zIndex = false;
    this.modal.type = graph;
      this.modal.active = true;
    // if(graph === 'production-by-job-order'){
    //   this.modal.type = 'production-by-job-order';
    //   this.modal.active = true;
    // }else if(graph === 'oee-by-workstation'){
    //   this.modal.type = 'oee-by-workstation';
    //   this.modal.active = true;
    // }else if(graph === 'machine-status'){
    //   this.modal.type = 'machine-status';
    //   this.modal.active = true;
    // }else if(graph === 'production-state'){
    //   this.modal.type = 'production-state';
    //   this.modal.active = true;
    // }else if(graph === 'production-analysis'){
    //   this.modal.type = 'production-analysis';
    //   this.modal.active = true;
    // }
  }

  onHide(display: boolean){
    this.modal.active = display;
    this.zIndex = true;
    this.modal.type = null;
  }

}
