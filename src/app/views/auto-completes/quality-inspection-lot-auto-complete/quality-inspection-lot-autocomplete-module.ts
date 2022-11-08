import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DassSharedModule } from '../../../shared/dass-shared.module';

import { AutoCompleteModule } from 'primeng';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import { StockAutoCompleteModule } from '../stock-auto-complete/stock-autocomplete-module';
import { InspectionLotService } from 'app/services/dto-services/quality-inspection/inspection-lot.service';
import { QualityInspectionLotAutoCompleteComponent } from './quality-inspection-lot-auto-complete.component';
import { BatchAutoCompleteModule } from '../batch-auto-complete/batch-autocomplete-module';

@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,

    ButtonModule,
    FormsModule,
    AutoCompleteModule,
    ModalModule.forRoot(),
    StockAutoCompleteModule,
    BatchAutoCompleteModule,
  ],
  declarations: [
    QualityInspectionLotAutoCompleteComponent,
  ],
  exports: [
    QualityInspectionLotAutoCompleteComponent,
  ]
  ,
  providers: [
    InspectionLotService
  ]
})
export class QualityInspectionLotAutoCompleteModule {
}
