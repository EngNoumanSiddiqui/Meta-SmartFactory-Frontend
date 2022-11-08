import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SalesQuotationsRoutingModule} from './sales-quotations-routing.module';
import {FormsModule} from '@angular/forms';
import {DassSharedModule} from 'app/shared/dass-shared.module';
import {CalendarModule, CheckboxModule, ConfirmDialogModule, TooltipModule, ProgressBarModule, ProgressSpinnerModule, CardModule, PanelModule} from 'primeng';
import {ModalModule} from 'ngx-bootstrap/modal';
import { PlantAutoCompleteModule } from 'app/views/auto-completes/plant-auto-complete/plant-autocomplete-module';
import { WareHouseAutoCompleteModule } from 'app/views/auto-completes/warehouse-auto-complete/warehouse-autocomplete-module';
import { CompanyService } from 'app/services/dto-services/company/company.service';
import { SalesQuotationsSharedModule } from './sales-quotations-shared.module';
import { SharedCustomerModule } from '../customers/shared-customer-module';
import { StockAutoCompleteModule } from 'app/views/auto-completes/stock-auto-complete/stock-autocomplete-module';
import { BatchAutoCompleteModule } from 'app/views/auto-completes/batch-auto-complete/batch-autocomplete-module';
import { ListSalesItemsQuotationsComponent } from './order-detail-items/list.component';
import { ActService } from 'app/services/dto-services/act/act.service';
import { EnumOrderStatusService } from 'app/services/dto-services/enum/order-status.service';
import { StockCardService } from 'app/services/dto-services/stock/stock.service';
import { SharedMaterialModule } from '../../warehouse-management-system/basic-warehouse-managment/material-cards/shared-material-module';
import { SharedStockTransferModule } from '../../warehouse-management-system/basic-warehouse-managment/transfer/shared-transfer-module';
import { NewSaleQuotationsComponent } from './new/new.component';
import { EditSaleQuotationsComponent } from './edit/edit.component';
import { ListSalesQuotationsComponent } from './list/list.component';
import { SalesOrderQuotationsService } from 'app/services/dto-services/sales-order-quotations/sales-order-quotations.service';
import { SalesModule } from '../sales/sales.module';
import { ActTypeService } from 'app/services/dto-services/act-type/act-type.service';
import { CostCenterAutoCompleteModule } from 'app/views/auto-completes/cost-center-auto-complete/cost-center-autocomplete-module';
import { ActTypeAutoCompleteModule } from 'app/views/auto-completes/act-type-auto-complete/act-type-autocomplete-module';
import { ParityAutoCompleteModule } from 'app/views/auto-completes/parity-auto-complete/parity-autocomplete-module';
import { CurrencyAutoCompleteModule } from 'app/views/auto-completes/currency-auto-complete/currency-autocomplete-module';
import { PrintSharedModule } from 'app/views/general-settings/print/print-component/print-shared.module';
import { InvoiceModule } from '../invoice/invoice.module';
@NgModule({
  imports: [
    CalendarModule,
    PanelModule,
    CardModule,
    CheckboxModule,
    ConfirmDialogModule,
    CommonModule,
    DassSharedModule,
    FormsModule,
    ModalModule.forRoot(),
    SalesQuotationsRoutingModule,
    TooltipModule,
    SharedCustomerModule,
    SharedStockTransferModule,
    StockAutoCompleteModule,
    BatchAutoCompleteModule,
    PlantAutoCompleteModule, // demo
    WareHouseAutoCompleteModule, // demo
    ProgressBarModule,
    ProgressSpinnerModule,
    SalesQuotationsSharedModule,
    SharedMaterialModule,
    SalesModule,
    CostCenterAutoCompleteModule,
    ActTypeAutoCompleteModule,
    ParityAutoCompleteModule,
    PrintSharedModule,
    InvoiceModule,
    CurrencyAutoCompleteModule
  ],
  declarations: [
    NewSaleQuotationsComponent,	
    EditSaleQuotationsComponent,	
    ListSalesQuotationsComponent,	
    ListSalesItemsQuotationsComponent
  ],
  exports: [
    ListSalesQuotationsComponent,	
    ListSalesItemsQuotationsComponent,	
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    ActService,	
    ActTypeService,
    EnumOrderStatusService,	
    SalesOrderQuotationsService,	
    StockCardService,	
    CompanyService
  ]
})
export class SalesQuotationsModule {
}
