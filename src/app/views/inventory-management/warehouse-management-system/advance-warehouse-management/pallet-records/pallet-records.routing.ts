import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PalletListComponent } from './list/pallet.list.component';

const routes: Routes = [
    { path: '', data: { title: 'pallet-records' }, component: PalletListComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PalletRecordsRouting {
}
