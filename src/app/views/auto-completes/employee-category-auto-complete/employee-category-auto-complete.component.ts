import {debounceTime, switchMap} from 'rxjs/operators';
import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import { UtilitiesService } from 'app/services/utilities.service';
import { EmployeeCapabilityService } from 'app/services/dto-services/employee/employee-capabilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { AppStateService } from 'app/services/dto-services/app-state.service';

@Component({
  selector: 'employee-category-auto-complete',
  templateUrl: './employee-category-auto-complete.component.html'
})

export class EmployeeCategoryeAutoCompleteComponent implements OnInit, OnDestroy {

  disabled = false;
  @Output() selectedEmployeeCategoryEvent = new EventEmitter();
  selectedEmployeeCategory: any;
  @Input() required: boolean;
  @Input() dropdown = true;
  sub: Subscription;
  @Input('disabled')
  set y(disabled) {
    this.disabled = disabled;
  }
  @Input() addIfMissing = false;

  modal = {active: false};
  selectedEmployeeCategoryId;
  @Input('selectedEmployeeCategoryId') set inid(selectedEmployeeCategoryId) {
    
    if(selectedEmployeeCategoryId) {
      this.loadingService.showLoader();
      this.selectedEmployeeCategoryId = selectedEmployeeCategoryId;
      this.employeeCapSrv.detailCategory(this.selectedEmployeeCategoryId).then(res => {
        this.selectedEmployeeCategory = res;
        this.loadingService.hideLoader();
        this.onChangeEmployeeCategory(res);
      })
    }
  }
  @Input('selectedEmployeeCategory')
  set in(selectedEmployeeCategory) {
    this.selectedEmployeeCategory = selectedEmployeeCategory;
  }

  @Input('groupType') set ingroupType(groupType) {
    this.loadingService.showLoader();
    this.allEmployeeCategories = [];
    this.pageFilter.groupType = groupType;
    this.searchTerms.next();
  }
  
  pageFilter = {
    pageNumber: 1,
    pageSize: 9999,
    capabilityCode: null,
    cabability: null,
    groupType: null,
    maxProficiency: null,
    minProficiency: null,
    maxIntrest: null,
    plantId: null,
    minIntrest: null,
    description: null,
    orderByDirection: null,
    orderByProperty: null,
    query: null,
    skillMatrixCategoryId: null
  };

  placeholder = 'no-data';
  filteredEmployeeCategory: Array<any>;

  employeecategoryname = null;
  private allEmployeeCategories: Array<any>;
  private searchTerms = new Subject<any>();

  constructor(private employeeCapSrv: EmployeeCapabilityService, private loadingService: LoaderService,
    private appStateService: AppStateService,
     private utilities: UtilitiesService) {

      this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
        if (res) {
         this.pageFilter.plantId = res?.plantId;
         this.searchTerms.next();
        } else {
          this.pageFilter.plantId = null;
        }
      });
  }

  modalShow() {
    this.modal.active = true;
  }

  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.employeeCapSrv.filterCategoryObservable(this.pageFilter))).subscribe(
      res => this.initResult(res),
      error2 => this.initResult([])
    );
    this.searchTerms.next();
  }

  ngOnDestroy() {
    if(this.sub) {
      this.sub.unsubscribe();
    }
  }

  private  initResult(res) {
    // this.filteredWorkStation = res;
    this.allEmployeeCategories = res['content'];
    if (this.allEmployeeCategories && this.allEmployeeCategories.length > 0) {
      this.placeholder = 'search-employee-category';
      if (this.selectedEmployeeCategoryId) {
        this.allEmployeeCategories.forEach(itm => {
          if (+this.selectedEmployeeCategoryId === +itm.skillMatrixCategoryId) {
            this.selectedEmployeeCategory = itm;
          }
        })
      }
    } else {
      this.placeholder = 'no-data';

    }

    this.loadingService.hideLoader();
  }

  // searchEmployeeCategory(event) {
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

  onChangeEmployeeCategory(event) {
    if (event && event.hasOwnProperty('skillMatrixCategoryId')) {
      this.selectedEmployeeCategoryEvent.next(this.selectedEmployeeCategory);
    } else {
      this.selectedEmployeeCategoryEvent.next(null);
    }
  }
  searchEmployeeCategory(event) {
    this.filteredEmployeeCategory = this.filterMatched(event.query);
  }

  handleDropdownClickForWorkStation() {
    this.filteredEmployeeCategory = [...this.allEmployeeCategories];

    if ( this.filteredEmployeeCategory.length === 0) {
      // this.workstationFilter.workStationName = null;
      this.searchTerms.next();
    }
  }
  filterMatched(query): any[] {
    const filtered: any[] = [];
    if (this.allEmployeeCategories && this.allEmployeeCategories.length > 0) {
      for (let i = 0; i < this.allEmployeeCategories.length; i++) {
        const obj = this.allEmployeeCategories[i];
        if (obj['skillMatrixCategoryCode'].toLowerCase().indexOf(query.toLowerCase()) >= 0) {
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

  // saveWorkStationType() {
  //   this._workStationTypeSvc.save({'employeecategoryname': this.employeecategoryname})
  //     .then(result => {
  //       this.utilities.showSuccessToast('saved-success');
  //       this.onChangeWorkStation({'workStationTypeId': result, 'employeecategoryname': this.employeecategoryname});
  //       this.allEmployeeCategories.push({'workStationTypeId': result, 'employeecategoryname': this.employeecategoryname});
  //       // this.workStation.workStationTypeId = result;
  //       // this.params.dialog.inputValue = '';
  //       this.modal.active = false;
  //     })
  //     .catch(error => this.utilities.showErrorToast(error));
  // }
}
