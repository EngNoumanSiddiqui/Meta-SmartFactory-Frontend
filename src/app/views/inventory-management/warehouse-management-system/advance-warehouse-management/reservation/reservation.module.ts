import {ConfirmationService} from 'primeng/api';
import {FormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AutoCompleteModule, ConfirmDialogModule, PickListModule, TooltipModule, ListboxModule} from 'primeng';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import { StockAutoCompleteModule } from 'app/views/auto-completes/stock-auto-complete/stock-autocomplete-module';
import {ModalModule} from 'ngx-bootstrap/modal';
import { ReservationRoutingModule } from './reservation-routing.module';
import { BatchAutoCompleteModule } from 'app/views/auto-completes/batch-auto-complete/batch-autocomplete-module';
import { NewReservationComponent } from './new/new.component';
import { EditReservationComponent } from './edit/edit.component';
import { ListReservationComponent } from './list/list.component';
import { DetailReservationComponent } from './detail/detail.component';
import { EquipmentService } from 'app/services/dto-services/equipment/equipment.service';
import { EquipmentTypeService } from 'app/services/dto-services/equipment-type/equipment-type.service';
import { ReservationService } from 'app/services/dto-services/reservation/reservation.service';
import { PlantService } from 'app/services/dto-services/plant/plant.service';
import { ProductionOrderService } from 'app/services/dto-services/production-order/production-order.service';
import { WareHouseAutoCompleteModule } from 'app/views/auto-completes/warehouse-auto-complete/warehouse-autocomplete-module';
import { WarehouseLocationModule } from '../warehouse-locations/warehouse-location.module';
import { ListChooseAdvancedStockReportComponent } from './advance-stock-report-list/advanced-stock-report-list.component';
@NgModule({
  imports: [

    CommonModule,
    ConfirmDialogModule,
    DassSharedModule,
    FormsModule,
    StockAutoCompleteModule,
    ListboxModule,
    ModalModule.forRoot(),
    PickListModule,
    TooltipModule,
    AutoCompleteModule,
    ReservationRoutingModule,
    WareHouseAutoCompleteModule,
    BatchAutoCompleteModule,
    WarehouseLocationModule,
  ],
  declarations: [
    NewReservationComponent,
    ListChooseAdvancedStockReportComponent,
    EditReservationComponent,
    ListReservationComponent,
    DetailReservationComponent
  ],
  exports: [
    ListReservationComponent,
    DetailReservationComponent,
    ListChooseAdvancedStockReportComponent,
    EditReservationComponent,
  ],
  providers: [
    ConfirmationService,
    EquipmentService,
    EquipmentTypeService,
    ReservationService,
    PlantService,
    ProductionOrderService
  ]
})
export class ReservationModule {
}
