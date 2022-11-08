import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {QualityInfoRecordService} from 'app/services/dto-services/quality-info-record/quality-info-record.service';
import { QualityInfoRecordRoutingModule } from './quality-info-record-routing.module';
import { PlantAutoCompleteModule } from 'app/views/auto-completes/plant-auto-complete/plant-autocomplete-module';
import {UnitAutoCompleteModule} from '../../auto-completes/unit-auto-complete/unit-autocomplete-module';
import {ActService} from 'app/services/dto-services/act/act.service';
import {
  RatingModule,
  SidebarModule,
  TooltipModule,
  TreeTableModule,   
  ConfirmDialogModule
} from 'primeng';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TableModule } from 'primeng/table';
import {CalendarModule} from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import { StockAutoCompleteModule } from 'app/views/auto-completes/stock-auto-complete/stock-autocomplete-module';
import {ListQualityInfoRecords} from './list/list.component';
import { NewQualityInfoRecord } from './new/new.component'
import {EditQualityInfoRecord} from './edit/edit.component'
import {DetailQualityInfoRecord} from './detail/detail.component';
import { NewInspectionControlData } from './inspection-control-data/new/new.component';
import { EditInspectionControlData } from './inspection-control-data/edit/edit.component';
import { DetailInspectionControlData } from './inspection-control-data/detail/detail.component'
import { QualityInspectionControlDataCertificationAutoCompleteModule } from 'app/views/auto-completes/quality-inspection-data-control-certificate-auto-complete/quality-inspect-data-control-certificate-autocomplete-module';
import { QualityInspectionControlDataService } from 'app/services/dto-services/quality-inspection-control-data/quality-inspection-control-data-certification.service';
import { QualityVendorSourceInspectionAutoCompleteModule } from 'app/views/auto-completes/quality-vendor-source-inspection-auto-complete/quality-vendor-source-inspec-autocomplete-module';
@NgModule({
  imports: [
    CommonModule,
    QualityInfoRecordRoutingModule,
    CalendarModule, 
    FormsModule,
    DassSharedModule,
    RatingModule,
    TooltipModule,
    ModalModule.forRoot(),
    ConfirmDialogModule,
    SidebarModule,
    TableModule,
    TreeTableModule,
    PlantAutoCompleteModule,
    UnitAutoCompleteModule, 
    StockAutoCompleteModule,
    QualityVendorSourceInspectionAutoCompleteModule,
    QualityInspectionControlDataCertificationAutoCompleteModule
  ],
  declarations: [ListQualityInfoRecords, NewQualityInfoRecord,EditQualityInfoRecord,DetailQualityInfoRecord, NewInspectionControlData, EditInspectionControlData, DetailInspectionControlData],
  providers: [QualityInfoRecordService,ActService, QualityInspectionControlDataService],
  
})
export class QualityInfoRecordModule { }
