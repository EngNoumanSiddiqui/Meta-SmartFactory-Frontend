import {debounceTime, switchMap} from 'rxjs/operators';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {Subject} from 'rxjs';
import {ExternalServiceService} from '../../../services/dto-services/maintenance-equipment/external-service.service';


@Component({
  selector: 'external-service-auto-complete',
  templateUrl: './external-service-auto-complete.component.html',

})

export class ExternalServiceAutoCompleteComponent implements OnInit {

  @Output() selectedExternalServiceEvent = new EventEmitter();
  selectedExternalService;
  @Input() required: boolean;
  @Input() dropdown=true;
  @Input('selectedExternalService')

  set in(selectedExternalService) {
    this.selectedExternalService = selectedExternalService;
  }

  placeholder = 'no-data';
  filteredExternalService: Array<any>;

  externalServiceFilter = {
    serviceName: null,
    pageSize: 500,
    pageNumber: 1,
    orderByProperty: 'serviceName'
  };
  @Input() addIfMissing = false;

  modal = {active: false};

  private allExternalServices: Array<any>;
  private searchTerms = new Subject<any>();

  constructor(private externalServiceService: ExternalServiceService) {

  }

  modalShow() {
    this.modal.active = true;
  }
  ngOnInit() {

    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.externalServiceService.filterObservable(this.externalServiceFilter))).subscribe(
      res => this.initResult(res['content']),
      error2 => this.initResult([])
    );
    this.searchTerms.next(this.externalServiceFilter);
  }

  private  initResult(res) {
    // this.filteredExternalService = res;
    this.allExternalServices = res;
    if (res.length > 0) {
      this.placeholder = 'search-external-service';
    } else {
      this.placeholder = 'no-data';

    }
  }


  onChangeExternalService(event) {
    if (event && event.hasOwnProperty('serviceId')) {
      this.selectedExternalServiceEvent.next(this.selectedExternalService);
    } else {
      this.selectedExternalServiceEvent.next(null);
    }
  }

  searchExternalService(event) {
    this.filteredExternalService = this.filterMatched(event.query);
  }

  handleDropdownClickForExternalService() {
    this.filteredExternalService = [...this.allExternalServices];

    if (this.filteredExternalService.length == 0) {
      this.externalServiceFilter.serviceName = null;
      this.searchTerms.next(this.externalServiceFilter);
    }
  }

  filterMatched(query): any[] {
    const filtered: any[] = [];
    if (this.allExternalServices && this.allExternalServices.length > 0) {
      for (let i = 0; i < this.allExternalServices.length; i++) {
        const obj = this.allExternalServices[i];
        if (obj['serviceName'].toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(obj);
        }
      }
    }
    if (filtered.length == 0) {
      this.externalServiceFilter.serviceName = query;
      this.searchTerms.next(this.externalServiceFilter);
    }
    return filtered;
  }

  setExternalService(externalService) {

    if (externalService) {
      this.selectedExternalService = externalService;
      this.allExternalServices.push(externalService);
      this.handleDropdownClickForExternalService()
      this.onChangeExternalService(this.selectedExternalService);
    }
  }

}
