import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DassSharedModule } from '../../../shared/dass-shared.module';
import { AutoCompleteModule } from 'primeng';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';

import { CountryAutoCompleteModule } from '../country-autocomplete/country-autocomplete-module';
import { SharedBatchModule } from 'app/views/inventory-management/warehouse-management-system/advance-warehouse-management/batch/shared-batch.module';
import { ParityAutoCompleteComponent } from './parity-auto-complete.component';
import { ParityService } from 'app/services/dto-services/parity/parity.service';

@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    ButtonModule,
    FormsModule,
    AutoCompleteModule,
    ModalModule.forRoot(),
    SharedBatchModule,
    CountryAutoCompleteModule
  ],
  declarations: [
    ParityAutoCompleteComponent,
  ],
  exports: [
    ParityAutoCompleteComponent,
  ]
  ,
  providers: [ParityService]
})
export class ParityAutoCompleteModule {
}
