import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DassSharedModule} from '../../../shared/dass-shared.module';

import {AutoCompleteModule} from 'primeng';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {WorkstationTypeAutoCompleteComponent} from './workstation-type-auto-complete.component';
import { WorkstationTypeService } from 'app/services/dto-services/workstation-type/workstation-type.service';
import {ModalModule} from 'ngx-bootstrap/modal';

@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    ButtonModule,
    FormsModule,
    ModalModule.forRoot(),
    AutoCompleteModule
  ],
  declarations: [
    WorkstationTypeAutoCompleteComponent,
  ],
  exports: [
    WorkstationTypeAutoCompleteComponent,
  ]
  ,
  providers: [
    WorkstationTypeService
  ]
})
export class WorkStationTypeAutoCompleteModule {
}
