import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DassSharedModule} from '../../../shared/dass-shared.module';
import {AutoCompleteModule} from 'primeng';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';

import { FactoryCalendarAutoCompleteComponent } from './factory-calendar-auto-complete.component';

@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    ButtonModule,
    FormsModule,
    AutoCompleteModule,
    ModalModule.forRoot()
  ],
  declarations: [
    FactoryCalendarAutoCompleteComponent,
  ],
  exports: [
    FactoryCalendarAutoCompleteComponent,
  ]
  ,
  providers: []
})
export class FactoryCalendarAutoCompleteModule {
}
