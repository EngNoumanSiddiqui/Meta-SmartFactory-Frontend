import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import {ModalModule} from 'ngx-bootstrap/modal';
import { ProjectListComponent } from './list/list.component';
import { ProjectNewComponent } from './new/new.component';
import { ProjectDetailsComponent } from './detail/detail.component';
import { ProjectService } from 'app/services/dto-services/project/project.service';
import { ProjectRoutingModule } from './projects.routing';
import { EmployeeAutoCompleteModule } from 'app/views/auto-completes/employee-auto-complete/employee-autocomplete-module';
import { MileStoneDetailsComponent } from './milestone-details/detail.component';
import { ProjectTaskDetailsComponent } from './project-task-details/detail.component';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ProjectRoutingModule,
        ConfirmDialogModule,
        DassSharedModule,
        ModalModule.forRoot(),
        EmployeeAutoCompleteModule
    ],
    exports: [ProjectDetailsComponent, MileStoneDetailsComponent, ProjectTaskDetailsComponent],
    declarations: [
        ProjectListComponent,
        ProjectNewComponent,
        MileStoneDetailsComponent,
        ProjectTaskDetailsComponent,
        ProjectDetailsComponent
    ],
    providers: [ProjectService],
})
export class ProjectModule { }
