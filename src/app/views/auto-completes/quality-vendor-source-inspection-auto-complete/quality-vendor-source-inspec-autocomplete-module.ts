import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DassSharedModule} from '../../../shared/dass-shared.module';

import {AutoCompleteModule} from 'primeng';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import { QualityVendorSourceInspectionService } from 'app/services/dto-services/quality-inspection-control-data/quality-vendor-source-inspection.service';
import { QualityVendorSourceInspectionAutoCompleteComponent } from './quality-vendor-source-inspec-auto-complete.component';

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
    QualityVendorSourceInspectionAutoCompleteComponent,
  ],
  exports: [
    QualityVendorSourceInspectionAutoCompleteComponent,
  ]
  ,
  providers: [
    QualityVendorSourceInspectionService
  ]
})
export class QualityVendorSourceInspectionAutoCompleteModule {
}
