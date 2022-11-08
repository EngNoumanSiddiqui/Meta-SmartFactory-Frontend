import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SalesRoutingModule } from "./sales-routing.module";
import { NewSaleComponent } from "./new/new.component";
import { EditSaleComponent } from "./edit/edit.component";
import { ListSalesComponent } from "./list/list.component";
import { FormsModule } from "@angular/forms";
import { DassSharedModule } from "app/shared/dass-shared.module";
import {
  CalendarModule,
  CheckboxModule,
  ConfirmDialogModule,
  TooltipModule,
  ProgressBarModule,
  ProgressSpinnerModule,
  CardModule,
  PanelModule,
  FileUploadModule,
  TreeTableModule,
  MenuModule,
} from "primeng";
import { ModalModule } from "ngx-bootstrap/modal";
import { SharedOrderPlanModule } from "./order-plan/shared-order-plan-module";
import { PlantAutoCompleteModule } from "app/views/auto-completes/plant-auto-complete/plant-autocomplete-module";
import { WareHouseAutoCompleteModule } from "app/views/auto-completes/warehouse-auto-complete/warehouse-autocomplete-module";
import { CompanyService } from "app/services/dto-services/company/company.service";
import { SalesSharedModule } from "./sales-shared.module";
import { NgCircleProgressModule } from "ng-circle-progress";
import { SharedCustomerModule } from "../customers/shared-customer-module";
import { StockAutoCompleteModule } from "app/views/auto-completes/stock-auto-complete/stock-autocomplete-module";
import { BatchAutoCompleteModule } from "app/views/auto-completes/batch-auto-complete/batch-autocomplete-module";
import { ListSalesItemsComponent } from "./order-detail-items/list.component";
import { ActService } from "app/services/dto-services/act/act.service";
import { EnumOrderStatusService } from "app/services/dto-services/enum/order-status.service";
import { SalesOrderService } from "app/services/dto-services/sales-order/sales-order.service";
import { StockCardService } from "app/services/dto-services/stock/stock.service";
import { SharedMaterialModule } from "../../warehouse-management-system/basic-warehouse-managment/material-cards/shared-material-module";
import { SharedStockTransferModule } from "../../warehouse-management-system/basic-warehouse-managment/transfer/shared-transfer-module";
import { SalesOrderQuotationsService } from "app/services/dto-services/sales-order-quotations/sales-order-quotations.service";
import { ActTypeService } from "app/services/dto-services/act-type/act-type.service";
import { CurrencyAutoCompleteModule } from "app/views/auto-completes/currency-auto-complete/currency-autocomplete-module";
import { SaleReviewJobOrderComponent } from "./sale-review-job-order/sale-review-job-order.component";
import { BasicManufacturingSharedModule } from "app/views/manufacturing-planning-system/basic-manufacturing/basic-manufacturing-planning.shared.module";
import { OperationAutoCompleteModule } from "../../../auto-completes/operation-auto-complete/operation-autocomplete-module";
import { ImageV2Module } from "app/views/image-v2/image-module-v2";
import { CostCenterAutoCompleteModule } from "app/views/auto-completes/cost-center-auto-complete/cost-center-autocomplete-module";
import { ParityAutoCompleteModule } from "app/views/auto-completes/parity-auto-complete/parity-autocomplete-module";
import { WorkStationAutoCompleteModule } from "app/views/auto-completes/ws-auto-complete/workstation-autocomplete-module";
import { EmployeeGenericGroupAutoCompleteModule } from "app/views/auto-completes/employee-generic-group-auto-complete/employee-generic-group-autocomplete-module";
import { PrintSharedModule } from "app/views/general-settings/print/print-component/print-shared.module";
import { LocationAutoCompleteModule } from "app/views/auto-completes/location-auto-complete/location-autocomplete-module";
import { InvoiceModule } from "../invoice/invoice.module";
import { ExchangeRateService } from "app/services/dto-services/exchange-rates/exchange-rates.service";
import { StockOrderSimulationService } from "../../../../services/dto-services/stock-order-simulation/stock-order-simulation.service";
import { ListSalesReportComponent } from "./report/report.component";

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
    SalesRoutingModule,
    TooltipModule,
    ImageV2Module,
    SharedOrderPlanModule,
    SharedCustomerModule,
    SharedStockTransferModule,
    StockAutoCompleteModule,
    BatchAutoCompleteModule,
    PlantAutoCompleteModule, // demo
    WareHouseAutoCompleteModule, // demo
    ProgressBarModule,
    ProgressSpinnerModule,
    SalesSharedModule,
    SharedMaterialModule,
    CurrencyAutoCompleteModule,
    NgCircleProgressModule.forRoot({
      innerStrokeColor: "#ffffff",
      innerStrokeWidth: 5,
    }),
    FileUploadModule,
    BasicManufacturingSharedModule,
    OperationAutoCompleteModule,
    CostCenterAutoCompleteModule,
    ParityAutoCompleteModule,
    WorkStationAutoCompleteModule,
    TreeTableModule,
    MenuModule,
    EmployeeGenericGroupAutoCompleteModule,
    LocationAutoCompleteModule,
    InvoiceModule,
    PrintSharedModule,
  ],
  declarations: [
    NewSaleComponent,
    EditSaleComponent,
    ListSalesComponent,
    SaleReviewJobOrderComponent,
    ListSalesItemsComponent,
    ListSalesReportComponent
  ],
  exports: [
    ListSalesComponent,
    NewSaleComponent,
    SaleReviewJobOrderComponent,
    ListSalesItemsComponent,
    ListSalesReportComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    ActService,
    ActTypeService,
    EnumOrderStatusService,
    SalesOrderService,
    SalesOrderQuotationsService,
    StockCardService,
    CompanyService,
    ExchangeRateService,
    StockOrderSimulationService,
  ],
})
export class SalesModule {}
