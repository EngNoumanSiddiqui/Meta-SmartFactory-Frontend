import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CalendarModule, CheckboxModule, ConfirmationService, ConfirmDialogModule, ContextMenuModule, DialogModule, MenuModule, ProgressSpinnerModule, SharedModule, TabViewModule, TooltipModule, ProgressBarModule, TreeModule, TreeTableModule } from 'primeng';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TableModule } from 'primeng/table';
import { JobOrderRoutingModule } from './job-order-routing.module';
import { JobOrderPlanningComponent } from './planning/planing.component';
import { ProductionListComponent } from './production/list/list.component';
import { ProdNewComponent } from './production/prod-new/prod-new.component';
import { CreateAutoSaleOrderComponent } from './production/create-auto-sale-order/create-auto-sale-order.component';

import { DetailJobOrderComponentFeatureComponent } from './production/component/component-feature/detail/detail.component';
import { JobOrderComponentFeatureListComponent } from './production/component/component-feature/list/list.component';
import { JobOrderComponentListComponent } from './production/component/production-component/list/list.component';
import { DetailJobOrderComponentComponent } from './production/component/production-component/detail/detail.component';
import { NewJobOrderComponentFeatureComponent } from './production/component/component-feature/new/new.component';
import { JobOrderOperationListComponent } from './production/operation/production-operation/list/list.component';
import { DetailJobOrderOperationComponent } from './production/operation/production-operation/detail/detail.component';
import { NewJobOrderOperationComponent } from './production/operation/production-operation/new/new.component';
import { JobOrderEquipmentListComponent } from './production/equipment/production-equipment/list/list.component';
import { DetailJobOrderEquipmentComponent } from './production/equipment/production-equipment/detail/detail.component';
import { NewJobOrderEquipmentComponent } from './production/equipment/production-equipment/new/new.component';
import { NewJobOrderWorkstationProgramComponent } from './production/operation/prod-tree-workstation-program/new/new.component';
import { JobOrderWorkstationProgramListComponent } from './production/operation/prod-tree-workstation-program/list/list.component';
import { DetailJobOrderWorkstationProgramComponent } from './production/operation/prod-tree-workstation-program/detail/detail.component';
import { DetailJobOrderRowComponent } from './production/job-order-row-detail/detail.component';
import { JobOrderJoinComponent } from './combine/combine.component';
import { CreateWithProductTreeSaleOrderComponent } from './production/with-product-tree/with-product-tree.component';
import { EditJobOrderComponent } from './edit/edit.component';
import { AuxiliaryStockComponent } from './production/auxiliary/new/new.component';
import { AuxiliaryComponentListComponent } from './production/auxiliary/list/list.component';
import { ImageModule } from 'app/views/image/image-module';
import { WorkStationAutoCompleteModule } from 'app/views/auto-completes/ws-auto-complete/workstation-autocomplete-module';
import { BatchAutoCompleteModule } from 'app/views/auto-completes/batch-auto-complete/batch-autocomplete-module';
import { PlantAutoCompleteModule } from 'app/views/auto-completes/plant-auto-complete/plant-autocomplete-module';
import { OrderDetailAutocompleteModule } from 'app/views/auto-completes/order-detail-auto-complete/order-detail-autocomplete-module';
import { SharedMaterialModule } from 'app/views/inventory-management/warehouse-management-system/basic-warehouse-managment/material-cards/shared-material-module';
import { SharedOperationsModule } from 'app/views/production-settings/operations/shared-operations.module';
import { SharedEquipmentsModule } from 'app/views/maintenance/equipment-technical-objects/equipment/shared-equipment.module';
import { ProductTreeCriteriaAutoCompleteModule } from 'app/views/auto-completes/product-tree-criteria-auto-complete/product-tree-criteria-autocomplete-module';
import { UnitAutoCompleteModule } from 'app/views/auto-completes/unit-auto-complete/unit-autocomplete-module';
import { WorkstationProgramAutoCompleteModule } from 'app/views/auto-completes/workstation-program-auto-complete/workstation-program-autocomplete-module';
import { WareHouseAutoCompleteModule } from 'app/views/auto-completes/warehouse-auto-complete/warehouse-autocomplete-module';
import { WorkCenterAutocompleteModule } from 'app/views/auto-completes/workcenter-auto-complete/workcenter-autocomplete-module';
import { SharedQualityInspectionModule } from 'app/views/quality-control-system/quality-inspection/inspection-lot/inpsection-lot.shared.module';
import { SharedEndJobModule } from './end-job/shared-end-job.module';
import { ListJobOrderComponent } from './list/list.component';
import { NewJobOrderStockComponent } from './production/component/production-component/new/new.component';
import { JobOrderDetailComponent } from './job-order-detail/job-order-detail.component';
import { DetailAuxiliaryComponent } from './production/auxiliary/detail/detail.component';
import { JobOrderFollowComponent } from './follow/follow.component';
import { EmployeeService } from 'app/services/dto-services/employee/employee.service';
import { EnumPOrderStatusService } from 'app/services/dto-services/enum/p-order-status.service';
import { EnumStockStatusService } from 'app/services/dto-services/enum/stock-status.service';
import { EquipmentService } from 'app/services/dto-services/equipment/equipment.service';
import { JobOrderService } from 'app/services/dto-services/job-order/job-order.service';
import { OperationService } from 'app/services/dto-services/operation/operation.service';
import { SalesOrderService } from 'app/services/dto-services/sales-order/sales-order.service';
import { StockCardService } from 'app/services/dto-services/stock/stock.service';
import { UsersService } from 'app/services/users/users.service';
import { WorkstationService } from 'app/services/dto-services/workstation/workstation.service';
import { EnumJobOrderStatusService } from 'app/services/dto-services/enum/job-order-status.service';
import { WorkcenterService } from 'app/services/dto-services/workcenter/workcenter.service';
import { ProductDetailItemCommunicatingService } from '../product-detail-item.service';
import { ProductionOrderMaterialService } from 'app/services/dto-services/production-order/production-order-material.service';
import { StockAutoCompleteModule } from 'app/views/auto-completes/stock-auto-complete/stock-autocomplete-module';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import { ProductTreePaneModule } from 'app/views/choose-panes/choose-product-tree-pane/product-tree-pane.module';
import { ProductionEditComponent } from './production/prod-edit/prod-edit.component';
import { CombineProductionOrderComponent } from './production/combine-production-order/combine-production-order.component';
import { JobOrderOperationDetailsComponent } from './production/combine-production-order/job-order-operation-details/job-order-operation-details';
import { BasicManufacturingSharedModule } from '../basic-manufacturing-planning.shared.module';
import {FileUploadModule} from 'primeng/fileupload';
import {JobOrderSensorDataListComponent} from './production/sensor-data/sensor-data.component';
import {EquipmentMonitoringModule} from "../../../monitoring-equipment/equipment-monitoring.module";
import {MeasuringDocumentService} from "../../../../services/dto-services/measuring/measuring-document.service";
import { CurrencyAutoCompleteModule } from 'app/views/auto-completes/currency-auto-complete/currency-autocomplete-module';
import { StopListJobOrderComponent } from './production/stops/list/list.component';
import { StopService } from 'app/services/dto-services/stop/stop.service';
import { ProdProductTreeComponent } from './production/prod-product-tree/prod-product-tree.component';
import { ProdReviewJobOrderComponent } from './production/prod-review-job-order/prod-review-job-order.component';
import { ProdWaitingFinalJobOrderComponent } from './production/prod-waiting-final-job-order/prod-waiting-final-job-order.component';
import { OperationAutoCompleteModule } from 'app/views/auto-completes/operation-auto-complete/operation-autocomplete-module';
import { ProductionOrderListDetailComponent } from './production/production-list-detail/list.component';
import { CostCenterAutoCompleteModule } from 'app/views/auto-completes/cost-center-auto-complete/cost-center-autocomplete-module';
import { EmployeeGenericGroupAutoCompleteModule } from 'app/views/auto-completes/employee-generic-group-auto-complete/employee-generic-group-autocomplete-module';
import { LocationAutoCompleteModule } from 'app/views/auto-completes/location-auto-complete/location-autocomplete-module';
import { MilestoneAutoCompleteModule } from 'app/views/auto-completes/milestone-auto-complete/milestone-autocomplete-module';
import { ProjectAutoCompleteModule } from 'app/views/auto-completes/project-auto-complete/project-autocomplete-module';
import { WarehouseLocationModule } from 'app/views/inventory-management/warehouse-management-system/advance-warehouse-management/warehouse-locations/warehouse-location.module';
import { AdvanceStockReportsModule } from 'app/views/inventory-management/warehouse-management-system/advance-warehouse-management/advanced-stock-reports/advance-stock-reports.module';
import { ProdOrderDetailComponent } from './production/detail/prod-order-detail.component';
import { ReservationModule } from 'app/views/inventory-management/warehouse-management-system/advance-warehouse-management/reservation/reservation.module';
import { PrintSharedModule } from 'app/views/general-settings/print/print-component/print-shared.module';
import { EmployeeAutoCompleteModule } from 'app/views/auto-completes/employee-auto-complete/employee-autocomplete-module';
import { JobOrderOperationPalletListComponent } from './production/operation/job-order-operation-pallet/list.component';
import { JobOrderOperationPalletService } from 'app/services/dto-services/job-order/job-order-operation-pallet.service';
import { ProductionStockReportsChartComponent } from './production/production-stock-reports/production-stock-reports.component';
import { ListViewProdDataComponent } from './production/list-view-data/list-view-data.component';

