import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DassSharedModule } from '../../../shared/dass-shared.module';
import { AutoCompleteModule } from 'primeng';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import { CostCenterAutoCompleteComponent } from './cost-center-auto-complete.component';
import { CostCenterService } from 'app/services/dto-services/cost-center/cost-center.service';

@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    ButtonModule,
    FormsModule,
    AutoCompleteModule,
    ModalModule.forRoot()
  ],
  declarations: [
    CostCenterAutoCompleteComponent,
  ],
  exports: [
    CostCenterAutoCompleteComponent,
  ]
  ,
  providers: [CostCenterService]
})
export class CostCenterAutoCompleteModule {
}
