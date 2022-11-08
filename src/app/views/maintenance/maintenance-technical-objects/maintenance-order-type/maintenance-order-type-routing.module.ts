/**
 * Created by reis on 29.07.2019.
 */
import {RouterModule, Routes} from '@angular/router';
import {MaintenanceOrderTypeListComponent} from './list/list.component';

const routes: Routes = [
  {
    path: '', data: {title: 'maintenance-order-type'},
    children: [
      {path: '', component: MaintenanceOrderTypeListComponent, data: {title: 'maintenance-order-type'}}
    ]
  }
];

export const MaintenanceOrderTypeModuleRoutes = RouterModule.forChild(routes);
