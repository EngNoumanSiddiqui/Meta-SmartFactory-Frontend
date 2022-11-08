import { PlantAutoCompleteModule } from './../../auto-completes/plant-auto-complete/plant-autocomplete-module';
import {FormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AutoCompleteModule, ColorPickerModule, ConfirmDialogModule, PickListModule, TooltipModule} from 'primeng';
import {DassSharedModule} from '../../../shared/dass-shared.module';
import {ListboxModule} from 'primeng/listbox';
import {ModalModule} from 'ngx-bootstrap/modal';
import {ImageModule} from '../../image/image-module';
import {WorkcenterRoutingModule} from './workcenter-routing.module';
import { WorkcenterSharedModule } from './workcenter-shared.module';
/**
 * COMPONENTS
 */
import {EditWorkcenterComponent} from './edit/edit.component';
import {ListWorkcenterComponent} from './list/list.component';

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
    WorkcenterRoutingModule,
    TooltipModule,
    ColorPickerModule,
    PlantAutoCompleteModule,
    AutoCompleteModule,
    WorkcenterSharedModule
  ],
  declarations: [
    
    EditWorkcenterComponent,
    ListWorkcenterComponent,
  ],
  providers: []
})
export class WorkcenterModule {
}
