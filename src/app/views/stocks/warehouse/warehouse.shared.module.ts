import {ConfirmationService} from 'primeng/api';
import {FormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AutoCompleteModule, ColorPickerModule, ConfirmDialogModule, PickListModule, TooltipModule} from 'primeng';
import {DassSharedModule} from '../../../shared/dass-shared.module';
import {ListboxModule} from 'primeng/listbox';
import {ModalModule} from 'ngx-bootstrap/modal';
 import {ImageModule} from '../../image/image-module';
import {ListWareHouseComponent} from './list/list.component';
import {DetailWareHouseComponent} from './detail/detail.component';
import {EditWareHouseComponent} from './edit/edit.component';
import {NewWareHouseComponent} from './new/new.component';
import {PlantAutoCompleteModule} from '../../auto-completes/plant-auto-complete/plant-autocomplete-module';
import { WareHouseAutoCompleteModule } from 'app/views/auto-completes/warehouse-auto-complete/warehouse-autocomplete-module';
import { FactoryCalendarAutoCompleteModule } from 'app/views/auto-completes/factory-calendar-auto-complete/factory-calendar-autocomplete-module';

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
    WareHouseAutoCompleteModule,
    FactoryCalendarAutoCompleteModule
  ],
  declarations: [

    NewWareHouseComponent,
    EditWareHouseComponent,
    DetailWareHouseComponent,
    ListWareHouseComponent,

  ],exports: [
    NewWareHouseComponent,
    EditWareHouseComponent,
    DetailWareHouseComponent,
    ListWareHouseComponent,
  ],
  providers: [
    ConfirmationService,
  ]
})
export class SharedWarehouseModule {
}
