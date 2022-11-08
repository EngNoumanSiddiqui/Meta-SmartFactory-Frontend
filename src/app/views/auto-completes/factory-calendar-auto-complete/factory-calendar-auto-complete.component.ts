import {debounceTime, switchMap} from 'rxjs/operators';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {Subject} from 'rxjs';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UsersService } from 'app/services/users/users.service';
import { WorkstationService } from 'app/services/dto-services/workstation/workstation.service';


@Component({
  selector: 'factory-calendar-auto-complete',
  templateUrl: './factory-calendar-auto-complete.component.html',

})

export class FactoryCalendarAutoCompleteComponent implements OnInit {

  @Output() selectedFactoryCalendarEvent = new EventEmitter<any>();
  selectedFactoryCalendar;
  @Input() required: boolean;
  @Input() dropdown = true;
  @Input('selectedFactoryCalendar')
  set in(selectedFactoryCalendar) {
    if (selectedFactoryCalendar) {
      this.selectedFactoryCalendar = selectedFactoryCalendar;
    } else {
      this.selectedFactoryCalendar = null;
    }
  }

  @Input('selectedFactoryCalendarId')  set a(selectedFactoryCalendarId) {
    if(selectedFactoryCalendarId) {
      this.getFactoryCalendarDetail(selectedFactoryCalendarId);   
    }
    // this.FactoryCalendarFilter.forkliftId = selectedFactoryCalendarId;
  }

  placeholder = 'no-data';
  filteredFactoryCalendar: Array<any>;

  FactoryCalendarFilter = {
    pageSize: 9999,
    factoryCalendarId: null,
    code: null,
    category: null,
    createDate: null,
    plantId: null,
    query: null,
    pageNumber: 1,
    orderByProperty: 'factoryCalendarId'
  };
  @Input() addIfMissing = false;
  @Input() disabled = false;

  modal = {active: false};

  private allFactoryCalendars: Array<any>;
  private searchTerms = new Subject<any>();

  constructor(private factoryCalendarService: WorkstationService, private loadingService: LoaderService,
    private _userSvc: UsersService,
     private utilities: UtilitiesService) {
      let selectedPlant = JSON.parse(this._userSvc.getPlant());
      this.FactoryCalendarFilter.plantId = selectedPlant ? selectedPlant.plantId : null;
  }

  modalShow() {
  }
  

  ngOnInit() {

    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.factoryCalendarService.getFilterFactoryCalendarList(this.FactoryCalendarFilter))).subscribe(
      res => this.initResult(res['content']),
      error2 => this.initResult([])
    );
    this.searchTerms.next(this.FactoryCalendarFilter);
  }

  private getFactoryCalendarDetail(factoryCalendarId) {
    this.factoryCalendarService.getFactoryCalendarById(factoryCalendarId).then(res => {
      this.selectedFactoryCalendar = res;
    })
  }

  private  initResult(res) {
    // this.filteredFactoryCalendar = res;
    this.allFactoryCalendars = res;
    if (res && res.length > 0) {
      this.placeholder = 'search-factory-calendar';
    } else {
      this.placeholder = 'no-data';
      this.selectedFactoryCalendar = null;
    }
  }


  onChangeFactoryCalendar(event) {
    if (event && event.hasOwnProperty('factoryCalendarId')) {
      this.selectedFactoryCalendarEvent.next(this.selectedFactoryCalendar);
    } else {
      this.selectedFactoryCalendarEvent.next(null);
    }
  }

  searchFactoryCalendar(event) {
    this.filteredFactoryCalendar = this.filterMatched(event.query);
  }

  handleDropdownClickForFactoryCalendar() {
    this.filteredFactoryCalendar = [...this.allFactoryCalendars];

    if (this.filteredFactoryCalendar.length == 0) {
      this.FactoryCalendarFilter.code = null;
      this.searchTerms.next(this.FactoryCalendarFilter);
    }
  }

  filterMatched(query): any[] {
    const filtered: any[] = [];
    if (this.allFactoryCalendars && this.allFactoryCalendars.length > 0) {
      for (let i = 0; i < this.allFactoryCalendars.length; i++) {
        const obj = this.allFactoryCalendars[i];
        if ((obj['code'].toLowerCase().indexOf(query.toLowerCase()) >= 0) ||
        (obj['category'].toLowerCase().indexOf(query.toLowerCase()) >= 0)) {
          filtered.push(obj);
        }
      }
    }
    if (filtered.length == 0) {
      this.FactoryCalendarFilter.code = query;
      this.searchTerms.next(this.FactoryCalendarFilter);
    }
    return filtered;
  }


}
