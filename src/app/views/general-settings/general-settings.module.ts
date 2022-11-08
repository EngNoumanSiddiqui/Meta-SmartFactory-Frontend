import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {GeneralSettingsRoutingModule} from './general-settings-routing.module';

import {FormsModule} from '@angular/forms';
import {DassSharedModule} from '../../shared/dass-shared.module';

import {AutoCompleteModule, ConfirmationService, ConfirmDialogModule, ListboxModule, TooltipModule} from 'primeng';
import {ModalModule} from 'ngx-bootstrap/modal';
import {ImageModule} from '../image/image-module';
import {AlertMessageSettingsComponent} from './alert-message-settings/alert-message-settings.component';

@NgModule({
  imports: [
    CommonModule,
    ConfirmDialogModule,
    DassSharedModule,
    FormsModule,
    ListboxModule,
    ModalModule.forRoot(),
    GeneralSettingsRoutingModule,
    TooltipModule,
    ImageModule,
    AutoCompleteModule,

  ],
  declarations: [

    /* //AlertSettings*/
    AlertMessageSettingsComponent,
    /*Shift Settings*/
  ],
  providers: [
    ConfirmationService

  ]
})
export class GeneralSettingsModule {
}
