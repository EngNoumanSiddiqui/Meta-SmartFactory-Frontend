import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ListComponent} from './list/list.component';
import {AutoCompleteModule, ColorPickerModule, ConfirmDialogModule, ListboxModule, PickListModule} from 'primeng';
import {DassSharedModule} from 'app/shared/dass-shared.module';
import {ImageModule} from 'app/views/image/image-module';
import {FormsModule} from '@angular/forms';
import { CompanyService } from 'app/services/dto-services/company/company.service';
import {ModalModule} from 'ngx-bootstrap/modal';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import { OrganizationRoutingModule } from './organization-routing.module';
import { SharedOrganizationModule } from './shared-organization.module';
import { OrganizationService } from 'app/services/dto-services/organization/organization.service';
@NgModule({
  declarations: [ListComponent],
  imports: [
    CommonModule,
    OrganizationRoutingModule,
    ConfirmDialogModule,
    DassSharedModule,
    ImageModule,
    FormsModule,
    ListboxModule,
    ModalModule.forRoot(),
    PickListModule,
    TooltipModule,
    ColorPickerModule,
    AutoCompleteModule,
    SharedOrganizationModule
  ], providers: [CompanyService, OrganizationService],
})
export class OrganizationModule {
}
