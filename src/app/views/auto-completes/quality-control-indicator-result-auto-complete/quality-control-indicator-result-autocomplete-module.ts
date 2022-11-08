import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DassSharedModule} from '../../../shared/dass-shared.module';

import {AutoCompleteModule} from 'primeng';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import { ControlIndicatorResultService } from 'app/services/dto-services/inspection-charateristics/control-indicator/control-indicator-result.service';
import { QualityControlIndicatorResultAutoCompleteComponent } from './quality-control-indicator-result-auto-complete.component';

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
    QualityControlIndicatorResultAutoCompleteComponent,
  ],
  exports: [
    QualityControlIndicatorResultAutoCompleteComponent,
  ]
  ,
  providers: [
    ControlIndicatorResultService
  ]
})
export class QualityControlIndicatorResultAutoCompleteModule {
}
