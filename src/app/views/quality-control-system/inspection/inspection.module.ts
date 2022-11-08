import { NgModule } from '@angular/core';

import { ListInspectionComponent } from './list/list.component';
import { DetailInspectionComponent } from './detail/detail.component';
import { NewInspectionComponent } from './new/new.component';
import { EditInspectionComponent } from './edit/edit.component';
import { ListControlIndicator } from './control-indicators/list/list.component';
import { DetailControlIndicator } from './control-indicators/detail/detail.component';
import { NewControlIndicator } from './control-indicators/new/new.component';
import { ListControlIndicatorDataComponent } from './control-indicators-data/list/list.component';
import { DetailControlIndicatorData } from './control-indicators-data/detail/detail.component';
import { NewControlIndicatorDataComponent } from './control-indicators-data/new/new.component';
import { InspectionRoutingModule } from './inspection-routing.module';
import { FormsModule } from '@angular/forms';

import { DassSharedModule } from 'app/shared/dass-shared.module';

import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { WorkstationDashboardService } from 'app/services/dto-services/workstation/workstation-dashboard.service';
import { EnumActStatusService } from 'app/services/dto-services/enum/act-status.service';
import { EnumActPositionService } from 'app/services/dto-services/enum/act-position.service';
import { InspectionService } from 'app/services/dto-services/inspection-charateristics/inspection.service';
import { ControlIndicatorService }  from 'app/services/dto-services/inspection-charateristics/control-indicator/controlIndicator.service';
import { ControlIndicatorDataService }  from 'app/services/dto-services/inspection-charateristics/control-indicator-data/controlIndicatorData.service';
import { InspectionCharacteristicTypeService } from 'app/services/dto-services/inspection-charateristics/inspection-characteristice-type.service';
import { ControlIndicatorTypeService } from 'app/services/dto-services/inspection-charateristics/control-indicator/control-indicator-type.service';
import { ControlIndicatorSampleService } from 'app/services/dto-services/inspection-charateristics/control-indicator/control-indicator-sample.service';
import { ControlIndicatorResultService } from 'app/services/dto-services/inspection-charateristics/control-indicator/control-indicator-result.service';
import { NEWQualityInspectionCharacteristicMethodComponent } from './inspection-characteristic-method/new/new.component';
import { QualityInspectionCharacteristicMethodListComponent } from './inspection-characteristic-method/list/list.component';
import { DetailQualityInspectionCharacteristicMethodComponent } from './inspection-characteristic-method/detail/detail.component';
import { InspectionMethodService } from 'app/services/dto-services/inspection-method/inspection-method.service';
import { InspectionCharacteristicMethodService } from 'app/services/dto-services/inspection-method/inspection-characteristic-method.service';
import { NEWQualityInspectionCharacteristicCatalogGroupComponent } from './inspection-characteristic-catalog-group/new/new.component';
import { QualityInspectionCharacteristicCatalogGroupListComponent } from './inspection-characteristic-catalog-group/list/list.component';
import { DetailQualityInspectionCharacteristicCatalogGroupComponent } from './inspection-characteristic-catalog-group/detail/detail.component';
import { QualityCatalogGroupService } from 'app/services/dto-services/quality-catalog-group/quality-catalog-group.service';
import { QualityControlIndicatorSampleAutoCompleteModule } from 'app/views/auto-completes/quality-control-indicator-sample-auto-complete/quality-control-indicator-sample-autocomplete-module';
import { QualityControlIndicatorResultAutoCompleteModule } from 'app/views/auto-completes/quality-control-indicator-result-auto-complete/quality-control-indicator-result-autocomplete-module';
import { ConfirmDialogModule } from 'primeng';
import { PlantAutoCompleteModule } from 'app/views/auto-completes/plant-auto-complete/plant-autocomplete-module';
import { UnitAutoCompleteModule } from 'app/views/auto-completes/unit-auto-complete/unit-autocomplete-module';
@NgModule({
  imports: [
    InspectionRoutingModule,
    FormsModule,
    DassSharedModule,
   
    ConfirmDialogModule,
    CommonModule,
    ModalModule.forRoot(),
    PlantAutoCompleteModule,
    UnitAutoCompleteModule,
    QualityControlIndicatorSampleAutoCompleteModule,
    QualityControlIndicatorResultAutoCompleteModule
    
  ],
  providers: [
    WorkstationDashboardService,
    EnumActStatusService,
    EnumActPositionService,
    InspectionService,
    ControlIndicatorService,
    ControlIndicatorDataService,
    InspectionCharacteristicTypeService,
    ControlIndicatorTypeService, 
    ControlIndicatorSampleService,
    ControlIndicatorResultService,
    InspectionMethodService,
    InspectionCharacteristicMethodService ,
    QualityCatalogGroupService 
  ],
  declarations: [
    ListInspectionComponent,
    DetailInspectionComponent,
    NewInspectionComponent,
    EditInspectionComponent,
    ListControlIndicator,
    DetailControlIndicator,
    NewControlIndicator,
    ListControlIndicatorDataComponent,
    DetailControlIndicatorData,
    NewControlIndicatorDataComponent,
    // Inspection Characteristic Method Components
    NEWQualityInspectionCharacteristicMethodComponent,
    QualityInspectionCharacteristicMethodListComponent,
    DetailQualityInspectionCharacteristicMethodComponent,
    
    // Inspection Characteristic Catalog Group Components
    NEWQualityInspectionCharacteristicCatalogGroupComponent,
    QualityInspectionCharacteristicCatalogGroupListComponent,
    DetailQualityInspectionCharacteristicCatalogGroupComponent

  ],
  exports: [NewInspectionComponent]
})
export class InspectionModule {}
