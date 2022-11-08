/**
 * Created by reis on 29.07.2019.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CheckboxModule, ConfirmDialogModule, KeyFilterModule, TooltipModule} from 'primeng';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {DassSharedModule} from '../../../../shared/dass-shared.module';
import {MaintenanceStrategyModuleRoutes} from './maintenance-strategy-routing.module';
import {SharedMaintenanceStrategyModule} from './shared-maintenance-strategy.module';
import {MaintenanceStrategyListComponent} from './list/list.component';
import {MaintenanceStrategyService} from '../../../../services/dto-services/maintenance-equipment/maintenance-strategy.service';
import {EditMaintenanceStrategyComponent} from './edit/edit.component';
import { UnitAutoCompleteModule } from 'app/views/auto-completes/unit-auto-complete/unit-autocomplete-module';


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
    MaintenanceStrategyModuleRoutes,
    SharedMaintenanceStrategyModule,
    UnitAutoCompleteModule
  ],
  declarations: [MaintenanceStrategyListComponent, EditMaintenanceStrategyComponent],
  providers: [MaintenanceStrategyService]
})
export class MaintenanceStrategyModule {
}
