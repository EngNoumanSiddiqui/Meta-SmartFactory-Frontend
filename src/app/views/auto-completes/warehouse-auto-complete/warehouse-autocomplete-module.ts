import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DassSharedModule} from '../../../shared/dass-shared.module';

import {AutoCompleteModule} from 'primeng';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {WarehouseAutoCompleteComponent} from './warehouse-auto-complete.component';
import {WarehouseService} from '../../../services/dto-services/warehouse/warehouse.service';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PlantAutoCompleteModule } from '../plant-auto-complete/plant-autocomplete-module';

@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    ModalModule.forRoot(),
    ButtonModule,
    FormsModule,
    PlantAutoCompleteModule,
    AutoCompleteModule,
  ],
  declarations: [
    WarehouseAutoCompleteComponent,
  ],
  exports: [
    WarehouseAutoCompleteComponent,
  ]
  ,
  providers: [
    WarehouseService
  ]
})
export class WareHouseAutoCompleteModule {
}
