import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CalendarModule, CheckboxModule, ConfirmDialogModule, InputNumberModule, TooltipModule} from 'primeng';
import {ModalModule} from 'ngx-bootstrap/modal';
import {FormsModule} from '@angular/forms';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import { ListWarehouseLocationComponent } from './list/warehouse-location-list.component';
import { WarehouseLocationRouting } from './warehouse-location.routing';
import { WarehouseLocationService } from 'app/services/dto-services/warehouse/warehouse-location.service';
import { ChooseWarehouseLocationPaneComponent } from 'app/views/choose-panes/choose-warehouse-location-pane/choose-warehouse-location.component';


@NgModule({
  imports: [
    CalendarModule,
    CheckboxModule,
    ConfirmDialogModule,
    CommonModule,
    DassSharedModule,
    FormsModule,
    ModalModule.forRoot(),
    WarehouseLocationRouting,
    TooltipModule,
    InputNumberModule,
  ],
  declarations: [
    ListWarehouseLocationComponent,
    ChooseWarehouseLocationPaneComponent
  ],
  providers: [
    WarehouseLocationService
  ], exports: [
    ListWarehouseLocationComponent,
    ChooseWarehouseLocationPaneComponent
  ]
})
export class WarehouseLocationModule {
}
