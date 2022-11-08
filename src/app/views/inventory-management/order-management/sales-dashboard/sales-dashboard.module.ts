import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SalesDashboardComponent } from './sales-dash/sales-dash.component';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import {ModalModule} from 'ngx-bootstrap/modal';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { ProgressSpinnerModule, ProgressBarModule, CalendarModule, PanelModule, CardModule } from 'primeng';
import { SalesModule } from '../sales/sales.module';
import { JobOrderModule } from 'app/views/manufacturing-planning-system/basic-manufacturing/job-order/job-order.module';


const routes: Routes = [
    { path: '', data: { title: 'sales-dashboard' },
    children: [
        { path: '', redirectTo: 'view', pathMatch: 'full'},
        {path: 'view', component: SalesDashboardComponent, data: { title: 'sales-dashboard' }}
    ]
 }
]



@NgModule({
    imports: [
        CommonModule,
        DassSharedModule,
        ModalModule.forRoot(),
        CardModule,
        SalesModule,
        JobOrderModule,
        CalendarModule,
        PanelModule,
        ProgressBarModule,
        ProgressSpinnerModule,
        NgCircleProgressModule.forRoot({
            'innerStrokeColor': '#ffffff',
            'innerStrokeWidth': 5,
          }),

        RouterModule.forChild(routes)
    ],
    declarations: [SalesDashboardComponent]
})
export class SalesDashboardModule { }
