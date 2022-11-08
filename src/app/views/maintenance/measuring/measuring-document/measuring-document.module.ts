import {FormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AutoCompleteModule, ConfirmDialogModule, TooltipModule} from 'primeng';
import {DassSharedModule} from '../../../../shared/dass-shared.module';
import {ListboxModule} from 'primeng/listbox';
import {ModalModule} from 'ngx-bootstrap/modal';
import {ImageModule} from '../../../image/image-module';
import {NewMeasuringDocumentComponent} from './new/new.component';
import {EditMeasuringDocumentComponent} from './edit/edit.component';
import {ListMeasuringDocumentComponent} from './list/list.component';
import {MeasuringDocumentRoutingModule} from './measuring-document-routing.module';
import {DetailMeasuringDocumentComponent} from './detail/detail.component';
import {MeasuringDocumentService} from '../../../../services/dto-services/measuring/measuring-document.service';
import {SharedMeasuringPointModule} from '../measuring-point/shared-measuring-point.module';
import {EmployeeAutoCompleteModule} from '../../../auto-completes/employee-auto-complete/employee-autocomplete-module';
@NgModule({
  imports: [
    CommonModule,
    ConfirmDialogModule,
    DassSharedModule,
    ImageModule,
    FormsModule,
    ListboxModule,
    ModalModule.forRoot(),
    MeasuringDocumentRoutingModule,
    TooltipModule,
    AutoCompleteModule,
    SharedMeasuringPointModule,
    EmployeeAutoCompleteModule
  ],
  declarations: [

    // Maintenance
    DetailMeasuringDocumentComponent,
    NewMeasuringDocumentComponent,
    EditMeasuringDocumentComponent,
    ListMeasuringDocumentComponent,

  ],
  providers: [MeasuringDocumentService]
})
export class MeasuringDocumentModule {
}
