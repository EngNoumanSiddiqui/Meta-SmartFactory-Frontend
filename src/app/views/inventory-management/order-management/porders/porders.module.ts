import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlantAutoCompleteModule } from 'app/views/auto-completes/plant-auto-complete/plant-autocomplete-module';
import { WareHouseAutoCompleteModule } from 'app/views/auto-completes/warehouse-auto-complete/warehouse-autocomplete-module';
import { PordersSharedModule } from './porders.shared.module';
import { NewPorderComponent } from './new/new.component';
import { ListPorderComponent } from './list/list.component';
import { PorderEditComponent } from './porder-edit/porder-edit.component';
import { ListPorderDetailComponent } from './porder-items/list.component';
import { CombinePorderComponent } from './combine/combine.component';
import { EnumPOrderStatusService } from 'app/services/dto-services/enum/p-order-status.service';
import { StockCardService } from 'app/services/dto-services/stock/stock.service';
import { PorderService } from 'app/services/dto-services/porder/porder.service';
import { EnumOrderStatusService } from 'app/services/dto-services/enum/order-status.service';
import { ActService } from 'app/services/dto-services/act/act.service';
import { SalesOrderService } from 'app/services/dto-services/sales-order/sales-order.service';
import { CurrencyAutoCompleteModule } from 'app/views/auto-completes/currency-auto-complete/currency-autocomplete-module';
import { PurchaseGroupAutoCompleteModule } from 'app/views/auto-completes/purchase-group-auto-complete/purchase-group-autocomplete-module';
import { ConfirmDialogModule, KeyFilterModule, ConfirmationService } from 'primeng';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {ModalModule} from 'ngx-bootstrap/modal';
import { PordersRoutingModule } from './porders-routing.module';
import { ImageModule } from 'app/views/image/image-module';
import { StockAutoCompleteModule } from 'app/views/auto-completes/stock-auto-complete/stock-autocomplete-module';
import { SharedCustomerModule } from '../customers/shared-customer-module';
import { BatchAutoCompleteModule } from 'app/views/auto-completes/batch-auto-complete/batch-autocomplete-module';
import { SharedStockTransferModule } from '../../warehouse-management-system/basic-warehouse-managment/transfer/shared-transfer-module';
import { SharedMaterialModule } from '../../warehouse-management-system/basic-warehouse-managment/material-cards/shared-material-module';
import { PurchaseQuotationService } from 'app/services/dto-services/purchase-quotation/purchase-quotation.service';
import { CostCenterAutoCompleteModule } from 'app/views/auto-completes/cost-center-auto-complete/cost-center-autocomplete-module';
import { ParityAutoCompleteModule } from 'app/views/auto-completes/parity-auto-complete/parity-autocomplete-module';
import { PrintSharedModule } from 'app/views/general-settings/print/print-component/print-shared.module';
import { InvoiceModule } from '../invoice/invoice.module';

@NgModule({
  imports: [
    CommonModule,
    ConfirmDialogModule,
    ReactiveFormsModule,
    DassSharedModule,
    FormsModule,
    ModalModule.forRoot(),
    PordersRoutingModule,
    TooltipModule,
    ImageModule,
    KeyFilterModule,
    StockAutoCompleteModule,
    CostCenterAutoCompleteModule,
    SharedCustomerModule,
    SharedStockTransferModule,
    BatchAutoCompleteModule,
    PlantAutoCompleteModule, // demo
    WareHouseAutoCompleteModule, // demo
    PordersSharedModule,
    CurrencyAutoCompleteModule,
    PurchaseGroupAutoCompleteModule,
    SharedMaterialModule,
    ParityAutoCompleteModule,
    PrintSharedModule,
    InvoiceModule
  ],
  declarations: [
    NewPorderComponent,
    ListPorderComponent,
    PorderEditComponent,
    ListPorderDetailComponent,
    CombinePorderComponent
  ],
  exports: [
    NewPorderComponent,
    ListPorderDetailComponent,
    ListPorderComponent,
  ],
  providers: [
    ConfirmationService,
    EnumPOrderStatusService,
    StockCardService,
    PorderService,
    EnumOrderStatusService,
    PurchaseQuotationService,
    SalesOrderService,
    ActService
  ]
})
export class PordersModule {
}
