import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import { EmployeeCapabilityService } from 'app/services/dto-services/employee/employee-capabilities.service';
import { EmployeeService } from 'app/services/dto-services/employee/employee.service';
import { ShiftSettingsComponent } from './shift-settings.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { ShiftSettingDetailComponent } from './detail/detail.component';
import { PlantAutoCompleteModule } from 'app/views/auto-completes/plant-auto-complete/plant-autocomplete-module';

@NgModule({
    declarations: [
        ShiftSettingsComponent,
        ShiftSettingDetailComponent
    ],
    exports: [
        ShiftSettingsComponent,
        ShiftSettingDetailComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ConfirmDialogModule,
        DassSharedModule,
        PlantAutoCompleteModule,
        ModalModule.forRoot(),
    ],
    providers: [EmployeeCapabilityService, EmployeeService]
})
export class SharedShiftSettingsModule { }
