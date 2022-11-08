import {FormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AutoCompleteModule, ColorPickerModule, ConfirmDialogModule, PickListModule, TooltipModule} from 'primeng';
import {DassSharedModule} from '../../../shared/dass-shared.module';
import {ListboxModule} from 'primeng/listbox';
import {ModalModule} from 'ngx-bootstrap/modal';
import {RoleRoutingModule} from './role-routing.module';
import {NewRoleComponent} from './new/new.component';
import {EditRoleComponent} from './edit/edit.component';
import {ListRoleComponent} from './list/list.component';
import {DetailRoleComponent} from './detail/detail.component';
import {TreeModule} from 'primeng/tree';
@NgModule({
  imports: [

    CommonModule,
    ConfirmDialogModule,
    DassSharedModule,
    FormsModule,
    TreeModule,
    ListboxModule,
    ModalModule.forRoot(),
    PickListModule,
    RoleRoutingModule,
    TooltipModule,
    ColorPickerModule,

    AutoCompleteModule,

  ],
  declarations: [

    NewRoleComponent,
    EditRoleComponent,
    ListRoleComponent,
    DetailRoleComponent,

  ],
  providers: []
})
export class RoleModule {
}
