import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
 

@Component({
  selector: 'auto-complete',
  templateUrl: './auto-complete.component.html',

})

export class AutoCompleteComponent implements OnInit {

  @Output() selectedEvent = new EventEmitter();
  selectedEl;
  disabled = false;

  @Input() itemName;
  @Input() dropdown;

  @Input() required: boolean;

  @Input('selectedEl')
  set a(selectedEl) {
    this.selectedEl = selectedEl;
  }

  @Input('disabled')
  set y(disabled) {
    this.disabled = disabled;
  }

  placeHolder = 'no-data';

  @Input('allElements')
  set z(allElements) {
    this.allElements = allElements;
    this.disabled = !(allElements);
    this.placeHolder = this.disabled ? 'no-data' : 'type-to-search';
    this.filteredResults = allElements;
  }
  filteredResults;
  allElements;
  constructor() {

  }

  @Input() inputStyle: string = null;

  ngOnInit() {

  }


  searchMatched(event) {

    this.filteredResults = this.filterMatched(event.query);
  }


  handleDropdownClick() {

    this.filteredResults = [...this.allElements];

  }


  filterMatched(query): any[] {


    const filtered: any[] = [];
    if (this.allElements && this.allElements.length > 0) {
      for (let i = 0; i < this.allElements.length; i++) {
        const obj = this.allElements[i];
        if (obj[this.itemName].toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(obj);
        }
      }
    }
    return filtered;
  }

  onChangeModel(event) {
    this.selectedEvent.next(event);

  }


}
