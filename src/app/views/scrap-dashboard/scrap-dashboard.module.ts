import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ScrapDashboardComponent} from './scrap-dashboard.component';
import {ScrapDashboardRoutingModule} from './scrap-dashboard-routing.module';
import {ScrapCausesComponent} from './components/scrap-causes/scrap-causes.component';
import {DassSharedModule} from '../../shared/dass-shared.module';
import {FormsModule} from '@angular/forms';
import { DailyScrapGraphComponent } from './components/daily-scrap-gaph/daily-scrap-graph.component';
import { MaterialScrapListComponent } from './components/material-scrap-list/material-scrap-list.component';
import { MaterialScrapGraphComponent } from './components/material-scrap-graph/material-scrap-graph.component';
import {WorkstationAutoCompleteComponent} from '../auto-completes/ws-auto-complete/workstation-auto-complete.component';
import {WorkStationAutoCompleteModule} from '../auto-completes/ws-auto-complete/workstation-autocomplete-module';
import {PlantAutoCompleteModule} from '../auto-completes/plant-auto-complete/plant-autocomplete-module';
import {WorkCenterAutocompleteModule} from '../auto-completes/workcenter-auto-complete/workcenter-autocomplete-module';


@NgModule({
  declarations: [ScrapDashboardComponent, ScrapCausesComponent, DailyScrapGraphComponent, MaterialScrapListComponent, MaterialScrapGraphComponent],
  imports: [
    CommonModule,
    FormsModule,
    DassSharedModule,
    ScrapDashboardRoutingModule,
    WorkStationAutoCompleteModule,
    PlantAutoCompleteModule,
    WorkCenterAutocompleteModule
  ]
})
export class ScrapDashboardModule {
}
