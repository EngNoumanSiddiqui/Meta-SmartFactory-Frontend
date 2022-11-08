import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DassSharedModule} from '../../../shared/dass-shared.module';

import {AutoCompleteModule} from 'primeng';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import { SamplingProcedurePointService } from 'app/services/dto-services/sampling-procedure/sampling-procedure-point.service';
import { QualitySamplingProcedureInspectionPointAutoCompleteComponent } from './quality-sampling-proc-insp-point-auto-complete.component';
import { QualitySamplingProcedureValueModeAutoCompleteModule } from '../quality-sampling-proc-value-mode-auto-complete/quality-sampling-proc-value-mode-autocomplete-module';
import { QualitySamplingTypeAutoCompleteModule } from '../quality-sampling-type-auto-complete/quality-sampling-type-autocomplete-module';

@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,

    ButtonModule,
    FormsModule,
    AutoCompleteModule,
    ModalModule.forRoot(),
    QualitySamplingTypeAutoCompleteModule,
    QualitySamplingProcedureValueModeAutoCompleteModule
  ],
  declarations: [
    QualitySamplingProcedureInspectionPointAutoCompleteComponent
  ],
  exports: [
    QualitySamplingProcedureInspectionPointAutoCompleteComponent
  ]
  ,
  providers: [
    SamplingProcedurePointService
  ]
})
export class QualitySamplingProcedureInspectionPointAutoCompleteModule {
}
