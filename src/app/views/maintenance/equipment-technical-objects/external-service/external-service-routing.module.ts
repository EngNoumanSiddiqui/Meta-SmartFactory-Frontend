/**
 * Created by reis on 29.07.2019.
 */
import {RouterModule, Routes} from '@angular/router';
import {ExternalServiceListComponent} from './list/list.component';

const routes: Routes = [
  {
    path: '', data: {title: 'external-service'},
    children: [
      {path: '', component: ExternalServiceListComponent, data: {title: 'external-service'}}
    ]
  }
];

export const ExternalServiceModuleRoutes = RouterModule.forChild(routes);
