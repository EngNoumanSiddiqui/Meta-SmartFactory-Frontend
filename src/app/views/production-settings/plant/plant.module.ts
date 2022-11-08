import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ListComponent} from './list/list.component';
import {PlantRoutingModule} from './plant-routing.module';
import {AutoCompleteModule, ConfirmDialogModule} from 'primeng';
import {DassSharedModule} from 'app/shared/dass-shared.module';
import {ImageModule} from 'app/views/image/image-module';
import {FormsModule} from '@angular/forms';
import {SharedPlantModule} from './shared-plant.module';
import { CompanyService } from 'app/services/dto-services/company/company.service';
import {ModalModule} from 'ngx-bootstrap/modal';
@NgModule({
  declarations: [ListComponent],
  imports: [
    CommonModule,
    PlantRoutingModule,
    ConfirmDialogModule,
    DassSharedModule,
    ImageModule,
    FormsModule,
    ModalModule.forRoot(),
    AutoCompleteModule,
    SharedPlantModule
  ], providers: [CompanyService],
})
export class PlantModule {
}
