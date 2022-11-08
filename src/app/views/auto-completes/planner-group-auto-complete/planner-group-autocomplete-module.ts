import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DassSharedModule} from '../../../shared/dass-shared.module';
import {AutoCompleteModule} from 'primeng';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {PlannerGroupAutoCompleteComponent} from './planner-group-auto-complete.component';
import {EquipmentPlannerGroupService} from '../../../services/dto-services/maintenance-equipment/planner-group.service';
import {SharedEquipmentPlannerGroupModule} from '../../maintenance/equipment-technical-objects/planner-group/shared-planner-gruop-module';

@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    ButtonModule,
    FormsModule,
    AutoCompleteModule,
    ModalModule.forRoot(),
    SharedEquipmentPlannerGroupModule
  ],
  declarations: [
    PlannerGroupAutoCompleteComponent,
  ],
  exports: [
    PlannerGroupAutoCompleteComponent,
  ]
  ,
  providers: [EquipmentPlannerGroupService

  ]
})
export class PlannerGroupAutoCompleteModule {
}
