import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { NewCompanyComponent } from './new/new.component';
import { EditCompanyComponent } from './edit/edit.component';
import { DetailCompanyComponent } from './detail/detail.component';
import { ListCompanyComponent } from './list/list.component';

const routes: Routes = [
  { path: '', data: { title: 'companies' },
    children: [
      { path: 'new', component: NewCompanyComponent, data: {title: 'new-company'}},
      { path: 'edit/:id', component: EditCompanyComponent, data: {title: 'edit-company'}},
      { path: 'detail/:id', component: DetailCompanyComponent, data: {title: 'company-detail'}},
      { path: '', component: ListCompanyComponent, data: {title: 'company-list'}}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyRoutingModule {}
