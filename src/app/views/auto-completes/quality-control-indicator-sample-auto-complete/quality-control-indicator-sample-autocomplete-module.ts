import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DassSharedModule} from '../../../shared/dass-shared.module';

import {AutoCompleteModule} from 'primeng';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import { ControlIndicatorSampleService } from 'app/services/dto-services/inspection-charateristics/control-indicator/control-indicator-sample.service';
import { QualityControlIndicatorSampleAutoCompleteComponent } from './quality-control-indicator-sample-auto-complete.component';

@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,

    ButtonModule,
    FormsModule,
    AutoCompleteModule,
    ModalModule.forRoot()
  ],
  declarations: [
    QualityControlIndicatorSampleAutoCompleteComponent,
  ],
  exports: [
    QualityControlIndicatorSampleAutoCompleteComponent,
  ]
  ,
  providers: [
    ControlIndicatorSampleService
  ]
})
export class QualityControlIndicatorSampleAutoCompleteModule {
}
