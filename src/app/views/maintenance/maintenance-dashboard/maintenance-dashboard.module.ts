import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DassSharedModule} from '../../../shared/dass-shared.module';
import {FormsModule} from '@angular/forms';
import {WorkStationAutoCompleteModule} from '../../auto-completes/ws-auto-complete/workstation-autocomplete-module';
import {PlantAutoCompleteModule} from '../../auto-completes/plant-auto-complete/plant-autocomplete-module';
import {WorkCenterAutocompleteModule} from '../../auto-completes/workcenter-auto-complete/workcenter-autocomplete-module';
import {CardModule} from 'primeng/card';
import {MaintenanceDashboardComponent} from './maintenance-dashboard.component';
import {MaintenanceDashboardRoutingModule} from './maintenance-dashboard-routing.module';
import {MonthlyMttrBarGraphComponent} from './components/monthly-mttr-bar-graph/monthly-mttr-bar-graph.component';
import {MonthlyMttrLineGraphComponent} from './components/monthly-mttr-line-graph/monthly-mttr-line-graph.component';
import {MonthlyMtbfBarGraphComponent} from './components/monthly-mtbf-bar-graph/monthly-mtbf-bar-graph.component';
import {MonthlyMtbfLineGraphComponent} from './components/monthly-mtbf-line-graph/monthly-mtbf-line-graph.component';
import {EmployeeAutoCompleteModule} from '../../auto-completes/employee-auto-complete/employee-autocomplete-module';


@NgModule({
  declarations: [
    MaintenanceDashboardComponent,
    MonthlyMttrBarGraphComponent,
    MonthlyMttrLineGraphComponent,
    MonthlyMtbfBarGraphComponent,
    MonthlyMtbfLineGraphComponent],
  imports: [
    CommonModule,
    FormsModule,
    DassSharedModule,
    MaintenanceDashboardRoutingModule,
    WorkStationAutoCompleteModule,
    PlantAutoCompleteModule,
    WorkCenterAutocompleteModule,
    CardModule,
    EmployeeAutoCompleteModule
  ]
})
export class MaintenanceDashboardModule {
}
