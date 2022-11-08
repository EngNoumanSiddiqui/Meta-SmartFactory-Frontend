import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DassSharedModule} from '../../../shared/dass-shared.module';

import {AutoCompleteModule} from 'primeng';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';

import { ModalModule } from 'ngx-bootstrap/modal';
import { EmployeeGeneralGroupAutoCompleteComponent } from './employee-general-auto-complete.component';
import { GenericGroupModule } from 'app/views/labor/generic-group/generic-group.module';

@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    ModalModule.forRoot(),
    ButtonModule,
    FormsModule,
    AutoCompleteModule,
    GenericGroupModule
  ],
  declarations: [
    EmployeeGeneralGroupAutoCompleteComponent,
  ],
  exports: [
    EmployeeGeneralGroupAutoCompleteComponent,
  ]
  ,
  providers: [
    
  ]
})
export class EmployeeGeneralGroupAutoCompleteModule {
}
