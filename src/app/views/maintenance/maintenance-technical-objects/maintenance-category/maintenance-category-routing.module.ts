/**
 * Created by reis on 29.07.2019.
 */
import {RouterModule, Routes} from '@angular/router';
import {MaintenanceCategoryListComponent} from './list/list.component';

const routes: Routes = [
  {
    path: '', data: {title: 'maintenance-category'},
    children: [
      {path: '', component: MaintenanceCategoryListComponent, data: {title: 'maintenance-category'}}
    ]
  }
];

export const MaintenanceCategoryModuleRoutes = RouterModule.forChild(routes);
