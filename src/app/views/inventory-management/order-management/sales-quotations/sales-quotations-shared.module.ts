import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import {ModalModule} from 'ngx-bootstrap/modal';
import { TreeModule } from 'primeng';
import { EnumOrderStatusService } from 'app/services/dto-services/enum/order-status.service';
import { FormsModule } from '@angular/forms';
import { SharedStockTransferModule } from '../../warehouse-management-system/basic-warehouse-managment/transfer/shared-transfer-module';
import { DetailSaleQuotationsComponent } from './detail/detail.component';
import { SalesItemQuotationsDetailComponent } from './order-detail-items/item-details/detail.component';
import { PrintSharedModule } from 'app/views/general-settings/print/print-component/print-shared.module';
import { InvoiceModule } from '../invoice/invoice.module';

@NgModule({
  imports: [
    CommonModule,
    ModalModule.forRoot(),
    DassSharedModule,
    SharedStockTransferModule,
    TreeModule,
    FormsModule,
    InvoiceModule,
    PrintSharedModule
  ],
  declarations: [
    DetailSaleQuotationsComponent,
    SalesItemQuotationsDetailComponent
  ],
  exports: [
    DetailSaleQuotationsComponent,
    SalesItemQuotationsDetailComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    EnumOrderStatusService,
  ]
})
export class SalesQuotationsSharedModule {
}
