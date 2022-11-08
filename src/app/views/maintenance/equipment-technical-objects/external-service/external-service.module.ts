/**
 * Created by reis on 29.07.2019.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CheckboxModule, ConfirmDialogModule, KeyFilterModule, TooltipModule} from 'primeng';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {DassSharedModule} from '../../../../shared/dass-shared.module';
import {ExternalServiceModuleRoutes} from './external-service-routing.module';
import {SharedExternalServiceModule} from './shared-external-service.module';
import {ExternalServiceListComponent} from './list/list.component';
import {ExternalServiceService} from '../../../../services/dto-services/maintenance-equipment/external-service.service';
import {EditExternalServiceComponent} from './edit/edit.component';
import {ExternalServiceDetailComponent} from './detail/detail.component';


@NgModule({
    imports: [
        CheckboxModule,
        ConfirmDialogModule,
        CommonModule,
        DassSharedModule,
        FormsModule,
        ModalModule.forRoot(),
        TooltipModule,
        KeyFilterModule,
        ExternalServiceModuleRoutes,
        SharedExternalServiceModule
    ],
    declarations: [ExternalServiceListComponent, EditExternalServiceComponent, ExternalServiceDetailComponent],
    exports: [
        ExternalServiceListComponent
    ],
    providers: [ExternalServiceService]
})
export class ExternalServiceModule {
}
