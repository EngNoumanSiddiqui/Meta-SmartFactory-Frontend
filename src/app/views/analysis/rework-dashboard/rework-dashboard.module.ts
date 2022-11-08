import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ScrapCausesComponent} from './components/scrap-causes/scrap-causes.component';
import {FormsModule} from '@angular/forms';
import { DailyReworkGraphComponent } from './components/daily-rework-gaph/daily-rework-graph.component';
import { MaterialReworkListComponent } from './components/material-rework-list/material-rework-list.component';
import { MaterialReworkGraphComponent } from './components/material-rework-graph/material-rework-graph.component';
import { ReworkDashboardComponent } from './rework-dashboard.component';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import { ReworkDashboardRoutingModule } from './rework-dashboard-routing.module';
import { WorkStationAutoCompleteModule } from 'app/views/auto-completes/ws-auto-complete/workstation-autocomplete-module';
import { WorkCenterAutocompleteModule } from 'app/views/auto-completes/workcenter-auto-complete/workcenter-autocomplete-module';


@NgModule({
  declarations: [
    ReworkDashboardComponent, 
    ScrapCausesComponent, 
    DailyReworkGraphComponent, 
    MaterialReworkListComponent, 
    MaterialReworkGraphComponent],
  imports: [
    CommonModule,
    FormsModule,
    DassSharedModule,
    ReworkDashboardRoutingModule,
    WorkStationAutoCompleteModule,
    WorkCenterAutocompleteModule
  ]
})
export class ReworkDashboardModule {
}
