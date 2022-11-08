import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DassSharedModule } from '../../../shared/dass-shared.module';
import { AutoCompleteModule } from 'primeng';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import { ProjectAutoCompleteComponent } from './project-auto-complete.component';
import { ProjectService } from 'app/services/dto-services/project/project.service';

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
    ProjectAutoCompleteComponent,
  ],
  exports: [
    ProjectAutoCompleteComponent,
  ]
  ,
  providers: [ProjectService]
})
export class ProjectAutoCompleteModule {
}
