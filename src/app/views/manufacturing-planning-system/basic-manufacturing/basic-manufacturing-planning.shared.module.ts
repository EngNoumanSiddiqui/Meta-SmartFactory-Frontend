
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuModule, TabViewModule, TooltipModule, TreeModule, TreeTableModule } from 'primeng';
import { ModalModule } from 'ngx-bootstrap/modal';
// Tabs Component
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TableModule } from 'primeng/table';
import { DetailProductTreeComponent } from './product-tree/detail/detail-product-tree.component';
import { ProductTreeDetailListComponent } from './product-tree-detail/list/list.component';
import { DetailProductTreeEquipmentComponent } from './equipment/production-equipment/detail/detail.component';
import { DetailProductTreeWorkstationProgramComponent } from './operation/prod-tree-workstation-program/detail/detail.component';
import { DetailProductTreeOperationComponent } from './operation/production-operation/detail/detail.component';
import { DetailProductTreeComponentComponent } from './component/production-component/detail/detail.component';
import { DetailProductTreeComponentFeatureComponent } from './component/component-feature/detail/detail.component';
import { DetailProductTreeDetailComponent } from './product-tree-detail/detail/detail.component';
import { NewProductTreeDetailComponent } from './product-tree-detail/new/new.component';
import { ProductTreeComponentFeatureListComponent } from './component/component-feature/list/list.component';
import { NewProductTreeComponentFeatureComponent } from './component/component-feature/new/new.component';
import { ProductTreeComponentListComponent } from './component/production-component/list/list.component';
import { NewProductTreeComponentComponent } from './component/production-component/new/new.component';
import { ProductTreeEquipmentListComponent } from './equipment/production-equipment/list/list.component';
import { NewProductTreeEquipmentComponent } from './equipment/production-equipment/new/new.component';
import { ProductTreeWorkstationProgramListComponent } from './operation/prod-tree-workstation-program/list/list.component';
import { NewProductTreeWorkstationProgramComponent } from './operation/prod-tree-workstation-program/new/new.component';
import { ProductTreeOperationListComponent } from './operation/production-operation/list/list.component';
import { NewProductTreeOperationComponent } from './operation/production-operation/new/new.component';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import { ProductTreeCriteriaAutoCompleteModule } from 'app/views/auto-completes/product-tree-criteria-auto-complete/product-tree-criteria-autocomplete-module';
import { WorkstationProgramAutoCompleteModule } from 'app/views/auto-completes/workstation-program-auto-complete/workstation-program-autocomplete-module';
import { EquipmentAutoCompleteModule } from 'app/views/auto-completes/equipment-auto-complete/equipment-autocomplete-module';
import { SharedMaterialModule } from 'app/views/inventory-management/warehouse-management-system/basic-warehouse-managment/material-cards/shared-material-module';
import { SharedOperationsModule } from 'app/views/production-settings/operations/shared-operations.module';
import { SharedEquipmentsModule } from 'app/views/maintenance/equipment-technical-objects/equipment/shared-equipment.module';
import { UnitAutoCompleteModule } from 'app/views/auto-completes/unit-auto-complete/unit-autocomplete-module';
import { PlantAutoCompleteModule } from 'app/views/auto-completes/plant-auto-complete/plant-autocomplete-module';
import { WorkStationAutoCompleteModule } from 'app/views/auto-completes/ws-auto-complete/workstation-autocomplete-module';
import { SharedProductTreeQualityPlanModule } from './quality-plan/sharedProductTreeQualityPlan.module';
import { ProductTreeService } from 'app/services/dto-services/product-tree/prod-tree.service';
import { ProductTreeComponentFeatureService } from 'app/services/dto-services/product-tree/product-tree-component-feature.service';
import { ProductTreeCriteriaService } from 'app/services/dto-services/product-tree/prod-tree-criteria.service';
import { ProductTreeComponentService } from 'app/services/dto-services/product-tree/prouduct-tree-component.service';
import { ProductTreeWorkstationProgramService } from 'app/services/dto-services/product-tree/product-tree-workstation-program.service';
import { WorkstationProgramService } from 'app/services/dto-services/product-tree/worksation-program.service';
import { ProductTreeEquipmentService } from 'app/services/dto-services/product-tree/prouduct-tree-equipment.service';
import { ProductTreeOperationService } from 'app/services/dto-services/product-tree/prouduct-tree-operation.service';
import { ProductTreeDetailService } from 'app/services/dto-services/product-tree/prod-tree-detail.service';
import { CurrencyAutoCompleteModule } from 'app/views/auto-completes/currency-auto-complete/currency-autocomplete-module';
import { NewProductTreeComponent } from './product-tree/new/new.component';
import { StockAutoCompleteModule } from 'app/views/auto-completes/stock-auto-complete/stock-autocomplete-module';

const EXPORTS = [
  ProductTreeDetailListComponent,
  NewProductTreeOperationComponent,
  NewProductTreeWorkstationProgramComponent,
  NewProductTreeEquipmentComponent,
  NewProductTreeComponentComponent,
  NewProductTreeComponent,
  NewProductTreeComponentFeatureComponent,
  DetailProductTreeComponent
]

@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    FormsModule,
    MenuModule,
    ModalModule.forRoot(),
    TabsModule,
    TabViewModule,
    TooltipModule,
    TableModule,
    TreeTableModule,
    ProductTreeCriteriaAutoCompleteModule,
    WorkstationProgramAutoCompleteModule,
    EquipmentAutoCompleteModule,
    SharedMaterialModule,
    SharedOperationsModule,
    SharedEquipmentsModule,
    UnitAutoCompleteModule,
    PlantAutoCompleteModule,
    WorkStationAutoCompleteModule,
    CurrencyAutoCompleteModule,
    StockAutoCompleteModule,
    TreeModule,
    SharedProductTreeQualityPlanModule
  ],

  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  declarations: [
    NewProductTreeOperationComponent,
    ProductTreeOperationListComponent,
    NewProductTreeWorkstationProgramComponent,
    ProductTreeWorkstationProgramListComponent,
    NewProductTreeEquipmentComponent,
    ProductTreeEquipmentListComponent,
    NewProductTreeComponentComponent,
    NewProductTreeComponent,
    ProductTreeComponentListComponent,
    NewProductTreeComponentFeatureComponent,
    ProductTreeComponentFeatureListComponent,
    NewProductTreeDetailComponent,
    DetailProductTreeDetailComponent,
    DetailProductTreeComponentFeatureComponent,
    DetailProductTreeComponentComponent,
    DetailProductTreeOperationComponent,
    DetailProductTreeWorkstationProgramComponent,
    DetailProductTreeEquipmentComponent,
    ...EXPORTS
  ],
  exports: [
    ...EXPORTS

  ],
  providers: [
    ProductTreeService,
    ProductTreeComponentFeatureService,
    ProductTreeCriteriaService,
    ProductTreeComponentService,
    ProductTreeWorkstationProgramService,
    WorkstationProgramService,
    ProductTreeEquipmentService,
    ProductTreeOperationService,
    ProductTreeDetailService,
  ]
})
export class BasicManufacturingSharedModule {}
