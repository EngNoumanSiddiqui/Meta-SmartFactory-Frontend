import {FormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {DassSharedModule} from '../../../shared/dass-shared.module';
import {CommonModule} from '@angular/common';
import {MeasuringRoutingModule} from './measuring-routing.module';
import {MaintenanceSensorDataComponent} from './maintenance-sensor-data/maintenance-sensor-data.component';
import {EquipmentAutoCompleteModule} from '../../auto-completes/equipment-auto-complete/equipment-autocomplete-module';
import {EquipmentMonitoringModule} from "../../monitoring-equipment/equipment-monitoring.module";
import {WorkStationAutoCompleteModule} from "../../auto-completes/ws-auto-complete/workstation-autocomplete-module";
@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    FormsModule,
    MeasuringRoutingModule,
    EquipmentAutoCompleteModule,
    EquipmentMonitoringModule,
    WorkStationAutoCompleteModule
  ],
  declarations: [
    MaintenanceSensorDataComponent
  ],
  providers: []
})
export class MeasuringModule {
}
