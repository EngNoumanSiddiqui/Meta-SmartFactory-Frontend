import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NewWareHouseComponent} from './new/new.component';
import {EditWareHouseComponent} from './edit/edit.component';
import {DetailWareHouseComponent} from './detail/detail.component';
import {ListWareHouseComponent} from './list/list.component';



const routes: Routes = [


  {
    path: '', data: {title: 'wareHouse'},
    children: [
      {path: 'new', component: NewWareHouseComponent, data: {title: 'new-warehouse'}},
      {path: 'edit/:id', component: EditWareHouseComponent, data: {title: 'edit-warehouse'}},
      {path: 'detail/:id', component: DetailWareHouseComponent, data: {title: 'warehouse-detail'}},
      {path: '', component: ListWareHouseComponent, data: {title: 'warehouses'}},
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WarehouseRoutingModule {}
