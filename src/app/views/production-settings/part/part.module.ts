import {FormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AutoCompleteModule, ColorPickerModule, ConfirmDialogModule, PickListModule, TooltipModule} from 'primeng';
import {DassSharedModule} from '../../../shared/dass-shared.module';
import {ListboxModule} from 'primeng/listbox';
import {ModalModule} from 'ngx-bootstrap/modal';
import {ImageModule} from '../../image/image-module';
import { NewPartComponent} from './new/new.component';
import { EditPartComponent} from './edit/edit.component';
import { DetailPartComponent} from './detail/detail.component';
import { ListPartComponent} from './list/list.component';
import {PartRoutingModule} from './part-routing.module';
@NgModule({
  imports: [

    CommonModule,
    ConfirmDialogModule,
    DassSharedModule,
    ImageModule,
    FormsModule,

    ListboxModule,
    ModalModule.forRoot(),
    PickListModule,
    PartRoutingModule,
    TooltipModule,
    ColorPickerModule,

    AutoCompleteModule,

  ],
  declarations: [

    NewPartComponent,
    EditPartComponent,
    DetailPartComponent,
    ListPartComponent,


  ],
  providers: []
})
export class PartModule {
}
