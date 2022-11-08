/**
 * Created by reis on 29.07.2019.
 */
import {Routes, RouterModule} from '@angular/router';

const routes: Routes = [
  {
    path: '', data: {title: 'maintenance-processing'},
    children: [
      {path: 'notifications', loadChildren: () => import('./notifications/notifications.module').then(m => m.NotificationsModule)},
      {path: 'maintenance-plan', loadChildren: () => import('./maintenance-planing/maintenance-planing.module').then(m => m.MaintenancePlaningModule)},
      {path: 'maintenance-order', loadChildren: () => import('../maintenance-order/maintenance-order/maintenance-order.module').then(m => m.MaintenanceOrderModule)},
    ]
  }
];

export const MaintenanceProcessingModuleRoutes = RouterModule.forChild(routes);
