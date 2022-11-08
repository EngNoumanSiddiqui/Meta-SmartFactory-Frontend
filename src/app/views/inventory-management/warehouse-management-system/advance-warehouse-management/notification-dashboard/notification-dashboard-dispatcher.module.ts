import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import {ModalModule} from 'ngx-bootstrap/modal';
import { CardModule, CalendarModule, PanelModule, ProgressBarModule, ProgressSpinnerModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { NotificationDashboardComponent } from './notification-dashboard';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { TransferNotificationModule } from '../transfer-notifications/transfer-notifications.module';
import { NotificationDashboardRouting } from './notification-dashboard.routing';

@NgModule({
    imports: [
        CommonModule,
        DassSharedModule,
        FormsModule,
        ModalModule.forRoot(),
        NotificationDashboardRouting,
        CardModule,
        CalendarModule,
        PanelModule,
        ProgressBarModule,
        ProgressSpinnerModule,
        NgCircleProgressModule.forRoot({
            'innerStrokeColor': '#ffffff',
            'innerStrokeWidth': 5,
          }),
        TransferNotificationModule
    ],
    declarations: [NotificationDashboardComponent],
    exports: [NotificationDashboardComponent]
})
export class NotificationDashboardDispatcherModule { }

