import {ConfirmationService} from 'primeng/api';
import {FormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AutoCompleteModule, ColorPickerModule, ConfirmDialogModule, PickListModule, TooltipModule} from 'primeng';
import {DassSharedModule} from '../../../shared/dass-shared.module';
import {ListboxModule} from 'primeng/listbox';
import {ModalModule} from 'ngx-bootstrap/modal';
 import {ImageModule} from '../../image/image-module';
import {WarehouseRoutingModule} from './warehouse-routing.module';
import {PlantAutoCompleteModule} from '../../auto-completes/plant-auto-complete/plant-autocomplete-module';
import {SharedWarehouseModule} from './warehouse.shared.module'
@NgModule({
  imports: [

    CommonModule,
    ConfirmDialogModule,
    DassSharedModule,
    ImageModule,
    FormsModule,
    PlantAutoCompleteModule,
    ListboxModule,
    ModalModule.forRoot(),
    PickListModule,
    TooltipModule,
    ColorPickerModule,

    AutoCompleteModule,
    WarehouseRoutingModule,
    SharedWarehouseModule
  ],
  providers: [
    ConfirmationService,
  ]
})
export class WarehouseModule {
}
