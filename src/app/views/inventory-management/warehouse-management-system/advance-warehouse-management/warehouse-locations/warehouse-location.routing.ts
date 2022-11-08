import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListWarehouseLocationComponent } from './list/warehouse-location-list.component';


const routes: Routes = [
    { path: '', component: ListWarehouseLocationComponent, data: { title: 'warehouse-locations' } }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WarehouseLocationRouting {
}