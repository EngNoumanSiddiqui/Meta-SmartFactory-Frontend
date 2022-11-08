import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DassSharedModule} from '../../../shared/dass-shared.module';

import {AutoCompleteModule} from 'primeng';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {EmployeeGenericGroupAutoCompleteComponent} from './employee-generic-group-auto-complete.component';


@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    ButtonModule,
    FormsModule,
    AutoCompleteModule
  ],
  declarations: [
    EmployeeGenericGroupAutoCompleteComponent,
  ],
  exports: [
    EmployeeGenericGroupAutoCompleteComponent,
  ]
  ,
  providers: [
    
  ]
})
export class EmployeeGenericGroupAutoCompleteModule {
}
