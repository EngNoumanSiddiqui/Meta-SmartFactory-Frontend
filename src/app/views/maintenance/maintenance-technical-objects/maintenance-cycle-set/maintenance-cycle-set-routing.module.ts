/**
 * Created by reis on 29.07.2019.
 */
import {RouterModule, Routes} from '@angular/router';
import {MaintenanceCycleSetListComponent} from './list/list.component';

const routes: Routes = [
  {
    path: '', data: {title: 'maintenance-cycle-set'},
    children: [
      {path: '', component: MaintenanceCycleSetListComponent, data: {title: 'maintenance-cycle-set'}}
    ]
  }
];

export const MaintenanceCycleSetModuleRoutes = RouterModule.forChild(routes);
