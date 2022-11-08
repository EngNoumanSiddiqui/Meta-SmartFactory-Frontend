/**
 * Created by reis on 29.07.2019.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CheckboxModule, ConfirmDialogModule, KeyFilterModule, TooltipModule} from 'primeng';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {DassSharedModule} from '../../../../shared/dass-shared.module';
import {EditAbcIndicatorComponent} from './edit/edit.component';
import {EquipmentAbcIndicatorModuleRoutes} from './abc-indicator-routing.module';
import {AbcIndicatorListComponent} from './list/list.component';
import {EquipmentAbcIndicatorService} from '../../../../services/dto-services/maintenance-equipment/abc-indicator.service';
import {SharedAbcIndicatorModule} from './shared-abc-indicator-module';


@NgModule({
  imports: [
    CheckboxModule,
    ConfirmDialogModule,
    CommonModule,
    DassSharedModule,
    FormsModule,
    ModalModule.forRoot(),
    TooltipModule,
    KeyFilterModule,
    SharedAbcIndicatorModule,
    EquipmentAbcIndicatorModuleRoutes
  ],
  declarations: [AbcIndicatorListComponent, EditAbcIndicatorComponent ],
  providers: [EquipmentAbcIndicatorService]
})
export class EquipmentAbcIndicatorModule {
}
