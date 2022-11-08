import {NgModule} from '@angular/core';
import {ConfirmDialogModule, KeyFilterModule, TooltipModule} from 'primeng';
import {CommonModule} from '@angular/common';
import {DassSharedModule} from '../../../../shared/dass-shared.module';
import {FormsModule} from '@angular/forms';
import {NewEquipmentPlannerGroupComponent} from './new/new.component';
import {EquipmentPlannerGroupService} from '../../../../services/dto-services/maintenance-equipment/planner-group.service';
import {PlantAutoCompleteModule} from '../../../auto-completes/plant-auto-complete/plant-autocomplete-module';
import { EquipmentPlannerGroupDetailComponent } from './detail/detail.component';


@NgModule({
  imports: [
    ConfirmDialogModule,
    CommonModule,
    DassSharedModule,
    FormsModule,
    TooltipModule,
    KeyFilterModule,
    PlantAutoCompleteModule,
  ],
  declarations: [
    NewEquipmentPlannerGroupComponent,
    EquipmentPlannerGroupDetailComponent
  ],
  providers: [
    EquipmentPlannerGroupService
  ],
  exports: [
    NewEquipmentPlannerGroupComponent,
    EquipmentPlannerGroupDetailComponent
  ]
})
export class SharedEquipmentPlannerGroupModule {
}
