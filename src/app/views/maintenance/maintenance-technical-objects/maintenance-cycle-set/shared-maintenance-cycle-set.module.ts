/**
 * Created by reis on 29.07.2019.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TooltipModule, ConfirmDialogModule} from 'primeng';
import {FormsModule} from '@angular/forms';
import {DassSharedModule} from '../../../../shared/dass-shared.module';
import {NewMaintenanceCycleSetComponent} from './new/new.component';
import {MaintenanceStrategyService} from '../../../../services/dto-services/maintenance-equipment/maintenance-strategy.service';
import { MaintenanceCategoryService } from '../../../../services/dto-services/maintenance-equipment/maintenance-category.service';
import { MaintenanceStrategyPackageService } from '../../../../services/dto-services/maintenance/maintenance-strategy-package.service';
import { MaintenanceCycleSetDetailComponent } from './detail/detail.component';
import {UnitAutoCompleteModule} from '../../../auto-completes/unit-auto-complete/unit-autocomplete-module';
@NgModule({
  imports: [
    CommonModule,
    ConfirmDialogModule,
    DassSharedModule,
    FormsModule,
    TooltipModule,
    UnitAutoCompleteModule
  ],
  declarations: [NewMaintenanceCycleSetComponent, MaintenanceCycleSetDetailComponent],
  exports: [NewMaintenanceCycleSetComponent, MaintenanceCycleSetDetailComponent],
  providers: [MaintenanceStrategyService, MaintenanceCategoryService, MaintenanceStrategyPackageService]
})
export class SharedMaintenanceCycleSetModule {
}
