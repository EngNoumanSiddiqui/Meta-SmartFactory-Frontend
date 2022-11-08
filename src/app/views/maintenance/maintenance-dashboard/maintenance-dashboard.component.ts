import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {ConvertUtil} from '../../../util/convert-util';
import * as moment from 'moment';
import {DashboardService} from '../../../services/dto-services/dashboard/dashboard.service';
import {UtilitiesService} from '../../../services/utilities.service';
import {LoaderService} from '../../../services/shared/loader.service';
import { Subscription } from 'rxjs';

import { AppStateService } from 'app/services/dto-services/app-state.service';

@Component({
  selector: 'app-maintenance-dashboard',
  templateUrl: './maintenance-dashboard.component.html'
})
export class MaintenanceDashboardComponent implements OnInit, OnDestroy {
  dateRange;

  filterModel = {
    startDate: null,
    finishDate: null,
    workcenterId: null,
    workstationId: null,
    plantId: null,
    employeeId: null
  };

  mttrInfo;
  mtbfInfo;
  showLoader = false;
  sub: Subscription;
  selectedPlant: any;

  cols = [
    { field: 'employeeName', header: 'employee' },
    { field: 'onSchedule', header: 'on-schedule' },
  ];

  constructor(private dashboardService: DashboardService,
              private appStateService: AppStateService,
              private utilities: UtilitiesService) {

                this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
                  if (!(res)) {
                    this.setSelectedPlant(null);
                  } else {
                    this.setSelectedPlant(res);
                  }
                });
  }

  ngOnInit() {
    const currentDay = moment(Date.now()).toDate();
    const lastDay = moment(Date.now()).dayOfYear(1).hour(0).minute(0).second(0).toDate();
    this.dateRange = [lastDay, currentDay];
    this.analyze();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  analyze() {
    this.filterModel.startDate = ConvertUtil.localDateShiftAsUTC(this.dateRange[0]);
    this.filterModel.finishDate = ConvertUtil.localDateShiftAsUTC(this.dateRange[1]);
    console.log(this.filterModel);

    // this.loaderService.showLoader();
    this.showLoader = true;
    this.loadMTTRInfo(this.filterModel);
    this.loadMTBFInfo(this.filterModel);
  }

  loadMTTRInfo(filterModel) {
    this.dashboardService.getMTTRInfo(filterModel).then(res => {
      this.mttrInfo = res;
      // this.mttrInfo = Object.assign({}, res);

      this.hideLoader();
    }).catch(err => {
      this.utilities.showErrorToast(err);

      this.hideLoader();
    })
  }

  loadMTBFInfo(filterModel) {
    this.dashboardService.getMTBFInfo(filterModel).then(res => {
      this.mtbfInfo = res;
      // this.mtbfInfo = Object.assign({}, res);

      this.hideLoader();
    }).catch(err => {
      this.utilities.showErrorToast(err);

      this.hideLoader();
    })
  }

  hideLoader() {
    // hide loader after getting result from the second service
    if (!this.showLoader) {
      // this.loaderService.hideLoader();
    }
    this.showLoader = false;
  }

  setSelectedPlant(event) {
    if (event) {
      this.selectedPlant = event;
      this.filterModel.plantId = event.plantId;
    } else {
      this.selectedPlant = null;
      this.filterModel.plantId = null;
    }
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
      this.filterModel.workcenterId = event.workCenterId;
    } else {
      this.filterModel.workcenterId = null;
    }
  }

  setSelectedEmployee(event) {
    if (event) {
      this.filterModel.employeeId = event.employeeId;
    } else {
      this.filterModel.employeeId = null;
    }
  }

  convertSecondsToHours(value) {
    const diffInHours: number = value / 60 / 60;
    // if (diffInHours < 0 || diffInHours === 0) {
    //   diffInHours += 24;
    // }
    return diffInHours.toFixed(2);
  }
}
