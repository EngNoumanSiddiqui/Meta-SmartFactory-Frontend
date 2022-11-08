import {debounceTime, switchMap} from 'rxjs/operators';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {Subject} from 'rxjs';
import {MaintenanceReasonService} from '../../../services/dto-services/maintenance-equipment/maintenance-reason.service';
import { UsersService } from 'app/services/users/users.service';


@Component({
  selector: 'maintenance-reason-auto-complete',
  templateUrl: './maintenance-reason-auto-complete.component.html',

})

export class MaintenanceReasonAutoCompleteComponent implements OnInit {

  @Output() selectedMaintenanceReasonEvent = new EventEmitter();
  selectedMaintenanceReason;
  @Input() required: boolean;
  @Input() dropdown=true;
  @Input() disabled = false;
  selectedPlant: any;
  @Input('selectedMaintenanceReason')

  set in(selectedMaintenanceReason) {
    this.selectedMaintenanceReason = selectedMaintenanceReason;
  }

  placeholder = 'no-data';
  filteredMaintenanceReason: Array<any>;

  maintenanceReasonFilter = {
    description: null,
    pageSize: 500,
    pageNumber: 1,
    plantId: null,
    orderByProperty: 'description'
  };
  @Input() addIfMissing = false;

  modal = {active: false};

  private allMaintenanceReasons: Array<any>;
  private searchTerms = new Subject<any>();

  constructor(private maintenanceReasonService: MaintenanceReasonService, private _userSvc: UsersService) {
    const setPlant = this._userSvc.getPlant();
    this.selectedPlant = JSON.parse(setPlant);
    if (this.selectedPlant) {
      this.maintenanceReasonFilter.plantId = this.selectedPlant.plantId;
    }
  }

  modalShow() {
    this.modal.active = true;
  }
  ngOnInit() {

    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.maintenanceReasonService.filterSharedObservable(this.maintenanceReasonFilter))).subscribe(
      res => this.initResult(res['content']),
      error2 => this.initResult([])
    );
    this.searchTerms.next(this.maintenanceReasonFilter);
  }

  private  initResult(res) {
    // this.filteredMaintenanceReason = res;
    this.allMaintenanceReasons = res;
    if (res.length > 0) {
      this.placeholder = 'search-maintenance-reason';
    } else {
      this.placeholder = 'no-data';

    }
  }


  onChangeMaintenanceReason(event) {
    if (event && event.hasOwnProperty('maintenanceReasonId')) {
      this.selectedMaintenanceReasonEvent.next(this.selectedMaintenanceReason);
    } else {
      this.selectedMaintenanceReasonEvent.next(null);
    }
  }

  searchMaintenanceReason(event) {
    this.filteredMaintenanceReason = this.filterMatched(event.query);
  }

  handleDropdownClickForMaintenanceReason() {
    this.filteredMaintenanceReason = [...this.allMaintenanceReasons];

    if (this.filteredMaintenanceReason.length == 0) {
      this.maintenanceReasonFilter.description = null;
      this.searchTerms.next(this.maintenanceReasonFilter);
    }
  }

  filterMatched(query): any[] {
    const filtered: any[] = [];
    if (this.allMaintenanceReasons && this.allMaintenanceReasons.length > 0) {
      for (let i = 0; i < this.allMaintenanceReasons.length; i++) {
        const obj = this.allMaintenanceReasons[i];
        if (obj['description'].toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(obj);
        }
      }
    }
    if (filtered.length == 0) {
      this.maintenanceReasonFilter.description = query;
      this.searchTerms.next(this.maintenanceReasonFilter);
    }
    return filtered;
  }

  setMaintenanceReason(maintenanceReason) {

    if (maintenanceReason) {
      this.selectedMaintenanceReason = maintenanceReason;
      this.allMaintenanceReasons.push(maintenanceReason);
      this.handleDropdownClickForMaintenanceReason()
      this.onChangeMaintenanceReason(this.selectedMaintenanceReason);
    }
  }

}
