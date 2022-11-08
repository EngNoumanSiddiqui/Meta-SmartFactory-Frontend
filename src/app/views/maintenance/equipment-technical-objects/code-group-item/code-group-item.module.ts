/**
 * Created by reis on 29.07.2019.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CheckboxModule, ConfirmDialogModule, KeyFilterModule, TooltipModule} from 'primeng';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {CodeGroupItemDetailComponent} from './detail/detail.component';
import {DassSharedModule} from '../../../../shared/dass-shared.module';
import { EditCodeGroupItemsComponent} from './edit/edit.component';
import {NewCodeGroupItemComponent} from './new/new.component';
import {CodeGroupItemListComponent} from './list/list.component';
import {EquipmentCodeGroupItemModuleRoutes} from './code-group-item-routing.module';
import {EquipmentCodeGroupItemService} from '../../../../services/dto-services/maintenance-equipment/code-group-item.service';
import {EquipmentCodeGroupHeaderService} from '../../../../services/dto-services/maintenance-equipment/code-group-header.service';


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
    EquipmentCodeGroupItemModuleRoutes
  ],
  declarations: [CodeGroupItemListComponent, NewCodeGroupItemComponent, EditCodeGroupItemsComponent, CodeGroupItemDetailComponent],
  providers: [EquipmentCodeGroupItemService,EquipmentCodeGroupHeaderService]
})
export class EquipmentCodeGroupItemModule {
}
