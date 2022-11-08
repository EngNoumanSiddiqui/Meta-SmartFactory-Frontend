import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DassSharedModule} from '../../../shared/dass-shared.module';

import {AutoCompleteModule} from 'primeng';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {EquipmentAutoCompleteComponent} from './equipment-auto-complete.component';
import {EquipmentService} from '../../../services/dto-services/equipment/equipment.service';

@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,

    ButtonModule,
    FormsModule,
    AutoCompleteModule
  ],
  declarations: [
    EquipmentAutoCompleteComponent,
  ],
  exports: [
    EquipmentAutoCompleteComponent,
  ]
  ,
  providers: [
    EquipmentService
  ]
})
export class EquipmentAutoCompleteModule {
}
