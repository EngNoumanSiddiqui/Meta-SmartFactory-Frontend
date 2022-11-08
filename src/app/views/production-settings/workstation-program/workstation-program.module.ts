import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule, ListboxModule, PickListModule, ColorPickerModule, AutoCompleteModule } from 'primeng';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import { ImageModule } from 'app/views/image/image-module';
import { FormsModule } from '@angular/forms';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {ModalModule} from 'ngx-bootstrap/modal';
import { SettingsSharedModule } from '../settings-shared.module';
import { WorkStationRoutingModule } from './workstation-program-routing.module';
import { WorkstationProgramListComponent } from './list/list.component';
import { WorkstationProgramNewComponent } from './new/new.component';
import { WorkstationProgramEditComponent } from './edit/edit.component';
import { WorkStationProgramDetailComponent } from './detail/detail.component';
import { WorkStationAutoCompleteModule } from 'app/views/auto-completes/ws-auto-complete/workstation-autocomplete-module';
import { UnitAutoCompleteModule } from 'app/views/auto-completes/unit-auto-complete/unit-autocomplete-module';
//components


@NgModule({
  declarations: [
    WorkstationProgramListComponent,
    WorkstationProgramNewComponent,
    WorkstationProgramEditComponent,
    WorkStationProgramDetailComponent
  ],
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
    ColorPickerModule,
    AutoCompleteModule,
    WorkStationRoutingModule,
    SettingsSharedModule,
    WorkStationAutoCompleteModule,
    UnitAutoCompleteModule
  ]
})
export class WorkStationProgramModule { }
