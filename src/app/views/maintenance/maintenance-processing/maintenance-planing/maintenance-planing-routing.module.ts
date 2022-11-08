import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MaintenancePlaningListComponent} from './maintenance-planing-list/maintenance-planing-list.component';


const routes: Routes = [
  {path: '', component: MaintenancePlaningListComponent, data: {title: 'maintenance-plan'}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintenancePlaningRoutingModule { }
