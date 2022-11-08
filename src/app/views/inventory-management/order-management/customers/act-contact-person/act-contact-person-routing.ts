import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewComponent } from './new/new.component';
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';
import { DetailComponent } from './detail/detail.component';
const routes: Routes = [
    {
        path: '', data: { title: 'accounts-contact' },
        children: [
            { path: '', component: ListComponent, data: { title:'contact-perons' } },
            { path: 'new', component: NewComponent, data: { title: 'new-account-contact-person' } },
            { path: 'edit/:id', component: EditComponent, data: { title: 'edit-account-contact-person' } },
            { path: 'detail/:id', component: DetailComponent, data: { title: 'account-contact-detail' } },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ContactPersonAccountRoutingModule { }
