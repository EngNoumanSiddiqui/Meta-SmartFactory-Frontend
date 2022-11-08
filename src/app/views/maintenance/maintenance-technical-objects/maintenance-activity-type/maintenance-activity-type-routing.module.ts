/**
 * Created by reis on 29.07.2019.
 */
import {RouterModule, Routes} from '@angular/router';
import {MaintenanceActivityTypeListComponent} from './list/list.component';

const routes: Routes = [
  {
    path: '', data: {title: 'maintenance-activity-type'},
    children: [
      {path: '', component: MaintenanceActivityTypeListComponent, data: {title: 'maintenance-activity-type'}}
    ]
  }
];

export const MaintenanceActivityTypeModuleRoutes = RouterModule.forChild(routes);
