import {debounceTime, switchMap} from 'rxjs/operators';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {Subject} from 'rxjs';
import {MaintenanceCategoryService} from '../../../services/dto-services/maintenance-equipment/maintenance-category.service';
import { UsersService } from 'app/services/users/users.service';


@Component({
  selector: 'maintenance-category-auto-complete',
  templateUrl: './maintenance-category-auto-complete.component.html',

})

export class MaintenanceCategoryAutoCompleteComponent implements OnInit {

  @Output() selectedMaintenanceCategoryEvent = new EventEmitter();
  selectedMaintenanceCategory;
  @Input() required: boolean;
  @Input() dropdown=true;
  selectedPlant: any;
  @Input('selectedMaintenanceCategory')

  set in(selectedMaintenanceCategory) {
    this.selectedMaintenanceCategory = selectedMaintenanceCategory;
  }

  placeholder = 'no-data';
  filteredMaintenanceCategory: Array<any>;

  maintenanceCategoryFilter = {
    code: null,
    pageSize: 500,
    plantId: null,
    pageNumber: 1,
    orderByProperty: 'code'
  };
  @Input() addIfMissing = false;

  modal = {active: false};

  private allMaintenanceCategorys: Array<any>;
  private searchTerms = new Subject<any>();

  constructor(private maintenanceCategoryService: MaintenanceCategoryService, private _userSvc: UsersService) {
    const setPlant = this._userSvc.getPlant();
    this.selectedPlant = JSON.parse(setPlant);
    if (this.selectedPlant) {
      this.maintenanceCategoryFilter.plantId = this.selectedPlant.plantId;
    }
  }

  modalShow() {
    this.modal.active = true;
  }
  ngOnInit() {

    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.maintenanceCategoryService.filterSharedObservable(this.maintenanceCategoryFilter))).subscribe(
      res => this.initResult(res['content']),
      error2 => this.initResult([])
    );
    this.searchTerms.next(this.maintenanceCategoryFilter);
  }

  private  initResult(res) {
    // this.filteredMaintenanceCategory = res;
    this.allMaintenanceCategorys = res;
    if (res.length > 0) {
      this.placeholder = 'search-maintenance-category';
    } else {
      this.placeholder = 'no-data';

    }
  }


  onChangeMaintenanceCategory(event) {
    if (event && event.hasOwnProperty('maintenanceCategoryId')) {
      this.selectedMaintenanceCategoryEvent.next(this.selectedMaintenanceCategory);
    } else {
      this.selectedMaintenanceCategoryEvent.next(null);
    }
  }

  searchMaintenanceCategory(event) {
    this.filteredMaintenanceCategory = this.filterMatched(event.query);
  }

  handleDropdownClickForMaintenanceCategory() {
    this.filteredMaintenanceCategory = [...this.allMaintenanceCategorys];

    if (this.filteredMaintenanceCategory.length == 0) {
      this.maintenanceCategoryFilter.code = null;
      this.searchTerms.next(this.maintenanceCategoryFilter);
    }
  }

  filterMatched(query): any[] {
    const filtered: any[] = [];
    if (this.allMaintenanceCategorys && this.allMaintenanceCategorys.length > 0) {
      for (let i = 0; i < this.allMaintenanceCategorys.length; i++) {
        const obj = this.allMaintenanceCategorys[i];
        if (obj['code'].toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(obj);
        }
      }
    }
    if (filtered.length == 0) {
      this.maintenanceCategoryFilter.code = query;
      this.searchTerms.next(this.maintenanceCategoryFilter);
    }
    return filtered;
  }

  setMaintenanceCategory(maintenanceCategory) {

    if (maintenanceCategory) {
      this.selectedMaintenanceCategory = maintenanceCategory;
      this.allMaintenanceCategorys.push(maintenanceCategory);
      this.handleDropdownClickForMaintenanceCategory()
      this.onChangeMaintenanceCategory(this.selectedMaintenanceCategory);
    }
  }

}
