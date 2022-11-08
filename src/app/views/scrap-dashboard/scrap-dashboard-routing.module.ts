import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ScrapDashboardComponent} from './scrap-dashboard.component';

const routes: Routes = [
  {path: '', component: ScrapDashboardComponent, data: {title: 'scrap-dashboard'}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScrapDashboardRoutingModule {
}
