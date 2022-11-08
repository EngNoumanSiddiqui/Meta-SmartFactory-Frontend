import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { StopListComponent } from "./list/stop-list.component";

const routes: Routes = [
    { path: '', redirectTo: 'list', pathMatch: 'full' },
    { path: 'list', component: StopListComponent, data: {title: 'stop-list'} }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StopListRoutingModule {
}