/**
 * Created by reis on 29.07.2019.
 */
import {Routes, RouterModule} from '@angular/router';

const routes: Routes = [
  {
    path: '', data: {title: 'equipment-technical'},
    children: [
      {path: 'planner-group', loadChildren: () => import('./planner-group/planner-group.module').then(m => m.EquipmentPlannerGroupModule)},
      {path: 'codegroupheader', loadChildren: () => import('./code-group-header/code-group-header.module').then(m => m.EquipmentCodeGroupHeaderModule)},
      {path: 'codegroup', loadChildren: () => import('./code-group/code-group.module').then(m => m.EquipmentCodeGroupModule)},
      {path: 'category', loadChildren: () => import('./category/category.module').then(m => m.EquipmentCategoryModule)},
      {path: 'objecttypes', loadChildren: () => import('./object-types/object-types.module').then(m => m.EquipmentObjectTypesModule)},
      {path: 'abcindicator', loadChildren: () => import('./abc-indicator/abc-indicator.module').then(m => m.EquipmentAbcIndicatorModule)},
      {path: 'codegroupitems', loadChildren: () => import('./code-group-item/code-group-item.module').then(m => m.EquipmentCodeGroupItemModule)},
      {path: 'functional-location', loadChildren: () => import('./functional-location/functional-location.module').then(m => m.FunctionalLocationModule)},
      {path: 'equipment-operation', loadChildren: () => import('./equipment-operation/equipment-operation.module').then(m => m.EquipmentOperationModule)},
      {path: 'external-service', loadChildren: () => import('./external-service/external-service.module').then(m => m.ExternalServiceModule)},
      {path: 'equipments', loadChildren: () => import('./equipment/equipment.module').then(m => m.EquipmentsModule)},
    ]
  }
];

export const EquipmentTechnicalModuleRoutes = RouterModule.forChild(routes);
