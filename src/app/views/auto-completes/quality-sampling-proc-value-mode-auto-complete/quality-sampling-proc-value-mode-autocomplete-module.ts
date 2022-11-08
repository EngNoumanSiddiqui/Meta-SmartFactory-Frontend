import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DassSharedModule} from '../../../shared/dass-shared.module';

import {AutoCompleteModule} from 'primeng';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import { QualitySamplingProcedureValueModeAutoCompleteComponent } from './quality-sampling-proc-value-mode-auto-complete.component';
import { SamplingProcedureValueModeService } from 'app/services/dto-services/sampling-procedure/sampling-procedure-value-mode.service';

@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,

    ButtonModule,
    FormsModule,
    AutoCompleteModule,
    ModalModule.forRoot(),
  ],
  declarations: [
    QualitySamplingProcedureValueModeAutoCompleteComponent,
  ],
  exports: [
    QualitySamplingProcedureValueModeAutoCompleteComponent,
  ]
  ,
  providers: [
    SamplingProcedureValueModeService
  ]
})
export class QualitySamplingProcedureValueModeAutoCompleteModule {
}
