import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { UsersService } from '../services/users/users.service';
import { HttpControllerService } from '../services/core/http-controller.service';
import { CityService } from '../services/dto-services/city/city.service';
import { CountryService } from '../services/dto-services/country/country.service';
import { FormsModule } from '@angular/forms';
import { OptionService } from '../services/base/option-service';
import { RoleAuthService } from '../services/auth/role-auth.service';
import { PermissionService } from '../services/dto-services/permissions/permission.service';
import { PermissionGroupService } from '../services/dto-services/permissions/permission-group.service';
import { RoleService } from '../services/dto-services/permissions/role.service';
import { WorkstationService } from '../services/dto-services/workstation/workstation.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { EqualValidator } from '../util/EqualValidator';
import { LoaderModule } from '../components/loader-component/loader.module';
import { AutoCompleteComponent } from '../components/app-auto-complete/auto-complete.component';
import { UtilitiesService } from '../services/utilities.service';

import { ShiftSettingsService } from '../services/dto-services/shift-setting/shift-setting.service';
import { PowerConsumptionService } from '../services/dto-services/power-consumption/power-consumption-service';
import { AlertService } from '../services/dto-services/alert-services/alert.services';
import { EnumMaintenanceTypeService } from '../services/dto-services/enum/maintenance-type.service';
import { PartService } from '../services/dto-services/part/part.service';
import { EnumMaintenanceStatusService } from '../services/dto-services/enum/maintenance-status.service';
import { WorkstationTypeService } from '../services/dto-services/workstation-type/workstation-type.service';
import { WorkcenterTypeService } from '../services/dto-services/workcenter-type/workcenter-type.service';
import { WarehouseService } from '../services/dto-services/warehouse/warehouse.service';
import { WorkcenterService } from '../services/dto-services/workcenter/workcenter.service';
import { EnumUserStatusService } from '../services/dto-services/enum/user-status.service';
import { EnumWorkStationStatusService } from '../services/dto-services/enum/workstation-status.service';
import { EnumWorkcenterStatusService } from '../services/dto-services/enum/workcenter-status.service';
import { EnumStopCauseStatusService } from '../services/dto-services/enum/stop-cause-status.service';
import { EnumOperationTypeService } from '../services/dto-services/enum/operation-type.service';
import { EnumOperationStatusService } from '../services/dto-services/enum/operation-status.service';
import { EnumGenderService } from '../services/dto-services/enum/gender.service';
import { EmployeeService } from '../services/dto-services/employee/employee.service';
import { EmployeeTitleService } from '../services/dto-services/employee-title/employee-title.service';
import { DepartmentService } from '../services/dto-services/department/department.service';
import { EnumBloodGroupService } from '../services/dto-services/enum/blood-group.service';
import { OperationService } from '../services/dto-services/operation/operation.service';
import { MaintenanceService } from '../services/dto-services/maintenance/maintenance.service';
import { StopCauseTypeService } from '../services/dto-services/stop-cause-type/stop-cause-type.service';
import { StopCauseService } from '../services/dto-services/stop-cause/stop-cause.service';
import { ConfirmationService } from 'primeng/api';
import { EnumJobOrderStatusService } from '../services/dto-services/enum/job-order-status.service';
import { JobOrderService } from '../services/dto-services/job-order/job-order.service';
import { ActService } from '../services/dto-services/act/act.service';
import { EnumMaterialTypeService } from '../services/dto-services/enum/metal-type.service';
import { StockTypeService } from '../services/dto-services/stock-type/stock-type.service';
import { StockTransferReceiptService } from '../services/dto-services/stock-transfer-receipt/stock-transfer-receipt.service';
import { StockCardService } from '../services/dto-services/stock/stock.service';
import { EnumStockTransferReceiptService } from '../services/dto-services/enum/stock-transfer-receipt.service';
import { EnumStockStatusService } from '../services/dto-services/enum/stock-status.service';
import { AppTimeComponent } from '../components/app-time/app-time.component';
import { AngularResizedEventModule } from 'angular-resize-event';
import { MediaChooserComponent } from '../views/image/media-chooser/media-chooser.component';
import { ImageViewerComponent } from '../views/image/image-viewer/image-viewer.component';
import { ImageAdderComponent } from '../views/image/image-adder/image-adder.component';
import { ChartModule } from 'primeng/chart';
import { StopService } from '../services/dto-services/stop/stop.service';
import { OeeService } from '../services/dto-services/oee/oee-service';
import { PlantService } from '../services/dto-services/plant/plant.service';
import { EnumService } from '../services/dto-services/enum/enum.service';
import { ProductionOrderService } from '../services/dto-services/production-order/production-order.service';
import { PorderService } from '../services/dto-services/porder/porder.service';
import { BatchService } from '../services/dto-services/batch/batch.service';
import { ChooseWorkstationPaneComponent } from '../views/choose-panes/choose-workstation-pane/choose-workstation-pane.component';
import { SafeHtmlPipe } from '../directives/safe-html';
import { ChooseBatchPaneComponent } from '../views/choose-panes/choose-batch-pane/choose-batch-pane.component';
import { ActTypeService } from '../services/dto-services/act-type/act-type.service';
import { InplaceModule } from 'primeng/inplace';
import { KeyFilterModule } from 'primeng/keyfilter';

