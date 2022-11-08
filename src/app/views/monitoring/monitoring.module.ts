import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MonitoringRoutingModule} from './monitoring-routing.module';
import {ListMonitoringComponent} from './list/list.component';
import {ModalContentComponent} from './modal/modal.component';
import {FormsModule} from '@angular/forms';
import {DassSharedModule} from '../../shared/dass-shared.module';
import {TooltipModule} from 'primeng';
import {ModalModule} from 'ngx-bootstrap/modal';
import {FactoryModalDetailComponent} from './monitor-detail/monitoring-detail.component';
import {NgCircleProgressModule} from 'ng-circle-progress';
import {MonitoringStopTemplateComponent} from './stop-component/stop-template.component';
import { FactoryModalLaborDetailComponent } from './monitor-labor-detail/monitor-labor-detail.component';
import { EquipmentMonitoringModule } from '../monitoring-equipment/equipment-monitoring.module';
import { ScrapReworkChartTemplateComponent } from './scrap-rework-chart-component/scrap-rework-chart.component';

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
    MonitoringRoutingModule,
    DassSharedModule,
    TooltipModule,
    ModalModule.forRoot(),
    EquipmentMonitoringModule
  ],
  declarations: [
    ListMonitoringComponent,
    ModalContentComponent,
    FactoryModalDetailComponent,
    FactoryModalLaborDetailComponent,
    MonitoringStopTemplateComponent,
    ScrapReworkChartTemplateComponent
  ],
  entryComponents: [
    ModalContentComponent
  ],
  providers: [
  ]
})
export class MonitoringModule {
}
