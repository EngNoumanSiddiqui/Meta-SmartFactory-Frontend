import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NewPalletComponent} from './new/new.component';
import {EditPalletComponent} from './edit/edit.component';
import {DetailPalletComponent} from './detail/detail.component';
import {ListPalletComponent} from './list/list.component';



const routes: Routes = [


  {
    path: '', data: {title: 'pallet-settings'},
    children: [
      {path: 'new', component: NewPalletComponent, data: {title: 'new-pallet'}},
      {path: 'edit/:id', component: EditPalletComponent, data: {title: 'edit-pallet'}},
      {path: 'detail/:id', component: DetailPalletComponent, data: {title: 'pallet-detail'}},
      {path: '', component: ListPalletComponent, data: {title: 'pallet-settings'}},
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PalletRoutingModule {}
