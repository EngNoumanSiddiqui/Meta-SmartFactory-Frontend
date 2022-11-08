import {debounceTime, switchMap} from 'rxjs/operators';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {Subject} from 'rxjs';
import {MaintenanceNotificationTypeService} from '../../../services/dto-services/maintenance-equipment/maintenance-notification-type.service';


@Component({
  selector: 'maintenance-notification-type-auto-complete',
  templateUrl: './maintenance-notification-type-auto-complete.component.html',

})

export class MaintenanceNotificationTypeAutoCompleteComponent implements OnInit {

  @Output() selectedMaintenanceNotificationTypeEvent = new EventEmitter();
  selectedMaintenanceNotificationType;
  selectedMaintenanceNotificationTypeId;
  @Input() required: boolean;
  @Input() dropdown=true;
  @Input('selectedMaintenanceNotificationType')

  set in(selectedMaintenanceNotificationType) {
    this.selectedMaintenanceNotificationType = selectedMaintenanceNotificationType;
  }
  @Input('selectedMaintenanceNotificationTypeId') set inId(selectedMaintenanceNotificationTypeId) {
    this.selectedMaintenanceNotificationTypeId = selectedMaintenanceNotificationTypeId;
  }

  @Input('plantId') set setPlantId(plantId) {
    if (plantId) {
      this.maintenanceNotificationTypeFilter.plantId = plantId;
      this.searchTerms.next(this.maintenanceNotificationTypeFilter);
    } else {
      this.maintenanceNotificationTypeFilter.plantId = null;
    }
  }

  placeholder = 'no-data';
  filteredMaintenanceNotificationType: Array<any>;

  maintenanceNotificationTypeFilter = {
    description: null,
    pageSize: 500,
    pageNumber: 1,
    orderByProperty: 'description',
    plantId: null
  };
  @Input() addIfMissing = false;

  modal = {active: false};

  private allMaintenanceNotificationTypes: Array<any>;
  private searchTerms = new Subject<any>();

  constructor(private maintenanceNotificationTypeService: MaintenanceNotificationTypeService) {

  }

  modalShow() {
    this.modal.active = true;
  }
  ngOnInit() {

    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.maintenanceNotificationTypeService.filterSharedObservable(this.maintenanceNotificationTypeFilter))).subscribe(
      res => this.initResult(res['content']),
      error2 => this.initResult([])
    );
    this.searchTerms.next(this.maintenanceNotificationTypeFilter);
  }

  private  initResult(res) {
    // this.filteredMaintenanceNotificationType = res;
    this.allMaintenanceNotificationTypes = res;
    if (res.length > 0) {
      this.placeholder = 'search-maintenance-notification-type';
      if (this.selectedMaintenanceNotificationTypeId) {
        this.selectedMaintenanceNotificationType = res.find(item => this.selectedMaintenanceNotificationTypeId === item.maintenanceNotificationTypeId);
      }
    } else {
      this.placeholder = 'no-data';

    }
  }


  onChangeMaintenanceNotificationType(event) {
    if (event && event.hasOwnProperty('maintenanceNotificationTypeId')) {
      this.selectedMaintenanceNotificationTypeEvent.next(this.selectedMaintenanceNotificationType);
    } else {
      this.selectedMaintenanceNotificationTypeEvent.next(null);
    }
  }

  searchMaintenanceNotificationType(event) {
    this.filteredMaintenanceNotificationType = this.filterMatched(event.query);
  }

  handleDropdownClickForMaintenanceNotificationType() {
    this.filteredMaintenanceNotificationType = [...this.allMaintenanceNotificationTypes];

    if (this.filteredMaintenanceNotificationType.length == 0) {
      this.maintenanceNotificationTypeFilter.description = null;
      this.searchTerms.next(this.maintenanceNotificationTypeFilter);
    }
  }

  filterMatched(query): any[] {
    const filtered: any[] = [];
    if (this.allMaintenanceNotificationTypes && this.allMaintenanceNotificationTypes.length > 0) {
      for (let i = 0; i < this.allMaintenanceNotificationTypes.length; i++) {
        const obj = this.allMaintenanceNotificationTypes[i];
        if (obj['description'].toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(obj);
        }
      }
    }
    if (filtered.length == 0) {
      this.maintenanceNotificationTypeFilter.description = query;
      this.searchTerms.next(this.maintenanceNotificationTypeFilter);
    }
    return filtered;
  }

  setMaintenanceNotificationType(maintenanceNotificationType) {

    if (maintenanceNotificationType) {
      this.selectedMaintenanceNotificationType = maintenanceNotificationType;
      this.allMaintenanceNotificationTypes.push(maintenanceNotificationType);
      this.handleDropdownClickForMaintenanceNotificationType()
      this.onChangeMaintenanceNotificationType(this.selectedMaintenanceNotificationType);
    }
  }

}
