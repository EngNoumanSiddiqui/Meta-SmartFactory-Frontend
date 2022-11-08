import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ListMeasuringDocumentComponent} from './list/list.component';
const routes: Routes = [
  {
    path: '', data: {title: 'measuring-document'},
    children: [
      {path: '', component: ListMeasuringDocumentComponent, data: {title: 'measuring-document'}},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeasuringDocumentRoutingModule {
}
