import { PlantAutoCompleteModule } from 'app/views/auto-completes/plant-auto-complete/plant-autocomplete-module';
import { OperationTypeRoutingModule } from './operation-type-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { OperationTypeNewComponent } from './new/new.component';
import { OperationTypeEditComponent } from './edit/edit.component';
import { ConfirmDialogModule, ListboxModule, PickListModule, ColorPickerModule, AutoCompleteModule } from 'primeng';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import { ImageModule } from 'app/views/image/image-module';
import { FormsModule } from '@angular/forms';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {ModalModule} from 'ngx-bootstrap/modal';
import { SettingsSharedModule } from '../settings-shared.module';

@NgModule({
  declarations: [ListComponent, OperationTypeNewComponent, OperationTypeEditComponent],
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
    PlantAutoCompleteModule,
    OperationTypeRoutingModule,
    SettingsSharedModule
  ]
})
export class OperationTypeModule { }
