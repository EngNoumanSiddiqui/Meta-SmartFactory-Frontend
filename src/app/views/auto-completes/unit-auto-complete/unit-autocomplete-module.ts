import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DassSharedModule} from '../../../shared/dass-shared.module';

import {AutoCompleteModule} from 'primeng';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {UnitAutoCompleteComponent} from './unit-list.component';
import {SharedUnitListService} from './shared-unit-list.service';
import {WorkstationService} from '../../../services/dto-services/workstation/workstation.service';
import {ModalModule} from 'ngx-bootstrap/modal';

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
    UnitAutoCompleteComponent,
  ],
  exports: [
    UnitAutoCompleteComponent,
  ]
  ,
  providers: [
    WorkstationService,
    SharedUnitListService
  ]
})
export class UnitAutoCompleteModule {
}
