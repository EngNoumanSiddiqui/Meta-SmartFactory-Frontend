import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DassSharedModule} from '../../../shared/dass-shared.module';

import {AutoCompleteModule} from 'primeng';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {CharacteristicAutoCompleteComponent} from './characteristic-auto-complete.component';
import {CharacteristicService} from '../../../services/dto-services/maintenance-equipment/characteristic.service';
import {SharedCharacteristicModule} from '../../maintenance/maintenance-technical-objects/maintenance-characteristic/shared-maintenance-characteristic-module';
import {ModalModule} from 'ngx-bootstrap/modal';

@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    ButtonModule,
    FormsModule,
    AutoCompleteModule,
    ModalModule.forRoot(),
    SharedCharacteristicModule
  ],
  declarations: [
    CharacteristicAutoCompleteComponent,
  ],
  exports: [
    CharacteristicAutoCompleteComponent,
  ]
  ,
  providers: [
    CharacteristicService
  ]
})
export class CharacteristicAutoCompleteModule {
}
