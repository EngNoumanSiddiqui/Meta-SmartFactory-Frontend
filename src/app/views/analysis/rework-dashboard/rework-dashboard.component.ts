import {Component, OnInit, OnDestroy} from '@angular/core';
import { AppStateService } from 'app/services/dto-services/app-state.service';
import { ConvertUtil } from 'app/util/convert-util';

import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-rework-dashboard',
  templateUrl: './rework-dashboard.component.html'
})
export class ReworkDashboardComponent implements OnInit, OnDestroy {
  dateRange;

  filterModel = {
    startDate: null,
    finishDate: null,
    workcenterId: null,
    workstationId: null,
    plantId: null
  };
  selectedPlant;
  filterChangeData;
  sub: Subscription;
  timerSub: Subscription;
  constructor(private appStateService: AppStateService) {
  }

  ngOnInit() {
    
    this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
      if (!(res)) {
        this.selectedPlant = null;
        this.filterModel.plantId = null;
      } else {
        this.selectedPlant = res;
        this.filterModel.plantId = res.plantId;
      }
    });
  

    // const currentDay = moment(Date.now()).toDate();
    // const lastDay = moment(Date.now()).subtract(1, 'weeks').toDate();
    // this.dateRange = [lastDay, currentDay];
    if(this.dateRange) {
      this.analyze();
    }
    
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  analyze() {


    this.filterModel.startDate = ConvertUtil.localDateShiftAsUTC(this.dateRange?.[0]);
    this.filterModel.finishDate = ConvertUtil.localDateShiftAsUTC(this.dateRange?.[1]);
    if(ConvertUtil.sameDay(new Date(this.filterModel.finishDate), new Date())) {
      this.filterChangeData = Object.assign({}, this.filterModel);
      this.timerSub = interval(6 * 1000).subscribe(() => {
        this.filterChangeData = Object.assign({}, this.filterModel);  
      });
    } else {
      this.filterChangeData = Object.assign({}, this.filterModel);
      if(this.timerSub) {
        this.timerSub.unsubscribe();
      }
    }
   
    // console.log(this.filterModel);
  }


  setSelectedPlant(event) {

    if (event) {
      this.filterModel.plantId = event.plantId;
    } else {
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
}
