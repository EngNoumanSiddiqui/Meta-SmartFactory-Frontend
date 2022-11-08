import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrapNewComponent } from './new/new.component';
import { ScrapEditComponent } from './edit/edit.component';
import { ScrapDetailComponent } from './detail/detail.component';
import { ReworkListComponent } from './list/list.component';
import { ReworkRoutingModule } from './rework-routing.module';
import { ConfirmDialogModule, ListboxModule, PickListModule, ColorPickerModule, AutoCompleteModule } from 'primeng';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import { ImageModule } from 'app/views/image/image-module';
import { FormsModule } from '@angular/forms';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {ModalModule} from 'ngx-bootstrap/modal';
import { PlantAutoCompleteModule } from 'app/views/auto-completes/plant-auto-complete/plant-autocomplete-module';
import { BatchAutoCompleteModule } from 'app/views/auto-completes/batch-auto-complete/batch-autocomplete-module';
import { WareHouseAutoCompleteModule } from 'app/views/auto-completes/warehouse-auto-complete/warehouse-autocomplete-module';
import { WorkStationAutoCompleteModule } from 'app/views/auto-completes/ws-auto-complete/workstation-autocomplete-module';
import { JobOrderAutoCompleteModule } from 'app/views/auto-completes/job-order-auto-complete/job-order-autocomplete.module';
import { ProdOrderAutoCompleteModule } from 'app/views/auto-completes/prod-order-auto-complete/prod-order-autocomplete.module';
import { SharedMaterialModule } from 'app/views/inventory-management/warehouse-management-system/basic-warehouse-managment/material-cards/shared-material-module';
import { ProductionOrderService } from 'app/services/dto-services/production-order/production-order.service';
import { JobOrderModule } from 'app/views/manufacturing-planning-system/basic-manufacturing/job-order/job-order.module';

@NgModule({
  declarations: [ScrapNewComponent, ScrapEditComponent, ScrapDetailComponent, ReworkListComponent],
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
    ReworkRoutingModule,
    PlantAutoCompleteModule,
    BatchAutoCompleteModule,
    WareHouseAutoCompleteModule,
    SharedMaterialModule,
    WorkStationAutoCompleteModule,
    JobOrderAutoCompleteModule,
    ProdOrderAutoCompleteModule,
    JobOrderModule
  ],
  providers: [
    ProductionOrderService
  ],
  exports: [ScrapDetailComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class ReworkModule { }
