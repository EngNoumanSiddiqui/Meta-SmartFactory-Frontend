import { PlantAutoCompleteModule } from './../auto-completes/plant-auto-complete/plant-autocomplete-module';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {DassSharedModule} from '../../shared/dass-shared.module';
import {ShiftSettingsComponent} from './shift-settings/shift-settings.component';
import {CountryCityTemplateComponent} from '../country-city-template/country-city-template.component';
import {AutoCompleteModule, ColorPickerModule, ConfirmDialogModule, PickListModule, TooltipModule} from 'primeng';
import {ImageModule} from '../image/image-module';
import {TreeModule} from 'primeng/tree';
import {LaborRoutingModule} from './labor-routing.module';
import {ConfirmationService} from 'primeng/api';
import {ModalModule} from 'ngx-bootstrap/modal';
import {ListboxModule} from 'primeng/listbox';
import { SharedShiftSettingsModule } from './shift-settings/shared.shift.setting.module';

@NgModule({
  imports: [
    CommonModule,
    ConfirmDialogModule,
    DassSharedModule,
    FormsModule,
    AutoCompleteModule,
    PlantAutoCompleteModule,
    ListboxModule,
    ModalModule.forRoot(),
    PickListModule,
    LaborRoutingModule,
    TooltipModule,
    TreeModule,
    ColorPickerModule,
    SharedShiftSettingsModule
    // ImageModule,
  ],
  declarations: [
    CountryCityTemplateComponent,
  ],
  providers: [
    ConfirmationService,
  ]
})
export class LaborModule {
}
