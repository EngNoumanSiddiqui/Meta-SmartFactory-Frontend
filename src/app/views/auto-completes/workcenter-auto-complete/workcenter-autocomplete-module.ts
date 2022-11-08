import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DassSharedModule} from '../../../shared/dass-shared.module';

import {AutoCompleteModule} from 'primeng';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {WorkCenterAutoCompleteComponent} from './workcenter-auto-complete.component';
import {WorkcenterService} from '../../../services/dto-services/workcenter/workcenter.service';
import { ModalModule } from 'ngx-bootstrap/modal';
import { WorkcenterSharedModule } from 'app/views/production-settings/workcenter/workcenter-shared.module';

@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    ButtonModule,
    ModalModule.forRoot(),
    FormsModule,
    AutoCompleteModule,
    WorkcenterSharedModule
  ],
  declarations: [
    WorkCenterAutoCompleteComponent,
  ],
  exports: [
    WorkCenterAutoCompleteComponent,
  ]
  ,
  providers: [
    WorkcenterService
  ]
})
export class WorkCenterAutocompleteModule {
}
