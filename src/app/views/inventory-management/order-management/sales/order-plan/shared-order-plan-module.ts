import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import { FormsModule } from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import { OrderDetailPlanComponent } from './list.component';
import { ProductionOrderService } from 'app/services/dto-services/production-order/production-order.service';
import { StockTransferReceiptService } from 'app/services/dto-services/stock-transfer-receipt/stock-transfer-receipt.service';
import { EnumJobOrderStatusService } from 'app/services/dto-services/enum/job-order-status.service';
import { SharedStockTransferModule } from 'app/views/inventory-management/warehouse-management-system/basic-warehouse-managment/transfer/shared-transfer-module';


@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    FormsModule,
    ModalModule.forRoot(),
    SharedStockTransferModule
  ],
  declarations: [
    OrderDetailPlanComponent,
  ],
  providers: [
    ProductionOrderService,
    StockTransferReceiptService,
    EnumJobOrderStatusService
  ],
  exports: [
    OrderDetailPlanComponent
  ]
})
export class SharedOrderPlanModule {
}
