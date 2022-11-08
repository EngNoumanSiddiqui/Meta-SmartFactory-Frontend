import {debounceTime, switchMap} from 'rxjs/operators';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {Subject} from 'rxjs';
import {EquipmentOperationService} from '../../../services/dto-services/maintenance-equipment/equipment-operation.service';


@Component({
  selector: 'equipment-operation-auto-complete',
  templateUrl: './equipment-operation-auto-complete.component.html',

})

export class EquipmentOperationAutoCompleteComponent implements OnInit {

  @Output() selectedEquipmentOperationEvent = new EventEmitter();
  selectedEquipmentOperation;
  @Input() required: boolean;
  @Input() dropdown=true;
  @Input() disabled = false;
  @Input('selectedEquipmentOperation')

  set in(selectedEquipmentOperation) {
    this.selectedEquipmentOperation = selectedEquipmentOperation;
  }

  placeholder = 'no-data';
  filteredEquipmentOperation: Array<any>;

  equipmentOperationFilter = {
    operationCode: null,
    pageSize: 500,
    pageNumber: 1,
    orderByProperty: 'operationCode'
  };
  @Input() addIfMissing = false;

  modal = {active: false};

  private allEquipmentOperations: Array<any>;
  private searchTerms = new Subject<any>();

  constructor(private equipmentOperationService: EquipmentOperationService) {

  }

  modalShow() {
    this.modal.active = true;
  }
  ngOnInit() {

    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.equipmentOperationService.filterObservable(this.equipmentOperationFilter))).subscribe(
      res => this.initResult(res['content']),
      error2 => this.initResult([])
    );
    this.searchTerms.next(this.equipmentOperationFilter);
  }

  private  initResult(res) {
    // this.filteredEquipmentOperation = res;
    this.allEquipmentOperations = res;
    if (res.length > 0) {
      this.placeholder = 'search-equipment-operation';
    } else {
      this.placeholder = 'no-data';

    }
  }


  onChangeEquipmentOperation(event) {
    if (event && event.hasOwnProperty('equipmentOperationId')) {
      this.selectedEquipmentOperationEvent.next(this.selectedEquipmentOperation);
    } else {
      this.selectedEquipmentOperationEvent.next(null);
    }
  }

  searchEquipmentOperation(event) {
    this.filteredEquipmentOperation = this.filterMatched(event.query);
  }

  handleDropdownClickForEquipmentOperation() {
    this.filteredEquipmentOperation = [...this.allEquipmentOperations];

    if (this.filteredEquipmentOperation.length == 0) {
      this.equipmentOperationFilter.operationCode = null;
      this.searchTerms.next(this.equipmentOperationFilter);
    }
  }

  filterMatched(query): any[] {
    const filtered: any[] = [];
    if (this.allEquipmentOperations && this.allEquipmentOperations.length > 0) {
      for (let i = 0; i < this.allEquipmentOperations.length; i++) {
        const obj = this.allEquipmentOperations[i];
        if (obj['operationCode'].toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(obj);
        }
      }
    }
    if (filtered.length == 0) {
      this.equipmentOperationFilter.operationCode = query;
      this.searchTerms.next(this.equipmentOperationFilter);
    }
    return filtered;
  }

  setEquipmentOperation(equipmentOperation) {
    if (equipmentOperation) {
      this.selectedEquipmentOperation = equipmentOperation;
      this.allEquipmentOperations.push(equipmentOperation);
      this.handleDropdownClickForEquipmentOperation()
      this.onChangeEquipmentOperation(this.selectedEquipmentOperation);
    }
  }

}
