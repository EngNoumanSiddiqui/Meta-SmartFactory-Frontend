import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Route, RouterModule } from "@angular/router";
import { WorkCenterCalendarListComponent } from "./list/list.component";
import { WorkCenterCalendarNewComponent } from "./new/new.component";
import { WorkCenterCalendarDetailsComponent } from "./details/details.component";
import { WorkCenterCalendarEditComponent } from "./edit/edit.component";
import { CheckboxModule, ConfirmDialogModule } from "primeng";
import { DassSharedModule } from "app/shared/dass-shared.module";
import { FormsModule } from "@angular/forms";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { ModalModule } from "ngx-bootstrap/modal";
import { WorkStationAutoCompleteModule } from "app/views/auto-completes/ws-auto-complete/workstation-autocomplete-module";
import { WorkCenterAutocompleteModule } from "app/views/auto-completes/workcenter-auto-complete/workcenter-autocomplete-module";

const routes: Route[] = [
  { path: "", redirectTo: "list", pathMatch: "full" },
  {
    path: "list",
    component: WorkCenterCalendarListComponent,
    data: { title: "workcenter-calendar-list" },
  },
  {
    path: "new",
    component: WorkCenterCalendarNewComponent,
    data: { title: "workcenter-calendar-new" },
  },
  {
    path: "details/:id",
    component: WorkCenterCalendarDetailsComponent,
    data: { title: "workcenter-calendar-detail" },
  },
  {
    path: "edit/:id",
    component: WorkCenterCalendarEditComponent,
    data: { title: "workcenter-calendar-edit" },
  },
];
@NgModule({
  imports: [
    CommonModule,
    CheckboxModule,
    ConfirmDialogModule,
    DassSharedModule,
    FormsModule,
    ModalModule.forRoot(),
    TooltipModule,
    WorkStationAutoCompleteModule,
    WorkCenterAutocompleteModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    WorkCenterCalendarNewComponent,
    WorkCenterCalendarDetailsComponent,
    WorkCenterCalendarEditComponent,
    WorkCenterCalendarListComponent,
  ],
  exports: [WorkCenterCalendarNewComponent],
})
export class WorkCenterCalendarModule {}