import {
  AutoCompleteModule,
  ButtonModule,
  CalendarModule,
  CheckboxModule,
  DialogModule,
  DropdownModule,
  GalleriaModule,
  InputSwitchModule,
  InputTextModule,
  MultiSelectModule,
  OverlayPanelModule,
  ProgressSpinnerModule,
  RadioButtonModule,
  TableModule,
  TabViewModule,
  ToastModule,
  FileUploadModule,
  TooltipModule,
  TreeModule,
  SplitButtonModule,
  AccordionModule,
  SelectButtonModule
} from 'primeng';
import { WorkstationErpService } from '../services/dto-services/workstation/workstation-erp.service';
import { PagingComponent } from '../components/app-paging';
import { PreviousRouteService } from '../services/shared/previous-page.service';
import { DashboardService } from '../services/dto-services/dashboard/dashboard.service';
import { DetailStaffComponent } from 'app/views/labor/staff/detail/detail.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { CustomFormDirective } from 'app/directives/form-invalid/form-invalid.directive';
import { SafeHtml } from 'app/directives/safe-url/safeurl';
import { CallbackPipe } from 'app/directives/filterPipe.pipe';
import { EmployeeDetailGroupsNewComponent } from 'app/views/labor/employee-detail-groups/new/new.component';
import { DetailMaterialCardComponent } from 'app/views/inventory-management/warehouse-management-system/basic-warehouse-managment/material-cards/detail/detail.component';
import { PalletScreenDetailComponet } from 'app/views/inventory-management/warehouse-management-system/basic-warehouse-managment/material-cards/pallet/detail/detail.component';
import { QualityScreenDetailComponent } from 'app/views/inventory-management/warehouse-management-system/basic-warehouse-managment/material-cards/quality-screen/detail/detail.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { DownloadDirective } from 'app/directives/download-file.directive';
import { LinebreaksPipe } from 'app/directives/line-breaks.pipe';
import { PipeFunction } from '../directives/pipe-function.pipe';
import { CustomToastComponent } from './custom-toast-component/custom-toast.component';
import { EmployeeGroupService } from 'app/services/dto-services/employee-group.service';
import { JobOrderGanttViewComponent } from 'app/views/analysis/allocation-report/job-order-gantt-view/job-order-gantt-view.component';

const COMPONENTS = [
  PagingComponent,
  AutoCompleteComponent,
  AppTimeComponent,
  ImageAdderComponent,
  ImageViewerComponent,
  MediaChooserComponent,
  DetailMaterialCardComponent,
  EmployeeDetailGroupsNewComponent,
  EqualValidator,
  PalletScreenDetailComponet,
  ChooseWorkstationPaneComponent,
  ChooseBatchPaneComponent,
  ChooseWorkstationPaneComponent,
  SafeHtmlPipe,
  LinebreaksPipe,
  DownloadDirective,
  DetailStaffComponent,
  QualityScreenDetailComponent,
  CustomToastComponent,
  JobOrderGanttViewComponent
];

const PRIMENG_MODULES = [
  AutoCompleteModule,
  ChartModule,
  CalendarModule,
  CheckboxModule,
  DialogModule,
  InputTextModule,
  TableModule,
  SplitButtonModule,
  MultiSelectModule,
  GalleriaModule,
  SelectButtonModule,
  DropdownModule,
  FileUploadModule,
  ButtonModule,
  RadioButtonModule,
  ProgressSpinnerModule,
  InputSwitchModule,
  TabViewModule,
  TooltipModule,
  TreeModule,
  AccordionModule,
  OverlayPanelModule,
  InplaceModule,
  KeyFilterModule

];
const OTHER_MODULES = [
  ToastModule,
  AngularResizedEventModule,
  NgxDocViewerModule,
  LoaderModule,
  ProgressSpinnerModule
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CarouselModule.forRoot(),
    TranslateModule.forChild(),
    ...PRIMENG_MODULES,
    ...OTHER_MODULES,
    ModalModule.forRoot(),
    AngularEditorModule
  ],
  declarations: [
    EqualValidator,
    CustomFormDirective,
    SafeHtml,
    CallbackPipe,
    PipeFunction,
    ...COMPONENTS

  ],
  exports: [
    TranslateModule,
    CarouselModule,
    CustomFormDirective,
    SafeHtml,
    CallbackPipe,
    PipeFunction,
    ...PRIMENG_MODULES,
    ...COMPONENTS,
    ...OTHER_MODULES,
  ],
  providers: [
    CityService,
    CountryService,
    HttpControllerService,
    OptionService,
    PermissionService,
    PermissionGroupService,
    RoleService,
    RoleAuthService,
    UsersService,
    WorkstationService,
    TranslateService,
    UtilitiesService,
    DepartmentService,
    OeeService,
    EmployeeService,
    EmployeeGroupService,
    EmployeeTitleService,
    EnumBloodGroupService,
    EnumGenderService,
    EnumOperationStatusService,
    EnumOperationTypeService,
    EnumStopCauseStatusService,
    EnumWorkcenterStatusService,
    EnumWorkStationStatusService,
    EnumUserStatusService,
    ActTypeService,
    WorkcenterService,
    WarehouseService,
    WorkcenterTypeService,
    WorkstationService,
    WorkstationTypeService,
    EnumMaintenanceStatusService,
    DatePipe,
    PartService,
    EnumMaintenanceTypeService,
    AlertService,
    PowerConsumptionService,
    ShiftSettingsService,
    MaintenanceService,
    OperationService,
    ConfirmationService,
    EnumJobOrderStatusService,
    StopCauseService,
    StopCauseTypeService,
    JobOrderService,
    ConfirmationService,
    EmployeeService,
    EnumStockStatusService,
    EnumStockTransferReceiptService,
    StockCardService,
    StockTransferReceiptService,
    StockTypeService,
    EnumMaterialTypeService,
    WarehouseService,
    ProductionOrderService,
    ActService,
    StopService,
    EnumService,
    PlantService,
    PorderService,
    BatchService,
    WorkstationErpService,
    PreviousRouteService,
    DashboardService
  ]
})
export class DassSharedModule {
}
