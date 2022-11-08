import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ListInspectionComponent } from './list/list.component';
import { NewInspectionComponent } from './new/new.component';

const routes: Routes = [
  { path: '', data: { title: 'inspection' },
    children: [
      { path: 'new', component: NewInspectionComponent, data: {title: 'inspection-characteristic-information'}},
      // { path: 'edit/:id', component: EditCustomerComponent, data: {title: 'edit-account'}},
      // { path: 'detail/:id', component: DetailCustomerComponent, data: {title: 'account-detail'}},
      { path: '', component: ListInspectionComponent, data: {title: 'inspection-characteristic'}}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InspectionRoutingModule {}
