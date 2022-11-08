import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DassSharedModule} from '../../../shared/dass-shared.module';

import {AutoCompleteModule} from 'primeng';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import { EmployeeCategoryeAutoCompleteComponent } from './employee-category-auto-complete.component';
import { EmployeeCapabilityService } from 'app/services/dto-services/employee/employee-capabilities.service';

@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    ButtonModule,
    FormsModule,
    ModalModule.forRoot(),
    AutoCompleteModule
  ],
  declarations: [
    EmployeeCategoryeAutoCompleteComponent
  ],
  exports: [
    EmployeeCategoryeAutoCompleteComponent
  ]
  ,
  providers: [
    EmployeeCapabilityService
  ]
})
export class EmployeeCategoryAutoCompleteModule {
}
