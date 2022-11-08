import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DassSharedModule} from '../../../shared/dass-shared.module';

import {AutoCompleteModule} from 'primeng';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import { QualityDefectTypeAutoCompleteComponent } from './quality-defect-type-auto-complete.component';
import { DefectTypeService } from 'app/services/dto-services/defect-type/defect-type.service';
import { DefectTypeModule } from 'app/views/quality-control-system/quality-settings/defect-type/defect-type.module';

@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,

    ButtonModule,
    FormsModule,
    AutoCompleteModule,
    ModalModule.forRoot(),
    DefectTypeModule
  ],
  declarations: [
    QualityDefectTypeAutoCompleteComponent,
  ],
  exports: [
    QualityDefectTypeAutoCompleteComponent,
  ]
  ,
  providers: [
    DefectTypeService
  ]
})
export class QualityDefectTypeAutoCompleteModule {
}
