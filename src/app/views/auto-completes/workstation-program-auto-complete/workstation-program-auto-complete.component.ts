import {debounceTime, switchMap} from 'rxjs/operators';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {Subject} from 'rxjs';
import {WorkstationProgramService} from '../../../services/dto-services/product-tree/worksation-program.service';


@Component({
  selector: 'workstation-program-auto-complete',
  templateUrl: './workstation-program-auto-complete.component.html',

})

export class WorkstationProgramAutoCompleteComponent implements OnInit {

  @Output() selectedWorkstationProgramEvent = new EventEmitter();
  selectedWorkstationProgram;
  @Input() required: boolean;
  @Input() dropdown = true;

  @Input('selectedWorkstationProgram')

  set in(selectedWorkstationProgram) {
    this.selectedWorkstationProgram = selectedWorkstationProgram;
  }

  placeholder = 'no-data';
  filteredWorkstationProgram: Array<any>;

  maintenanceCategoryFilter = {
    description: null,
    pageSize: 500,
    pageNumber: 1,
    orderByProperty: 'description'
  };
  @Input() addIfMissing = false;

  modal = {active: false};

  private allWorkstationPrograms: Array<any>;
  private searchTerms = new Subject<any>();

  constructor(private maintenanceCategoryService: WorkstationProgramService) {

  }

  modalShow() {
    this.modal.active = true;
  }

  ngOnInit() {

    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.maintenanceCategoryService.filterObservable(this.maintenanceCategoryFilter))).subscribe(
      res => this.initResult(res['content']),
      error2 => this.initResult([])
    );
    this.searchTerms.next(this.maintenanceCategoryFilter);
  }

  private  initResult(res) {
    // this.filteredWorkstationProgram = res;
    this.allWorkstationPrograms = res;
    if (res.length > 0) {
      this.placeholder = 'search-workstation-program';
    } else {
      this.placeholder = 'no-data';

    }
  }


  onChangeWorkstationProgram(event) {
    if (event && event.hasOwnProperty('workstationProgramId')) {
      this.selectedWorkstationProgramEvent.next(this.selectedWorkstationProgram);
    } else {
      this.selectedWorkstationProgramEvent.next(null);
    }
  }

  searchWorkstationProgram(event) {
    this.filteredWorkstationProgram = this.filterMatched(event.query);
  }

  handleDropdownClickForWorkstationProgram() {
    this.filteredWorkstationProgram = [...this.allWorkstationPrograms];

    if (this.filteredWorkstationProgram.length == 0) {
      this.maintenanceCategoryFilter.description = null;
      this.searchTerms.next(this.maintenanceCategoryFilter);
    }
  }

  filterMatched(query): any[] {
    const filtered: any[] = [];
    if (this.allWorkstationPrograms && this.allWorkstationPrograms.length > 0) {
      for (let i = 0; i < this.allWorkstationPrograms.length; i++) {
        const obj = this.allWorkstationPrograms[i];
        if(obj['description']){
          if (obj['description'].toLowerCase().indexOf(query.toLowerCase()) >= 0) {
            filtered.push(obj);
          }
        }
      }
    }
    if (filtered.length == 0) {
      this.maintenanceCategoryFilter.description = query;
      this.searchTerms.next(this.maintenanceCategoryFilter);
    }
    return filtered;
  }

  setWorkstationProgram(maintenanceCategory) {

    if (maintenanceCategory) {
      this.selectedWorkstationProgram = maintenanceCategory;
      this.allWorkstationPrograms.push(maintenanceCategory);
      this.handleDropdownClickForWorkstationProgram()
      this.onChangeWorkstationProgram(this.selectedWorkstationProgram);
    }
  }

}
