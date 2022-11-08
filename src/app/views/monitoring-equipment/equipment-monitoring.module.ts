import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {EquipmentMonitoringRoutingModule} from './equipment-monitoring-routing.module';
import {EquipmentMonitoringListComponent} from './list/equipment-monitoring-list.component';
import {EquipmentModalContentComponent} from './modal/equipment-modal.component';
import {FormsModule} from '@angular/forms';
import {DassSharedModule} from '../../shared/dass-shared.module';
import {TooltipModule} from 'primeng';
import {ModalModule} from 'ngx-bootstrap/modal';
import {EquipmentMonitoringDetailComponent} from './monitor-detail/equipment-monitoring-detail.component';
import {NgCircleProgressModule} from 'ng-circle-progress';
import {EquipmentMonitoringTemplateComponent} from './equipment-component/equipment-template.component';
import {EquipmentSensorDataComponent} from './equipment-sensor-data-component/equipment-sensor-data.component';

@NgModule({
  imports: [
    CommonModule,
    NgCircleProgressModule.forRoot({
      // set defaults here
      'backgroundPadding': 0,
      'radius': 80,
      'space': -13,
      'unitsFontSize': '11',
      'outerStrokeGradient': true,
      'outerStrokeWidth': 13,
      'outerStrokeColor': '#4882c2',
      'outerStrokeGradientStopColor': '#53a9ff',
      'innerStrokeColor': '#e7e8ea',
      'innerStrokeWidth': 13,
      'title': '',
      'titleFontSize': '30',
      'subtitleFontSize': '52',
      'animateTitle': false,
      'animationDuration': 500,
      'showTitle': false,
      'showUnits': false,
      'showBackground': false,
      'clockwise': false,
      'responsive': true,
      'startFromZero': false,
      'titleColor': '#d6d6d6',
      'subtitleColor': '#d6d6d6',
    }),
    FormsModule,
    EquipmentMonitoringRoutingModule,
    DassSharedModule,
    TooltipModule,
    ModalModule.forRoot()
  ],
  declarations: [
    EquipmentMonitoringListComponent,
    EquipmentModalContentComponent,
    EquipmentMonitoringDetailComponent,
    EquipmentMonitoringTemplateComponent,
    EquipmentSensorDataComponent
  ],
  entryComponents: [
    EquipmentModalContentComponent
  ],
  exports: [
    EquipmentMonitoringDetailComponent,
    EquipmentMonitoringTemplateComponent,
    EquipmentSensorDataComponent
  ],
  providers: [
  ]
})
export class EquipmentMonitoringModule {
}
