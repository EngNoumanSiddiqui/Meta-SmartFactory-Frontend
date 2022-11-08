import {debounceTime, switchMap} from 'rxjs/operators';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subject} from 'rxjs';
import { UtilitiesService } from 'app/services/utilities.service';
import { WorkstationService } from 'app/services/dto-services/workstation/workstation.service';


@Component({
  selector: 'workstation-category-auto-complete',
  templateUrl: './workstation-category-autocomplete.component.html',

})

export class WorkstationCategoryAutoCompleteComponent implements OnInit {

  disabled = false;
  @Output() selectedWorkStationCategoryEvent = new EventEmitter();
  selectedWorkStationCategory: any;
  @Input() required: boolean;
  @Input() dropdown = true;
  @Input('disabled')
  set y(disabled) {
    this.disabled = disabled;
  }
  @Input() addIfMissing = false;

  modal = {active: false};

  @Input() selectedWorkstationCategoryId = null;
  @Input() selectedWorkstationCategoryCode = null;
  @Input('selectedWorkStationCategory')
  set in(selectedWorkStationCategory) {
    this.selectedWorkStationCategory = selectedWorkStationCategory;
  }
  

  placeholder = 'no-data';
  filteredWorkStationCategory: Array<any>;

  workstationCategoryname = null;
  private allWorkstationCategorys: Array<any>;
  private searchTerms = new Subject<any>();
  payLoadObject = {
    'wsCatCode': null,
    'wsCatDescription': null,
    'wsCatId': 0,
    'wsCatName': null
  };

  constructor(private _workStationSvc: WorkstationService, private utilities: UtilitiesService) {

  }

  modalShow() {
    this.modal.active = true;
  }

  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this._workStationSvc.getCategoryList())).subscribe(
      res => this.initResult(res),
      error2 => this.initResult([])
    );
    this.searchTerms.next();
  }

  private  initResult(res) {
    // this.filteredWorkStation = res;
    this.allWorkstationCategorys = res;
    if (res.length > 0) {
      this.placeholder = 'search-workstation-Category';
      if (this.selectedWorkstationCategoryId) {
        this.allWorkstationCategorys.forEach(itm => {
          if (+this.selectedWorkstationCategoryId === +itm.wsCatId) {
            this.selectedWorkStationCategory = itm;
          }
        })
      }
      if (this.selectedWorkstationCategoryCode) {
        this.allWorkstationCategorys.forEach(itm => {
          if (this.selectedWorkstationCategoryCode === itm.wsCatCode) {
            this.selectedWorkStationCategory = itm;
          }
        })
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
    if (event && event.hasOwnProperty('wsCatId')) {
      this.selectedWorkStationCategoryEvent.next(this.selectedWorkStationCategory);
    } else {
      this.selectedWorkStationCategoryEvent.next(null);
    }
  }
  searchWorkStation(event) {
    this.filteredWorkStationCategory = this.filterMatched(event.query);
  }

  handleDropdownClickForWorkStation() {
    this.filteredWorkStationCategory = [...this.allWorkstationCategorys];

    if ( this.filteredWorkStationCategory.length === 0) {
      // this.workstationFilter.workStationName = null;
      this.searchTerms.next();
    }
  }
  filterMatched(query): any[] {
    const filtered: any[] = [];
    if (this.allWorkstationCategorys && this.allWorkstationCategorys.length > 0) {
      for (let i = 0; i < this.allWorkstationCategorys.length; i++) {
        const obj = this.allWorkstationCategorys[i];
        if (obj['wsCatName'].toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(obj);
        }
      }
    }
    if (filtered.length === 0) {
      // this.workstationFilter.workStationName = query;
        // this.searchTerms.next(this.workstationFilter);
    }
    return filtered;
  }

  saveWorkStationCategory() {
    this._workStationSvc.saveWorkstationCategory(this.payLoadObject)
      .then(result => {
        this.utilities.showSuccessToast('saved-success');
        this.onChangeWorkStation({wsCatId: result, ...this.payLoadObject});
        this.allWorkstationCategorys.push({wsCatId: result, ...this.payLoadObject});
        this.modal.active = false;
      })
      .catch(error => this.utilities.showErrorToast(error));
  }
}
