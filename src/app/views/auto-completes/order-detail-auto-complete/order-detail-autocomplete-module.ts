import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DassSharedModule} from '../../../shared/dass-shared.module';

import {AutoCompleteModule} from 'primeng';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {OrderDetailAutoCompleteComponent} from './order-detail-auto-complete.component';
import {SalesOrderService} from '../../../services/dto-services/sales-order/sales-order.service';

@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    ButtonModule,
    FormsModule,
    AutoCompleteModule
  ],
  declarations: [
    OrderDetailAutoCompleteComponent,
  ],
  exports: [
    OrderDetailAutoCompleteComponent,
  ]
  ,
  providers: [
    SalesOrderService
  ]
})
export class OrderDetailAutocompleteModule {
}