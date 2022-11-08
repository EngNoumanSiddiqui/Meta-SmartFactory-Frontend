import {debounceTime, switchMap} from 'rxjs/operators';
import {Component, EventEmitter, Input, OnInit, Output, OnDestroy} from '@angular/core';

import {Subject, Subscription} from 'rxjs';
import { AppStateService } from 'app/services/dto-services/app-state.service';

import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';

import { EmployeeGenericGroupService } from 'app/services/dto-services/employee-generic-group.service';


@Component({
  selector: 'employee-general-group-auto-complete',
  templateUrl: './employee-general-auto-complete.component.html',

})

export class EmployeeGeneralGroupAutoCompleteComponent implements OnInit, OnDestroy {

  @Output() selectedGeneralGroupEvent = new EventEmitter<any>();
  selectedGeneralGroup: any;
  selectedGeneralGroupId: any;
  @Input() required: boolean = false;
  @Input() disabled: boolean;
  @Input() dropdown = true;
  sub: Subscription;
  @Input() addIfMissing = false;
  modal = {active: false};
  selectedPlant = null;
  isSetDefaultSelected: boolean = false;

  @Input('selectedGeneralGroup')  set in(selectedGeneralGroup) {
    this.selectedGeneralGroup = selectedGeneralGroup;
  }
  @Input('selectedGeneralGroupNo')  set inGeneralGroupNo(selectedGeneralGroupNo) {
    if(selectedGeneralGroupNo) {
      this.selectedGeneralGroup = {GeneralGroupNo: selectedGeneralGroupNo};
    }
  }
  @Input('selectedGeneralGroupId')  set inId(selectedGeneralGroupId) {
    if (selectedGeneralGroupId) {
      this.selectedGeneralGroupId = +selectedGeneralGroupId;
      if(this.selectedGeneralGroup && this.selectedGeneralGroup.employeeGroupId === this.selectedGeneralGroupId) {

      } else {
        this.getDetailGeneralGroup();
      }
    } else {
      this.selectedGeneralGroupId = null;
      this.selectedGeneralGroup = null;
    }
  }

  @Input('plantId') set x (plantId) {
    if (plantId) {
      this.GeneralGroupFilter.plantId = plantId;
      this.searchTermGeneralGroups.next(this.GeneralGroupFilter);
    }
  }

  placeholder = 'no-data';
  filteredGeneralGroups: Array<any>;

  GeneralGroupFilter = {
    employeeGroupId: null,
    generalName: null,
    generalNo: null,
    plantId: null,
    pageSize: 500,
    pageNumber: 1,
    query: null,
    orderByProperty: 'employeeGroupId',
    orderByDirection: 'desc'
  };
  private allGeneralGroups: Array<any>;
  private searchTermGeneralGroups = new Subject<any>();

  constructor(private _empGeneralSvc: EmployeeGenericGroupService,
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
     private appStateSvc: AppStateService) {
    
  }

  modalShow() {
    this.modal.active = true;
  }


  ngOnInit() {
    this.searchTermGeneralGroups.pipe(
      debounceTime(400),
      switchMap(term => this._empGeneralSvc.filterObs(this.GeneralGroupFilter))).subscribe(
      res => this.initResult(res['content']),
      error2 => this.initResult([])
    );
    
    this.sub = this.appStateSvc.plantAnnounced$.subscribe(res => {
      if ((res) && res.plantId) {
        this.selectedPlant = res;
        this.GeneralGroupFilter.plantId = res.plantId;
        this.searchTermGeneralGroups.next(this.GeneralGroupFilter);
      } 
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  private  initResult(res) {
    this.allGeneralGroups = res;
    if (res.length > 0) {
      this.placeholder = 'search-employee-general-group';
    } else {
      this.placeholder = 'no-data';
    }
  }

  getDetailGeneralGroup() {
    this._empGeneralSvc.getDetail(this.selectedGeneralGroupId).then(res => {
      this.selectedGeneralGroup = res;
    }).catch(Err => console.error(Err));
  }

  onChangeGeneralGroup(event) {
    console.log('@onChangeGeneralGroup', event);
    if (event && event.hasOwnProperty('employeeGenericGroupId')) {
      this.selectedGeneralGroupEvent.next(this.selectedGeneralGroup);
    } else {
      this.selectedGeneralGroupEvent.next(null);
    }
  }

  searchWareHouse(event) {
    this.filteredGeneralGroups = this.filterMatched(event.query);
  }

  onSave(res) {
    if(res) {
      this.selectedGeneralGroup = res;
      this.allGeneralGroups.unshift({...res});
      this.onChangeGeneralGroup(this.selectedGeneralGroup);
      this.modal.active = false;
    }
  }


  handleDropdownClickForWareHouse() {
    this.filteredGeneralGroups = [...this.allGeneralGroups];
    if (this.filteredGeneralGroups.length === 0) {
      this.GeneralGroupFilter.generalName = null;
      this.searchTermGeneralGroups.next(this.GeneralGroupFilter);
    }
  }

  filterMatched(query): any[] {
    const filtered: any[] = [];
    if (this.allGeneralGroups && this.allGeneralGroups.length > 0) {
      for (let i = 0; i < this.allGeneralGroups.length; i++) {
        const obj = this.allGeneralGroups[i];
        const emp = obj['employeeGenericGroupId'] + obj['groupCode'] + obj['groupName'];
        if (emp.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(obj);
        }
      }
    }
    if (filtered.length === 0) {
      this.GeneralGroupFilter.generalName = query;
      this.searchTermGeneralGroups.next(this.GeneralGroupFilter);
    }
    return filtered;
  }
}
