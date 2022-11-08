import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DassSharedModule} from '../../../shared/dass-shared.module';

import {AutoCompleteModule} from 'primeng';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import { QualityInspectionControlDataCertificationAutoCompleteComponent } from './quality-inspect-data-control-certificate-auto-complete.component';
import { QualityInspectionControlDataCertificationService } from 'app/services/dto-services/quality-inspection-control-data/quality-inspection-control-data.service';
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
    QualityInspectionControlDataCertificationAutoCompleteComponent,
  ],
  exports: [
    QualityInspectionControlDataCertificationAutoCompleteComponent,
  ]
  ,
  providers: [
    QualityInspectionControlDataCertificationService
  ]
})
export class QualityInspectionControlDataCertificationAutoCompleteModule {
}
