import { WareHouseAutoCompleteModule } from './../../auto-completes/warehouse-auto-complete/warehouse-autocomplete-module';
import { PlantAutoCompleteModule } from './../../auto-completes/plant-auto-complete/plant-autocomplete-module';
import {FormsModule} from '@angular/forms';
import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AutoCompleteModule, ColorPickerModule, ConfirmDialogModule, PickListModule, TooltipModule} from 'primeng';
import {DassSharedModule} from '../../../shared/dass-shared.module';
import {ListboxModule} from 'primeng/listbox';
import {ModalModule} from 'ngx-bootstrap/modal';
import {ImageModule} from '../../image/image-module';
import {NewWorkstationComponent} from './new/new.component';
import {EditWorkstationComponent} from './edit/edit.component';
import {ListWorkstationComponent} from './list/list.component';
import {WorkstationsRoutingModule} from './workstation-routing.module';
import { AddCapacityComponent } from './add-capacity/add-capacity.component';
import { BasicScreenComponent } from './basic-screen/basic-screen.component';
import { InitialScreenComponent } from './initial-screen/initial-screen.component';
import {SharedWorkstationModule} from './shared-workstation.module';
import { InitialDetailComponent } from './detail/initial-detail/initial-detail.component';
import {UnitAutoCompleteModule} from '../../auto-completes/unit-auto-complete/unit-autocomplete-module';
import { WorkStationTypeAutoCompleteModule } from 'app/views/auto-completes/ws-type-auto-complete/workstation-type-autocomplete-module';
import { WorkStationCategoryAutoCompleteModule } from 'app/views/auto-completes/ws-category-auto-complete/workstation-category-autocomplete.module';
import { WorkCenterAutocompleteModule } from 'app/views/auto-completes/workcenter-auto-complete/workcenter-autocomplete-module';
import { WorkStationAutoCompleteModule } from 'app/views/auto-completes/ws-auto-complete/workstation-autocomplete-module';
import { CurrencyAutoCompleteModule } from 'app/views/auto-completes/currency-auto-complete/currency-autocomplete-module';
import { LocationAutoCompleteModule } from 'app/views/auto-completes/location-auto-complete/location-autocomplete-module';
@NgModule({
  imports: [
    CommonModule,
    CurrencyAutoCompleteModule,
    ConfirmDialogModule,
    DassSharedModule,
    ImageModule,
    FormsModule,
    ListboxModule,
    ModalModule.forRoot(),
    PickListModule,
    WorkstationsRoutingModule,
    TooltipModule,
    ColorPickerModule,
    AutoCompleteModule,
    SharedWorkstationModule,
    UnitAutoCompleteModule,
    PlantAutoCompleteModule, // demo
    WareHouseAutoCompleteModule, // demo
    WorkStationAutoCompleteModule,
    
    WorkStationTypeAutoCompleteModule,
    WorkStationCategoryAutoCompleteModule,
    WorkCenterAutocompleteModule,
    LocationAutoCompleteModule,
  ],
  declarations: [
    NewWorkstationComponent,
    EditWorkstationComponent,
    ListWorkstationComponent,
    AddCapacityComponent,
    BasicScreenComponent,
    InitialScreenComponent,
    InitialDetailComponent
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WorkstationModule {
}
