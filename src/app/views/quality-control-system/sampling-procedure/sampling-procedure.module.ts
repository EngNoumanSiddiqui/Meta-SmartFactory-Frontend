import { NgModule } from '@angular/core';

import { ListSamplingProcedure } from './list/list.component';
import { DetailSamplingProcedure } from './detail/detail.component';
import { NewSamplingProcedure } from './new/new.component';
import { EditSamplingProcedure } from './edit/edit.component';
import { SamplingProcedureRoutingModule } from './sampling-procedure-routing.module';

import { DassSharedModule } from 'app/shared/dass-shared.module';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { SamplingProcedureService } from 'app/services/dto-services/sampling-procedure/sampling-procedure.service';
import { SamplingProcedurePointService } from 'app/services/dto-services/sampling-procedure/sampling-procedure-point.service';
import { FormsModule } from '@angular/forms';
import { QualitySamplingTypeAutoCompleteModule } from 'app/views/auto-completes/quality-sampling-type-auto-complete/quality-sampling-type-autocomplete-module';
import { QualitySamplingProcedureValueModeAutoCompleteModule } from 'app/views/auto-completes/quality-sampling-proc-value-mode-auto-complete/quality-sampling-proc-value-mode-autocomplete-module';
import { QualitySamplingProcedureInspectionPointAutoCompleteModule } from 'app/views/auto-completes/quality-sampling-proc-insp-point-auto-complete/quality-sampling-proc-insp-point-autocomplete-module';
@NgModule({
  imports: [
    SamplingProcedureRoutingModule,
    DassSharedModule,
    CommonModule,
    FormsModule,
    ModalModule.forRoot(),
    QualitySamplingTypeAutoCompleteModule,
    QualitySamplingProcedureValueModeAutoCompleteModule,
    QualitySamplingProcedureInspectionPointAutoCompleteModule,
    ConfirmDialogModule
  ],
  providers: [
    SamplingProcedureService,
    SamplingProcedurePointService,
  ],
  declarations: [
    ListSamplingProcedure,
    DetailSamplingProcedure,
    NewSamplingProcedure,
    EditSamplingProcedure
  ]
})
export class SamplingProcedureModule { }
