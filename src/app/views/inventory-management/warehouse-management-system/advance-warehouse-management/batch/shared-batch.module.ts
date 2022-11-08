import {CalendarModule, CheckboxModule, ConfirmDialogModule, KeyFilterModule, TooltipModule} from 'primeng';
import {ModalModule} from 'ngx-bootstrap/modal';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {NewBatchComponent} from './new/new.component';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import { StockAutoCompleteModule } from 'app/views/auto-completes/stock-auto-complete/stock-autocomplete-module';
import { DetailBatchComponent } from './detail/detail.component';
import { StockCardService } from 'app/services/dto-services/stock/stock.service';
import { StockTransferReceiptService } from 'app/services/dto-services/stock-transfer-receipt/stock-transfer-receipt.service';
import { BatchService } from 'app/services/dto-services/batch/batch.service';
/**
 * Created by reis on 10.06.2019.
*/

@NgModule({
  imports: [
    CalendarModule,
    CheckboxModule,
    ConfirmDialogModule,
    CommonModule,
    DassSharedModule,
    FormsModule,
    ModalModule.forRoot(),
    TooltipModule,
    KeyFilterModule,
    StockAutoCompleteModule
  ],
  declarations: [
    NewBatchComponent,
    DetailBatchComponent
  ],
  providers: [
    StockCardService,
    StockTransferReceiptService,
    BatchService
  ],
  exports: [
    NewBatchComponent,
    DetailBatchComponent
  ]
})
export class SharedBatchModule {
}
