import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SettingsRoutingModule} from './settings-routing.module';
import {FormsModule} from '@angular/forms';
import {DassSharedModule} from '../../shared/dass-shared.module';

import {AutoCompleteModule, ColorPickerModule, ConfirmationService, ConfirmDialogModule, ListboxModule, PickListModule, TooltipModule, TreeModule} from 'primeng';
import {ModalModule} from 'ngx-bootstrap/modal';
import {ImageModule} from '../image/image-module';
import { PowerConsuptionSettingsComponent } from '../general-settings/power-consuption-settings/power-consuption-settings.component';

@NgModule({
  imports: [

    CommonModule,
    ConfirmDialogModule,
    DassSharedModule,

    FormsModule,

    ListboxModule,
    ModalModule.forRoot(),
    PickListModule,
    SettingsRoutingModule,
    TooltipModule,
    TreeModule,
    ColorPickerModule,
    ImageModule,
    AutoCompleteModule,

  ],
  declarations: [PowerConsuptionSettingsComponent,],
  providers: [
    ConfirmationService,

  ]
})
export class SettingsModule {
}
