import {debounceTime, switchMap} from 'rxjs/operators';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subject} from 'rxjs';
import { UsersService } from 'app/services/users/users.service';
import { StopCauseService } from 'app/services/dto-services/stop-cause/stop-cause.service';


@Component({
  selector: 'stop-cause-auto-complete',
  templateUrl: './stop-cause-auto-complete.component.html',

})

export class StopCauseAutoCompleteComponent implements OnInit {

  disabled = false;
  @Output() selectedStopCauseEvent = new EventEmitter<any>();
  selectedStopCause: any;
  @Input() required: boolean;
  @Input() dropdown = true;
  @Input() getInfoById = false;
  @Input() appendToBody = false;
  workStationList = [];
  selectedPlant: any;
  @Input('plantId') set x (plantId) {
    if (plantId) {
      this.stopCauseFilter.plantId = plantId;
      this.searchTerms.next(this.stopCauseFilter);
    }
  }
  
  @Input('disabled')
  set y(disabled) {
    this.disabled = disabled;
  }
  @Input('selectedStopCause') set in(selectedStopCause) {
    // if (selectedStopCause) {
      this.selectedStopCause = selectedStopCause || null;
    // }
  }
  @Input('selectedStopCauseId') set inid(selectedStopCauseId) {
    // 
    if (selectedStopCauseId && (!this.selectedStopCause || selectedStopCauseId !== this.selectedStopCause.stopCauseId)) {
      this.getStopCauseDetail(selectedStopCauseId);
    } else if (selectedStopCauseId && this.getInfoById) {
      this.getStopCauseDetail(selectedStopCauseId);
    }
    
  }

  placeholder= 'no-data';
  filteredStopCause: Array<any>;

  stopCauseFilter = {
    stopCauseName: null,
    stopCauseId: null,
    plantId: null,
    pageSize: 500,
    pageNumber: 1,
    orderByProperty: 'stopCauseName',
    parentId: null
  };

  private allStopCauses: Array<any>;
  private searchTerms = new Subject<any>();

  constructor(private stopCauseService: StopCauseService, private _userSvc: UsersService) {
    const setPlant = this._userSvc.getPlant();
    this.selectedPlant = JSON.parse(setPlant);
    if (this.selectedPlant) {
      this.stopCauseFilter.plantId = this.selectedPlant.plantId;
    }
  }


  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.stopCauseService.filter(this.stopCauseFilter))).subscribe(
      res => this.initResult(res['content']),
      error2 => this.initResult([])
    );
    this.searchTerms.next(this.stopCauseFilter);
  }

  private  initResult(res) {
    // this.filteredStopCause = res;
    if(this.workStationList && this.workStationList.length) {
      this.allStopCauses = [...this.workStationList];
    } else {
      this.allStopCauses = res;
    }
    if (this.allStopCauses.length > 0) {
      this.placeholder = 'select-stop-cause';
    } else {
      this.placeholder = 'no-data';

    }
  }

  // searchStopCause(event) {
  //   this.stopCauseFilter.workStationName = event.query;
  //   this.searchTerms.next(this.stopCauseFilter);
  // }
  //
  //
  // handleDropdownClickForStopCause() {
  //   this.stopCauseFilter.workStationName = null;
  //   this.searchTerms.next(this.stopCauseFilter);
  // }
  //

  onChangeStopCause(event) {
    if (event && event.hasOwnProperty('stopCauseId')) {
      this.selectedStopCauseEvent.next(this.selectedStopCause);
    } else {
      this.selectedStopCauseEvent.next(null);
    }
  }
  searchStopCause(event) {
    this.filteredStopCause = this.filterMatched(event.query);
  }

  handleDropdownClickForStopCause() {
    this.filteredStopCause = [...this.allStopCauses];

    if ( this.filteredStopCause.length == 0) {
      this.stopCauseFilter.stopCauseName = null;
      this.searchTerms.next(this.stopCauseFilter);
    }
  }
  getStopCauseDetail(workstationId) {
      this.stopCauseService.getDetail(workstationId).then((rs: any) => {
        this.selectedStopCause = rs;
        // this.onChangeStopCause(this.selectedStopCause);
      });
  }
  filterMatched(query): any[] {
    const filtered: any[] = [];
    if (this.allStopCauses && this.allStopCauses.length > 0) {
      for (let i = 0; i < this.allStopCauses.length; i++) {
        const obj = this.allStopCauses[i];
        if (obj['stopCauseName'].toLowerCase().indexOf(query.toLowerCase()) >= 0 ||
        obj['stopCauseNo'].toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(obj);
        }
      }
    }
    if (filtered.length == 0) {
      this.stopCauseFilter.stopCauseName = query;
        this.searchTerms.next(this.stopCauseFilter);
    }
    return filtered;
  }
}
