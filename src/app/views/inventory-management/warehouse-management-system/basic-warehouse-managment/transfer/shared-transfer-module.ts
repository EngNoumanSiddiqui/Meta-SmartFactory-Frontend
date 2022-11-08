import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CalendarModule, CheckboxModule, ConfirmDialogModule, KeyFilterModule, TooltipModule} from 'primeng';

import { StockTransferNotificationService } from 'app/services/dto-services/stock-transfer-notification/stock-transfer-notification.service';
import { StockAutoCompleteModule } from 'app/views/auto-completes/stock-auto-complete/stock-autocomplete-module';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import { FormsModule } from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import { BatchAutoCompleteModule } from 'app/views/auto-completes/batch-auto-complete/batch-autocomplete-module';
import { WareHouseAutoCompleteModule } from 'app/views/auto-completes/warehouse-auto-complete/warehouse-autocomplete-module';
import { PlantAutoCompleteModule } from 'app/views/auto-completes/plant-auto-complete/plant-autocomplete-module';
import { NewStockTransferReceiptComponent } from './new/new.component';
import { ListCustomerOrdersComponent } from './order-list/list.component';
import { StockWarehousesComponent } from 'app/views/stocks/component/stock-warehouses.component';
import { DetailStockTransferReceiptComponent } from './detail/detail.component';
import { StockTransferReceiptService } from 'app/services/dto-services/stock-transfer-receipt/stock-transfer-receipt.service';
import { SalesOrderService } from 'app/services/dto-services/sales-order/sales-order.service';
import { TransferGoodsRouting } from './transfer.routing';
import { ListStockTransferReceiptItemsComponent } from './transfer-items/list.component';
import { ListStockTransferReceiptComponent } from './list/list.component';
import { EditStockTransferReceiptComponent } from './edit/edit.component';
import { PrintSharedModule } from 'app/views/general-settings/print/print-component/print-shared.module';


@NgModule({
  imports: [
    CalendarModule,
    CheckboxModule,
    ConfirmDialogModule,
    CommonModule,
    DassSharedModule,
    FormsModule,
    TransferGoodsRouting,
    ModalModule.forRoot(),
    TooltipModule,
    KeyFilterModule,
    BatchAutoCompleteModule,
    WareHouseAutoCompleteModule,
    PlantAutoCompleteModule,
    StockAutoCompleteModule,
    PrintSharedModule
  ],
  declarations: [
    ListStockTransferReceiptComponent,
    ListStockTransferReceiptItemsComponent,
    EditStockTransferReceiptComponent,
    NewStockTransferReceiptComponent,
    DetailStockTransferReceiptComponent,
    ListCustomerOrdersComponent,
    StockWarehousesComponent,
  ],
  providers: [
    StockTransferReceiptService,
    SalesOrderService,
    StockTransferNotificationService
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  exports: [
    NewStockTransferReceiptComponent,
    ListCustomerOrdersComponent,
    StockWarehousesComponent,
    DetailStockTransferReceiptComponent,
  ]
})
export class SharedStockTransferModule {
}
