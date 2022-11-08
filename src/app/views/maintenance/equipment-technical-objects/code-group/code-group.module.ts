/**
 * Created by reis on 29.07.2019.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CheckboxModule, ConfirmDialogModule, KeyFilterModule, TooltipModule} from 'primeng';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {DassSharedModule} from '../../../../shared/dass-shared.module';
import {EditCodeGroupComponent} from './edit/edit.component';
import {EquipmentCodeGroupModuleRoutes} from './code-group-routing.module';
import {NewCodeGroupComponent} from './new/new.component';
import {CodeGroupListComponent} from './list/list.component';
import {EquipmentCodeGroupService} from '../../../../services/dto-services/maintenance-equipment/code-group.service';
import { SharedEquipmentCodeGroupModule } from './shared-code-group.module';


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
    EquipmentCodeGroupModuleRoutes,
    SharedEquipmentCodeGroupModule
  ],
  declarations: [CodeGroupListComponent, NewCodeGroupComponent, EditCodeGroupComponent ],
  providers: [EquipmentCodeGroupService]
})
export class EquipmentCodeGroupModule {
}
