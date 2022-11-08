/**
 * Created by reis on 29.07.2019.
 */
import {Routes, RouterModule} from '@angular/router';
import {ListFunctionalLocationComponent} from './list/list.component';

const routes: Routes = [
  {
    path: '', data: {title: 'functional-location'},
    children: [
      {path: '', component: ListFunctionalLocationComponent, data: {title: 'functional-location'}}
    ]
  }
];

export const FunctionalLocationModuleRoutes = RouterModule.forChild(routes);
