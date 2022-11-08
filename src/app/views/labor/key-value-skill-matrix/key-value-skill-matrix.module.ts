import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmployeeCapabilityService } from 'app/services/dto-services/employee/employee-capabilities.service';
import { EmployeeSkillService } from 'app/services/dto-services/employee/employee-skills.service';
import { EmployeeService } from 'app/services/dto-services/employee/employee.service';
import { SkillCategoryService } from 'app/services/dto-services/employee/skill-category.service';
import { OperationService } from 'app/services/dto-services/operation/operation.service';
import { SubOperationService } from 'app/services/dto-services/operation/sub-operation.service';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import { OperationAutoCompleteModule } from 'app/views/auto-completes/operation-auto-complete/operation-autocomplete-module';
import { StockAutoCompleteModule } from 'app/views/auto-completes/stock-auto-complete/stock-autocomplete-module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ConfirmDialogModule, TooltipModule } from 'primeng';
import {RadioButtonModule} from 'primeng/radiobutton';
import { KeyValueSKillRoutingModule } from './key-value-skill-matrix-routing.module';
import { KeyValueSKillListComponent } from './list/list.component';

@NgModule({
  declarations: [KeyValueSKillListComponent],
  imports: [
    CommonModule,
    ConfirmDialogModule,
    DassSharedModule,
    FormsModule,
    ModalModule.forRoot(),
    TooltipModule,
    RadioButtonModule,
    OperationAutoCompleteModule,
    StockAutoCompleteModule,
    KeyValueSKillRoutingModule
  ],
  providers: [EmployeeSkillService, EmployeeService, OperationService,
    SubOperationService, SkillCategoryService, EmployeeCapabilityService],
})
export class KeyValueSKillModule { }
