import {ConfirmationService} from 'primeng/api';
import {FormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AutoCompleteModule, ConfirmDialogModule, TooltipModule} from 'primeng';
import {DassSharedModule} from '../../../shared/dass-shared.module';
import {ModalModule} from 'ngx-bootstrap/modal';
import {ListPalletComponent} from './list/list.component';
import {DetailPalletComponent} from './detail/detail.component';
import {EditPalletComponent} from './edit/edit.component';
import {NewPalletComponent} from './new/new.component';
import { PalletRoutingModule } from './pallets-routing.module';
import { PalletSettingsService } from 'app/services/dto-services/pallet/pallet-settings.service';
import { PlantAutoCompleteModule } from 'app/views/auto-completes/plant-auto-complete/plant-autocomplete-module';
import { WareHouseAutoCompleteModule } from 'app/views/auto-completes/warehouse-auto-complete/warehouse-autocomplete-module';
import { SharedOperationsModule } from '../operations/shared-operations.module';
@NgModule({
  imports: [

    CommonModule,
    ConfirmDialogModule,
    DassSharedModule,
    FormsModule,
    ModalModule.forRoot(),
    TooltipModule,
    AutoCompleteModule,
    PalletRoutingModule,
    PlantAutoCompleteModule,
    WareHouseAutoCompleteModule,
    SharedOperationsModule
  ],
  declarations: [

    NewPalletComponent,
    EditPalletComponent,
    DetailPalletComponent,
    ListPalletComponent,

  ],
  exports: [
    DetailPalletComponent
  ],
  providers: [
    PalletSettingsService,
    ConfirmationService,
  ]
})
export class PalletsModule {
}
