import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DassSharedModule} from '../../../shared/dass-shared.module';

import {AutoCompleteModule} from 'primeng';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import { QualityControlIndicatorTypeAutoCompleteComponent } from './quality-control-indicator-type-auto-complete.component';
import { ControlIndicatorTypeService } from 'app/services/dto-services/inspection-charateristics/control-indicator/control-indicator-type.service';

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
    QualityControlIndicatorTypeAutoCompleteComponent,
  ],
  exports: [
    QualityControlIndicatorTypeAutoCompleteComponent,
  ]
  ,
  providers: [
    ControlIndicatorTypeService
  ]
})
export class QualityControlIndicatorTypeAutoCompleteModule {
}
