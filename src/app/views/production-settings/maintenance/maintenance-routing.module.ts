import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NewMaintenanceComponent} from './new/new.component';
import {EditMaintenanceComponent} from './edit/edit.component';
import {DetailMaintenanceComponent} from './detail/detail.component';
import {ListMaintenanceComponent} from './list/list.component';

const routes: Routes = [
  {
    path: '', data: {title: 'maintenance'},
    children: [
      {path: 'new', component: NewMaintenanceComponent, data: {title: 'new-maintenance'}},
      {path: 'edit/:id', component: EditMaintenanceComponent, data: {title: 'edit-maintenance'}},
      {path: 'detail/:id', component: DetailMaintenanceComponent, data: {title: 'maintenance-detail'}},
      {path: '', component: ListMaintenanceComponent, data: {title: 'maintenance'}}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintenanceRoutingModule {
}
