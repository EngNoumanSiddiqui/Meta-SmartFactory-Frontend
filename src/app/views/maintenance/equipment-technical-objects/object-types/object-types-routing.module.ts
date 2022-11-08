/**
 * Created by reis on 29.07.2019.
 */
import {RouterModule, Routes} from '@angular/router';
import {ObjectTypesListComponent} from './list/list.component';

const routes: Routes = [
  {
    path: '', data: {title: 'object-types'},
    children: [
      {path: '', component: ObjectTypesListComponent, data: {title: 'object-types'}}
    ]
  }
];

export const EquipmentObjectTypesModuleRoutes = RouterModule.forChild(routes);
