import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DassSharedModule} from '../../../shared/dass-shared.module';

import {AutoCompleteModule} from 'primeng';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {WorkstationAutoCompleteComponent} from './workstation-auto-complete.component';
import {WorkstationService} from '../../../services/dto-services/workstation/workstation.service';

@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    ButtonModule,
    FormsModule,
    AutoCompleteModule
  ],
  declarations: [
    WorkstationAutoCompleteComponent,
  ],
  exports: [
    WorkstationAutoCompleteComponent,
  ]
  ,
  providers: [
    WorkstationService
  ]
})
export class WorkStationAutoCompleteModule {
}
