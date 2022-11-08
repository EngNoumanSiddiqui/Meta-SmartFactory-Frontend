import {debounceTime, switchMap} from 'rxjs/operators';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {Subject} from 'rxjs';
import {MaintenanceSystemConditionService} from '../../../services/dto-services/maintenance-equipment/maintenance-system-condition.service';
import { UsersService } from 'app/services/users/users.service';


@Component({
  selector: 'maintenance-system-condition-auto-complete',
  templateUrl: './maintenance-system-condition-auto-complete.component.html',

})

export class MaintenanceSystemConditionAutoCompleteComponent implements OnInit {

  @Output() selectedMaintenanceSystemConditionEvent = new EventEmitter();
  selectedMaintenanceSystemCondition;
  @Input() required: boolean;
  @Input() dropdown = true;
  selectedPlant: any;

  @Input('selectedMaintenanceSystemCondition')

  set in(selectedMaintenanceSystemCondition) {
    this.selectedMaintenanceSystemCondition = selectedMaintenanceSystemCondition;
  }

  placeholder = 'no-data';
  filteredMaintenanceSystemCondition: Array<any>;

  maintenanceSystemConditionFilter = {
    description: null,
    pageSize: 500,
    pageNumber: 1,
    plantId: null,
    orderByProperty: 'description'
  };
  @Input() addIfMissing = false;

  modal = {active: false};

  private allMaintenanceSystemConditions: Array<any>;
  private searchTerms = new Subject<any>();

  constructor(private maintenanceSystemConditionService: MaintenanceSystemConditionService, private _userSvc: UsersService) {
    const setPlant = this._userSvc.getPlant();
    this.selectedPlant = JSON.parse(setPlant);
    if (this.selectedPlant) {
      this.maintenanceSystemConditionFilter.plantId = this.selectedPlant.plantId;
    }
  }

  modalShow() {
    this.modal.active = true;
  }

  ngOnInit() {

    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.maintenanceSystemConditionService.filterSharedObservable(this.maintenanceSystemConditionFilter))).subscribe(
      res => this.initResult(res['content']),
      error2 => this.initResult([])
    );
    this.searchTerms.next(this.maintenanceSystemConditionFilter);
  }

  private  initResult(res) {
    // this.filteredMaintenanceSystemCondition = res;
    this.allMaintenanceSystemConditions = res;
    if (res.length > 0) {
      this.placeholder = 'search-system-condition';
    } else {
      this.placeholder = 'no-data';

    }
  }


  onChangeMaintenanceSystemCondition(event) {
    if (event && event.hasOwnProperty('maintenanceSystemConditionId')) {
      this.selectedMaintenanceSystemConditionEvent.next(this.selectedMaintenanceSystemCondition);
    } else {
      this.selectedMaintenanceSystemConditionEvent.next(null);
    }
  }

  searchMaintenanceSystemCondition(event) {
    this.filteredMaintenanceSystemCondition = this.filterMatched(event.query);
  }

  handleDropdownClickForMaintenanceSystemCondition() {
    this.filteredMaintenanceSystemCondition = [...this.allMaintenanceSystemConditions];

    if (this.filteredMaintenanceSystemCondition.length == 0) {
      this.maintenanceSystemConditionFilter.description = null;
      this.searchTerms.next(this.maintenanceSystemConditionFilter);
    }
  }

  filterMatched(query): any[] {
    const filtered: any[] = [];
    if (this.allMaintenanceSystemConditions && this.allMaintenanceSystemConditions.length > 0) {
      for (let i = 0; i < this.allMaintenanceSystemConditions.length; i++) {
        const obj = this.allMaintenanceSystemConditions[i];
        if (obj['description'].toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(obj);
        }
      }
    }
    if (filtered.length == 0) {
      this.maintenanceSystemConditionFilter.description = query;
      this.searchTerms.next(this.maintenanceSystemConditionFilter);
    }
    return filtered;
  }

  setMaintenanceSystemCondition(maintenanceSystemCondition) {

    if (maintenanceSystemCondition) {
      this.selectedMaintenanceSystemCondition = maintenanceSystemCondition;
      this.allMaintenanceSystemConditions.push(maintenanceSystemCondition);
      this.handleDropdownClickForMaintenanceSystemCondition()
      this.onChangeMaintenanceSystemCondition(this.selectedMaintenanceSystemCondition);
    }
  }

}
