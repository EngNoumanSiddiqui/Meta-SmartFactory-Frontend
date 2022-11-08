/**
 * Created by reis on 29.07.2019.
 */
import {RouterModule, Routes} from '@angular/router';
import {MaintenanceStrategyListComponent} from './list/list.component';

const routes: Routes = [
  {
    path: '', data: {title: 'maintenance-strategy'},
    children: [
      {path: '', component: MaintenanceStrategyListComponent, data: {title: 'maintenance-strategy'}}
    ]
  }
];

export const MaintenanceStrategyModuleRoutes = RouterModule.forChild(routes);
