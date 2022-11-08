import { Injector, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ServiceLocator } from 'app/services/dto-services/job-order/service-location.service';


const routes: Routes = [
    { path: '', data: { title: 'manufacturing-planning-system' },
        children: [
            {
                path: '', redirectTo: 'advance', pathMatch: 'full'
            },
            { 
                path: 'advance', loadChildren: () => import('./advance-manufacturing/advance-manufacturing.module')
                .then(m => m.AdvanceManufacturingModule)
            },
            {
                path: 'basic', loadChildren: () => import('./basic-manufacturing/basic-manufacturing.module')
                .then(m => m.BasicManufacturingModule)
            }
        ]
    }
]


@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ]
})
export class ManufacturingPlanningSystemModule {
    constructor(private injector: Injector){    // Create global Service Injector.
        ServiceLocator.injector = this.injector;
    }
 }
