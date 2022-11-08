/**
 * Created by reis on 29.07.2019.
 */
import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CategoryListComponent} from './list/list.component';

const routes: Routes = [
  {
    path: '', data: {title: 'category'},
    children: [
      {path: '', component: CategoryListComponent, data: {title: 'category'}}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EquipmentCategoryModuleRoutes {}
// export const EquipmentCategoryModuleRoutes = RouterModule.forChild(routes);
