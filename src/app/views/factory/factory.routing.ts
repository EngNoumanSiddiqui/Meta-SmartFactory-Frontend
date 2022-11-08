import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    // { path: '', redirectTo: 'factory', pathMatch: 'full', },
    { path: '', data: { title: 'factory' },
        children: [
            { path: 'calendar', loadChildren: () => import('./factory-calendar/factory-calendar.module').then(m => m.FactoryCalendarModule)},
            // { path: 'calendarholidays', loadChildren: () => import('./factory-calendar-holidays/factory-calendar-holidays.module').then(m => m.FactoryCalendarHolidaysModule)},
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class FacotryRoutingModule { }
