import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DassSharedModule} from '../../../shared/dass-shared.module';

import {AutoCompleteModule} from 'primeng';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {StopCauseAutoCompleteComponent} from './stop-cause-auto-complete.component';
import { StopCauseService } from 'app/services/dto-services/stop-cause/stop-cause.service';

@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    ButtonModule,
    FormsModule,
    AutoCompleteModule
  ],
  declarations: [
    StopCauseAutoCompleteComponent,
  ],
  exports: [
    StopCauseAutoCompleteComponent,
  ]
  ,
  providers: [
    StopCauseService
  ]
})
export class StopCauseAutoCompleteModule {
}
