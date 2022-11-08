/**
 * Created by reis on 29.07.2019.
 */
import {RouterModule, Routes} from '@angular/router';
import {ProductTreeCriteriaListComponent} from './list/list.component';

const routes: Routes = [
  {
    path: '', data: {title: 'product-tree-criteria'},
    children: [
      {path: '', component: ProductTreeCriteriaListComponent, data: {title: 'product-tree-criteria'}}
    ]
  }
];

export const ProductTreeCriteriaModuleRoutes = RouterModule.forChild(routes);
