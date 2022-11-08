import {FormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DassSharedModule} from '../../../../shared/dass-shared.module';
import {MeasuringPointRoutingModule} from './measuring-point-routing.module';
import {SharedMeasuringPointModule} from './shared-measuring-point.module';
import { UnitAutoCompleteModule } from 'app/views/auto-completes/unit-auto-complete/unit-autocomplete-module';
@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    FormsModule,
    MeasuringPointRoutingModule,
    SharedMeasuringPointModule
  ],
  declarations: [],
  providers: []
})
export class MeasuringPointModule {
}
