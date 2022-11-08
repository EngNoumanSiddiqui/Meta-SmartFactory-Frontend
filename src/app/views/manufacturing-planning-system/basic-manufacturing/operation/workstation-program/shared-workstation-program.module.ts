/**
 * Created by reis on 29.07.2019.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import { UnitAutoCompleteModule } from 'app/views/auto-completes/unit-auto-complete/unit-autocomplete-module';
import { NewWorkstationProgramComponent } from './new/new.component';
import { WorkstationProgramService } from 'app/services/dto-services/product-tree/worksation-program.service';


@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    FormsModule,
    TooltipModule,
    UnitAutoCompleteModule
  ],
  declarations: [NewWorkstationProgramComponent],
  exports: [NewWorkstationProgramComponent],
  providers: [WorkstationProgramService]
})
export class SharedWorkstationProgramModule {
}
