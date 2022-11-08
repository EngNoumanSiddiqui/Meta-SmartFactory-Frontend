import {Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {JobSch, MonitoringDataDto} from '../../../dto/monitor/monitor';
import {ConvertUtil} from '../../../util/convert-util';
import {Subscription} from 'rxjs';
import {OeeAverageReport, RequestOeeDateIntervalDto} from '../../../dto/oee/oee.model';
import {OeeService} from '../../../services/dto-services/oee/oee-service';
import { LoaderService } from 'app/services/shared/loader.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';

@Component({
  selector: 'factory-modal-detail',
  templateUrl: './monitoring-detail.component.html',
  styleUrls: ['./monitoring-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FactoryModalDetailComponent implements OnInit, OnDestroy {

  openedEmployees = true;
  showFullComponents = false;
  models: JobSch[];
  model: MonitoringDataDto;

  lastWorkstationId;
  stops;
  sessionCheckInterval: Subscription;

  averageStops;
  totalStops;
  stopCount;


  oEE: OeeAverageReport;


  oeeRequestTemplate: RequestOeeDateIntervalDto = {
    workstationId: null,
  };
  scrapData: any;
  reworkData: any;

  @Input('stops') set s(stops) {
    this.calculateStops(stops);
    if (stops) {
      this.stops = stops;

    } else {
      this.stops = null;
    }
  }

  @Input('scrapData') set sscrapData(scrapData) {
    if(scrapData) {
      this.scrapData = scrapData;
    } else {
      this.scrapData = null;
    }
  }
  @Input('reworkData') set sreworkData(reworkData) {
    if(reworkData) {
      this.reworkData = reworkData;
    } else {
      this.reworkData = null;
    }
  }

  @Input('model') set modelDto(model: MonitoringDataDto) {
    this.model = model;
    console.log('@models', this.model)
    if (model) {
      this.models = model.datas;
      // this.models[0].employees = [...this.models[0].employees,...this.models[0].employees, ...this.models[0].employees,...this.models[0].employees]
      if(this.models[0].oeeAvarageReport) {
        this.workStationOee(this.models[0].oeeAvarageReport)
      } else {
        this.getWorkstationOee(this.models[0].workStationId)
      }
      this.normalizeData(this.models);
      // this.initialize(this.models[0].jobOrderId);
    } else {
      this.models = null;
      this.getWorkstationOee(null);
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

  openJobORderDetails(jobOrderId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.JOBORDER, jobOrderId);
  }
   showJobOrderOperationDetail(id) {
    this.loaderService.showDetailDialog(DialogTypeEnum.JOBORDEROPERATION, id);
  }
  showEmployeeDetail(id) {
    this.loaderService.showDetailDialog(DialogTypeEnum.STAFF, id);
  }
  openmaterialDetails(materialId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.STOCK, materialId);
  }
  openWorkstationDetails(workstationId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.WORKSTATION, workstationId);
  }

  workStationOee(oee) {
    this.oEE = oee as OeeAverageReport;
    this.normalizePercent(this.oEE);
  }

  getWorkstationOee(workstationId) {

    if (workstationId) {

      if (workstationId !== this.lastWorkstationId) {
        this.lastWorkstationId = workstationId;
      } else {
        return;
      }
    } else {
      this.oEE = null;
      return;
    }
    this.oeeRequestTemplate.workstationId = workstationId;
    const decAFilter = Object.assign({}, this.oeeRequestTemplate);
    this.oeeService.latestShiftOeeReport(decAFilter).then(res => {
      this.oEE = res as OeeAverageReport;
      this.normalizePercent(this.oEE);
    });


  }

  normalizePercent(oEE) {
    if (!oEE) {
      return
    }
    // oEE.oee2 = this.normalizeDecimal(oEE.oee2);
    // // oEE.oee1 = this.normalizeDecimal(oEE.oee1);
    // oEE.availability = this.normalizeDecimal(oEE.availability);
    // oEE.quality = this.normalizeDecimal(oEE.quality);
    // oEE.teep = this.normalizeDecimal(oEE.teep);
    // oEE.actualPerformance = oEE.actualPerformance ? this.normalizeDecimal(oEE.actualPerformance) : oEE.actualPerformance;
    // oEE.workPerformance = oEE.workPerformance ? this.normalizeDecimal(oEE.workPerformance) : oEE.workPerformance;
  }

  normalizeDecimal(value) {
    if (Number(value) === 100) {
      return Math.round(100);
    }
    return parseFloat((value * 100).toFixed(2));
  }

  ngOnDestroy() {
    if (this.sessionCheckInterval) {
      this.sessionCheckInterval.unsubscribe();
    }
  }

  getReadableTime(time) {
    if (time) {
      return ConvertUtil.longDuration2DHHMMSSTime(time)
    } else {
      return ' - ';
    }
  }

  normalizeData(models) {
    const me = this;
    models.forEach(model => {

      model.dailyJobLoadedTimeAsString = me.getReadableTime(model.dailyJobLoadedTime);
      model.lastStopDurationAsString = me.getReadableTime(model.lastStopDuration);
      model.jobOperationTimeAsString = me.getReadableTime(model.jobOperationTime);
      model.dailyStopDurationAsString = me.getReadableTime(model.dailyStopDuration);
      // model.onScheduleEmployee = (model.onScheduleEmployee) ? (model.onScheduleEmployee * 100).toFixed(2) : 0;
    });
  };

  toDate(duration) {
    if (duration && duration > -1) {
      const d = new Date(0, 0, 0, 0, 0, 0, 0);
      d.setMilliseconds(duration)
      return d;
    }
    return 0;
  }
}
