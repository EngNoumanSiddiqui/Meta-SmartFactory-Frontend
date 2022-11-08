import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CalendarModule, CheckboxModule, ConfirmDialogModule, KeyFilterModule, TooltipModule} from 'primeng';
import {ModalModule} from 'ngx-bootstrap/modal';
import {FormsModule} from '@angular/forms';
import {NewAbcIndicatorComponent} from './new/new.component';
import {EquipmentAbcIndicatorService} from '../../../../services/dto-services/maintenance-equipment/abc-indicator.service';
import {DassSharedModule} from '../../../../shared/dass-shared.module';
import { AbcIndicatorDetailComponent } from './detail/detail.component';


@NgModule({
  imports: [
    CalendarModule,
    CheckboxModule,
    ConfirmDialogModule,
    CommonModule,
    DassSharedModule,
    FormsModule,
    ModalModule.forRoot(),
    TooltipModule,
    KeyFilterModule,

  ],
  declarations: [
    NewAbcIndicatorComponent,
    AbcIndicatorDetailComponent
  ],
  providers: [
    EquipmentAbcIndicatorService
  ],
  exports: [
    NewAbcIndicatorComponent,
    AbcIndicatorDetailComponent
  ]
})
export class SharedAbcIndicatorModule {
}
