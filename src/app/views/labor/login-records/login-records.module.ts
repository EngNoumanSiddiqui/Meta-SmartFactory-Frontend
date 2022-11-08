import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { SharedModule, TabViewModule, TreeTableModule } from 'primeng';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import { FormsModule } from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import { TreeModule } from 'primeng/tree';
import { ImageModule } from 'app/views/image/image-module';
import { TableModule } from 'primeng/table';
import { WorkStationAutoCompleteModule } from 'app/views/auto-completes/ws-auto-complete/workstation-autocomplete-module';
import { LoginRecordsRoutingModule } from './login-records.routing';
import { LoginRecordsService } from 'app/services/dto-services/login-records-service/login-records.service';
import { EmployeeAutoCompleteModule } from 'app/views/auto-completes/employee-auto-complete/employee-autocomplete-module';

@NgModule({
  declarations: [ListComponent],
  imports: [
    CommonModule,
    DassSharedModule,
    FormsModule,
    ModalModule.forRoot(),
    LoginRecordsRoutingModule,
    SharedModule,
    TabsModule,
    TabViewModule,
    TooltipModule,
    TreeModule,
    ImageModule,
    TableModule,
    TreeTableModule,
    WorkStationAutoCompleteModule,
    EmployeeAutoCompleteModule
  ],
  providers: [LoginRecordsService]
})
export class LoginRecordsModule { }
