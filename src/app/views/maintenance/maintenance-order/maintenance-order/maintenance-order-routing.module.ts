/**
 * Created by reis on 29.07.2019.
 */
import {RouterModule, Routes} from '@angular/router';
import {MaintenanceOrderListComponent} from './list/list.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '', data: {title: 'maintenance-order'},
    children: [
      {path: '', component: MaintenanceOrderListComponent, data: {title: 'maintenance-order'}}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintenanceOrderModuleRoutes {}
