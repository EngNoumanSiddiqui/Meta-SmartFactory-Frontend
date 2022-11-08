import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { NewEquipmentComponent} from './new/new.component';
import { EditEquipmentComponent} from './edit/edit.component';
import { DetailEquipmentComponent} from './detail/detail.component';
import { ListEquipmentComponent} from './list/list.component';

const routes: Routes = [
  { path: '', data: {title: 'equipments'},
    children: [
      {path: 'new', component: NewEquipmentComponent, data: {title: 'new-equipment'}},
      {path: 'edit/:id', component: EditEquipmentComponent, data: {title: 'edit-equipment'}},
      {path: 'detail/:id', component: DetailEquipmentComponent, data: {title: 'equipment-detail'}},
      {path: '', component: ListEquipmentComponent,  data: {title: 'equipments'}}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EquipmentsRoutingModule {}
