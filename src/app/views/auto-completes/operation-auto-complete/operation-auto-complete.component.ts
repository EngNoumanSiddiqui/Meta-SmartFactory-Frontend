import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import { OperationService } from 'app/services/dto-services/operation/operation.service';
import { UsersService } from 'app/services/users/users.service';
import { Subject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';


@Component({
  selector: 'operation-auto-complete',
  templateUrl: './operation-auto-complete.component.html',
  styles: [`
    body .ui-autocomplete .ui-autocomplete-input{
      padding: 0.5em !important;
    }
  `],
  encapsulation: ViewEncapsulation.None

})

export class OperationAutoCompleteComponent implements OnInit {

  @Output() selectedOperationEvent = new EventEmitter();
  @Output() outsourceEvent = new EventEmitter();
  @Output() transferEvent = new EventEmitter();
  @Output() workstationListEvent = new EventEmitter();
  selectedOperation: any;
  @Input() supplier = false;
  @Input() both = false;
  @Input() dropdown = true;
  @Input() required: boolean;
  @Input() addIfMissing = false;
  @Input() forOutsource = false;
  @Input() forTransfer = false;
  @Input() forWorkstationList = false;
  @Input('selectedOperation') set in(selectedOperation) { // {operationName,operationId}
    this.selectedOperation = selectedOperation;
  }

  @Input('operationName') set opName(opeartionName){
    if(opeartionName) this.pageFilter.operationName;
  }
  @Input('plantId') set plantIdy(plantId) {
    if (plantId) {
      this.pageFilter.plantId = plantId;
      this.searchTerms.next(this.pageFilter);
    } else {
      this.pageFilter.plantId = null;
    }
  }

  placeholder = 'no-data';
  isInvalid = false;
  filteredOperation: Array<any>;

  modal = {active: false};

  private allOperations: Array<any>;

  pageFilter = {
    description: null,
    operationName: null,
    operationNo: null,
    operationType: null,
    orderByDirection: 'desc',
    orderByProperty: 'operationId',
    pageNumber: 1,
    pageSize: 99999,
    plantId: null,
    query: null,
    workstationId: null
}

private searchTerms = new Subject<any>();

  constructor(
    private operationService: OperationService,
    private _userSvc: UsersService) {
      // console.log('@operatonAutoCompleteModuel')
    let selectedPlant = JSON.parse(this._userSvc.getPlant());
    this.pageFilter.plantId = selectedPlant ? selectedPlant.plantId : null;
  }

  modalShow() {
    this.modal.active = true;
  }

  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.operationService.filterObservable(this.pageFilter))).subscribe(res => {
        this.initResult(res['content']);
      }, err => {
        this.initResult([]);
      })
    this.filter();
  }

  filter() {
    this.searchTerms.next(this.pageFilter);
  }

  private  initResult(res) {
    // this.filteredOperation = res;
    this.allOperations = res;
    if (res.length > 0) {
      this.placeholder = 'select-the-operation';
      if(this.selectedOperation) {
        const operation = this.allOperations.find(op => op.operationId === this.selectedOperation.operationId);
        if(operation && this.forOutsource) {
            this.outsourceEvent.next(operation.outsource);
        }
        if(operation && this.forTransfer) {
          this.transferEvent.next(operation.transfer);
        }
        if(operation && this.forWorkstationList) {
          this.workstationListEvent.next(operation.operationWorkStationList);
        }
        
      }
    } else {
      this.placeholder = 'no-data';

    }
  }


  onChangeOperation(event) {
    if (event && event.hasOwnProperty('operationId')) {
      this.selectedOperationEvent.next(this.selectedOperation);
      if(this.forOutsource) {
        this.outsourceEvent.next(this.selectedOperation.outsource);
      }
      if(this.forTransfer) {
        this.transferEvent.next(this.selectedOperation.transfer);
      }
      if(this.forWorkstationList) {
        this.workstationListEvent.next(this.selectedOperation.operationWorkStationList);
      }
      
    } else {
      this.selectedOperationEvent.next(null);
    }
  }

  searchAct(event) {
    this.filteredOperation = this.filterMatched(event.query);
  }

  handleDropdownClickForAct() {
    this.filteredOperation = [...this.allOperations];
  }

  filterMatched(query): any[] {
    const filtered: any[] = [];
    if (this.allOperations && this.allOperations.length > 0) {
      for (let i = 0; i < this.allOperations.length; i++) {
        const obj = this.allOperations[i];
        if (obj['operationName'].toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(obj);
        }
      }
    }

    return filtered;
  }

  setOperation(operation) {
    // if (this.both || (this.supplier && operation.accountPosition === 'SUPPLIER') || (!this.supplier && operation.accountPosition === 'CUSTOMER')) {
    this.selectedOperation = {operationName: operation.operationName, operationId: operation.operationId};
      this.allOperations.push(this.selectedOperation);
      this.handleDropdownClickForAct();
      this.onChangeOperation(this.selectedOperation);
    // }
  }

}
