import {debounceTime, switchMap} from 'rxjs/operators';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {Subject} from 'rxjs';
import {MaintenanceStrategyService} from '../../../services/dto-services/maintenance-equipment/maintenance-strategy.service';
import { UsersService } from 'app/services/users/users.service';


@Component({
  selector: 'maintenance-strategy-auto-complete',
  templateUrl: './maintenance-strategy-auto-complete.component.html',

})

export class MaintenanceStrategyAutoCompleteComponent implements OnInit {

  @Output() selectedMaintenanceStrategyEvent = new EventEmitter();
  selectedMaintenanceStrategy;
  @Input() required: boolean;
  @Input() dropdown = true;
  selectedPlant: any;
  @Input('selectedMaintenanceStrategy')

  set in(selectedMaintenanceStrategy) {
    this.selectedMaintenanceStrategy = selectedMaintenanceStrategy;
  }

  placeholder = 'no-data';
  filteredMaintenanceStrategy: Array<any>;

  maintenanceStrategyFilter = {
    maintenanceStrategyId: null,
    description: null,
    plantId: null,
    query: null,
    pageNumber: 1,
    pageSize: 9999
  };
  @Input() addIfMissing = false;

  modal = {active: false};

  private allMaintenanceStrategys: Array<any>;
  private searchTerms = new Subject<any>();

  constructor(private maintenanceStrategyService: MaintenanceStrategyService, private _userSvc: UsersService) {
    const setPlant = this._userSvc.getPlant();
    this.selectedPlant = JSON.parse(setPlant);
    if (this.selectedPlant) {
      this.maintenanceStrategyFilter.plantId = this.selectedPlant.plantId;
    }
  }

  modalShow() {
    this.modal.active = true;
  }
  ngOnInit() {

    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.maintenanceStrategyService.filterObservable(this.maintenanceStrategyFilter))).subscribe(
      res => this.initResult(res['content']),
      error2 => this.initResult([])
    );
    this.searchTerms.next(this.maintenanceStrategyFilter);
  }

  private  initResult(res) {
    // this.filteredMaintenanceStrategy = res;
    this.allMaintenanceStrategys = res;
    if (res.length > 0) {
      this.placeholder = 'search-maintenance-strategy';
    } else {
      this.placeholder = 'no-data';

    }
  }


  onChangeMaintenanceStrategy(event) {
    if (event && event.hasOwnProperty('maintenanceStrategyId')) {
      this.selectedMaintenanceStrategyEvent.next(this.selectedMaintenanceStrategy);
    } else {
      this.selectedMaintenanceStrategyEvent.next(null);
    }
  }

  searchMaintenanceStrategy(event) {
    this.filteredMaintenanceStrategy = this.filterMatched(event.query);
  }

  handleDropdownClickForMaintenanceStrategy() {
    this.filteredMaintenanceStrategy = [...this.allMaintenanceStrategys];

    if (this.filteredMaintenanceStrategy.length == 0) {
      this.maintenanceStrategyFilter.description = null;
      this.searchTerms.next(this.maintenanceStrategyFilter);
    }
  }

  filterMatched(query): any[] {
    const filtered: any[] = [];
    if (this.allMaintenanceStrategys && this.allMaintenanceStrategys.length > 0) {
      for (let i = 0; i < this.allMaintenanceStrategys.length; i++) {
        const obj = this.allMaintenanceStrategys[i];
        if (obj['description'].toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(obj);
        }
      }
    }
    if (filtered.length == 0) {
      this.maintenanceStrategyFilter.description = query;
      this.searchTerms.next(this.maintenanceStrategyFilter);
    }
    return filtered;
  }

  setMaintenanceStrategy(maintenanceStrategy) {

    if (maintenanceStrategy) {
      this.selectedMaintenanceStrategy = maintenanceStrategy;
      this.allMaintenanceStrategys.push(maintenanceStrategy);
      this.handleDropdownClickForMaintenanceStrategy()
      this.onChangeMaintenanceStrategy(this.selectedMaintenanceStrategy);
    }
  }

}
