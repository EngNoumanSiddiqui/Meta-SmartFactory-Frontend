import {debounceTime, switchMap} from 'rxjs/operators';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {Subject} from 'rxjs';
import {EmployeeService} from '../../../services/dto-services/employee/employee.service';
import { UsersService } from 'app/services/users/users.service';


@Component({
  selector: 'employee-auto-complete',
  templateUrl: './employee-auto-complete.component.html',

})

export class EmployeeAutoCompleteComponent implements OnInit {

  @Output() selectedEmployeeEvent = new EventEmitter<any>();
  @Input() required: boolean;
  @Input() dropdown = true;
  @Input() disabled = false;
  selectedPlant: any;

  @Input('selectedEmployee')

  set in(selectedEmployee) {
    if (selectedEmployee) {
      const emp = {
        employeeId: selectedEmployee.employeeId,
        employeeNo: selectedEmployee.employeeNo,
        firstName: selectedEmployee.firstName,
        fullName: selectedEmployee.firstName + ' ' + selectedEmployee.lastName,
        lastName: selectedEmployee.lastName
      };
      this.selectedEmployee = emp;
    } else {
      this.selectedEmployee = null;
    }
    
  }
  @Input('selectedEmployeeId')

  set inId(selectedEmployeeId) {
    if (selectedEmployeeId) {
      this.getEmployeeDetail(selectedEmployeeId);
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
    plantId: null,
    orderByDirection: 'desc',
    orderByProperty: 'employeeId'
  };

  // selected employee on dropdown
  selectedEmployee: any;
  allEmployees: Array<any>;
  private searchTerms = new Subject<any>();

  constructor(private employeeSvc: EmployeeService, private _userSvc: UsersService) {
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


  getEmployeeDetail(employeeId) {
    if (employeeId) {
      this.employeeSvc.getDetail(employeeId).then((rs: any) => {
        const emp = {
          employeeId: rs.employeeId,
          employeeNo: rs.employeeNo,
          firstName: rs.firstName,
          fullName: rs.firstName + ' ' + rs.lastName,
          lastName: rs.lastName
        };
        this.selectedEmployee = emp;
        this.checkAndAddSelectedEmployee();
      });
    }

  }

  private checkAndAddSelectedEmployee() {
    const me = this;
    if (this.selectedEmployee) {
      if (this.filteredEmployee) {
        const ex = this.filteredEmployee.find(it => it.employeeId == me.selectedEmployee.employeeId);
        const aex = this.allEmployees.find(it => it.employeeId == me.selectedEmployee.employeeId);
        if (!aex) {
          this.filteredEmployee.push(this.selectedEmployee);
          this.filteredEmployee = [...this.filteredEmployee];
        }
        if (!ex) {
          this.allEmployees.push(this.selectedEmployee);
        }
      }
      this.selectedEmployeeEvent.next(this.selectedEmployee);
    }
  }

  private  initResult(res) {
    // this.filteredEmployee = res;
    this.allEmployees = res;
    if (res.length > 0) {
      this.placeholder = 'Type name, surname or id';
    } else {
      this.placeholder = 'no-data';

    }
  }


  onChangeEmployee(event) {
    if (event && event.hasOwnProperty('employeeId')) {
      const emp = {
        employeeId: event.employeeId,
        employeeNo: event.employeeNo,
        firstName: event.firstName,
        fullName: event.firstName + ' ' + event.lastName,
        lastName: event.lastName
      };
      this.selectedEmployee=emp;
      this.selectedEmployeeEvent.next(this.selectedEmployee);
    } else {
      this.selectedEmployee=null;
      this.selectedEmployeeEvent.next(null);
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
        const emp = obj['firstName'] + obj['lastName'] + obj['employeeId'];

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
