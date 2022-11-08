import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DassSharedModule} from '../../../shared/dass-shared.module';
import {AutoCompleteModule} from 'primeng';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {AbcIndicatorAutoCompleteComponent} from './abc-indicator-auto-complete.component';
import {EquipmentAbcIndicatorService} from '../../../services/dto-services/maintenance-equipment/abc-indicator.service';
import {SharedAbcIndicatorModule} from '../../maintenance/equipment-technical-objects/abc-indicator/shared-abc-indicator-module';

@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    ButtonModule,
    FormsModule,
    AutoCompleteModule,
    ModalModule.forRoot(),
    SharedAbcIndicatorModule
  ],
  declarations: [
    AbcIndicatorAutoCompleteComponent,
  ],
  exports: [
    AbcIndicatorAutoCompleteComponent,
  ]
  ,
  providers: [EquipmentAbcIndicatorService

  ]
})
export class AbcIndicatorAutoCompleteModule {
}
