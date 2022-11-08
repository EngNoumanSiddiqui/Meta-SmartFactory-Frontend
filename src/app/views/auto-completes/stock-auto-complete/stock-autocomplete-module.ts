import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DassSharedModule} from '../../../shared/dass-shared.module';

import {AutoCompleteModule} from 'primeng';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {StockAutoCompleteComponent} from './stock-auto-complete.component';
import {StockCardService} from '../../../services/dto-services/stock/stock.service';

@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    ButtonModule,
    FormsModule,
    AutoCompleteModule
  ],
  declarations: [
    StockAutoCompleteComponent,
  ],
  exports: [
    StockAutoCompleteComponent,
  ]
  ,
  providers: [
    StockCardService
  ]
})
export class StockAutoCompleteModule {
}
