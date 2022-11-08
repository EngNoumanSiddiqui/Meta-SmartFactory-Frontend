import {debounceTime, switchMap} from 'rxjs/operators';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {Subject} from 'rxjs';
import {MaintenanceActivityTypeService} from '../../../services/dto-services/maintenance-equipment/maintenance-activity-type.service';
import { UsersService } from 'app/services/users/users.service';


@Component({
  selector: 'maintenance-activity-type-auto-complete',
  templateUrl: './maintenance-activity-type-auto-complete.component.html',

})

export class MaintenanceActivityTypeAutoCompleteComponent implements OnInit {

  @Output() selectedMaintenanceActivityTypeEvent = new EventEmitter<any>();
  selectedMaintenanceActivityType;
  selectedMaintenanceActivityTypeID;
  @Input() required: boolean;
  @Input() dropdown = true;
  @Input() disabled = false;
  selectedPlant: any;
  @Input('selectedMaintenanceActivityType') set in(selectedMaintenanceActivityType) {
    this.selectedMaintenanceActivityType = selectedMaintenanceActivityType;
  }

  @Input('selectedMaintenanceActivityTypeId') set inId(selectedMaintenanceActivityTypeId) {
    this.selectedMaintenanceActivityTypeID = selectedMaintenanceActivityTypeId;
  }
  placeholder = 'no-data';
  filteredMaintenanceActivityType: Array<any>;

  maintenanceActivityTypeFilter = {
    description: null,
    pageSize: 500,
    plantId: null,
    pageNumber: 1,
    orderByProperty: 'description'
  };
  @Input() addIfMissing = false;

  modal = {active: false};

  private allMaintenanceActivityTypes: Array<any>;
  private searchTerms = new Subject<any>();

  constructor(private maintenanceActivityTypeService: MaintenanceActivityTypeService, private _userSvc: UsersService) {
    const setPlant = this._userSvc.getPlant();
    this.selectedPlant = JSON.parse(setPlant);
    if (this.selectedPlant) {
      this.maintenanceActivityTypeFilter.plantId = this.selectedPlant.plantId;
    }
  }

  modalShow() {
    this.modal.active = true;
  }
  ngOnInit() {

    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.maintenanceActivityTypeService.filterSharedObservable(this.maintenanceActivityTypeFilter))).subscribe(
      res => this.initResult(res['content']),
      error2 => this.initResult([])
    );
    this.searchTerms.next(this.maintenanceActivityTypeFilter);
  }

  private  initResult(res) {
    // this.filteredMaintenanceActivityType = res;
    this.allMaintenanceActivityTypes = res;
    if (res.length > 0) {
      this.placeholder = 'search-maintenance-activity-type';
      if (this.selectedMaintenanceActivityTypeID) {
        const selecteditm = res.find(item => this.selectedMaintenanceActivityTypeID === item.maintenanceActivityTypeId);
        this.selectedMaintenanceActivityType = selecteditm;
      }
    } else {
      this.placeholder = 'no-data';

    }
  }


  onChangeMaintenanceActivityType(event) {
    if (event && event.hasOwnProperty('maintenanceActivityTypeId')) {
      this.selectedMaintenanceActivityTypeEvent.next(this.selectedMaintenanceActivityType);
    } else {
      this.selectedMaintenanceActivityTypeEvent.next(null);
    }
  }

  searchMaintenanceActivityType(event) {
    this.filteredMaintenanceActivityType = this.filterMatched(event.query);
  }

  handleDropdownClickForMaintenanceActivityType() {
    this.filteredMaintenanceActivityType = [...this.allMaintenanceActivityTypes];

    if (this.filteredMaintenanceActivityType.length == 0) {
      this.maintenanceActivityTypeFilter.description = null;
      this.searchTerms.next(this.maintenanceActivityTypeFilter);
    }
  }

  filterMatched(query): any[] {
    const filtered: any[] = [];
    if (this.allMaintenanceActivityTypes && this.allMaintenanceActivityTypes.length > 0) {
      for (let i = 0; i < this.allMaintenanceActivityTypes.length; i++) {
        const obj = this.allMaintenanceActivityTypes[i];
        if (obj['description'].toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(obj);
        }
      }
    }
    if (filtered.length == 0) {
      this.maintenanceActivityTypeFilter.description = query;
      this.searchTerms.next(this.maintenanceActivityTypeFilter);
    }
    return filtered;
  }

  setMaintenanceActivityType(maintenanceActivityType) {

    if (maintenanceActivityType) {
      this.selectedMaintenanceActivityType = maintenanceActivityType;
      this.allMaintenanceActivityTypes.push(maintenanceActivityType);
      this.handleDropdownClickForMaintenanceActivityType()
      this.onChangeMaintenanceActivityType(this.selectedMaintenanceActivityType);
    }
  }

}
