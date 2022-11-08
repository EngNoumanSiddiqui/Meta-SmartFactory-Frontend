/**
 * Created by reis on 29.07.2019.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CheckboxModule, ConfirmDialogModule, KeyFilterModule, TooltipModule} from 'primeng';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {CodeGroupHeaderDetailComponent} from './detail/detail.component';
import {DassSharedModule} from '../../../../shared/dass-shared.module';
import {EditCodeGroupHeaderComponent} from './edit/edit.component';
import {EquipmentCodeGroupHeaderModuleRoutes} from './code-group-header-routing.module';
import {NewCodeGroupHeaderComponent} from './new/new.component';
import {CodeGroupHeaderListComponent} from './list/list.component';
import {EquipmentCodeGroupHeaderService} from '../../../../services/dto-services/maintenance-equipment/code-group-header.service';
import {EquipmentCodeGroupService} from '../../../../services/dto-services/maintenance-equipment/code-group.service';
import {EquipmentCodeGroupAutoCompleteModule} from '../../../auto-completes/equipment-code-group-auto-complete/equipment-code-group-autocomplete-module';
import { SharedEquipmentCodeGroupHeaderModule } from './shared-code-group-header.module';


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
    EquipmentCodeGroupHeaderModuleRoutes,
    EquipmentCodeGroupAutoCompleteModule,
    SharedEquipmentCodeGroupHeaderModule
  ],
  declarations: [CodeGroupHeaderListComponent, NewCodeGroupHeaderComponent, EditCodeGroupHeaderComponent],
  providers: [EquipmentCodeGroupHeaderService, EquipmentCodeGroupService]
})
export class EquipmentCodeGroupHeaderModule {
}
