/**
 * Created by reis on 29.07.2019.
 */
import {RouterModule, Routes} from '@angular/router';
import {CodeGroupListComponent} from './list/list.component';

const routes: Routes = [
  {
    path: '', data: {title: 'catalog'},
    children: [
      {path: '', component: CodeGroupListComponent, data: {title: 'catalog'}}
    ]
  }
];

export const EquipmentCodeGroupModuleRoutes = RouterModule.forChild(routes);
