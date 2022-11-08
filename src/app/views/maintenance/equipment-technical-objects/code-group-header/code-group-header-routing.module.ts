/**
 * Created by reis on 29.07.2019.
 */
import {RouterModule, Routes} from '@angular/router';
import {CodeGroupHeaderListComponent} from './list/list.component';

const routes: Routes = [
  {
    path: '', data: {title: 'code-group'},
    children: [
      {path: '', component: CodeGroupHeaderListComponent, data: {title: 'code-group'}}
    ]
  }
];

export const EquipmentCodeGroupHeaderModuleRoutes = RouterModule.forChild(routes);
