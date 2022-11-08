/**
 * Created by reis on 29.07.2019.
 */
import {RouterModule, Routes} from '@angular/router';
import {AbcIndicatorListComponent} from './list/list.component';

const routes: Routes = [
  {
    path: '', data: {title: 'abc-indicator'},
    children: [
      {path: '', component: AbcIndicatorListComponent, data: {title: 'abc-indicator'}}
    ]
  }
];

export const EquipmentAbcIndicatorModuleRoutes = RouterModule.forChild(routes);
