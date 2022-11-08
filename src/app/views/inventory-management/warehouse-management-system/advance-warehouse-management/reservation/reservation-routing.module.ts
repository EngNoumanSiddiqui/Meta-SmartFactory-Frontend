import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ListReservationComponent} from './list/list.component';
import {NewReservationComponent} from './new/new.component';
import {EditReservationComponent} from './edit/edit.component';
import {DetailReservationComponent} from './detail/detail.component';


const routes: Routes = [
      {path: '', component: ListReservationComponent, data: {title: 'reservation'}},
      {path: 'new', component: NewReservationComponent, data: {title: 'new-reservation'}},
      {path: 'edit/:id', component: EditReservationComponent, data: {title: 'edit-reservation'}},
      {path: 'detail/:id', component: DetailReservationComponent, data: {title: 'reservation-detail'}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReservationRoutingModule {}
