import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {DassSharedModule} from '../../shared/dass-shared.module';
import {CalendarModule, ConfirmDialogModule, TooltipModule} from 'primeng';
import {ModalModule} from 'ngx-bootstrap/modal';
import { CompanyRoutingModule } from './company-routing.module';
import { NewCompanyComponent } from './new/new.component';
import { EditCompanyComponent } from './edit/edit.component';
import { DetailCompanyComponent } from './detail/detail.component';
import { ListCompanyComponent } from './list/list.component';
import { CompanyService } from 'app/services/dto-services/company/company.service';
import { SharedPlantModule } from '../production-settings/plant/shared-plant.module';
@NgModule({
  imports: [
    CalendarModule,
    ConfirmDialogModule,
    CommonModule,
    CompanyRoutingModule,
    DassSharedModule,
    FormsModule,
    ModalModule.forRoot(),
    TooltipModule,
    SharedPlantModule
  ],
  declarations: [
    ListCompanyComponent,
    NewCompanyComponent,
    EditCompanyComponent,
    DetailCompanyComponent
  ],
  providers: [
    CompanyService
  ]
})
export class CompanyModule {
}
