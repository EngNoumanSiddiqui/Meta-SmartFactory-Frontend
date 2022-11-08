import {ListSkillMatrixSamplingValueComponent} from './list/list.component';
import {DetailSkillMatrixSamplingValueComponent} from './detail/detail.component';
import {EditSkillMatrixSamplingValueComponent} from './edit/edit.component';
import {NewSkillMatrixSamplingValueComponent} from './new/new.component';
import {FormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AutoCompleteModule, ColorPickerModule, ConfirmDialogModule, TooltipModule} from 'primeng';
import {DassSharedModule} from '../../../shared/dass-shared.module';
import {ModalModule} from 'ngx-bootstrap/modal';
import { SkillMatrixSamplingValueRoutingModule } from './skill-matrix-sampling-value-routing.module';
import { SkillMatrixSamplingValueService } from 'app/services/dto-services/skill-matrix-report/skill-matrix-sampling-value.service';
@NgModule({
  imports: [
    CommonModule,
    ConfirmDialogModule,
    DassSharedModule,
    FormsModule,
    ModalModule.forRoot(),
    SkillMatrixSamplingValueRoutingModule,
    TooltipModule,
    ColorPickerModule,
    AutoCompleteModule,
  ],
  declarations: [
    NewSkillMatrixSamplingValueComponent,
    EditSkillMatrixSamplingValueComponent,
    DetailSkillMatrixSamplingValueComponent,
    ListSkillMatrixSamplingValueComponent,
  ],
  providers: [SkillMatrixSamplingValueService]
})
export class SkillMatrixSamplingValueModule {
}
