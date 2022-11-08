import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListInspectionMethod } from './list/list.component';

const routes: Routes = [
  { path: '', data: { title: 'inspection-method' },
    children: [
      { path: '', component: ListInspectionMethod, data: {title: 'inspection-method'}}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InspectionMethodRoutingModule {}
