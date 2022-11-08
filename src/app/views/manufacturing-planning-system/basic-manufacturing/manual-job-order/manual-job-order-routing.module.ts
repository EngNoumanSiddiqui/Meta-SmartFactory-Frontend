import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { ListManualJobOrderComponent } from './list/list.component';

const routes: Routes = [
    // { path: '', redirectTo: 'list', pathMatch: 'full' },
    { path: 'list', component: ListManualJobOrderComponent, data: {title: 'manual-job-orders'} }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManualJobOrderRoutingModule {
}
