import {Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {JobSch, MonitoringDataDto} from '../../../dto/monitor/monitor';
import {ConvertUtil} from '../../../util/convert-util';
import {Subscription} from 'rxjs';
import {OeeAverageReport, RequestOeeDateIntervalDto} from '../../../dto/oee/oee.model';
import {OeeService} from '../../../services/dto-services/oee/oee-service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { LoaderService } from 'app/services/shared/loader.service';

@Component({
  selector: 'monitor-labor-modal-detail',
  templateUrl: './monitor-labor-detail.component.html',
  styleUrls: ['./monitor-labor-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FactoryModalLaborDetailComponent implements OnInit, OnDestroy {

  openedIndex = {0: true};
  showFullComponents = false;
  models: JobSch[];
  model: MonitoringDataDto;

  lastWorkstationId;
  stops;
  sessionCheckInterval: Subscription;

  averageStops;
  totalStops;
  stopCount;


  @Input('stops') set s(stops) {
    this.calculateStops(stops);
    if (stops) {
      this.stops = stops;

    } else {
      this.stops = null;
    }
  }

  @Input('model') set modelDto(model: MonitoringDataDto) {
    this.model = model;
    if (model) {
      this.models = model.datas;
      this.normalizeData();
    } else {
      this.models = null;
    }
  }

  constructor(private oeeService: OeeService, private loaderService: LoaderService) {

  }

  calculateStops(stops) {
    this.resetStopValues();
    const me = this;
    if (stops) {
      let total = 0;
      stops.forEach(item => {
        total += item.stopDuration;
      });
      this.totalStops = this.getReadableTime(total);
      this.averageStops = this.getReadableTime(total / stops.length);
      this.stopCount = stops.length;
    }

  }

  resetStopValues() {
    this.averageStops = null;
    this.totalStops = null;
    this.stopCount = null;
  }


  ngOnInit(): void {


  }


  ngOnDestroy() {
    if (this.sessionCheckInterval) {
      this.sessionCheckInterval.unsubscribe();
    }
  }

  getReadableTime(time) {
    if (time || time === 0) {
      return ConvertUtil.longDuration2DHHMMSSTime(time)
    } else {
      return ' - ';
    }
  }

  normalizeData() {
    const me = this;
    this.models.forEach(model => {

      model.dailyJobLoadedTimeAsString = me.getReadableTime(model.dailyJobLoadedTime);
      model.lastStopDurationAsString = me.getReadableTime(model.lastStopDuration);
      model.jobOperationTimeAsString = me.getReadableTime(model.jobOperationTime);
      model.dailyStopDurationAsString = me.getReadableTime(model.dailyStopDuration);
      model.employeeDtoList.forEach((employeeInfo, i) => {
        employeeInfo.workDurationAsString = me.getReadableTime(employeeInfo.workDuration);
        employeeInfo.stopDurationAsString = me.getReadableTime(employeeInfo.totalStopDuration);
        employeeInfo.remainingCycleDurationAsString = me.getReadableTime(employeeInfo.remainingCycleDuration);
        employeeInfo.remainingDurationAsString = me.getReadableTime(employeeInfo.remainingDuration);
        employeeInfo.plannedDurationAsString = me.getReadableTime(employeeInfo.plannedDuration);
        let position = 0;
        if (model.materiaList && model.materiaList.length > 0) {
          position = (employeeInfo.goodQuantity + employeeInfo.scrapQuantity + employeeInfo.reworkQuantity) / model.materiaList[0].neededQuantity;
        }
        employeeInfo.position = position;
      });
    });
  };

  openworkStationDetails(workstationId: any) {
    this.loaderService.showDetailDialog(DialogTypeEnum.WORKSTATION, workstationId);
  }
  openmaterialDetails(materialId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.STOCK, materialId);
  }
  openJobORderDetails(jobOrderId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.JOBORDER, jobOrderId);
  }

  showJobOrderOperationDetail(id) {
    this.loaderService.showDetailDialog(DialogTypeEnum.JOBORDEROPERATION, id);
  }
  showEmployeeDetail(id) {
    this.loaderService.showDetailDialog(DialogTypeEnum.STAFF, id);
  }
  toDate(duration) {
    if (duration && duration > -1) {
      const d = new Date(0, 0, 0, 0, 0, 0, 0);
      d.setMilliseconds(duration)
      return d;
    }
    return 0;
  }
}
