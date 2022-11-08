import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DassSharedModule} from '../../../shared/dass-shared.module';

import {AutoCompleteModule} from 'primeng';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {CharacteristicDataTypeAutoCompleteComponent} from './characteristic-data-type-auto-complete.component';
import {CharacteristicDataTypeService} from '../../../services/dto-services/maintenance-equipment/characteristic-data-type.service';
import {ModalModule} from 'ngx-bootstrap/modal';

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
    CharacteristicDataTypeAutoCompleteComponent,
  ],
  exports: [
    CharacteristicDataTypeAutoCompleteComponent,
  ]
  ,
  providers: [
    CharacteristicDataTypeService
  ]
})
export class CharacteristicDataTypeAutoCompleteModule {
}
