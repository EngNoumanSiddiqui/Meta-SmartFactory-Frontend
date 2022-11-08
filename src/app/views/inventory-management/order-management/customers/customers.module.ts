import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EditCustomerComponent} from './edit/edit.component';
import {ListCustomerComponent} from './list/list.component';
import {CustomersRoutingModule} from './customers-routing.module';
import {FormsModule} from '@angular/forms';
import { CalendarModule, ConfirmDialogModule } from 'primeng';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {ModalModule} from 'ngx-bootstrap/modal';
import { SharedCustomerModule } from './shared-customer-module';
import { ActService } from 'app/services/dto-services/act/act.service';
import { ActTypeService } from 'app/services/dto-services/act-type/act-type.service';
import { EnumActStatusService } from 'app/services/dto-services/enum/act-status.service';
import { TranslateService } from '@ngx-translate/core';
import { EnumActPositionService } from 'app/services/dto-services/enum/act-position.service';
import { SalesOrderService } from 'app/services/dto-services/sales-order/sales-order.service';
import { StockTransferReceiptService } from 'app/services/dto-services/stock-transfer-receipt/stock-transfer-receipt.service';
import { CurrencyAutoCompleteModule } from 'app/views/auto-completes/currency-auto-complete/currency-autocomplete-module';
import { ParityAutoCompleteModule } from 'app/views/auto-completes/parity-auto-complete/parity-autocomplete-module';
import { EmployeeAutoCompleteModule } from 'app/views/auto-completes/employee-auto-complete/employee-autocomplete-module';
@NgModule({
  imports: [
    CalendarModule,
    ConfirmDialogModule,
    CommonModule,
    CustomersRoutingModule,
    DassSharedModule,
    FormsModule,
    ModalModule.forRoot(),
    TooltipModule,
    CurrencyAutoCompleteModule,
    SharedCustomerModule,
    ParityAutoCompleteModule,
    EmployeeAutoCompleteModule
  ],
  declarations: [
    EditCustomerComponent,
    ListCustomerComponent
  ],
  providers: [
    ActService,
    ActTypeService,
    EnumActStatusService,
    TranslateService,
    EnumActPositionService,
    SalesOrderService,
    StockTransferReceiptService
  ]

})
export class CustomersModule {
}
