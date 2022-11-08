import { Component, OnDestroy, OnInit } from '@angular/core';
import { StopService } from '../../../../services/dto-services/stop/stop.service';
import { WorkstationStops } from '../../../../dto/analysis/stop-down-time/workstation-stops';
import { StopPercentage } from '../../../../dto/analysis/stop-down-time/stop-percentage';
import { UtilitiesService } from '../../../../services/utilities.service';
import { LoaderService } from '../../../../services/shared/loader.service';

import { AppStateService } from 'app/services/dto-services/app-state.service';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './stop-downtime-analysis.html'
})
export class StopDowntimeAnalysisComponent implements OnInit, OnDestroy {
  
  display = false;

  thisDay: Array<StopPercentage>;
  yesterday: Array<StopPercentage>;
  thisWeek: Array<StopPercentage>;
  lasWeek: Array<StopPercentage>;
  thisMonth: Array<StopPercentage>;
  lastMonth: Array<StopPercentage>;
  selectedPlant: any;
  sub: Subscription;
  result: WorkstationStops = null;

  constructor(private utilities: UtilitiesService, private loader: LoaderService,
    private appStateSvc: AppStateService,
    private _stopSvc: StopService) {
      

  }

  exportAsPng(printSectionId: string) {
    this.utilities.exportAsPng(printSectionId);
  }


  ngOnInit(): void {
    this.display = false;

    this.sub = this.appStateSvc.plantAnnounced$.subscribe((res: any) => {
      if (res) {
        this.selectedPlant = res;
        this.filter();
      }
    });
    
    // this.filter();

  }

  filter() {
    this.loader.showLoader();
    this._stopSvc.getAllWorkStopsPlantIdPercentage(this.selectedPlant.plantId).then(result => {
      this.loader.hideLoader();
      this.initializeData(<WorkstationStops>result);
      this.display = true;
    }
    ).catch(error => {
      this.loader.hideLoader();
      this.utilities.showErrorToast(error);
      this.display = true;
    });
  }

  ngOnDestroy() {
    if(this.sub) {
      this.sub.unsubscribe();
    }
  }



  private initializeData(result: WorkstationStops) {
    this.result = result;
    this.thisDay = result.today;
    this.yesterday = result.yesterday;
    this.thisWeek = result.thisWeek;
    this.lasWeek = result.lastWeek;
    this.thisMonth = result.thisMonth;
    this.lastMonth = result.lastMonth;

  }

  onChangeStop(stop){
    this.display =  false;
    let planned: boolean = true;
    if(stop === 'PLANNED'){
        planned  = true;
    }else if(stop === 'UNPLANNED'){
       planned =  false;
    }
    // this.loader.showLoader();
    // this._stopSvc.getAllWorkStopsPlantIdPercentage(this.selectedPlant.plantId).then(result => {
    //   this.loader.hideLoader();
    //   this.initializeData(<WorkstationStops>result);
      if(stop !== '' && stop !==null && stop !=='null'){
        // console.log('@planned', planned)
        this.thisDay = this.result.today.filter(item => item.planned === planned);
        this.yesterday = this.result.yesterday.filter(item => item.planned === planned);
        this.thisWeek = this.result.thisWeek.filter(item => item.planned === planned);
        this.lasWeek = this.result.lastWeek.filter(item => item.planned === planned);
        this.thisMonth = this.result.thisMonth.filter(item => item.planned === planned);
        this.lastMonth = this.result.lastMonth.filter(item => item.planned === planned);
      } else {
        this.initializeData(this.result);
      }
      this.display = true;
    // }).catch(error => {
    //   this.loader.hideLoader();
    //   this.utilities.showErrorToast(error);
    //   this.display = true;
    // });


  }

}
