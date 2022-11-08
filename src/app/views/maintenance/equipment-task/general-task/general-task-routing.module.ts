/**
 * Created by reis on 29.07.2019.
 */
import {RouterModule, Routes} from '@angular/router';
import {EquipmentTaskListComponent} from './list/list.component';

const routes: Routes = [
  {
    path: '', data: {title: 'equipment-task'},
    children: [
      {path: '', component: EquipmentTaskListComponent, data: {title: 'equipment-task'}}
    ]
  }
];

export const GeneralTaskModuleRoutes = RouterModule.forChild(routes);
