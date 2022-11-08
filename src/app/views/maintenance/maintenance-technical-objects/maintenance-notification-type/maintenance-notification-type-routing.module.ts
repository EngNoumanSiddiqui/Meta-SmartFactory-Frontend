/**
 * Created by reis on 29.07.2019.
 */
import {RouterModule, Routes} from '@angular/router';
import {MaintenanceNotificationTypeListComponent} from './list/list.component';

const routes: Routes = [
  {
    path: '', data: {title: 'maintenance-notification-type'},
    children: [
      {path: '', component: MaintenanceNotificationTypeListComponent, data: {title: 'maintenance-notification-type'}}
    ]
  }
];

export const MaintenanceNotificationTypeModuleRoutes = RouterModule.forChild(routes);
