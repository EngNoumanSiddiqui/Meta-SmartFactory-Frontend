import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CalendarModule, CheckboxModule, ConfirmDialogModule, KeyFilterModule, TooltipModule} from 'primeng';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import { FormsModule } from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import { ListStockReportComponent } from './list/stock-report-list.component';
import { StockTransferReceiptService } from 'app/services/dto-services/stock-transfer-receipt/stock-transfer-receipt.service';
import { SalesOrderService } from 'app/services/dto-services/sales-order/sales-order.service';

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
    KeyFilterModule
  ],
  declarations: [
    ListStockReportComponent
  ],
  providers: [
    StockTransferReceiptService,
    SalesOrderService
  ],
  exports: [
    ListStockReportComponent
  ]
})
export class StockReportsSharedModule {
}
