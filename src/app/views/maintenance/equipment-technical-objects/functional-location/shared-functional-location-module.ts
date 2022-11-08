///<reference path="list/list.component.ts"/>
import {NgModule} from '@angular/core';
import {AutoCompleteModule, ConfirmDialogModule, KeyFilterModule, TooltipModule} from 'primeng';
import {CommonModule} from '@angular/common';
import {DassSharedModule} from '../../../../shared/dass-shared.module';
import {FormsModule} from '@angular/forms';
import {NewFunctionalLocationComponent} from './new/new.component';
import {PlantAutoCompleteModule} from '../../../auto-completes/plant-auto-complete/plant-autocomplete-module';
import {ActAutoCompleteModule} from '../../../auto-completes/act-auto-complete/act-autocomplete-module';
import {PlannerGroupAutoCompleteModule} from '../../../auto-completes/planner-group-auto-complete/planner-group-autocomplete-module';
import {AbcIndicatorAutoCompleteModule} from '../../../auto-completes/abc-indicator-auto-complete/abc-indicator-autocomplete-module';
import {EquipmentObjectTypeAutoCompleteModule} from '../../../auto-completes/equipment-object-type-auto-complete/equipment-object-type-autocomplete-module';
import {EquipmentCategoryAutoCompleteModule} from '../../../auto-completes/equipment-category-auto-complete/equipment-category-autocomplete-module';
import {CountryAutoCompleteModule} from '../../../auto-completes/country-autocomplete/country-autocomplete-module';
import {UnitAutoCompleteModule} from '../../../auto-completes/unit-auto-complete/unit-autocomplete-module';
import {WorkStationAutoCompleteModule} from '../../../auto-completes/ws-auto-complete/workstation-autocomplete-module';
import {FunctionalLocationDetailComponent} from './detail/detail.component';
import {ListFunctionalLocationComponent} from './list/list.component';
import {EditFunctionalLocationComponent} from './edit/edit.component';
import {FunctionalLocationService} from '../../../../services/dto-services/maintenance-equipment/functional-location.service';
import {ModalModule} from 'ngx-bootstrap/modal';
import {ChooseFunctionalLocationPaneComponent} from '../../../choose-panes/choose-functional-location-pane/list.component';

const COMPONENT = [NewFunctionalLocationComponent,
  FunctionalLocationDetailComponent,
  EditFunctionalLocationComponent,
  ListFunctionalLocationComponent,
  ChooseFunctionalLocationPaneComponent
];

@NgModule({
  imports: [
    ConfirmDialogModule,
    ModalModule.forRoot(),
    CommonModule,
    DassSharedModule,
    FormsModule,
    TooltipModule,
    KeyFilterModule,
    PlantAutoCompleteModule,
    WorkStationAutoCompleteModule,
    UnitAutoCompleteModule,
    CountryAutoCompleteModule,
    AutoCompleteModule,
    EquipmentCategoryAutoCompleteModule,
    EquipmentObjectTypeAutoCompleteModule,
    ActAutoCompleteModule,
    PlannerGroupAutoCompleteModule,
    AbcIndicatorAutoCompleteModule
  ],
  declarations: [
    ...COMPONENT
  ],
  providers: [
    FunctionalLocationService
  ],
  exports: [
    ...COMPONENT
  ]
})
export class SharedFunctionalLocationModule {
}
