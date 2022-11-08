import {debounceTime, switchMap} from 'rxjs/operators';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {WorkStationListDto} from '../../../dto/workstation/workstation-list-dto';
import {Subject} from 'rxjs';
import {WorkstationService} from '../../../services/dto-services/workstation/workstation.service';
import { UsersService } from 'app/services/users/users.service';


@Component({
  selector: 'workstation-auto-complete',
  templateUrl: './workstation-auto-complete.component.html',

})

export class WorkstationAutoCompleteComponent implements OnInit {

  disabled = false;
  @Output() selectedWorkStationEvent = new EventEmitter<any>();
  selectedWorkStation: WorkStationListDto;
  @Input() required: boolean = false;
  @Input() dropdown = true;
  @Input() getInfoById = false;
  @Input() appendToBody = false;
  workStationList = [];
  locationId: any = null;

  @Input('workStationList') set xworkStationList (workStationList) {
    if (workStationList) {
      this.workStationList = workStationList;
      this.allWorkstations = [...this.workStationList];
    }
  }

  selectedPlant: any;
  @Input('plantId') set x (plantId) {
    if (plantId) {
      this.workstationFilter.plantId = plantId;
      this.searchTerms.next(this.workstationFilter);
    }
  }
  @Input('locationId') set xLocationId (locationId) {
    if (locationId !== undefined) {
      this.locationId = locationId;
      this.workstationFilter.locationId = locationId;
      this.searchTerms.next(this.workstationFilter);
      // if(this.allWorkstations && this.allWorkstations.length) {
      //   const filteredWorkStations = this.allWorkstations
      //   .filter(workstation => workstation.location && workstation.location.locationId === this.locationId);
      //   if(filteredWorkStations.length) {
      //     this.allWorkstations = [...filteredWorkStations];
      //   }
      // }
    }
  }
  @Input('workCenterId') set stx (workCenterId) {
    if (workCenterId) {
      this.workstationFilter.workCenterId = workCenterId;
      this.searchTerms.next(this.workstationFilter);
    } else {
      this.workstationFilter.workCenterId = null;
      this.searchTerms.next(this.workstationFilter);
    }
    
  }
  @Input('disabled')
  set y(disabled) {
    this.disabled = disabled;
  }
  @Input('selectedWorkStation') set in(selectedWorkStation) {
    // if (selectedWorkStation) {
      this.selectedWorkStation = selectedWorkStation || null;
    // }
  }
  @Input('selectedWorkStationId') set inid(selectedWorkStationId) {
    // 
    if (selectedWorkStationId && (!this.selectedWorkStation || selectedWorkStationId !== this.selectedWorkStation.workStationId)) {
      this.getWorkStationDetail(selectedWorkStationId);
    } else if (selectedWorkStationId && this.getInfoById) {
      this.getWorkStationDetail(selectedWorkStationId);
    }
    
  }

  @Input('parentWorkStationId') set pWId(parentWorkStationId){
    if (parentWorkStationId) {
      this.workstationFilter.parentId = parentWorkStationId;
      this.searchTerms.next(this.workstationFilter);
    }
  }

  placeholder= 'no-data';
  filteredWorkStation: Array<WorkStationListDto>;

  workstationFilter = {
    workStationName: null,
    workCenterId: null,
    locationId: null,
    plantId: null,
    pageSize: 500,
    pageNumber: 1,
    orderByProperty: 'workStationName',
    parentId: null
  };

  private allWorkstations: Array<any>;
  private searchTerms = new Subject<any>();

  constructor(private workStationService: WorkstationService, private _userSvc: UsersService) {
    const setPlant = this._userSvc.getPlant();
    this.selectedPlant = JSON.parse(setPlant);
    if (this.selectedPlant) {
      this.workstationFilter.plantId = this.selectedPlant.plantId;
    }
  }


  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.workStationService.filterObservable(this.workstationFilter))).subscribe(
      res => this.initResult(res['content']),
      error2 => this.initResult([])
    );
    this.searchTerms.next(this.workstationFilter);
  }

  private  initResult(res) {
    // this.filteredWorkStation = res;
    if(this.workStationList && this.workStationList.length) {
      
      this.allWorkstations = [...this.workStationList];
    } else {
      this.allWorkstations = res;
    }
    if (this.allWorkstations.length > 0) {
      this.placeholder = 'search-workstation';
      if(this.locationId && res && res.length) {
        const workstations = res.filter(workstation => {
          if(this.allWorkstations.find(workstation2 => workstation2.workStationId === workstation.workStationId)) {
            return true;
          } else {
            return false;
          }
        });
        const filteredWorkStations= workstations
        .filter(workstation => workstation.location && workstation.location.locationId === this.locationId);
        if(filteredWorkStations && filteredWorkStations.length) {
          if(filteredWorkStations.length === 1) {
            this.selectedWorkStation = filteredWorkStations[0];
            this.onChangeWorkStation(this.allWorkstations[0]);
          }
        }
      }
    } else {
      this.placeholder = 'no-data';

    }
  }

  // searchWorkStation(event) {
  //   this.workstationFilter.workStationName = event.query;
  //   this.searchTerms.next(this.workstationFilter);
  // }
  //
  //
  // handleDropdownClickForWorkStation() {
  //   this.workstationFilter.workStationName = null;
  //   this.searchTerms.next(this.workstationFilter);
  // }
  //

  onChangeWorkStation(event) {
    if (event && event.hasOwnProperty('workStationId')) {
      this.selectedWorkStationEvent.next(this.selectedWorkStation);
    } else {
      this.selectedWorkStationEvent.next(null);
    }
  }
  searchWorkStation(event) {
    this.filteredWorkStation = this.filterMatched(event.query);
  }

  handleDropdownClickForWorkStation() {
    this.filteredWorkStation = [...this.allWorkstations];

    if ( this.filteredWorkStation.length == 0) {
      this.workstationFilter.workStationName = null;
      this.searchTerms.next(this.workstationFilter);
    }
  }
  getWorkStationDetail(workstationId) {
      this.workStationService.getDetail(workstationId).then((rs: any) => {
        this.selectedWorkStation = rs;
        // this.onChangeWorkStation(this.selectedWorkStation);
      });
  }
  filterMatched(query): any[] {
    const filtered: any[] = [];
    if (this.allWorkstations && this.allWorkstations.length > 0) {
      for (let i = 0; i < this.allWorkstations.length; i++) {
        const obj = this.allWorkstations[i];
        if (obj['workStationName'].toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(obj);
        }
      }
    }
    if (filtered.length == 0) {
      this.workstationFilter.workStationName = query;
        this.searchTerms.next(this.workstationFilter);
    }
    return filtered;
  }
}
