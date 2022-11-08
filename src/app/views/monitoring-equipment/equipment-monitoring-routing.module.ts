import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EquipmentMonitoringListComponent} from './list/equipment-monitoring-list.component';


const routes: Routes = [
      { path: '', component: EquipmentMonitoringListComponent, data: { title: 'equipment-monitoring' }}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EquipmentMonitoringRoutingModule {}
