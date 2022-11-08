import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DassSharedModule} from '../../../shared/dass-shared.module';

import {AutoCompleteModule} from 'primeng';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {PlantAutoCompleteComponent} from './plant-auto-complete.component';
import {SharedPlantListService} from './shared-plant-list.service';
import {PlantService} from '../../../services/dto-services/plant/plant.service';
import {SharedPlantModule} from '../../production-settings/plant/shared-plant.module';
import {ModalModule} from 'ngx-bootstrap/modal';

@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    ButtonModule,
    FormsModule,
    AutoCompleteModule,
    SharedPlantModule,
    ModalModule.forRoot()
  ],
  declarations: [
    PlantAutoCompleteComponent,
  ],
  exports: [
    PlantAutoCompleteComponent,
  ]
  ,
  providers: [
    PlantService,
    SharedPlantListService
  ]
})
export class PlantAutoCompleteModule {
}
