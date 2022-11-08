import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ListQualityInfoRecords} from './list/list.component';
const routes: Routes = [
  { path: '', data: { title: 'quality-info-record' },
  children: [
    { path: '', component: ListQualityInfoRecords, data: {title: 'quality-info-record'}}
  ]
}
]; 

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QualityInfoRecordRoutingModule { }
