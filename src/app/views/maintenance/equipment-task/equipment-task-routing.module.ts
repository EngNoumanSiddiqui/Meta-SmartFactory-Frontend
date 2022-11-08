/**
 * Created by reis on 29.07.2019.
 */
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: '', data: {title: 'equipment-task'},
    children: [
      {path: 'general-task', loadChildren:() => import('./general-task/general-task.module').then(m => m.GeneralTaskModule)},
    ]
  }
];

export const EquipmentTaskModuleRoutes = RouterModule.forChild(routes);
