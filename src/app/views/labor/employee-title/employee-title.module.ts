import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';

import { NewComponent } from './new/new.component';
import { EditComponent } from './edit/edit.component';
import { DetailComponent } from './detail/detail.component';
import { CalendarModule, CheckboxModule, ConfirmDialogModule, ContextMenuModule, ProgressSpinnerModule, MenuModule, SharedModule, TabViewModule, TreeTableModule } from 'primeng';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import { StockAutoCompleteModule } from 'app/views/auto-completes/stock-auto-complete/stock-autocomplete-module';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import { TreeModule } from 'primeng/tree';
import { ImageModule } from 'app/views/image/image-module';
import { TableModule } from 'primeng/table';
import { UnitAutoCompleteModule } from 'app/views/auto-completes/unit-auto-complete/unit-autocomplete-module';
import { PlantAutoCompleteModule } from 'app/views/auto-completes/plant-auto-complete/plant-autocomplete-module';
import { WorkStationAutoCompleteModule } from 'app/views/auto-completes/ws-auto-complete/workstation-autocomplete-module';
import { EmployeeTitleRoutingModule } from './employee-title-routing';
import { SharedMaterialModule } from 'app/views/inventory-management/warehouse-management-system/basic-warehouse-managment/material-cards/shared-material-module';
import { BasicManufacturingSharedModule } from 'app/views/manufacturing-planning-system/basic-manufacturing/basic-manufacturing-planning.shared.module';

@NgModule({
  declarations: [ListComponent, NewComponent, EditComponent, DetailComponent],
  imports: [
    CalendarModule,
    CheckboxModule,
    CommonModule,
    ConfirmDialogModule,
    ContextMenuModule,
    DassSharedModule,
    StockAutoCompleteModule,
    DialogModule,
    FormsModule,
    TreeTableModule,
    ProgressSpinnerModule,
    MenuModule,
    ModalModule.forRoot(),
    EmployeeTitleRoutingModule,
    SharedModule,
    TabsModule,
    TabViewModule,
    TooltipModule,
    TreeModule,
    ImageModule,
    BasicManufacturingSharedModule,
    TableModule,
    SharedMaterialModule,
    UnitAutoCompleteModule,
    PlantAutoCompleteModule,
    WorkStationAutoCompleteModule
  ]
})
export class EmployeeTitleModule { }
