import {Component, Input, OnInit} from '@angular/core';
import { PlantService } from 'app/services/dto-services/plant/plant.service';
import {LoaderService} from 'app/services/shared/loader.service';

@Component({
  selector: 'plant-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {




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
    companyName : null,
    companyCode : null,
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

  @Input('data') set st(data) {
    if (data) {
      const item = Object.assign({}, data);
      this.plant = item;
    }
  }


  // @Input('id') set xw(plantId) {
  //   if (plantId) {
  //     this._plantService.getAllPlants().then((plants:any )=> {
  //       if(plants){
  //         let plant = plants.filter((element)=> element.plantId == plantId );
  //         if(plant){
  //           this.data = plant[0];
  //         }
  //       }
  //     });
  //   }
  // }

  constructor(private _plantService: PlantService, private loaderService: LoaderService) {
  }

  ngOnInit() {

    this._plantService.getDetail(this.plant.plantId).then(result => {
      this.loaderService.hideLoader();
      if ((result['countryName'])) {
        this.plant['countryName'] = result['countryName'];
      }
      if ((result['cityName'])) {
        this.plant['cityName'] = result['cityName'];
      }
        if ((result['company'])) {
          this.plant['companyName']= result['company'].companyName;
          this.plant['companyCode'] = result['company'].companyCode;
        }


    }
      ).catch(error => {
        this.loaderService.hideLoader();
        console.log(error)
      });

  }

}
