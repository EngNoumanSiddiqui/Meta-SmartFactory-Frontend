/**
 * Created by reis on 29.07.2019.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CheckboxModule, ConfirmDialogModule, TooltipModule} from 'primeng';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {DassSharedModule} from '../../../../shared/dass-shared.module';
import { ScheduleCallListComponent } from './list/list.component';
import { NewScheduleCallComponent } from './new/new.component';
import { EditScheduleCallComponent } from './edit/edit.component';
import { ScheduleCallDetailComponent } from './detail/detail.component';
import { MaintenancePlanScheduleCallService } from 'app/services/dto-services/maintenance/maintenance-plan-schedule-call.service';
import { UnitAutoCompleteModule } from 'app/views/auto-completes/unit-auto-complete/unit-autocomplete-module';

@NgModule({
  imports: [
    CheckboxModule,
    ConfirmDialogModule,
    CommonModule,
    DassSharedModule,
    FormsModule,
    ModalModule.forRoot(),
    TooltipModule,
    UnitAutoCompleteModule
  ],
  declarations: [ScheduleCallListComponent, NewScheduleCallComponent, EditScheduleCallComponent, ScheduleCallDetailComponent],
  exports: [ScheduleCallListComponent],
  providers: [MaintenancePlanScheduleCallService]
})
export class ScheduleCallModule {
}
