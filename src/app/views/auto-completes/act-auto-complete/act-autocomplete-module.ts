import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DassSharedModule} from '../../../shared/dass-shared.module';

import {AutoCompleteModule} from 'primeng';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {ActAutoCompleteComponent} from './act-auto-complete.component';
import {ModalModule} from 'ngx-bootstrap/modal';
import { SharedCustomerModule } from 'app/views/inventory-management/order-management/customers/shared-customer-module';


@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    ButtonModule,
    FormsModule,
    AutoCompleteModule,
    ModalModule.forRoot(),
    SharedCustomerModule
  ],
  declarations: [
    ActAutoCompleteComponent,
  ],
  exports: [
    ActAutoCompleteComponent,
  ]
  ,
  providers: [

  ]
})
export class ActAutoCompleteModule {
}
