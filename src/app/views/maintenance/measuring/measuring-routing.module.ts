import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MaintenanceSensorDataComponent} from './maintenance-sensor-data/maintenance-sensor-data.component';

const routes: Routes = [
  {path: 'measuring-point', loadChildren:() => import('./measuring-point/measuring-point.module').then(m => m.MeasuringPointModule)},
  {path: 'measuring-document', loadChildren:() => import('./measuring-document/measuring-document.module').then(m => m.MeasuringDocumentModule)},
  {path: 'sensor-data', component: MaintenanceSensorDataComponent, data: {title: 'sensor-data'}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeasuringRoutingModule {
}
