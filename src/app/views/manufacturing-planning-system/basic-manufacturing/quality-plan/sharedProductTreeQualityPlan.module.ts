import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuModule, TabViewModule, TooltipModule, TreeTableModule } from 'primeng';
import { ModalModule } from 'ngx-bootstrap/modal';
// Tabs Component
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TableModule } from 'primeng/table';
import { ProductTreeCriteriaAutoCompleteModule } from 'app/views/auto-completes/product-tree-criteria-auto-complete/product-tree-criteria-autocomplete-module';
import { WorkstationProgramAutoCompleteModule } from 'app/views/auto-completes/workstation-program-auto-complete/workstation-program-autocomplete-module';
import { EquipmentAutoCompleteModule } from 'app/views/auto-completes/equipment-auto-complete/equipment-autocomplete-module';
import { PlantAutoCompleteModule } from 'app/views/auto-completes/plant-auto-complete/plant-autocomplete-module';
import { WorkStationAutoCompleteModule } from 'app/views/auto-completes/ws-auto-complete/workstation-autocomplete-module';
import { StockAutoCompleteModule } from 'app/views/auto-completes/stock-auto-complete/stock-autocomplete-module';
import { WorkCenterAutocompleteModule } from 'app/views/auto-completes/workcenter-auto-complete/workcenter-autocomplete-module';
import { QualityInspectionOperationAutoCompleteModule } from 'app/views/auto-completes/quality-inspection-operation-auto-complete/quality-inspection-operation-autocomplete-module';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import { ProductTreeQualityPlanDetailComponent } from './quality-plan-detail/detail/detail.component';
import { ProductTreeQualityPlanListComponent } from './quality-plan-detail/list/list.component';
import { ProductTreeQualityPlanNewComponent } from './quality-plan-detail/new/new.component';
import { ProductTreeQualityPlanOperationNewComponent } from './quality-plan-operation/new/new.component';
import { ProductTreeQualityPlanOperationListComponent } from './quality-plan-operation/list/list.component';
import { ProductTreeQualityPlanOperationDetailComponent } from './quality-plan-operation/detail/detail.component';
import { ProductTreeDetailQualityPlanService } from 'app/services/dto-services/product-tree/prod-tree-quality-plan-service';
import { ProductTreeDetailQualityPlanOperationService } from 'app/services/dto-services/product-tree/prod-tree-quality-plan-operation-service';
import { ProductTreeQualityPlanCharacteristicDetailComponent } from './quality-plan-operation/quality-characteristic/detail/detail.component';
import { ProductTreeQualityPlanCharacteristicListComponent } from './quality-plan-operation/quality-characteristic/list/list.component';
import { ProductTreeQualityPlanCharacteristicNewComponent } from './quality-plan-operation/quality-characteristic/new/new.component';
import { ProductTreeDetailQualityPlanCharacService } from 'app/services/dto-services/product-tree/prod-tree-quality-plan-charac-service';
import { InspCharAutoCompleteModule } from 'app/views/auto-completes/insp-char-auto-complete/insp-char-auto-complete-module';
import { SamplingProcedureService } from 'app/services/dto-services/sampling-procedure/sampling-procedure.service';
import { SharedMaterialModule } from 'app/views/inventory-management/warehouse-management-system/basic-warehouse-managment/material-cards/shared-material-module';



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
        PlantAutoCompleteModule,
        WorkStationAutoCompleteModule,
        StockAutoCompleteModule,
        WorkCenterAutocompleteModule,
        QualityInspectionOperationAutoCompleteModule,
        InspCharAutoCompleteModule

    ],
    declarations: [
        ProductTreeQualityPlanListComponent,
        ProductTreeQualityPlanDetailComponent,
        ProductTreeQualityPlanNewComponent,
        ProductTreeQualityPlanOperationNewComponent,
        ProductTreeQualityPlanOperationListComponent,
        ProductTreeQualityPlanOperationDetailComponent,
        ProductTreeQualityPlanCharacteristicDetailComponent,
        ProductTreeQualityPlanCharacteristicListComponent,
        ProductTreeQualityPlanCharacteristicNewComponent,
    ],
    exports: [
        ProductTreeQualityPlanListComponent,
        ProductTreeQualityPlanDetailComponent,
        ProductTreeQualityPlanNewComponent,
        ProductTreeQualityPlanOperationNewComponent,
        ProductTreeQualityPlanOperationListComponent,
        ProductTreeQualityPlanOperationDetailComponent,
        ProductTreeQualityPlanCharacteristicDetailComponent,
        ProductTreeQualityPlanCharacteristicListComponent,
        ProductTreeQualityPlanCharacteristicNewComponent,
    ],
    providers: [
        ProductTreeDetailQualityPlanService,
        ProductTreeDetailQualityPlanOperationService,
        ProductTreeDetailQualityPlanCharacService,
        SamplingProcedureService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]

})
export class SharedProductTreeQualityPlanModule {
}
