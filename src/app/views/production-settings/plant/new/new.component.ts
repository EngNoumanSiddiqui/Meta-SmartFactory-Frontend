import {Component, EventEmitter, OnInit, Output, Input} from '@angular/core';
import {Router, RouterLinkActive} from '@angular/router';
import {LoaderService} from 'app/services/shared/loader.service';
import {UtilitiesService} from 'app/services/utilities.service';
import {environment} from 'environments/environment';
import {PlantService} from 'app/services/dto-services/plant/plant.service';
import { CompanyService } from 'app/services/dto-services/company/company.service';
import { CountryService } from 'app/services/dto-services/country/country.service';
import { CityService } from 'app/services/dto-services/city/city.service';


@Component({
  selector: 'plant-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {

  @Output() saveAction = new EventEmitter<any>();

  plantStatus:any=[]=[
    {
      Id:1,
      value:'ACTIVE'
    },
    {
      Id:2,
      value:'INACTIVE'
    }

  ];

  plant = {
    active: true,
    alertLatePurchaseOrder: false,
    alertSemifinishLateWorkOrder: false,
    schedulePalletBox: false,
    minPalletUsageForPlanningJob: 0,
    scheduleConfirmedPurchaseDelayDay: 0,
    autoErpWorkorderConfirmation: 0,
    confirmOnsiteTransferAuto: 0,
    createAutoPalletForEndJob: 0,
    createAutoStockTransferNotification: 0,
    demandPlanning:0,
    loadjobForceStockReservationChange: 0,
    factoryCalenderCode: null,
    integrationUrl: null,
    langCode: null,

    address: null,
    checkAvaiableStockForRequestedReservation: 0,
    checkPreviousJobOrderCompleted: 0,
    cityId: null,
    currency: null,
    panelMaster: null,
    cityName: null,
    companyAddress: null,
    companyId: null,
    countryId: null,
    countryName: null,
    createAutoProdOrders: 0,
    combineProductionOrderAuto: 0,
    loadJobForceStockReservationChange: 0,
    moveStockAfterCompletedOperation: 0,
    erpSupport: 0,
    createdDate: null,
    deliverManualPurchaseOrder: 0,
    autoPurchasePeriodDays: 0,
    getWaitingForMaterialReservationByJobOrder: 0,
    goodsMovementCodTemplete: null,
    materialCode: null,
    plantCode: null,
    plantId: null,
    plantName: null,
    postcode: null,
    status: null,
    shiftTargetQuantity: null,
    prodOrderCodeTemplete: null,
    waitSemiProductPercentage: null,
    requestReservationDelayDay: null,
    scheduleAllocationLimitDay: null,
    processingJobsMaxLatencyDay: 0,
    plannedJobsMaxLatencyDay: 0,
    prodOrderStartBeforeDay: null,
    purchaseOrderCodeTemplete: null,
    purchaseQuotationCodeTemplete: null,
    recheckJobOrderStockHasUnReristrictedQuantity: 0,
    releaseAllStockFromReservation: 0,
    releaseAllStockFromReservationAfterAutoSchedule: 0,
    salesOrderCodeTemplete: null,
    salesOrderRefCodeTemplete: null,
    salesQuotationCodeTemplete: null,
    salesForecastDurationDay : 0,
    autoPalletConfirm : 0,
    scheduleReleaseReservationLimitDay: 0,
    reorderRangeWeek: 0,
    reorderDayRange: 0,
    scheduleActualCaseWaitPurchase: null,
    scheduleActualCaseWaitSemiProduct: null,
    scheduleActualCaseWaitRequestReservation: null,
    scheduleActualCaseWaitEquipment: null,
    scheduleSameEquipmentSetupDurationCheck: null,
    scheduleSameEquipmentShortSetupDurationMin: null,
    scheduleOrderNoMaxIterationCount: null,
    skipOsiteTransfer: 0,
    updateWsBaseOnOnlyErp: 0
  }

@Input('companyId') set setcomid(companyId) {
  if (companyId) {
    this.plant.companyId = companyId;
  }
}
  cities;
  countries;

  selectedCompany: any;
  id;

  sameascompany = true;
  companyList = [];

  params = {
    dialog: { title: '', inputValue: '' }
  };
  cityDisabled: boolean;

  constructor(private _router: Router,
    private _plantService: PlantService,
    private companyService: CompanyService,
    private loaderService: LoaderService,
    private _citySvc: CityService,
    private _countrySvc: CountryService,
    private utilities: UtilitiesService, ) {

  }


  ngOnInit() {
    this.companyService.getAllCompanies().then((res: any) => this.companyList = res).catch(err => console.error(err));
    this._countrySvc.getIdNameList().then(result => this.countries = result).catch(error => console.log(error));

  }
  onCompanySelected(event) {
    this.companyList.forEach(itm => {
      if (itm.companyId === +event) {
        this.plant.companyAddress = itm.companyAddress;
        this.selectedCompany = itm;
      }
    })
  }
  countrySelection(event) {
    if (this.plant.countryId !== null) {
      this.countries.forEach(country => {
        if (this.plant.countryId === country.countryId) {
          this.plant.countryName = country.countryName;
        }
      });
      this._citySvc.getIdNameList(this.plant.countryId)
        .then(result => this.cities = result)
        .catch(error => console.log(error));

      this.cityDisabled = false;
    } else {
      this.cityDisabled = true;
    }

  }

  reset() {
    this.plant = {
      active: true,
    alertLatePurchaseOrder: false,
    alertSemifinishLateWorkOrder: false,
    schedulePalletBox: false,
    minPalletUsageForPlanningJob: 0,
    autoErpWorkorderConfirmation: 0,
    confirmOnsiteTransferAuto: 0,
    createAutoPalletForEndJob: 0,
    createAutoStockTransferNotification: 0,
    scheduleConfirmedPurchaseDelayDay: 0,
    autoPurchasePeriodDays: 0,
    demandPlanning:0,
    factoryCalenderCode: null,
    integrationUrl: null,
    langCode: null,
    loadjobForceStockReservationChange: 0,

      address: null,
      checkAvaiableStockForRequestedReservation: 0,
      checkPreviousJobOrderCompleted: 0,
      cityId: null,
      loadJobForceStockReservationChange: 0,
    moveStockAfterCompletedOperation: 0,
    currency: null,
      cityName: null,
      combineProductionOrderAuto: 0,
    erpSupport: 0,
      status: null,
      companyAddress: null,
      companyId: null,
      countryId: null,
      requestReservationDelayDay: 0,
      countryName: null,
      createAutoProdOrders: 0,
      createdDate: null,
      waitSemiProductPercentage: null,
      prodOrderStartBeforeDay: null,
      deliverManualPurchaseOrder: 0,
      getWaitingForMaterialReservationByJobOrder: 0,
      goodsMovementCodTemplete: null,
      materialCode: null,
      plantCode: null,
      panelMaster: null,
      shiftTargetQuantity: null,
      plantId: null,
      plantName: null,
      postcode: null,
      processingJobsMaxLatencyDay: 0,
      plannedJobsMaxLatencyDay: 0,
      prodOrderCodeTemplete: null,
      purchaseOrderCodeTemplete: null,
      purchaseQuotationCodeTemplete: null,
      salesOrderRefCodeTemplete: null,
      recheckJobOrderStockHasUnReristrictedQuantity: 0,
      releaseAllStockFromReservation: 0,
      releaseAllStockFromReservationAfterAutoSchedule: 0,
      salesOrderCodeTemplete: null,
      salesQuotationCodeTemplete: null,
      salesForecastDurationDay : 0,
      autoPalletConfirm : 0,
      scheduleReleaseReservationLimitDay: 0,
      reorderRangeWeek: 0,
      reorderDayRange: 0,
      scheduleActualCaseWaitPurchase: null,
      scheduleActualCaseWaitSemiProduct: null,
      scheduleActualCaseWaitRequestReservation: null,
      scheduleActualCaseWaitEquipment: null,
      scheduleSameEquipmentSetupDurationCheck: null,
      scheduleSameEquipmentShortSetupDurationMin: null,
      scheduleOrderNoMaxIterationCount: null,
      scheduleAllocationLimitDay: null,
      skipOsiteTransfer: 0,
      updateWsBaseOnOnlyErp: 0

    }
  }




  save() {
    this.loaderService.showLoader();
    if (this.sameascompany && this.selectedCompany) {
      this.plant.postcode = this.selectedCompany.postcode;
      this.plant.companyAddress = this.selectedCompany.companyAddress;
      this.plant.address = this.selectedCompany.address;
      this.plant.cityId = this.selectedCompany.cityId;
      this.plant.countryId = this.selectedCompany.countryId;
      this.plant.countryName = this.selectedCompany.countryName;
    }
    this._plantService.save(this.plant)
      .then(result => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.reset();
          this.saveAction.emit(result);
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }
}
