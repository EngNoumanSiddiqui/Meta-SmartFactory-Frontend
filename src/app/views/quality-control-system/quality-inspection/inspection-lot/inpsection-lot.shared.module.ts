import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import {
    RatingModule,
    SidebarModule,
    TooltipModule,
    TreeTableModule,
    ConfirmDialogModule
} from 'primeng';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { WorkStationAutoCompleteModule } from 'app/views/auto-completes/ws-auto-complete/workstation-autocomplete-module';
import { PlantAutoCompleteModule } from 'app/views/auto-completes/plant-auto-complete/plant-autocomplete-module';
import { StockAutoCompleteModule } from 'app/views/auto-completes/stock-auto-complete/stock-autocomplete-module';
import { BatchAutoCompleteModule } from 'app/views/auto-completes/batch-auto-complete/batch-autocomplete-module';
import { WorkCenterAutocompleteModule } from 'app/views/auto-completes/workcenter-auto-complete/workcenter-autocomplete-module';
import { WorkstationDashboardService } from 'app/services/dto-services/workstation/workstation-dashboard.service';
import { EnumActStatusService } from 'app/services/dto-services/enum/act-status.service';
import { EnumActPositionService } from 'app/services/dto-services/enum/act-position.service';
import { InspectionLotService } from 'app/services/dto-services/quality-inspection/inspection-lot.service';
import { QualityInspectionOperationAutoCompleteModule } from 'app/views/auto-completes/quality-inspection-operation-auto-complete/quality-inspection-operation-autocomplete-module';
import { QualityInspectionRoutingModule } from '../quality-inspection-routing.module';
import { EquipmentOperationAutoCompleteModule } from 'app/views/auto-completes/equipment-operation-auto-complete/equipment-operation-autocomplete-module';
import { InspectionSpecificationService } from 'app/services/dto-services/quality-inspection/inspection-specification.service';
import { NewInspectionLot } from './new/new.component';
import { NewInspectionSpecification } from './inspection-specification/new/new.component';
import { UnitAutoCompleteModule } from 'app/views/auto-completes/unit-auto-complete/unit-autocomplete-module';
import { InspectionPlanModule } from 'app/views/quality-control-system/inspection-plan/inspection-plan.module';
import { QualityInfoRecordService } from 'app/services/dto-services/quality-info-record/quality-info-record.service';

@NgModule({
    imports: [
        QualityInspectionRoutingModule,
        FormsModule,
        DassSharedModule,
        RatingModule,
        TooltipModule,
        CommonModule,
        ModalModule.forRoot(),
        ConfirmDialogModule,
        SidebarModule,
        TableModule,
        TreeTableModule,
        WorkStationAutoCompleteModule,
        PlantAutoCompleteModule,
        StockAutoCompleteModule,
        QualityInspectionOperationAutoCompleteModule,
        BatchAutoCompleteModule,
        WorkCenterAutocompleteModule,
        CalendarModule,
        EquipmentOperationAutoCompleteModule,
        UnitAutoCompleteModule,
        InspectionPlanModule,

    ],
    providers: [
        WorkstationDashboardService,
        EnumActStatusService,
        EnumActPositionService,
        InspectionLotService,
        QualityInfoRecordService,
        InspectionSpecificationService
    ],
    declarations: [
        NewInspectionLot,
        NewInspectionSpecification,
    ],
    exports: [
        NewInspectionLot,
        NewInspectionSpecification,
        UnitAutoCompleteModule,
        
    ]
})
export class SharedQualityInspectionModule { }
