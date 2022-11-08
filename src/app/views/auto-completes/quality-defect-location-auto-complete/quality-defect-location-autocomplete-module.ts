import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DassSharedModule} from '../../../shared/dass-shared.module';

import {AutoCompleteModule} from 'primeng';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import { DefectLocationsService } from 'app/services/dto-services/defect-location/defect-locations.service';
import { QualityDefectLocationAutoCompleteComponent } from './quality-defect-location-auto-complete.component';
import { DefectLocationModule } from 'app/views/quality-control-system/quality-settings/defect-location/defect-location.module';

@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,

    ButtonModule,
    FormsModule,
    AutoCompleteModule,
    ModalModule.forRoot(),
    DefectLocationModule
  ],
  declarations: [
    QualityDefectLocationAutoCompleteComponent,
  ],
  exports: [
    QualityDefectLocationAutoCompleteComponent,
  ]
  ,
  providers: [
    DefectLocationsService
  ]
})
export class QualityDefectLocationAutoCompleteModule {
}
