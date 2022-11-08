import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ListProductTreeComponent } from './product-tree/list/list.component';
import { JobOrderSchedulerComponent } from '../advance-manufacturing/schedular/joborder-scheduler.component';
import { BasicManufacturingSharedModule } from './basic-manufacturing-planning.shared.module';
import { ProductDetailItemCommunicatingService } from './product-detail-item.service';
import { CloneProductTreeComponent } from './product-tree/clone/clone-product-tree.component';
import { ConfirmDialogModule, DialogModule } from 'primeng';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import { StockAutoCompleteModule } from 'app/views/auto-completes/stock-auto-complete/stock-autocomplete-module';
import { FormsModule } from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import { WorkstationProgramAutoCompleteModule } from 'app/views/auto-completes/workstation-program-auto-complete/workstation-program-autocomplete-module';
import { EquipmentAutoCompleteModule } from 'app/views/auto-completes/equipment-auto-complete/equipment-autocomplete-module';
import { SharedMaterialModule } from 'app/views/inventory-management/warehouse-management-system/basic-warehouse-managment/material-cards/shared-material-module';
import { SharedOperationsModule } from 'app/views/production-settings/operations/shared-operations.module';
import { SharedEquipmentsModule } from 'app/views/maintenance/equipment-technical-objects/equipment/shared-equipment.module';
import { UnitAutoCompleteModule } from 'app/views/auto-completes/unit-auto-complete/unit-autocomplete-module';
import { PlantAutoCompleteModule } from 'app/views/auto-completes/plant-auto-complete/plant-autocomplete-module';
import { WorkStationAutoCompleteModule } from 'app/views/auto-completes/ws-auto-complete/workstation-autocomplete-module';
import { MySchedulerModule } from 'app/components/scheduler/scheduler.module';
import { CurrencyAutoCompleteModule } from 'app/views/auto-completes/currency-auto-complete/currency-autocomplete-module';
import { ScheduleReportService } from 'app/services/dto-services/schedule-report/schedule-report.service';


const routes: Routes = [
    { path: '', data: { title: 'basic-manufacturing-planning' },
        children: [
            {path: 'management/product-tree', component: ListProductTreeComponent, data: {title: 'product-trees'}},
            {path: 'management', loadChildren: () => import('./job-order/job-order.module').then(m => m.JobOrderModule)},
            {path: 'management/projects', loadChildren: () => import('./projects/projects.module').then(m => m.ProjectModule)},
            {path: 'management/production-manual', component: JobOrderSchedulerComponent, data: {title: 'production-schedule'}},

        ]
    }
]


@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        BasicManufacturingSharedModule,
        ConfirmDialogModule,
        DassSharedModule,
        StockAutoCompleteModule,
        MySchedulerModule,
        DialogModule,
        FormsModule,
        ModalModule.forRoot(),
        WorkstationProgramAutoCompleteModule,
        EquipmentAutoCompleteModule,
        SharedMaterialModule,
        SharedOperationsModule,
        SharedEquipmentsModule,
        UnitAutoCompleteModule,
        PlantAutoCompleteModule,
        CurrencyAutoCompleteModule,
        WorkStationAutoCompleteModule
    ],
    declarations: [
        ListProductTreeComponent,
        CloneProductTreeComponent,
        JobOrderSchedulerComponent
    ],
    providers: [ProductDetailItemCommunicatingService, ScheduleReportService]
})
export class BasicManufacturingModule { }
