import {debounceTime, switchMap} from 'rxjs/operators';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {WorkStationListDto} from '../../../dto/workstation/workstation-list-dto';
import {Subject} from 'rxjs';
import { WorkstationTypeService } from 'app/services/dto-services/workstation-type/workstation-type.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { UsersService } from 'app/services/users/users.service';


@Component({
  selector: 'workstation-type-auto-complete',
  templateUrl: './workstation-type-auto-complete.component.html',

})

export class WorkstationTypeAutoCompleteComponent implements OnInit {

  disabled = false;
  @Output() selectedWorkStationTypeEvent = new EventEmitter<any>();
  selectedWorkStationType: any;
  @Input() required: boolean;
  @Input() dropdown = true;
  @Input('disabled')
  set y(disabled) {
    this.disabled = disabled;
  }
  @Input() addIfMissing = false;

  modal = {active: false};

  @Input() selectedWorkstationTypeId;
  @Input('selectedWorkStationType')
  set in(selectedWorkStationType) {
    this.selectedWorkStationType = selectedWorkStationType;
  }

  workStationTypeFilter = {
      orderByDirection: null,
      orderByProperty: null,
      pageNumber: 1,
      pageSize: 99999,
      plantId: null,
      query: null,
      workStationTypeId: null,
      workStationTypeName: null,
  };
  

  placeholder = 'no-data';
  filteredWorkStationType: Array<any>;

  workstationtypename = null;
  private allWorkstationTypes: Array<any>;
  private searchTerms = new Subject<any>();

  constructor(private _workStationTypeSvc: WorkstationTypeService, private _userSvc: UsersService, private utilities: UtilitiesService) {
    const setPlant = this._userSvc.getPlant();
    const selectedPlant = JSON.parse(setPlant);
    if (selectedPlant) {
      this.workStationTypeFilter.plantId = selectedPlant.plantId;
    }
  }

  modalShow() {
    this.modal.active = true;
  }

  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this._workStationTypeSvc.filter(term))).subscribe(
      res => this.initResult(res['content']),
      error2 => this.initResult([])
    );
    this.searchTerms.next(this.workStationTypeFilter);
  }

  private  initResult(res) {
    // this.filteredWorkStation = res;
    this.allWorkstationTypes = res;
    if (res.length > 0) {
      this.placeholder = 'search-workstation-type';
      if (this.selectedWorkstationTypeId) {
        this.allWorkstationTypes.forEach(itm => {
          if (+this.selectedWorkstationTypeId === +itm.workStationTypeId) {
            this.selectedWorkStationType = itm;
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
    if (event && event.hasOwnProperty('workStationTypeId')) {
      this.selectedWorkStationTypeEvent.next(this.selectedWorkStationType);
    } else {
      this.selectedWorkStationTypeEvent.next(null);
    }
  }
  searchWorkStation(event) {
    this.filteredWorkStationType = this.filterMatched(event.query);
  }

  handleDropdownClickForWorkStation() {
    this.filteredWorkStationType = [...this.allWorkstationTypes];

    if ( this.filteredWorkStationType.length === 0) {
      this.workStationTypeFilter.query = null;
      this.searchTerms.next(this.workStationTypeFilter);
    }
  }
  filterMatched(query): any[] {
    const filtered: any[] = [];
    if (this.allWorkstationTypes && this.allWorkstationTypes.length > 0) {
      for (let i = 0; i < this.allWorkstationTypes.length; i++) {
        const obj = this.allWorkstationTypes[i];
        if (obj['workStationTypeName'].toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(obj);
        }
      }
    }
    if (filtered.length === 0) {
      this.workStationTypeFilter.query = query;
        this.searchTerms.next(this.workStationTypeFilter);
    }
    return filtered;
  }

  saveWorkStationType() {
    this._workStationTypeSvc.save({
      'workStationTypeName': this.workstationtypename,
      plantId: this.workStationTypeFilter.plantId
    })
      .then(result => {
        this.utilities.showSuccessToast('saved-success');
        this.selectedWorkStationType = {'workStationTypeId': result, 'workStationTypeName': this.workstationtypename}
        this.onChangeWorkStation({'workStationTypeId': result, 'workStationTypeName': this.workstationtypename});
        this.allWorkstationTypes.unshift({'workStationTypeId': result, 'workStationTypeName': this.workstationtypename});
        // this.workStation.workStationTypeId = result;
        // this.params.dialog.inputValue = '';
        this.modal.active = false;
      })
      .catch(error => this.utilities.showErrorToast(error));
  }
}
