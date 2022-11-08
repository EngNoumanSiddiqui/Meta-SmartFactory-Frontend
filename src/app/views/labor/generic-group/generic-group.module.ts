import { WorkStationAutoCompleteModule } from './../../auto-completes/ws-auto-complete/workstation-autocomplete-module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewComponent } from './new/new.component';
import { DetailComponent } from './detail/detail.component';
import { EditComponent } from './edit/edit.component';
import { EmployeeGeneralGroupListComponent } from './list/list.component';
import { GenericGroupRoutingModule } from './generic-group-routing.module';
import { ConfirmDialogModule, ListboxModule, PickListModule, ColorPickerModule, AutoCompleteModule } from 'primeng';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import { ImageModule } from 'app/views/image/image-module';
import { FormsModule } from '@angular/forms';
import { TreeModule } from 'primeng/tree';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {ModalModule} from 'ngx-bootstrap/modal';
import { EmployeeGroupService } from 'app/services/dto-services/employee-group.service';
import {PlantAutoCompleteModule} from '../../auto-completes/plant-auto-complete/plant-autocomplete-module';
import {PlannerGroupAutoCompleteModule} from '../../auto-completes/planner-group-auto-complete/planner-group-autocomplete-module';
import { WorkCenterAutocompleteModule } from 'app/views/auto-completes/workcenter-auto-complete/workcenter-autocomplete-module';
import { OperationAutoCompleteModule } from 'app/views/auto-completes/operation-auto-complete/operation-autocomplete-module';
import { ProdOrderAutoCompleteModule } from 'app/views/auto-completes/prod-order-auto-complete/prod-order-autocomplete.module';
import { ExchangeGroupComponent } from './exchange-group/exchange-group.component';
import { ForkLiftAutoCompleteModule } from 'app/views/auto-completes/forklift-auto-complete/forklift-autocomplete-module';
import { WareHouseAutoCompleteModule } from 'app/views/auto-completes/warehouse-auto-complete/warehouse-autocomplete-module';
import { MaterialGroupAutoCompleteModule } from 'app/views/auto-completes/material-group-auto-complete/material-group-autocomplete-module';
@NgModule({
  declarations: [
    NewComponent, 
    DetailComponent, 
    EditComponent, 
    EmployeeGeneralGroupListComponent,
    ExchangeGroupComponent
  ],
  imports: [
    CommonModule,
    ConfirmDialogModule,
    DassSharedModule,
    ImageModule,
    FormsModule,
    TreeModule,
    ListboxModule,
    ModalModule.forRoot(),
    PickListModule,
    TooltipModule,
    ColorPickerModule,
    AutoCompleteModule,
    GenericGroupRoutingModule,
    WorkStationAutoCompleteModule,
    PlannerGroupAutoCompleteModule,
    PlantAutoCompleteModule,
    WorkCenterAutocompleteModule,
    OperationAutoCompleteModule,
    ProdOrderAutoCompleteModule,
    ForkLiftAutoCompleteModule,
    WareHouseAutoCompleteModule,
    MaterialGroupAutoCompleteModule
  ],
  exports: [NewComponent],
  providers:[EmployeeGroupService]
})
export class GenericGroupModule { }
