import {CalendarModule, CheckboxModule, ConfirmDialogModule, KeyFilterModule, TooltipModule} from 'primeng';
import {ModalModule} from 'ngx-bootstrap/modal';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {ListBatchComponent} from './list/list.component';
import {EditBatchComponent} from './edit/edit.component';

import {BatchRoutingModule} from './batch-routing.module';
import {SharedBatchModule} from './shared-batch.module';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
import { DassSharedModule } from 'app/shared/dass-shared.module';
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
    BatchRoutingModule,
    ModalModule.forRoot(),
    TooltipModule,
    KeyFilterModule,
    SharedBatchModule,
  ],
  declarations: [
    ListBatchComponent,
    EditBatchComponent,
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ],
  providers: [
    StockCardService,
    StockTransferReceiptService,
    BatchService,
    EnumService
  ]
})
export class BatchModule {
}
