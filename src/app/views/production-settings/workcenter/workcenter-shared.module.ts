import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DassSharedModule } from '../../../shared/dass-shared.module';
/**
 * COMPONENTS
 */
import { DetailWorkcenterComponent } from './detail/detail.component';
import { NewWorkcenterComponent } from './new/new.component';
import { FormsModule } from '@angular/forms';
import { PlantAutoCompleteModule } from 'app/views/auto-completes/plant-auto-complete/plant-autocomplete-module';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PlantAutoCompleteModule,
    ModalModule.forRoot(),
    DassSharedModule,
  ],
  declarations: [ DetailWorkcenterComponent, NewWorkcenterComponent ],
  exports: [ DetailWorkcenterComponent, NewWorkcenterComponent ],
  providers: []
})

export class WorkcenterSharedModule {
}
