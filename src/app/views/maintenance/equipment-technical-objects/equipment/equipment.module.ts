import {FormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DassSharedModule} from '../../../../shared/dass-shared.module';
import {EquipmentsRoutingModule} from './equipment-routing.module';
import {SharedEquipmentsModule} from './shared-equipment.module';
@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    FormsModule,
    EquipmentsRoutingModule,
    SharedEquipmentsModule
  ],
  declarations: [],
  providers: [

  ]
})
export class EquipmentsModule {
}
