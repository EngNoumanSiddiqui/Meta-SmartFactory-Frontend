import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DassSharedModule} from '../../../shared/dass-shared.module';

import {AutoCompleteModule} from 'primeng';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import { QualityNotificationService } from 'app/services/dto-services/quality-notification/quality-notification.service';
import { QualityNotificationAutoCompleteComponent } from './quality-notification-auto-complete.component';
import { StockAutoCompleteModule } from '../stock-auto-complete/stock-autocomplete-module';

@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,

    ButtonModule,
    FormsModule,
    AutoCompleteModule,
    ModalModule.forRoot(),
    StockAutoCompleteModule
  ],
  declarations: [
    QualityNotificationAutoCompleteComponent,
  ],
  exports: [
    QualityNotificationAutoCompleteComponent,
  ]
  ,
  providers: [
    QualityNotificationService
  ]
})
export class QualityNotificationAutoCompleteModule {
}
