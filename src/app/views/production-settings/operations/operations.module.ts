import { PlantAutoCompleteModule } from './../../auto-completes/plant-auto-complete/plant-autocomplete-module';
import {FormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DassSharedModule} from '../../../shared/dass-shared.module';

import {OperationsRoutingModule} from './operations-routing.module';
import {SharedOperationsModule} from './shared-operations.module';
import { CurrencyAutoCompleteModule } from 'app/views/auto-completes/currency-auto-complete/currency-autocomplete-module';
@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    FormsModule,
    OperationsRoutingModule,
    SharedOperationsModule,
    CurrencyAutoCompleteModule,
    PlantAutoCompleteModule,
  ],
  declarations: [

  ],
  providers: []
})
export class OperationsModule {
}
