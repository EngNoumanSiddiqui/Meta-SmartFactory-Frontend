import {debounceTime, switchMap} from 'rxjs/operators';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {Subject} from 'rxjs';
import {MaintenanceOrderTypeService} from '../../../services/dto-services/maintenance-equipment/maintenance-order-type.service';
import { UsersService } from 'app/services/users/users.service';


@Component({
  selector: 'maintenance-order-type-auto-complete',
  templateUrl: './maintenance-order-type-auto-complete.component.html',

})

export class MaintenanceOrderTypeAutoCompleteComponent implements OnInit {

  @Output() selectedMaintenanceOrderTypeEvent = new EventEmitter<any>();
  selectedMaintenanceOrderType;
  @Input() required: boolean;
  @Input() dropdown=true;
  selectedPlant: any;
  @Input('selectedMaintenanceOrderType')

  set in(selectedMaintenanceOrderType) {
    this.selectedMaintenanceOrderType = selectedMaintenanceOrderType;
  }

  placeholder = 'no-data';
  filteredMaintenanceOrderType: Array<any>;
  @Input('plantId') set setplantId(plantId) {
    if (plantId) {
      this.maintenanceOrderTypeFilter.plantId = plantId;
      this.searchTerms.next(this.maintenanceOrderTypeFilter);
    }
  }
  maintenanceOrderTypeFilter = {
    maintenanceOrderTypeName: null,
    pageSize: 500,
    plantId: null,
    pageNumber: 1,
    orderByProperty: 'maintenanceOrderTypeName'
  };
  @Input() addIfMissing = false;

  modal = {active: false};

  private allMaintenanceOrderTypes: Array<any>;
  private searchTerms = new Subject<any>();

  constructor(private maintenanceOrderTypeService: MaintenanceOrderTypeService, private _userSvc: UsersService) {
    const setPlant = this._userSvc.getPlant();
    this.selectedPlant = JSON.parse(setPlant);
    if (this.selectedPlant) {
      this.maintenanceOrderTypeFilter.plantId = this.selectedPlant.plantId;
    }
  }

  modalShow() {
    this.modal.active = true;
  }
  ngOnInit() {

    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.maintenanceOrderTypeService.filterSharedObservable(this.maintenanceOrderTypeFilter))).subscribe(
      res => this.initResult(res['content']),
      error2 => this.initResult([])
    );
    this.searchTerms.next(this.maintenanceOrderTypeFilter);
  }

  private  initResult(res) {
    // this.filteredMaintenanceOrderType = res;
    this.allMaintenanceOrderTypes = res;
    if (res.length > 0) {
      this.placeholder = 'search-maintenance-order-type';
    } else {
      this.placeholder = 'no-data';

    }
  }


  onChangeMaintenanceOrderType(event) {
    if (event && event.hasOwnProperty('maintenanceOrderTypeId')) {
      this.selectedMaintenanceOrderTypeEvent.next(this.selectedMaintenanceOrderType);
    } else {
      this.selectedMaintenanceOrderTypeEvent.next(null);
    }
  }

  searchMaintenanceOrderType(event) {
    this.filteredMaintenanceOrderType = this.filterMatched(event.query);
  }

  handleDropdownClickForMaintenanceOrderType() {
    this.filteredMaintenanceOrderType = [...this.allMaintenanceOrderTypes];

    if (this.filteredMaintenanceOrderType.length == 0) {
      this.maintenanceOrderTypeFilter.maintenanceOrderTypeName = null;
      this.searchTerms.next(this.maintenanceOrderTypeFilter);
    }
  }

  filterMatched(query): any[] {
    const filtered: any[] = [];
    if (this.allMaintenanceOrderTypes && this.allMaintenanceOrderTypes.length > 0) {
      for (let i = 0; i < this.allMaintenanceOrderTypes.length; i++) {
        const obj = this.allMaintenanceOrderTypes[i];
        if (obj['maintenanceOrderTypeName'].toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(obj);
        }
      }
    }
    if (filtered.length == 0) {
      this.maintenanceOrderTypeFilter.maintenanceOrderTypeName = query;
      this.searchTerms.next(this.maintenanceOrderTypeFilter);
    }
    return filtered;
  }

  setMaintenanceOrderType(maintenanceOrderType) {

    if (maintenanceOrderType) {
      this.selectedMaintenanceOrderType = maintenanceOrderType;
      this.allMaintenanceOrderTypes.push(maintenanceOrderType);
      this.handleDropdownClickForMaintenanceOrderType()
      this.onChangeMaintenanceOrderType(this.selectedMaintenanceOrderType);
    }
  }

}
