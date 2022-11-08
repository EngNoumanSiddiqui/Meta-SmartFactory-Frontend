import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListInspectionLot } from './inspection-lot/list/list.component';

const routes: Routes = [
  { path: '', data: { title: 'inspection-lot' },
    children: [
      { path: '', component: ListInspectionLot, data: {title: 'inspection-lot'}}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QualityInspectionRoutingModule {}
