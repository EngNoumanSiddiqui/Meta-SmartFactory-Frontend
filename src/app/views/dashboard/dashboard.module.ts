import {NgModule} from '@angular/core';

import {DashboardComponent} from './dashboard.component';
import {DashboardRoutingModule} from './dashboard-routing.module';
import {FormsModule} from '@angular/forms';

import {DassSharedModule} from 'app/shared/dass-shared.module';
import {RatingModule, SidebarModule, TooltipModule, TreeTableModule} from 'primeng';
import {CommonModule} from '@angular/common';
import {TableModule} from 'primeng/table';
import {OeeLoosesByShiftComponent} from './components/oee-looses-by-shift/oee-looses-by-shift.component';
import {ProductionByJobOrderComponent} from './components/production-by-joborder/production-by-job-order.component';
import {OeeByWorkstationComponent} from './components/oee-by-workstation/oee-by-workstation.component';
import {WorkstationsStatusComponent} from './components/workstations-status/workstations-status.component';
import {ProductionAnalysisComponent} from './components/production-analysis/production-analysis.component';
import {WorkStationAutoCompleteModule} from '../auto-completes/ws-auto-complete/workstation-autocomplete-module';
import {PlantAutoCompleteModule} from '../auto-completes/plant-auto-complete/plant-autocomplete-module';
import {WorkCenterAutocompleteModule} from '../auto-completes/workcenter-auto-complete/workcenter-autocomplete-module';
import {WorkstationDashboardService} from '../../services/dto-services/workstation/workstation-dashboard.service';
import { WorkstationsStateComponent } from './components/workstations-state/workstations-state.component';
import { JobOrderServiceStatic } from 'app/services/dto-services/job-order/job-order-static.service';
import { ServiceLocator } from 'app/services/dto-services/job-order/service-location.service';
import { Injector } from '@angular/core';

@NgModule({
  imports: [
    DashboardRoutingModule,
    FormsModule,
    DassSharedModule,
    RatingModule,
    TooltipModule,
    CommonModule,
    SidebarModule,
    TableModule,
    TreeTableModule,
    WorkStationAutoCompleteModule,
    PlantAutoCompleteModule,
    WorkCenterAutocompleteModule,
  ],
  providers: [WorkstationDashboardService, JobOrderServiceStatic],
  declarations: [
    DashboardComponent,
    OeeLoosesByShiftComponent,
    ProductionByJobOrderComponent,
    OeeByWorkstationComponent,
    WorkstationsStatusComponent,
    ProductionAnalysisComponent,
    WorkstationsStateComponent
  ]
})
export class DashboardModule {
  constructor(private injector: Injector){    // Create global Service Injector.
    ServiceLocator.injector = this.injector;
  }
}
