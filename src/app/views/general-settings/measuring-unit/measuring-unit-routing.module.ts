import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { NewMeasuringUnitComponent } from './new/new.component';
import { EditMeasuringUnitComponent } from './edit/edit.component';
import { DetailMeasuringUnitComponent } from './detail/detail.component';
import { ListMeasuringUnitComponent } from './list/list.component';



const routes: Routes = [


  {
    path: '', data: {title: 'measuring-unit'},
    children: [
      {path: 'new', component: NewMeasuringUnitComponent, data: {title: 'new-measuring-unit'}},
      {path: 'edit/:id', component: EditMeasuringUnitComponent, data: {title: 'edit-measuring-unit'}},
      {path: 'detail/:id', component: DetailMeasuringUnitComponent, data: {title: 'measuring-unit-detail'}},
      {path: '', component: ListMeasuringUnitComponent, data: {title: 'measuring-unit-list'}},
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeasuringUnitRoutingModule {}
