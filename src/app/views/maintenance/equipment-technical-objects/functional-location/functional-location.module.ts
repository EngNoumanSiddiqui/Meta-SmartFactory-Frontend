/**
 * Created by reis on 29.07.2019.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {SharedFunctionalLocationModule} from './shared-functional-location-module';
import {DassSharedModule} from '../../../../shared/dass-shared.module';
import {FunctionalLocationModuleRoutes} from './functional-location-routing.module';


@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    FormsModule,
    SharedFunctionalLocationModule,
    FunctionalLocationModuleRoutes
  ],
  declarations: [],
  providers: []
})
export class FunctionalLocationModule {
}
