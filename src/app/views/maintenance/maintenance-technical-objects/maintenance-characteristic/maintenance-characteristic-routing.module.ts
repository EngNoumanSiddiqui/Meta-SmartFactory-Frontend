/**
 * Created by reis on 29.07.2019.
 */
import {RouterModule, Routes} from '@angular/router';
import {ListCharacteristicComponent} from './list/list.component';

const routes: Routes = [
  {
    path: '', data: {title: 'maintenance-characteristic'},
    children: [
      {path: '', component: ListCharacteristicComponent, data: {title: 'maintenance-characteristic'}}
    ]
  }
];

export const MaintenanceCharacteristicModuleRoutes = RouterModule.forChild(routes);
