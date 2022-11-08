/**
 * Created by reis on 29.07.2019.
 */
import {RouterModule, Routes} from '@angular/router';
import {CodeGroupItemListComponent} from './list/list.component';

const routes: Routes = [
  {
    path: '', data: {title: 'catalog-profile'},
    children: [
      {path: '', component: CodeGroupItemListComponent, data: {title: 'catalog-profile'}}
    ]
  }
];

export const EquipmentCodeGroupItemModuleRoutes = RouterModule.forChild(routes);
