import {debounceTime, switchMap} from 'rxjs/operators';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subject} from 'rxjs';
import { UsersService } from 'app/services/users/users.service';
import { EmployeeGenericGroupService } from 'app/services/dto-services/employee-generic-group.service';


@Component({
  selector: 'employee-generic-group-auto-complete',
  templateUrl: './employee-generic-group-auto-complete.component.html',

})

export class EmployeeGenericGroupAutoCompleteComponent implements OnInit {

  @Output() selectedEmployeeGenericGroupEvent = new EventEmitter<any>();
  @Input() required: boolean;
  @Input() dropdown = true;
  @Input() disabled = false;
  selectedPlant: any;

  @Input('selectedEmployeeGenericGroup')

  set in(selectedEmployeeGenericGroup) {
    if (selectedEmployeeGenericGroup) {
     
      this.selectedEmployeeGenericGroup = selectedEmployeeGenericGroup;
    } else {
      this.selectedEmployeeGenericGroup = null;
    }
    
  }
  @Input('selectedEmployeeGenericGroupId')
  set inId(selectedEmployeeGenericGroupId) {
    if (selectedEmployeeGenericGroupId) {
      const selectedEmployeeGenericGroup = this.allEmployees ? this.allEmployees.find(x => x.employeeGenericGroupId === selectedEmployeeGenericGroupId) : null;
      if(selectedEmployeeGenericGroup) {
        this.selectedEmployeeGenericGroup = selectedEmployeeGenericGroup;
      } else{
        this.getEmployeeGenericGroupDetail(selectedEmployeeGenericGroupId);
      }
    }
  }

  @Input('plantId') set setplantId(plantId) {
    if (plantId) {
      this.employeeFilter.plantId = plantId;
      this.searchTerms.next(this.employeeFilter);
    }
  }

  placeholder = 'no-data';
  filteredEmployee: Array<any>;

  employeeFilter = {
    query: null,
    pageSize: 999,
    pageNumber: 1,
    groupName: null,
    plantId: null,
    orderByDirection: 'desc',
    orderByProperty: 'employeeGenericGroupId'
  };

  // selected employee on dropdown
  selectedEmployeeGenericGroup: any;
  allEmployees: Array<any>;
  private searchTerms = new Subject<any>();

  constructor(private employeeSvc: EmployeeGenericGroupService, private _userSvc: UsersService) {
    const setPlant = this._userSvc.getPlant();
    this.selectedPlant = JSON.parse(setPlant);
    if (this.selectedPlant) {
      this.employeeFilter.plantId = this.selectedPlant.plantId;
    }
  }


  ngOnInit() {

    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.employeeSvc.filterShared(this.employeeFilter))).subscribe(
      res => this.initResult(res['content']),
      error2 => this.initResult([])
    );
    this.searchTerms.next(this.employeeFilter);
  }


  getEmployeeGenericGroupDetail(employeeGenericGroupId) {
    if (employeeGenericGroupId) {
      this.employeeSvc.getDetail(employeeGenericGroupId).then((rs: any) => {
        this.selectedEmployeeGenericGroup = rs;
      });
    }

  }

  private checkAndAddselectedEmployeeGenericGroup() {
    const me = this;
    if (this.selectedEmployeeGenericGroup) {
      if (this.filteredEmployee) {
        const ex = this.filteredEmployee.find(it => it.employeeGenericGroupId == me.selectedEmployeeGenericGroup.employeeGenericGroupId);
        const aex = this.allEmployees.find(it => it.employeeGenericGroupId == me.selectedEmployeeGenericGroup.employeeGenericGroupId);
        if (!aex) {
          this.filteredEmployee.push(this.selectedEmployeeGenericGroup);
          this.filteredEmployee = [...this.filteredEmployee];
        }
        if (!ex) {
          this.allEmployees.push(this.selectedEmployeeGenericGroup);
        }
      }
      this.selectedEmployeeGenericGroupEvent.next(this.selectedEmployeeGenericGroup);
    }
  }

  private  initResult(res) {
    // this.filteredEmployee = res;
    this.allEmployees = res;
    if (res.length > 0) {
      this.placeholder = 'search-employee-group';
    } else {
      this.placeholder = 'no-data';

    }
  }


  onChangeEmployee(event) {
    if (event && event.hasOwnProperty('employeeGenericGroupId')) {
      this.selectedEmployeeGenericGroupEvent.next(this.selectedEmployeeGenericGroup);
    } else {
      this.selectedEmployeeGenericGroupEvent.next(null);
    }
  }

  searchEmployee(event) {
    this.filteredEmployee = this.filterMatched(event.query);
  }

  handleDropdownClickForEmployee() {
    this.filteredEmployee = [...this.allEmployees];

    if (this.filteredEmployee.length == 0) {
      this.employeeFilter.query = null;
      this.searchTerms.next(this.employeeFilter);
    }
  }

  filterMatched(query): any[] {
    const filtered: any[] = [];
    if (this.allEmployees && this.allEmployees.length > 0) {
      for (let i = 0; i < this.allEmployees.length; i++) {
        const obj = this.allEmployees[i];
        const emp = obj['groupCode'] + obj['groupName'];
        if (emp.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(obj);
        }
      }
    }
    if (filtered.length == 0) {
      this.employeeFilter.query = query;
      this.searchTerms.next(this.employeeFilter);
    }
    return filtered;
  }
}
