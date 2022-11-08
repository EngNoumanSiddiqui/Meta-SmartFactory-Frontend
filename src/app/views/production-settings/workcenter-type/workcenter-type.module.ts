import { PlantAutoCompleteModule } from 'app/views/auto-completes/plant-auto-complete/plant-autocomplete-module';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { NewComponent } from './new/new.component';
import { EditComponent } from './edit/edit.component';
import { ConfirmDialogModule, ListboxModule, PickListModule, ColorPickerModule, AutoCompleteModule } from 'primeng';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import { ImageModule } from 'app/views/image/image-module';
import { FormsModule } from '@angular/forms';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {ModalModule} from 'ngx-bootstrap/modal';
import { WorkCenterTypeRoutingModule } from './workcenter-type-routing.module';
import { WorkcenterTypeService } from 'app/services/dto-services/workcenter-type/workcenter-type.service';
import { WorkcenterTypeSharedModule } from './workcenter-type-shared.module';

@NgModule({
  declarations: [ ListComponent, NewComponent, EditComponent ],
  imports: [
    CommonModule,
    ConfirmDialogModule,
    DassSharedModule,
    ImageModule,
    FormsModule,
    ListboxModule,
    ModalModule.forRoot(),
    WorkCenterTypeRoutingModule,
    PickListModule,
    TooltipModule,
    ColorPickerModule,
    AutoCompleteModule,
    PlantAutoCompleteModule,
    WorkcenterTypeSharedModule
  ],
  providers: [WorkcenterTypeService]
})
export class WorkCenterTypeModule { }
