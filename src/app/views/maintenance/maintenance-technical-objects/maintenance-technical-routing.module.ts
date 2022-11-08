/**
 * Created by reis on 29.07.2019.
 */
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: '', data: {title: 'category'},
    children: [
      {path: 'characteristic', loadChildren: () => import('./maintenance-characteristic/maintenance-characteristic.module').then(m => m.MaintenanceCharacteristicModule)},
      {path: 'maintenance-strategy', loadChildren: () => import('./maintenance-strategy/maintenance-strategy.module').then(m => m.MaintenanceStrategyModule)},
      {path: 'maintenance-cycle-set', loadChildren: () => import('./maintenance-cycle-set/maintenance-cycle-set.module').then(m => m.MaintenanceCycleSetModule)},
      {path: 'maintenance-category', loadChildren: () => import('./maintenance-category/maintenance-category.module').then(m => m.MaintenanceCategoryModule)},
      {path: 'maintenance-system-condition', loadChildren: () => import('./maintenance-system-condition/maintenance-system-condition.module').then(m => m.MaintenanceSystemConditionModule)},
      // {path: 'maintenance-notification-type', loadChildren: () => import('./maintenance-notification-type/maintenance-notification-type.module').then(m => m.MaintenanceNotificationTypeModule)},
      // {path: 'maintenance-activity-type', loadChildren: () => import('./maintenance-activity-type/maintenance-activity-type.module').then(m => m.MaintenanceActivityTypeModule)},
      // {path: 'maintenance-order-type', loadChildren: () => import('./maintenance-order-type/maintenance-order-type.module').then(m => m.MaintenanceOrderTypeModule)},
      {path: 'maintenance-reason', loadChildren: () => import('./maintenance-reason/maintenance-reason.module').then(m => m.MaintenanceReasonModule)},

    ]
  }
];

export const MaintenanceTechnicalModuleRoutes = RouterModule.forChild(routes);
