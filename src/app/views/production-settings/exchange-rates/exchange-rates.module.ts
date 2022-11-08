import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { NewComponent } from './new/new.component';
import { EditComponent } from './edit/edit.component';
import { DetailComponent } from './detail/detail.component';
import { ConfirmDialogModule} from 'primeng';
import { FormsModule } from '@angular/forms';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {ModalModule} from 'ngx-bootstrap/modal';
import { ExchangeRateRoutingModule } from './exchange-rates-routing.module';
import { ExchangeRateService } from 'app/services/dto-services/exchange-rates/exchange-rates.service';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import { CurrencyAutoCompleteModule } from 'app/views/auto-completes/currency-auto-complete/currency-autocomplete-module';

@NgModule({
  declarations: [ ListComponent, NewComponent, EditComponent, DetailComponent ],
  imports: [
    CommonModule,
    ConfirmDialogModule,
    DassSharedModule,
    FormsModule,
    ModalModule.forRoot(),
    ExchangeRateRoutingModule,
    TooltipModule,
    CurrencyAutoCompleteModule
  ], 
  providers: [ExchangeRateService],
  exports: [NewComponent, DetailComponent]
})
export class ExchangeRateModule { }
