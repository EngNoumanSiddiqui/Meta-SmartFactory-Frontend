/**
 * Created by reis on 29.07.2019.
 */
import {RouterModule, Routes} from '@angular/router';
import {MaintenanceReasonListComponent} from './list/list.component';

const routes: Routes = [
  {
    path: '', data: {title: 'maintenance-reason'},
    children: [
      {path: '', component: MaintenanceReasonListComponent, data: {title: 'maintenance-reason'}}
    ]
  }
];

export const MaintenanceReasonModuleRoutes = RouterModule.forChild(routes);
