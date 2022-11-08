import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { ListProductionMonitoringComponent } from "./production-monitoring/list.component";
import { JobOrderAutoSchedulerComponent } from "./schedular/auto-scheduler/joborder-auto-scheduler.component";
import { LaborAutoSchedulerComponent } from "./schedular/labor-auto-scheduler/labor-auto-scheduler.component";
import { CalendarModule, ConfirmDialogModule, ChipsModule } from "primeng";
import { DassSharedModule } from "app/shared/dass-shared.module";
import { FormsModule } from "@angular/forms";
import { ModalModule } from "ngx-bootstrap/modal";
import { EquipmentAutoCompleteModule } from "app/views/auto-completes/equipment-auto-complete/equipment-autocomplete-module";
import { WorkStationAutoCompleteModule } from "app/views/auto-completes/ws-auto-complete/workstation-autocomplete-module";
import { EmployeeAutoCompleteModule } from "app/views/auto-completes/employee-auto-complete/employee-autocomplete-module";
import { JobOrderAutoCompleteModule } from "app/views/auto-completes/job-order-auto-complete/job-order-autocomplete.module";
import { EventEditComponent } from "./schedular/event-edit-component/event-edit-component";
import { WorkCenterAutocompleteModule } from "app/views/auto-completes/workcenter-auto-complete/workcenter-autocomplete-module";
import { MySchedulerModule } from "app/components/scheduler/scheduler.module";
import { MaintenanceOrderService } from "app/services/dto-services/maintenance-equipment/maintenance-order.service";
import { JobOrderServiceStatic } from "app/services/dto-services/job-order/job-order-static.service";
import { ScheduleReportService } from "app/services/dto-services/schedule-report/schedule-report.service";
import { ProjectAutoSchedulerComponent } from "./schedular/project-auto-scheduler/project-auto-scheduler.component";
import { ProjectService } from "app/services/dto-services/project/project.service";
import { ProjectStaticService } from "app/services/dto-services/project/project-static.service";
import { ByMilestoneComponent } from "./schedular/project-auto-scheduler/by-milestone/by-milestone.component";
import { ByProdOrdersComponent } from "./schedular/project-auto-scheduler/by-prod-orders/by-prod-orders.component";
import { ByProjectsComponent } from "./schedular/project-auto-scheduler/by-projects/by-projects.component";
import { ByAllComponent } from "./schedular/project-auto-scheduler/by-all/by-all.component";
import { DhtmlGanttChartModule } from "app/shared/dhtml-gantt-chart/dhtml-gantt-chart.module";
import { MaterialHandlingSimulationComponent } from "./material-handling-simulation/material-handling-simulation.component";
import { SimulationManagementComponent } from "./simulation-management/simulation-management.component";
import { AddSimulationComponent } from "./add-simulation/add-simulation.component";
import { SimulationAddShiftComponent } from "./simulation-add-shift/simulation-add-shift.component";
import { WorkCenterCalendarModule } from "app/views/general-settings/workcenter-calendar/workcenter-calendar.module";
import { SimulationAddCapacityComponent } from "./simulation-add-capacity/simulation-add-capacity.component";
import { UnitAutoCompleteModule } from "app/views/auto-completes/unit-auto-complete/unit-autocomplete-module";

const routes: Routes = [
  {
    path: "",
    data: { title: "advance-manufacturing-planning" },
    children: [
      {
        path: "production-monitoring",
        component: ListProductionMonitoringComponent,
        data: { title: "real-time-production-monitoring" },
      },
      {
        path: "job-order-auto-scheduler",
        component: JobOrderAutoSchedulerComponent,
        data: { title: "production-auto-schedule" },
      },
      {
        path: "labor-auto-scheduler",
        component: LaborAutoSchedulerComponent,
        data: { title: "labor-auto-schedule" },
      },
      {
        path: "project-auto-scheduler",
        component: ProjectAutoSchedulerComponent,
        data: { title: "project-auto-schedule" },
      },
      {
        path: "material-handling-simulation",
        component: MaterialHandlingSimulationComponent,
        data: { title: "material-handling-simulation" },
      },
      {
        path: "simulation-management",
        component: SimulationManagementComponent,
        data: { title: "simulation-management" },
      },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CalendarModule,
    ConfirmDialogModule,
    DassSharedModule,
    FormsModule,
    ModalModule.forRoot(),
    ChipsModule,
    EquipmentAutoCompleteModule,
    WorkStationAutoCompleteModule,
    WorkCenterAutocompleteModule,
    EmployeeAutoCompleteModule,
    JobOrderAutoCompleteModule,
    MySchedulerModule,
    DhtmlGanttChartModule,
    WorkCenterCalendarModule,
    UnitAutoCompleteModule
  ],
  declarations: [
    ListProductionMonitoringComponent,
    JobOrderAutoSchedulerComponent,
    LaborAutoSchedulerComponent,
    ProjectAutoSchedulerComponent,
    ByMilestoneComponent,
    ByProdOrdersComponent,
    ByProjectsComponent,
    ByAllComponent,
    EventEditComponent,
    MaterialHandlingSimulationComponent,
    SimulationManagementComponent,
    AddSimulationComponent,
    SimulationAddShiftComponent,
    SimulationAddCapacityComponent
  ],
  providers: [
    JobOrderServiceStatic,
    MaintenanceOrderService,
    ScheduleReportService,
    ProjectStaticService,
    ProjectService,
  ],
})
export class AdvanceManufacturingModule {}
