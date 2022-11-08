/**
 * Created by reis on 29.07.2019.
 */
import {RouterModule, Routes} from '@angular/router';
import {MaintenanceSystemConditionListComponent} from './list/list.component';

const routes: Routes = [
  {
    path: '', data: {title: 'maintenance-system-condition'},
    children: [
      {path: '', component: MaintenanceSystemConditionListComponent, data: {title: 'maintenance-system-condition'}}
    ]
  }
];

export const MaintenanceSystemConditionModuleRoutes = RouterModule.forChild(routes);
