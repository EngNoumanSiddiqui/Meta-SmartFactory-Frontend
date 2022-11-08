import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import {ModalModule} from 'ngx-bootstrap/modal';
import { CardModule, CalendarModule, PanelModule, ProgressBarModule, ProgressSpinnerModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { TransferNotificationModule } from '../transfer-notifications/transfer-notifications.module';
import { NotificationMobileDashboardRouting } from './notification-mobile-dashboard.routing';
import { NotificationMobileDashboardComponent } from './notification-mobile-dashboard';

@NgModule({
    imports: [
        CommonModule,
        DassSharedModule,
        FormsModule,
        ModalModule.forRoot(),
        NotificationMobileDashboardRouting,
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
    declarations: [NotificationMobileDashboardComponent],
    exports: [NotificationMobileDashboardComponent]
    
})
export class NotificationMobileDashboardModule { }

