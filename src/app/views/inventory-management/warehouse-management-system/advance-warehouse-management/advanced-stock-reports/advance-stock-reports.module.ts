import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CalendarModule, CheckboxModule, ConfirmDialogModule, InputNumberModule, KeyFilterModule, TooltipModule} from 'primeng';
import {ModalModule} from 'ngx-bootstrap/modal';
import {FormsModule} from '@angular/forms';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import { ListAdvancedStockReportComponent } from './list/advanced-stock-report-list.component';
import { StockTransferReceiptService } from 'app/services/dto-services/stock-transfer-receipt/stock-transfer-receipt.service';
import { PordersModule } from 'app/views/inventory-management/order-management/porders/porders.module';
import { SalesModule } from 'app/views/inventory-management/order-management/sales/sales.module';
import { TransferNotificationModule } from '../../advance-warehouse-management/transfer-notifications/transfer-notifications.module';
import { AdvancedStockReportsRouting } from './advance-stock-reports.routing';
import { ReservationModule } from '../reservation/reservation.module';
import { WarehouseLocationModule } from '../warehouse-locations/warehouse-location.module';
import { NewAdvanceStockReportsComponent } from './new/new.component';
import { StockAutoCompleteModule } from 'app/views/auto-completes/stock-auto-complete/stock-autocomplete-module';
import { WareHouseAutoCompleteModule } from 'app/views/auto-completes/warehouse-auto-complete/warehouse-autocomplete-module';
import { BatchAutoCompleteModule } from 'app/views/auto-completes/batch-auto-complete/batch-autocomplete-module';
import { UnitAutoCompleteModule } from 'app/views/auto-completes/unit-auto-complete/unit-autocomplete-module';
import { ShiftBasedStockReportsComponent } from './shift-based-stock-reports/shift-based-stock-reports.component';
import { StockReportsAdvanceChartComponent } from './stock-reports/stock-reports.component';
import { SalesStockReportsAdvanceChartComponent } from './sales-stock-reports/sales-stock-reports.component';
import { ProductionStockReportsAdvanceChartComponent } from './production-stock-reports/production-stock-reports.component';
import { ListViewDataComponent } from './list-view-data/list-view-data.component';
import { SummarizedStockReportComponent } from './summarized-stock-reports/summarized-stock-reports.component';


@NgModule({
  imports: [
    CalendarModule,
    CheckboxModule,
    ConfirmDialogModule,
    CommonModule,
    DassSharedModule,
    FormsModule,
    ModalModule.forRoot(),
    AdvancedStockReportsRouting,
    TooltipModule,
    KeyFilterModule,
    ReservationModule,
    PordersModule,
    SalesModule,
    InputNumberModule,
    TransferNotificationModule,
    StockAutoCompleteModule,
    WareHouseAutoCompleteModule,
    BatchAutoCompleteModule,
    UnitAutoCompleteModule,
    WarehouseLocationModule
  ],
  declarations: [
    ListAdvancedStockReportComponent,
    ShiftBasedStockReportsComponent,
    SummarizedStockReportComponent,
    ListViewDataComponent,
    StockReportsAdvanceChartComponent,
    SalesStockReportsAdvanceChartComponent,
    ProductionStockReportsAdvanceChartComponent,
    NewAdvanceStockReportsComponent
  ],
  providers: [
    StockTransferReceiptService,
  ], exports: [
    ListAdvancedStockReportComponent,
    NewAdvanceStockReportsComponent
  ]
})
export class AdvanceStockReportsModule {
}
