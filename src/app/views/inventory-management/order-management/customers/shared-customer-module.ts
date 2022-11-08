import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CalendarModule, CheckboxModule, ConfirmDialogModule, KeyFilterModule, TooltipModule} from 'primeng';
import {ModalModule} from 'ngx-bootstrap/modal';
import {FormsModule} from '@angular/forms';
import {NewCustomerComponent} from './new/new.component';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import { SharedOrderPlanModule } from '../sales/order-plan/shared-order-plan-module';
import { DetailCustomerComponent } from './detail/detail.component';
import { AccountTransactionsComponent } from './account-transactions/account-transactions.component';
import { ListCustomerAllOrdersComponent } from './order-list/list.component';
import { ListCustomerTransferComponent } from './customer-transfers/list.component';
import { ActService } from 'app/services/dto-services/act/act.service';
import { ActTypeService } from 'app/services/dto-services/act-type/act-type.service';
import { SharedStockTransferModule } from '../../warehouse-management-system/basic-warehouse-managment/transfer/shared-transfer-module';
import { CurrencyAutoCompleteModule } from 'app/views/auto-completes/currency-auto-complete/currency-autocomplete-module';
import { ParityAutoCompleteModule } from 'app/views/auto-completes/parity-auto-complete/parity-autocomplete-module';
import { EmployeeAutoCompleteModule } from 'app/views/auto-completes/employee-auto-complete/employee-autocomplete-module';

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
    SharedStockTransferModule,
    SharedOrderPlanModule,
    CurrencyAutoCompleteModule,
    ParityAutoCompleteModule,
    EmployeeAutoCompleteModule
  ],
  declarations: [
    NewCustomerComponent,
    DetailCustomerComponent,
    AccountTransactionsComponent,
    ListCustomerAllOrdersComponent,
    ListCustomerTransferComponent
  ],
  providers: [
    ActService,
    ActTypeService
  ],
  exports: [
    NewCustomerComponent,
    DetailCustomerComponent,
    ListCustomerAllOrdersComponent,
    ListCustomerTransferComponent
  ]
})
export class SharedCustomerModule {
}
