/**
 * Created by reis on 29.07.2019.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CheckboxModule, ConfirmDialogModule, KeyFilterModule, TooltipModule} from 'primeng';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {CategoryDetailComponent} from './detail/detail.component';
import {DassSharedModule} from '../../../../shared/dass-shared.module';
import {EditCategoryComponent} from './edit/edit.component';
import {EquipmentCategoryModuleRoutes} from './category-routing.module';
import {NewCategoryComponent} from './new/new.component';
import {CategoryListComponent} from './list/list.component';
import {EquipmentCategoryService} from '../../../../services/dto-services/maintenance-equipment/equipment-category.service';
import { MaintenanceSharedModule } from '../../maintenance-shared.module';
import {SharedCategoryModule} from './shared-category.module';


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
    SharedCategoryModule,
    EquipmentCategoryModuleRoutes,
    MaintenanceSharedModule
  ],
  declarations: [CategoryListComponent, EditCategoryComponent],
  providers: [EquipmentCategoryService]
})
export class EquipmentCategoryModule {
}
