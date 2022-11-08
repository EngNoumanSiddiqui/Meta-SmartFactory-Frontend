/**
 * Created by reis on 29.07.2019.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CheckboxModule, ConfirmDialogModule, KeyFilterModule, TooltipModule} from 'primeng';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {PlantAutoCompleteModule} from '../../../auto-completes/plant-auto-complete/plant-autocomplete-module';
import {EquipmentPlannerGroupDetailComponent} from './detail/detail.component';
import {ListEquipmentPlannerGroupComponent} from './list/planner-group-list.component';
import {EquipmentPlannerGroupService} from '../../../../services/dto-services/maintenance-equipment/planner-group.service';
import {SharedEquipmentPlannerGroupModule} from './shared-planner-gruop-module';
import {DassSharedModule} from '../../../../shared/dass-shared.module';
import {EditEquipmentPlannerGroupComponent} from './edit/edit.component';
import {PlannerGroupModuleRoutes} from './planner-group-routing.module';


@NgModule({
  imports: [
    CheckboxModule,
    ConfirmDialogModule,
    CommonModule,
    DassSharedModule,
    FormsModule,
    ModalModule.forRoot(),
    TooltipModule,
    KeyFilterModule,
    PlantAutoCompleteModule,
    SharedEquipmentPlannerGroupModule,
    PlannerGroupModuleRoutes
  ],
  declarations: [ EditEquipmentPlannerGroupComponent, ListEquipmentPlannerGroupComponent],
  providers: [EquipmentPlannerGroupService]
})
export class EquipmentPlannerGroupModule {
}
