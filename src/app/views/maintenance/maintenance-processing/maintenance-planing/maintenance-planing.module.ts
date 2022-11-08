import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaintenancePlaningRoutingModule } from './maintenance-planing-routing.module';
import {DassSharedModule} from '../../../../shared/dass-shared.module';
import { MaintenancePlaningListComponent } from './maintenance-planing-list/maintenance-planing-list.component';
import { MaintenancePlaningNewComponent } from './maintenance-planing-new/maintenance-planing-new.component';
import { MaintenancePlaningEditComponent } from './maintenance-planing-edit/maintenance-planing-edit.component';
import {FormsModule} from '@angular/forms';
import {CalendarModule, CheckboxModule, ConfirmDialogModule, KeyFilterModule, TooltipModule} from 'primeng';
import {ModalModule} from 'ngx-bootstrap/modal';
import {MaintenanceActivityTypeAutoCompleteModule} from '../../../auto-completes/maintenance-activity-type-auto-complete/maintenance-activity-type-autocomplete-module';
import { MaintenanceSharedModule } from '../../maintenance-shared.module';
import { UnitAutoCompleteModule } from 'app/views/auto-completes/unit-auto-complete/unit-autocomplete-module';
import { EquipmentAutoCompleteModule } from 'app/views/auto-completes/equipment-auto-complete/equipment-autocomplete-module';
import { WorkStationAutoCompleteModule } from 'app/views/auto-completes/ws-auto-complete/workstation-autocomplete-module';
import { PlantAutoCompleteModule } from 'app/views/auto-completes/plant-auto-complete/plant-autocomplete-module';
import { EquipmentTaskService } from 'app/services/dto-services/maintenance-equipment/equipment-task.service';
import { ScheduleCallModule } from '../schedule-call/schedule-call.module';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
import { MaintenanceOrderTypeAutoCompleteModule } from 'app/views/auto-completes/maintenance-order-type-auto-complete/maintenance-order-type-autocomplete-module';
import { GeneralTaskModule } from '../../equipment-task/general-task/general-task.module';

@NgModule({
  declarations: [MaintenancePlaningListComponent, MaintenancePlaningNewComponent, MaintenancePlaningEditComponent],
  imports: [
    CommonModule,
    MaintenancePlaningRoutingModule,
    DassSharedModule,
    FormsModule,
    CalendarModule,
    CheckboxModule,
    ConfirmDialogModule,
    ModalModule.forRoot(),
    TooltipModule,
    KeyFilterModule,
    MaintenanceActivityTypeAutoCompleteModule,
    MaintenanceSharedModule,
    UnitAutoCompleteModule,
    EquipmentAutoCompleteModule,
    WorkStationAutoCompleteModule,
    PlantAutoCompleteModule,
    ScheduleCallModule,
    GeneralTaskModule,
    MaintenanceOrderTypeAutoCompleteModule
  ],
  providers: [EquipmentTaskService, EnumService]
})
export class MaintenancePlaningModule { }
