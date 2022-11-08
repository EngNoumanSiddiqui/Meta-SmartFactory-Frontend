import {FormsModule} from '@angular/forms';
import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AutoCompleteModule, ConfirmDialogModule} from 'primeng';
import {DassSharedModule} from '../../../shared/dass-shared.module';
import {ModalModule} from 'ngx-bootstrap/modal';
import { WorkStationTypeAutoCompleteModule } from 'app/views/auto-completes/ws-type-auto-complete/workstation-type-autocomplete-module';
import { OpTypeToWSTypeRoutingModule } from './op-type-to-ws-type-routing.module';
import { NewComponent } from './new/new.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';
import { OperationTypeToWSTypeService } from 'app/services/dto-services/operation/operation-type-to-ws-type.service';
import { SettingsSharedModule } from '../settings-shared.module';
@NgModule({
  imports: [
    CommonModule,
    ConfirmDialogModule,
    DassSharedModule,
    FormsModule,
    ModalModule.forRoot(),
    OpTypeToWSTypeRoutingModule,
    AutoCompleteModule,
    WorkStationTypeAutoCompleteModule,
    SettingsSharedModule
  ],
  declarations: [
    ListComponent,
    NewComponent,
    EditComponent
  ],
  providers: [OperationTypeToWSTypeService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OpTypeToWSTypeModule {
}
