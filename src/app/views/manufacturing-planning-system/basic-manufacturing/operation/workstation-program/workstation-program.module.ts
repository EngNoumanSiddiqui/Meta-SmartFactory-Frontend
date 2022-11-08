/**
 * Created by reis on 29.07.2019.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxModule, ConfirmDialogModule, KeyFilterModule, TooltipModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { WorkstationProgramModuleRoutes } from './workstation-program-routing.module';
import { SharedWorkstationProgramModule } from './shared-workstation-program.module';
import { WorkstationProgramListComponent } from './list/list.component';
import { EditWorkstationProgramComponent } from './edit/edit.component';
import { UnitAutoCompleteModule } from 'app/views/auto-completes/unit-auto-complete/unit-autocomplete-module';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import {ModalModule} from 'ngx-bootstrap/modal';
import { WorkstationProgramDetailComponent } from './detail/detail.component';
import { WorkstationProgramService } from 'app/services/dto-services/product-tree/worksation-program.service';


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
    WorkstationProgramModuleRoutes,
    SharedWorkstationProgramModule,
    UnitAutoCompleteModule
  ],
  declarations: [WorkstationProgramListComponent, EditWorkstationProgramComponent, WorkstationProgramDetailComponent],
  providers: [WorkstationProgramService]
})
export class WorkstationProgramModule {
}
