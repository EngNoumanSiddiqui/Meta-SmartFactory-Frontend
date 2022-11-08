import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DassSharedModule} from '../../../shared/dass-shared.module';

import {AutoCompleteModule} from 'primeng';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {ActTypeAutoCompleteComponent} from './act-type-auto-complete.component';
import {ModalModule} from 'ngx-bootstrap/modal';
import { AccountTypeModule } from 'app/views/inventory-management/order-management/account-type/account-type.module';


@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    ButtonModule,
    FormsModule,
    AutoCompleteModule,
    ModalModule.forRoot(),
    AccountTypeModule
  ],
  declarations: [
    ActTypeAutoCompleteComponent,
  ],
  exports: [
    ActTypeAutoCompleteComponent,
  ]
  ,
  providers: [

  ]
})
export class ActTypeAutoCompleteModule {
}
