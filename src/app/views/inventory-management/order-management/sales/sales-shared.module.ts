import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import { ImageV2Module } from 'app/views/image-v2/image-module-v2';
import { DetailSaleComponent } from './detail/detail.component';
import {ModalModule} from 'ngx-bootstrap/modal';
import { SharedOrderPlanModule } from './order-plan/shared-order-plan-module';
import { TreeModule } from 'primeng';
import { EnumOrderStatusService } from 'app/services/dto-services/enum/order-status.service';
import { FormsModule } from '@angular/forms';
import { SharedStockTransferModule } from '../../warehouse-management-system/basic-warehouse-managment/transfer/shared-transfer-module';
import { SalesItemDetailComponent } from './order-detail-items/item-details/detail.component';
import { SalesOrderQuotationsService } from 'app/services/dto-services/sales-order-quotations/sales-order-quotations.service';
import { PrintSharedModule } from 'app/views/general-settings/print/print-component/print-shared.module';
import { InvoiceModule } from '../invoice/invoice.module';

@NgModule({
  imports: [
    CommonModule,
    ModalModule.forRoot(),
    DassSharedModule,
    SharedOrderPlanModule,
    SharedStockTransferModule,
    TreeModule,
    ImageV2Module,
    PrintSharedModule,
    InvoiceModule,
    FormsModule
  ],
  declarations: [
    DetailSaleComponent,
    SalesItemDetailComponent
  ],
  exports: [
    DetailSaleComponent,
    SalesItemDetailComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    EnumOrderStatusService,
    SalesOrderQuotationsService
  ]
})
export class SalesSharedModule {
}
