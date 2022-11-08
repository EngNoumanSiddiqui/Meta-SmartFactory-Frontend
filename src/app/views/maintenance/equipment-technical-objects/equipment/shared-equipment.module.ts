import {ConfirmationService} from 'primeng/api';
import {FormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AutoCompleteModule, ConfirmDialogModule, PickListModule, TooltipModule} from 'primeng';
import {DassSharedModule} from '../../../../shared/dass-shared.module';
import {ListboxModule} from 'primeng/listbox';
import {ModalModule} from 'ngx-bootstrap/modal';
import {ImageModule} from '../../../image/image-module';
import {NewEquipmentComponent} from './new/new.component';
import {EditEquipmentComponent} from './edit/edit.component';
import {DetailEquipmentComponent} from './detail/detail.component';
import {ListEquipmentComponent} from './list/list.component';
import {EquipmentService} from '../../../../services/dto-services/equipment/equipment.service';
import {EquipmentTypeService} from '../../../../services/dto-services/equipment-type/equipment-type.service';
import {EquipmentCategoryAutoCompleteModule} from '../../../auto-completes/equipment-category-auto-complete/equipment-category-autocomplete-module';
import {EquipmentObjectTypeAutoCompleteModule} from '../../../auto-completes/equipment-object-type-auto-complete/equipment-object-type-autocomplete-module';
import {WorkStationAutoCompleteModule} from '../../../auto-completes/ws-auto-complete/workstation-autocomplete-module';
import {UnitAutoCompleteModule} from '../../../auto-completes/unit-auto-complete/unit-autocomplete-module';
import {CountryAutoCompleteModule} from '../../../auto-completes/country-autocomplete/country-autocomplete-module';
import {PlantAutoCompleteModule} from '../../../auto-completes/plant-auto-complete/plant-autocomplete-module';
import {ActAutoCompleteModule} from '../../../auto-completes/act-auto-complete/act-autocomplete-module';
import {PlannerGroupAutoCompleteModule} from '../../../auto-completes/planner-group-auto-complete/planner-group-autocomplete-module';
import {AbcIndicatorAutoCompleteModule} from '../../../auto-completes/abc-indicator-auto-complete/abc-indicator-autocomplete-module';
import {ChooseEquipmentPaneComponent} from '../../../choose-panes/choose-equipment-pane/choose-equipment-pane.component';
import { EquipmentAutoCompleteModule } from 'app/views/auto-completes/equipment-auto-complete/equipment-autocomplete-module';
import { SharedFunctionalLocationModule } from '../functional-location/shared-functional-location-module';
import { SharedMaterialModule } from 'app/views/inventory-management/warehouse-management-system/basic-warehouse-managment/material-cards/shared-material-module';
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
    TooltipModule,
    WorkStationAutoCompleteModule,
    UnitAutoCompleteModule,
    CountryAutoCompleteModule,
    AutoCompleteModule,
    EquipmentCategoryAutoCompleteModule,
    EquipmentObjectTypeAutoCompleteModule,
    PlantAutoCompleteModule,
    ActAutoCompleteModule,
    PlannerGroupAutoCompleteModule,
    AbcIndicatorAutoCompleteModule,
    EquipmentAutoCompleteModule,
    SharedFunctionalLocationModule,
    SharedMaterialModule
  ],
  declarations: [

    NewEquipmentComponent,
    EditEquipmentComponent,
    DetailEquipmentComponent,
    ListEquipmentComponent,
    ChooseEquipmentPaneComponent

  ],
  providers: [
    ConfirmationService,
    EquipmentService,
    EquipmentTypeService,
  ],
  exports: [ChooseEquipmentPaneComponent, DetailEquipmentComponent]
})
export class SharedEquipmentsModule {
}