@NgModule({
  imports: [
    CalendarModule,
    CheckboxModule,
    CommonModule,
    ConfirmDialogModule,
    ContextMenuModule,
    DassSharedModule,
    StockAutoCompleteModule,
    DialogModule,
    ReactiveFormsModule,
    FormsModule,
    ProgressSpinnerModule,
    ProgressBarModule,
    MenuModule,
    TreeModule,
    TreeTableModule,
    ModalModule.forRoot(),
    JobOrderRoutingModule,
    SharedModule,
    TabsModule,
    TabViewModule,
    TooltipModule,
    ImageModule,
    TableModule,
    WorkStationAutoCompleteModule,
    BatchAutoCompleteModule,
    PlantAutoCompleteModule,
    OrderDetailAutocompleteModule,
    SharedMaterialModule,
    SharedOperationsModule,
    SharedEquipmentsModule,
    ProductTreeCriteriaAutoCompleteModule,
    UnitAutoCompleteModule,
    WorkstationProgramAutoCompleteModule,
    WareHouseAutoCompleteModule,
    WorkCenterAutocompleteModule,
    SharedQualityInspectionModule,
    SharedEndJobModule,
    ProductTreePaneModule,
    BasicManufacturingSharedModule,
    FileUploadModule,
    CurrencyAutoCompleteModule,
    OperationAutoCompleteModule,
    EquipmentMonitoringModule,
    LocationAutoCompleteModule,
    CostCenterAutoCompleteModule,
    EmployeeGenericGroupAutoCompleteModule,
    ProjectAutoCompleteModule,
    MilestoneAutoCompleteModule,
    AdvanceStockReportsModule,
    ReservationModule,
    EmployeeAutoCompleteModule,
    PrintSharedModule,
    WarehouseLocationModule
  ],
  declarations: [
    JobOrderPlanningComponent,
    JobOrderJoinComponent,
    ListJobOrderComponent,
    EditJobOrderComponent,
    ProductionListComponent,
    CombineProductionOrderComponent,
    JobOrderOperationDetailsComponent,
    ProdNewComponent,
    ProductionOrderListDetailComponent,
    ProdProductTreeComponent,
    ProdReviewJobOrderComponent,
    ProdWaitingFinalJobOrderComponent,
    ProductionEditComponent,
    CreateWithProductTreeSaleOrderComponent,
    CreateAutoSaleOrderComponent,
    NewJobOrderStockComponent,
    DetailJobOrderComponentFeatureComponent,
    JobOrderComponentFeatureListComponent,
    JobOrderComponentListComponent,
    DetailJobOrderComponentComponent,
    NewJobOrderComponentFeatureComponent,
    JobOrderOperationListComponent,
    DetailJobOrderOperationComponent,
    NewJobOrderOperationComponent,
    JobOrderEquipmentListComponent,
    DetailJobOrderEquipmentComponent,
    NewJobOrderEquipmentComponent,
    NewJobOrderWorkstationProgramComponent,
    JobOrderWorkstationProgramListComponent,
    DetailJobOrderWorkstationProgramComponent,
    DetailJobOrderRowComponent,
    JobOrderDetailComponent,
    ProdOrderDetailComponent,
    AuxiliaryStockComponent,
    AuxiliaryComponentListComponent,
    DetailAuxiliaryComponent,
    JobOrderFollowComponent,
    StopListJobOrderComponent,
    JobOrderSensorDataListComponent,
    ProductionStockReportsChartComponent,
    ListViewProdDataComponent,
    JobOrderOperationPalletListComponent,
  ],
  exports: [
    JobOrderComponentListComponent,
    JobOrderOperationPalletListComponent,
    JobOrderEquipmentListComponent,
    JobOrderWorkstationProgramListComponent,
    JobOrderOperationListComponent,
    JobOrderDetailComponent,
    ProdOrderDetailComponent,
    StopListJobOrderComponent,
    ProductionEditComponent,
    DetailJobOrderOperationComponent,
    ProductionListComponent,
    ProductionOrderListDetailComponent
  ],
  providers: [
    ConfirmationService,
    EmployeeService,
    EnumPOrderStatusService,
    EnumStockStatusService,
    EquipmentService,
    JobOrderService,
    OperationService,
    SalesOrderService,
    JobOrderOperationPalletService ,
    StockCardService,
    UsersService,
    WorkstationService,
    StopService,
    EnumJobOrderStatusService,
    WorkcenterService,
    ProductDetailItemCommunicatingService,
    ProductionOrderMaterialService,
    MeasuringDocumentService
  ]
})
export class JobOrderModule {
}
