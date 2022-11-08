/**
 * Created by reis on 29.07.2019.
 */
import {Routes, RouterModule} from '@angular/router';
import {ListEquipmentPlannerGroupComponent} from './list/planner-group-list.component';

const routes: Routes = [
  {
    path: '', data: {title: 'planer-group'},
    children: [
      {path: '', component: ListEquipmentPlannerGroupComponent, data: {title: 'equipment-planner-group'}}
    ]
  }
];

export const PlannerGroupModuleRoutes = RouterModule.forChild(routes);
