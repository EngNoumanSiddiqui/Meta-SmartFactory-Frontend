/**
 * Created by reis on 29.07.2019.
 */
import {RouterModule, Routes} from '@angular/router';
import {EquipmentOperationListComponent} from './list/list.component';

const routes: Routes = [
  {
    path: '', data: {title: 'equipment-operation'},
    children: [
      {path: '', component: EquipmentOperationListComponent, data: {title: 'equipment-operation'}}
    ]
  }
];

export const EquipmentOperationModuleRoutes = RouterModule.forChild(routes);
