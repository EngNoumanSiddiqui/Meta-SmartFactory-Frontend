import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {PlantService} from 'app/services/dto-services/plant/plant.service';
import {LoaderService} from 'app/services/shared/loader.service';
import {UtilitiesService} from 'app/services/utilities.service';

import {environment} from 'environments/environment';
import { CompanyService } from 'app/services/dto-services/company/company.service';
import { CountryService } from 'app/services/dto-services/country/country.service';
import { CityService } from 'app/services/dto-services/city/city.service';
import { PlantDto } from 'app/dto/plant/plant.model';

@Component({
  selector: 'plant-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnChanges {
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
    autoPurchasePeriodDays: 0,
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
    cityId: null,
    panelMaster: null,
    cityName: null,
    companyAddress: null,
    companyId: null,
    countryId: null,
    currency: null,
    countryName: null,
    createAutoProdOrders: 0,
    createdDate: null,
    deliverManualPurchaseOrder: 0,
    getWaitingForMaterialReservationByJobOrder: 0,
    loadJobForceStockReservationChange: 0,
    moveStockAfterCompletedOperation: 0,
    scheduleReleaseReservationLimitDay: 0,
    reorderRangeWeek: 0,
    reorderDayRange: 0,
    goodsMovementCodTemplete: null,
    materialCode: null,
    plantCode: null,
    plantId: null,
    plantName: null,
    postcode: null,
    status: null,
    processingJobsMaxLatencyDay: 0,
    plannedJobsMaxLatencyDay: 0,
    prodOrderCodeTemplete: null,
    purchaseOrderCodeTemplete: null,
    purchaseQuotationCodeTemplete: null,
    recheckJobOrderStockHasUnReristrictedQuantity: 0,
    combineProductionOrderAuto: 0,
    erpSupport: 0,
    shiftTargetQuantity: null,
    waitSemiProductPercentage: null,
    prodOrderStartBeforeDay: null,
    releaseAllStockFromReservation: 0,
    releaseAllStockFromReservationAfterAutoSchedule: 0,
    salesOrderCodeTemplete: null,
    salesOrderRefCodeTemplete: null,
    salesQuotationCodeTemplete: null,
    checkPreviousJobOrderCompleted: 0,
    salesForecastDurationDay : null,
    requestReservationDelayDay: null,
    autoPalletConfirm : 0,
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

  countries: any;
  cities: any;
  cityDisabled: boolean;
  @Input('data') set st(data) {
    if (data) {
      const item = Object.assign({}, data);
      this.plant = item;
      // this.plant.companyId = data.company? parseInt(data.company.companyId) + '' : null;
     if(this.plant.countryId) this.getCountryCites(this.plant.countryId)
    }
  }
  companyList = [];
  ngOnChanges() {

  }

  constructor(private _plantService: PlantService,
    private companyService: CompanyService,
              private loaderService: LoaderService,
              private _citySvc: CityService,
              private _countrySvc: CountryService,
              private utilities: UtilitiesService) {

                
  }

  ngOnInit() {
    this.companyService.getAllCompanies().then((res: any) => this.companyList = res).catch(err => console.error(err));
    this._countrySvc.getIdNameList().then(result => this.countries = result).catch(error => console.log(error));
    
    this._plantService.getDetail(this.plant.plantId).then(result => {
      this.loaderService.hideLoader();
      if ((result['countryId'])) {
        this.plant['countryId'] = result['countryId'];
      }
      if ((result['cityId'])) {
        this.getCountryCites(this.plant.countryId);
        this.plant['cityId'] = result['cityId'];
      }

    }
      ).catch(error => {
        this.loaderService.hideLoader();
        console.log(error)
      });

      
  }

  getCountryCites(countryId: number){
    this._citySvc.getIdNameList(countryId)
    .then(result => { this.cities = result; this.cityDisabled = false;})
    .catch(error => console.log(error));
  }

  onCompanySelected(event) {
    this.plant.companyId = parseInt(event.target.value);
    this.companyList.forEach(itm => {
      if (itm.companyId === +event) {
        this.plant.companyAddress = itm.companyAddress;
        this.plant.cityId = itm.cityId;
      }
    })
  }

  countrySelection(event) {
    this.plant.countryId = parseInt(event.target.value);
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

  citySelection(event){
    this.plant.cityId = parseInt(event.target.value);
    this.cities.forEach(element => {
        if(this.plant.cityId === element.cityId) this.plant.cityName = element.cityName
    });

  }



  save() {
    this.loaderService.showLoader();
    this._plantService.save(this.plant)
      .then(() => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');

        if ((this.plant['countryId'])) {
          this.plant['countryId'] = this.plant['countryId'];
        }
        if ((this.plant['cityId'])) {
          this.plant['cityId'] = this.plant['cityId'];
        }

        setTimeout(() => {
          this.saveAction.emit('close');
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
      
  }
}
