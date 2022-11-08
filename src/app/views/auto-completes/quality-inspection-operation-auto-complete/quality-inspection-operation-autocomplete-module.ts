import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DassSharedModule } from '../../../shared/dass-shared.module';

import { AutoCompleteModule } from 'primeng';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import { InspectionOperationsService } from 'app/services/dto-services/inspection-operations/inspection-operations.service';
import { QualityInspectionOperationAutoCompleteComponent } from './quality-inspection-operation-auto-complete.component';
import { InspectionOperationModule } from 'app/views/quality-control-system/quality-settings/inspection-operation/inspection-operation.module';

@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,

    ButtonModule,
    FormsModule,
    AutoCompleteModule,
    InspectionOperationModule,
    ModalModule.forRoot()
  ],
  declarations: [
    QualityInspectionOperationAutoCompleteComponent,
  ],
  exports: [
    QualityInspectionOperationAutoCompleteComponent,
  ]
  ,
  providers: [
    InspectionOperationsService
  ]
})
export class QualityInspectionOperationAutoCompleteModule {
}
