import {ConfirmationService} from 'primeng/api';
import {FormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConfirmDialogModule, TooltipModule} from 'primeng';
import {DassSharedModule} from '../../../shared/dass-shared.module';
import {ModalModule} from 'ngx-bootstrap/modal';
import { MeasuringUnitRoutingModule } from './measuring-unit-routing.module';
import { NewMeasuringUnitComponent } from './new/new.component';
import { ListMeasuringUnitComponent } from './list/list.component';
import { EditMeasuringUnitComponent } from './edit/edit.component';
import { DetailMeasuringUnitComponent } from './detail/detail.component';
import { MeasuringUnitService } from 'app/services/dto-services/measuring/measuring-unit.service';
import { StockAutoCompleteModule } from 'app/views/auto-completes/stock-auto-complete/stock-autocomplete-module';
import { WorkStationAutoCompleteModule } from 'app/views/auto-completes/ws-auto-complete/workstation-autocomplete-module';
import { EquipmentAutoCompleteModule } from 'app/views/auto-completes/equipment-auto-complete/equipment-autocomplete-module';
import { UnitAutoCompleteModule } from 'app/views/auto-completes/unit-auto-complete/unit-autocomplete-module';
@NgModule({
  declarations: [
    NewMeasuringUnitComponent,
    ListMeasuringUnitComponent,
    EditMeasuringUnitComponent,
    DetailMeasuringUnitComponent
  ],
  imports: [
    CommonModule,
    ConfirmDialogModule,
    DassSharedModule,
    FormsModule,
    ModalModule.forRoot(),
    TooltipModule,
    MeasuringUnitRoutingModule,
    StockAutoCompleteModule,
    WorkStationAutoCompleteModule,
    EquipmentAutoCompleteModule,
    UnitAutoCompleteModule
  ],
  providers: [
    ConfirmationService,
    MeasuringUnitService
  ]
})
export class MeasuringUnitModule {
}
