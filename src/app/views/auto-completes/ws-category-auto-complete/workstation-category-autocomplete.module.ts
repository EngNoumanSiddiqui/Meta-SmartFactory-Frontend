import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DassSharedModule} from '../../../shared/dass-shared.module';

import {AutoCompleteModule} from 'primeng';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import { WorkstationCategoryAutoCompleteComponent } from './workstation-category-autocomplete.component';

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
    WorkstationCategoryAutoCompleteComponent,
  ],
  exports: [
    WorkstationCategoryAutoCompleteComponent,
  ]
  ,
  providers: [
  ]
})
export class WorkStationCategoryAutoCompleteModule {
}
