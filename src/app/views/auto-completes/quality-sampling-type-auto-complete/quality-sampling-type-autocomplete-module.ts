import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DassSharedModule} from '../../../shared/dass-shared.module';

import {AutoCompleteModule} from 'primeng';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import { SamplingTypeService } from 'app/services/dto-services/sampling-type/sampling-type.service';
import { QualitySamplingTypeAutoCompleteComponent } from './quality-sampling-type-auto-complete.component';

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
    QualitySamplingTypeAutoCompleteComponent,
  ],
  exports: [
    QualitySamplingTypeAutoCompleteComponent,
  ]
  ,
  providers: [
    SamplingTypeService
  ]
})
export class QualitySamplingTypeAutoCompleteModule {
}
