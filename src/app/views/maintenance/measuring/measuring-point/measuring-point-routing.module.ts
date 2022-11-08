import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NewMeasuringPointComponent} from './new/new.component';
import {EditMeasuringPointComponent} from './edit/edit.component';
import {DetailMeasuringPointComponent} from './detail/detail.component';
import {ListMeasuringPointComponent} from './list/list.component';
const routes: Routes = [
  {
    path: '', data: {title: 'measuring-point'},
    children: [
      {path: 'new', component: NewMeasuringPointComponent, data: {title: 'new-measuring-point'}},
      {path: 'edit/:id', component: EditMeasuringPointComponent, data: {title: 'edit-measuring-point'}},
      {path: 'detail/:id', component: DetailMeasuringPointComponent, data: {title: 'measuring-point-detail'}},
      {path: '', component: ListMeasuringPointComponent, data: {title: 'measuring-point'}},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeasuringPointRoutingModule {
}
