import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DassSharedModule} from '../../../shared/dass-shared.module';
import {AutoCompleteModule} from 'primeng';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {SharedMaintenanceCategoryModule} from '../../maintenance/maintenance-technical-objects/maintenance-category/shared-maintenance-category.module';
import {MaintenanceCategoryAutoCompleteComponent} from './maintenance-category-auto-complete.component';
import {MaintenanceCategoryService} from '../../../services/dto-services/maintenance-equipment/maintenance-category.service';

@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    ButtonModule,
    FormsModule,
    AutoCompleteModule,
    ModalModule.forRoot(),
    SharedMaintenanceCategoryModule
  ],
  declarations: [
    MaintenanceCategoryAutoCompleteComponent,
  ],
  exports: [
    MaintenanceCategoryAutoCompleteComponent,
  ]
  ,
  providers: [MaintenanceCategoryService

  ]
})
export class MaintenanceCategoryAutoCompleteModule {
}
