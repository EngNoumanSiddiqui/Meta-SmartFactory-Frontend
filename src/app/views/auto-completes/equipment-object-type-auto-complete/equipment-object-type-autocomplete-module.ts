import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DassSharedModule} from '../../../shared/dass-shared.module';

import {AutoCompleteModule} from 'primeng';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {EquipmentObjectTypeAutoCompleteComponent} from './equipment-object-type-auto-complete.component';
import {EquipmentObjectTypesService} from '../../../services/dto-services/maintenance-equipment/object-types.service';

@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    ButtonModule,
    FormsModule,
    AutoCompleteModule
  ],
  declarations: [
    EquipmentObjectTypeAutoCompleteComponent,
  ],
  exports: [
    EquipmentObjectTypeAutoCompleteComponent,
  ]
  ,
  providers: [
    EquipmentObjectTypesService
  ]
})
export class EquipmentObjectTypeAutoCompleteModule {
}
