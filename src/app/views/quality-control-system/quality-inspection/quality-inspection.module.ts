import { NgModule } from '@angular/core';

import { ListInspectionLot } from './inspection-lot/list/list.component';
import { DetailInspectionLot } from './inspection-lot/detail/detail.component';
import { EditInspectionLot } from './inspection-lot/edit/edit.component';
import { DetailInspectionSpecification } from './inspection-lot/inspection-specification/detail/detail.component';
import { EditInspectionSpecification } from './inspection-lot/inspection-specification/edit/edit.component';
import { QualityInspectionRoutingModule } from './quality-inspection-routing.module';
import { FormsModule } from '@angular/forms';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import { EquipmentOperationAutoCompleteModule } from '../../auto-completes/equipment-operation-auto-complete/equipment-operation-autocomplete-module';
import { InspectionSpecificationService } from 'app/services/dto-services/quality-inspection/inspection-specification.service';
import { DetailInspectionSpec } from './inspection-lot/inspection-specification/inspection-spec/detail/detail.component'
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
import { ListResultRecording } from './inspection-lot/result-recording/list/list.component';
import { NewResultRecording } from './inspection-lot/result-recording/new/new.component';
import { EditResultRecording } from './inspection-lot/result-recording/edit/edit.component'
import { DetailResultRecording } from './inspection-lot/result-recording/detail/detail.component'
import { ResultRecordingService } from 'app/services/dto-services/quality-inspection/result-recording/result-recording.service';
import { ListDefectRecording } from './inspection-lot/defect-recording/list/list.component';
import { NewDefectRecording } from './inspection-lot/defect-recording/new/new.component';
import { EditDefectRecording } from './inspection-lot/defect-recording/edit/edit.component'
import { DetailDefectRecording } from './inspection-lot/defect-recording/detail/detail.component'
import { DefectRecordingService } from 'app/services/dto-services/quality-inspection/defect-recording/defect-recording.service';

import { ListUsageDecision } from './inspection-lot/usage-decision/list/list.component';
import { NewUsageDecision } from './inspection-lot/usage-decision/new/new.component';
import { EditUsageDecision } from './inspection-lot/usage-decision/edit/edit.component'
import { DetailUsageDecision } from './inspection-lot/usage-decision/detail/detail.component'
import { UsageDecisionService } from 'app/services/dto-services/quality-inspection/usage-decision/usage-decision.service';
import { InspCharAutoCompleteModule } from '../../auto-completes/insp-char-auto-complete/insp-char-auto-complete-module';
import { QualityNotificationModule } from './../quality-notification/quality-notification.module';
import { ListInspectionSpecifications } from './inspection-lot/inspection-specification/list/list.component';
import { NewInspectionSpec } from './inspection-lot/inspection-specification/inspection-spec/new/new.component';
import { EditInspectionSpec } from './inspection-lot/inspection-specification/inspection-spec/edit/edit.component'
import { QualityInspectionOperationAutoCompleteModule } from 'app/views/auto-completes/quality-inspection-operation-auto-complete/quality-inspection-operation-autocomplete-module';
import { SharedQualityInspectionModule } from './inspection-lot/inpsection-lot.shared.module';
// import { QualityInspectionLotAutoCompleteModule } from 'app/views/auto-completes/quality-inspection-lot-auto-complete/quality-inspection-lot-autocomplete-module';
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
    InspCharAutoCompleteModule,
    QualityInspectionOperationAutoCompleteModule,
    BatchAutoCompleteModule,
    WorkCenterAutocompleteModule,
    CalendarModule,
    QualityNotificationModule,
    EquipmentOperationAutoCompleteModule,
    SharedQualityInspectionModule
    // QualityInspectionLotAutoCompleteModule
  ],
  providers: [
    WorkstationDashboardService,
    EnumActStatusService,
    EnumActPositionService,
    InspectionLotService,
    ResultRecordingService,
    DefectRecordingService,
    UsageDecisionService,
    InspectionSpecificationService
  ],
  declarations: [
    ListInspectionLot,
    DetailInspectionLot,
    EditInspectionLot,
    DetailInspectionSpecification,
    EditInspectionSpecification,
    ListResultRecording,
    NewResultRecording,
    EditResultRecording,
    DetailResultRecording,
    ListDefectRecording,
    NewDefectRecording,
    EditDefectRecording,
    DetailDefectRecording,
    ListUsageDecision,
    NewUsageDecision,
    EditUsageDecision,
    DetailUsageDecision,
    ListInspectionSpecifications,
    NewInspectionSpec,
    EditInspectionSpec,
    DetailInspectionSpec
  ]
})
export class QualityInspectionModule { }
