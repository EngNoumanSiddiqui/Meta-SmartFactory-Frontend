import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListMaterialCardComponent } from './list/list.component';

const routes: Routes = [
    { path: '', data: { title: 'material-master' }, component: ListMaterialCardComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MaterialCardsRouting {
}
