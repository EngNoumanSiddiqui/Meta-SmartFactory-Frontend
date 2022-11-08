import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DassSharedModule} from '../../../shared/dass-shared.module';

import {AutoCompleteModule} from 'primeng';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import { QualityNotificationTypeAutoCompleteComponent } from './quality-notification-type-auto-complete.component';
import { QualityNotificationTypeService } from 'app/services/dto-services/quality-notification-type/quality-notification-type.service';
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
    QualityNotificationTypeAutoCompleteComponent,
  ],
  exports: [
    QualityNotificationTypeAutoCompleteComponent,
  ]
  ,
  providers: [
    QualityNotificationTypeService
  ]
})
export class QualityNotificationTypeAutoCompleteModule {
}
