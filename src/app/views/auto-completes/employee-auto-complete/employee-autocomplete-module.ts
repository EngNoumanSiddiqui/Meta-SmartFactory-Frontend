import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DassSharedModule} from '../../../shared/dass-shared.module';

import {AutoCompleteModule} from 'primeng';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {EmployeeAutoCompleteComponent} from './employee-auto-complete.component';
import {EmployeeService} from '../../../services/dto-services/employee/employee.service';

@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    ButtonModule,
    FormsModule,
    AutoCompleteModule
  ],
  declarations: [
    EmployeeAutoCompleteComponent,
  ],
  exports: [
    EmployeeAutoCompleteComponent,
  ]
  ,
  providers: [
    EmployeeService
  ]
})
export class EmployeeAutoCompleteModule {
}
