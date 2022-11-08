/**
 * Created by reis on 29.07.2019.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CheckboxModule, ConfirmDialogModule, KeyFilterModule, TooltipModule} from 'primeng';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {DassSharedModule} from '../../../../shared/dass-shared.module';
import {MaintenanceCategoryModuleRoutes} from './maintenance-category-routing.module';
import {SharedMaintenanceCategoryModule} from './shared-maintenance-category.module';
import {MaintenanceCategoryListComponent} from './list/list.component';
import {MaintenanceCategoryService} from '../../../../services/dto-services/maintenance-equipment/maintenance-category.service';
import {EditMaintenanceCategoryComponent} from './edit/edit.component';
import {MaintenanceCategoryDetailComponent} from './detail/detail.component';


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
    MaintenanceCategoryModuleRoutes,
    SharedMaintenanceCategoryModule
  ],
  declarations: [MaintenanceCategoryListComponent, EditMaintenanceCategoryComponent ],
  providers: [MaintenanceCategoryService]
})
export class MaintenanceCategoryModule {
}
