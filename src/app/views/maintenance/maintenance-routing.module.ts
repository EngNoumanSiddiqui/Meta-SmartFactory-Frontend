/**
 * Created by reis on 29.07.2019.
 */
import {Routes, RouterModule} from '@angular/router';
const routes: Routes = [
  {
    path: '', data: {title: 'plant-maintenance'},
    children: [
      {path: 'equipment-task', loadChildren:() => import('./equipment-task/equipment-task.module').then(m => m.EquipmentTaskModule)},
      {path: 'measuring', loadChildren:() => import('./measuring/measuring.module').then(m => m.MeasuringModule)},
      {path: 'equipment-technical', loadChildren:() => import('./equipment-technical-objects/equipment-technical.module').then(m => m.EquipmentTechnicalModule)},
      {path: 'maintenance-processing', loadChildren:() => import('./maintenance-processing/maintenance-processing.module').then(m => m.MaintenanceProcessingModule)},
      {path: 'maintenance-technical', loadChildren:() => import('./maintenance-technical-objects/maintenance-technical.module').then(m => m.MaintenanceTechnicalModule)},
      {path: 'report', loadChildren: () => import('./maintenance-dashboard/maintenance-dashboard.module').then(m => m.MaintenanceDashboardModule)},
    ]
  }
];

export const MaintenanceModuleRoutes = RouterModule.forChild(routes);
