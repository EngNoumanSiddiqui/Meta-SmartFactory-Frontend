/**
 * Created by reis on 29.07.2019.
 */
import {RouterModule, Routes} from '@angular/router';
import {WorkstationProgramListComponent} from './list/list.component';

const routes: Routes = [
  {
    path: '', data: {title: 'product-tree-criteria'},
    children: [
      {path: '', component: WorkstationProgramListComponent, data: {title: 'product-tree-criteria'}}
    ]
  }
];

export const WorkstationProgramModuleRoutes = RouterModule.forChild(routes);
