/**
 * Created by reis on 29.07.2019.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CheckboxModule, ConfirmDialogModule, KeyFilterModule, TooltipModule} from 'primeng';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {DassSharedModule} from '../../../../shared/dass-shared.module';
import {MaintenanceCycleSetListComponent} from './list/list.component';
import {MaintenanceStrategyService} from '../../../../services/dto-services/maintenance-equipment/maintenance-strategy.service';
import {EditMaintenanceCycleSetComponent} from './edit/edit.component';
import { UnitAutoCompleteModule } from 'app/views/auto-completes/unit-auto-complete/unit-autocomplete-module';
import { MaintenanceCycleSetModuleRoutes } from './maintenance-cycle-set-routing.module';
import { SharedMaintenanceCycleSetModule } from './shared-maintenance-cycle-set.module';


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
    MaintenanceCycleSetModuleRoutes,
    SharedMaintenanceCycleSetModule,
    UnitAutoCompleteModule
  ],
  declarations: [MaintenanceCycleSetListComponent, EditMaintenanceCycleSetComponent],
  providers: [MaintenanceStrategyService]
})
export class MaintenanceCycleSetModule {
}
