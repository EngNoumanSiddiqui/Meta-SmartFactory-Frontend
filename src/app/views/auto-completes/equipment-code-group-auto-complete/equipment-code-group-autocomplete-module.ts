import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DassSharedModule} from '../../../shared/dass-shared.module';

import {AutoCompleteModule} from 'primeng';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import { EquipmentCodeGroupAutoCompleteComponent} from './equipment-code-group-auto-complete.component';
import {EquipmentCodeGroupService} from '../../../services/dto-services/maintenance-equipment/code-group.service';

@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,

    ButtonModule,
    FormsModule,
    AutoCompleteModule
  ],
  declarations: [
    EquipmentCodeGroupAutoCompleteComponent,
  ],
  exports: [
    EquipmentCodeGroupAutoCompleteComponent,
  ]
  ,
  providers: [
    EquipmentCodeGroupService
  ]
})
export class EquipmentCodeGroupAutoCompleteModule {
}
