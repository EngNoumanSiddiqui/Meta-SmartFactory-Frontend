import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import * as moment from 'moment';
import { Subscription } from 'rxjs';

import { AppStateService } from 'app/services/dto-services/app-state.service';
import {MeasuringDocumentService} from '../../../../services/dto-services/measuring/measuring-document.service';
import {LoaderService} from '../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../services/utilities.service';
import {ConvertUtil} from '../../../../util/convert-util';

@Component({
  selector: 'maintenance-sensor-data',
  templateUrl: './maintenance-sensor-data.component.html'
})
export class MaintenanceSensorDataComponent implements OnInit, OnDestroy {
  filterModel = {
    startDate: null,
    finishDate: null,
    workstationId: null,
    equipmentId: null,
    plantId: null,
    pointSize: 100
  };

  tableData;
  sub: Subscription;
  selectedPlant: any;

  constructor(private appStateService: AppStateService,
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private measuringDocumentService: MeasuringDocumentService) {
  }

  ngOnInit() {
    const currentDay = moment(Date.now()).toDate();
    const lastDay = moment(Date.now()).dayOfYear(1).hour(0).minute(0).second(0).toDate();

    this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
      if (!(res)) {
        this.setSelectedPlant(null);
      } else {
        this.setSelectedPlant(res);
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  analyze() {
    // console.log(this.filterModel);

    const temp = Object.assign({}, this.filterModel);
    // set end time to 23:59:59 of selected day.
    temp.finishDate = moment(temp.finishDate).endOf('day').toDate();
    // temp.startDate = ConvertUtil.localDateShiftAsUTC(temp.startDate);
    // temp.finishDate = ConvertUtil.localDateShiftAsUTC(temp.finishDate);

    this.loaderService.showLoader();
    this.measuringDocumentService.getEquipmentSensorDataList(temp).then(result => {
        if ( Array.isArray(result) ) {
          this.tableData = result;
        }
        this.loaderService.hideLoader();
      }).catch(error => {
        this.tableData = [];
        this.utilities.showErrorToast(error);
        this.loaderService.hideLoader();
      });
  }

  setSelectedPlant(event) {
    if (event) {
      this.selectedPlant = event;
      if (this.filterModel.plantId !== event.plantId) {
        this.filterModel.workstationId = null;
        this.filterModel.equipmentId = null;
      }
      this.filterModel.plantId = event.plantId;
    } else {
      this.selectedPlant = null;
      this.filterModel.plantId = null;
      this.filterModel.workstationId = null;
      this.filterModel.equipmentId = null;
    }
  }

  setSelectedWorkstation(event) {
    if (event) {
      if (this.filterModel.workstationId !== event.workStationId) {
        this.filterModel.equipmentId = null;
      }
      this.filterModel.workstationId = event.workStationId;
    } else {
      this.filterModel.workstationId = null;
      this.filterModel.equipmentId = null;
    }
  }

  setSelectedEquipment(event) {
    if (event) {
      this.filterModel.equipmentId = event.equipmentId;
    } else {
      this.filterModel.equipmentId = null;
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
