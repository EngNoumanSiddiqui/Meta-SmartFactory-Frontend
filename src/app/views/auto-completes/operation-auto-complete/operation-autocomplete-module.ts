import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DassSharedModule} from '../../../shared/dass-shared.module';

import {AutoCompleteModule} from 'primeng';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import { OperationAutoCompleteComponent } from './operation-auto-complete.component';


@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    ButtonModule,
    FormsModule,
    AutoCompleteModule,
    ModalModule.forRoot(),
  ],
  declarations: [
    OperationAutoCompleteComponent,
  ],
  exports: [
    OperationAutoCompleteComponent,
  ]
  ,
  providers: [

  ]
})
export class OperationAutoCompleteModule {
}
