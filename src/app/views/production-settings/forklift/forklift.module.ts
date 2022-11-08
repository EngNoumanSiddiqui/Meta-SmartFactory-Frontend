import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule, ListboxModule, PickListModule, ColorPickerModule, AutoCompleteModule } from 'primeng';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import { FormsModule } from '@angular/forms';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {ModalModule} from 'ngx-bootstrap/modal';
import { WareHouseAutoCompleteModule } from 'app/views/auto-completes/warehouse-auto-complete/warehouse-autocomplete-module';
import { ForkLiftNewComponent } from './new/new.component';
import { ForkLiftEditComponent } from './edit/edit.component';
import { ForkLiftDetailComponent } from './detail/detail.component';
import { ForkLiftListComponent } from './list/list.component';
import { ForkLiftService } from 'app/services/dto-services/forklift.service';
import { ForkLiftRoutingModule } from './forklift-routing.module';
import { PlantAutoCompleteModule } from 'app/views/auto-completes/plant-auto-complete/plant-autocomplete-module';

@NgModule({
  declarations: [ForkLiftNewComponent, ForkLiftEditComponent, ForkLiftDetailComponent, ForkLiftListComponent],
  imports: [
    CommonModule,
    ConfirmDialogModule,
    DassSharedModule,
    FormsModule,
    ListboxModule,
    ModalModule.forRoot(),
    PickListModule,
    TooltipModule,
    ForkLiftRoutingModule,
    ColorPickerModule,
    AutoCompleteModule,
    PlantAutoCompleteModule,
    WareHouseAutoCompleteModule,
  ],
  providers: [ForkLiftService],
  exports: [
    
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class ForkLiftModule { }
