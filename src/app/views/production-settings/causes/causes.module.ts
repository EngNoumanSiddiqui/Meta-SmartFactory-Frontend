import {ListCauseComponent} from './list/list.component';
import {DetailCauseComponent} from './detail/detail.component';
import {EditCauseComponent} from './edit/edit.component';
import {NewCauseComponent} from './new/new.component';
import {FormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AutoCompleteModule, ColorPickerModule, ConfirmDialogModule, PickListModule, TooltipModule} from 'primeng';
import {DassSharedModule} from '../../../shared/dass-shared.module';
import {ListboxModule} from 'primeng/listbox';
import {ModalModule} from 'ngx-bootstrap/modal';
import {CausesRoutingModule} from './causes-routing.module';
import {ImageModule} from '../../image/image-module';
import { PlantAutoCompleteModule } from 'app/views/auto-completes/plant-auto-complete/plant-autocomplete-module';
import {WorkCenterAutocompleteModule} from '../../auto-completes/workcenter-auto-complete/workcenter-autocomplete-module';
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
    CausesRoutingModule,
    TooltipModule,
    ColorPickerModule,
    PlantAutoCompleteModule,
    AutoCompleteModule,
    WorkCenterAutocompleteModule,

  ],
  declarations: [

    NewCauseComponent,
    EditCauseComponent,
    DetailCauseComponent,
    ListCauseComponent,

  ],
  exports: [DetailCauseComponent],
  providers: []
})
export class CausesModule {
}
