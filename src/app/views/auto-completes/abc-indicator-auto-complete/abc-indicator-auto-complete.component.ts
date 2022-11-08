import {debounceTime, switchMap} from 'rxjs/operators';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {Subject} from 'rxjs';
import {EquipmentAbcIndicatorService} from '../../../services/dto-services/maintenance-equipment/abc-indicator.service';


@Component({
  selector: 'abc-indicator-auto-complete',
  templateUrl: './abc-indicator-auto-complete.component.html',

})

export class AbcIndicatorAutoCompleteComponent implements OnInit {

  @Output() selectedAbcIndicatorEvent = new EventEmitter();
  selectedAbcIndicator;
  @Input() required: boolean;
  @Input() dropdown=true;


  @Input('selectedAbcIndicator')
  set in(selectedAbcIndicator) {
    this.selectedAbcIndicator = selectedAbcIndicator;
  }

  @Input('plantId') set setPlantId(plantId) {
    if (plantId) {
      this.abcIndicatorFilter.plantId = plantId;
      this.searchTerms.next(this.abcIndicatorFilter);
    } else {
      this.abcIndicatorFilter.plantId = null;
    }
  }

  placeholder = 'no-data';
  filteredAbcIndicator: Array<any>;

  abcIndicatorFilter = {
    equipmentAbcIndicatorType: null,
    pageSize: 500,
    pageNumber: 1,
    orderByProperty: 'equipmentAbcIndicatorType',
    plantId: null
  };
  modal = {active: false};
  private allAbcIndicators: Array<any>;
  private searchTerms = new Subject<any>();
  @Input() addIfMissing = false;
  constructor(private abcIndicatorService: EquipmentAbcIndicatorService) {

  }
  modalShow() {
    this.modal.active = true;
  }

  ngOnInit() {

    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.abcIndicatorService.filterObservable(this.abcIndicatorFilter))).subscribe(
      res => this.initResult(res['content']),
      error2 => this.initResult([])
    );
    this.searchTerms.next(this.abcIndicatorFilter);
  }

  private  initResult(res) {
    // this.filteredAbcIndicator = res;
    this.allAbcIndicators = res;
    if (res.length > 0) {
      this.placeholder = 'search-abc-indicator';
    } else {
      this.placeholder = 'no-data';

    }
  }


  onChangeAbcIndicator(event) {
    if (event && event.hasOwnProperty('equipmentAbcIndicatorId')) {
      this.selectedAbcIndicatorEvent.next(this.selectedAbcIndicator);
    } else {
      this.selectedAbcIndicatorEvent.next(null);
    }
  }

  searchAbcIndicator(event) {
    this.filteredAbcIndicator = this.filterMatched(event.query);
  }

  handleDropdownClickForAbcIndicator() {
    this.filteredAbcIndicator = [...this.allAbcIndicators];

    if (this.filteredAbcIndicator.length == 0) {
      this.abcIndicatorFilter.equipmentAbcIndicatorType = null;
      this.searchTerms.next(this.abcIndicatorFilter);
    }
  }

  filterMatched(query): any[] {
    const filtered: any[] = [];
    if (this.allAbcIndicators && this.allAbcIndicators.length > 0) {
      for (let i = 0; i < this.allAbcIndicators.length; i++) {
        const obj = this.allAbcIndicators[i];
        if (obj['equipmentAbcIndicatorType'].toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(obj);
        }
      }
    }
    if (filtered.length == 0) {
      this.abcIndicatorFilter.equipmentAbcIndicatorType = query;
      this.searchTerms.next(this.abcIndicatorFilter);
    }
    return filtered;
  }


  setAbcIndicator(abcIndicator) {
    this.selectedAbcIndicator = abcIndicator;
    this.allAbcIndicators.push(abcIndicator);
    this.handleDropdownClickForAbcIndicator();
    this.onChangeAbcIndicator(abcIndicator);
  }

}
