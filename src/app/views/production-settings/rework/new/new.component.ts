import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ScrapService } from 'app/services/dto-services/scrap.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { environment } from 'environments/environment';
import { ProductionOrderService } from 'app/services/dto-services/production-order/production-order.service';
import { StockCardService } from 'app/services/dto-services/stock/stock.service';
import { ScrapTypeService } from 'app/services/dto-services/scrap-type.service';
import { ScrapCauseService } from 'app/services/dto-services/scrap-cause/scrap-cause.service';
import { EmployeeService } from 'app/services/dto-services/employee/employee.service';
import { WorkstationService } from 'app/services/dto-services/workstation/workstation.service';
import { UsersService } from 'app/services/users/users.service';

@Component({
  selector: 'rework-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class ScrapNewComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();
  scrapReqDto = {
    batch: null,
    jobOrderId: null,
    materialId: null,
    material: null,
    reworkStatus: null,
    operatorId: null,
    plantId: null,
    description: null,
    jobOrderOperationId: null,
    quantity: null,
    quantityUnit: null,
    returnQuantity: null,
    returnQuantityUnit: null,
    referenceId: null,
    reworkWorkerId: null,
    scrapCauseId: null,
    scrapTypeId: null,
    wareHouseId: null,
    workstationId: null

  };

  productionOrderList = [];
  jobOrderList = [];
  unitList = [];
  stockList = [];
  scrapTypeList = [];
  scrapCauseList = [];
  reworkStatusList = ['REQUESTED', 'REPROCESSED', 'PARTIALLY_REPROCESSED', 'CANCELLED'];
  workers = [];
  actId: any;
  selectedPlant: any;
  selectedProdOrderId: any;
  jobOrderOperationList: any = [];
  constructor(
    private scrapService: ScrapService,
    private scrapTypeService: ScrapTypeService,
    private scrapCauseService: ScrapCauseService,
    private utilities: UtilitiesService,
    private loaderService: LoaderService,
    private _prodOrderSvc: ProductionOrderService,
    private _stockSvc: StockCardService,
    private _userSvc: UsersService,
    private _employeeSvc: EmployeeService,
    private workstationService: WorkstationService,
  ) { 
    const setPlant = this._userSvc.getPlant();
    this.selectedPlant = JSON.parse(setPlant);
    if (this.selectedPlant) {
      this.scrapReqDto.plantId = this.selectedPlant.plantId;
    }
  }

  ngOnInit() {
    // this._stockSvc.filter({ pageNumber: 1, pageSize: 1000 }).then(result => {
    //   this.stockList = result['content'];
    // }).catch(error => console.log(error));
    this.scrapReqDto.reworkStatus = 'REQUESTED';
    this.workstationService.getWorkstationUnitList().then((result: any) => {
      this.unitList = result;
    }).catch(error => console.log(error));
    this._prodOrderSvc.filterProdObservable({ pageNumber: 1, pageSize: 1000, plantId: this.scrapReqDto.plantId }).subscribe(result => {
        this.productionOrderList = result['content'];
      }, error => {
        console.log(error)
    });
    this.scrapTypeService.filter({ pageNumber: 1, pageSize: 1000, typeScrap: false, plantId: this.scrapReqDto.plantId }).then(result => {
      this.scrapTypeList = result['content'];
    }).catch(error => console.log(error));
    this.scrapCauseService.filter({ pageNumber: 1, pageSize: 1000, type: 'REWORK', plantId: this.scrapReqDto.plantId }).then(result => {
      this.scrapCauseList = result['content'];
    }).catch(error => console.log(error));
    this._employeeSvc.filter({ pageNumber: 1, plantId: this.scrapReqDto.plantId, pageSize: 1000 }).then(result => {
      this.workers = result['content'];
      // this.workers.sort((a, b) => (a.plant.plantId > b.plant.plantId) ? 1 : -1);
    }).catch(error => console.log(error));
  }
  setSelectedPlant(selectedPlantEvent) {
    if (selectedPlantEvent) {
      this.scrapReqDto.plantId = selectedPlantEvent.plantId;
      this._prodOrderSvc.filterProdObservable({
        pageNumber: 1,
        plantId: this.scrapReqDto.plantId,
        pageSize: 1000
      }).subscribe(result => {
          this.productionOrderList = result['content'];
        }, error => {
          console.log(error)
      });
    } else {
      this.scrapReqDto.plantId = null;
    }
  }

  setSelectedWorkStation(event) {
    if (event && event.hasOwnProperty('workStationId')) {
      this.scrapReqDto.workstationId = event.workStationId;
    } else {
      this.scrapReqDto.workstationId = null;
    }
  }

  onProductionOrderChange(event) {
    const detailItem = event;
    if (detailItem) {
    this.scrapReqDto.batch = detailItem.batch;
    this.scrapReqDto.materialId = detailItem.materialId;
    this.actId = detailItem.saleOrder ? detailItem.saleOrder.actId : null;
    // this.scrapReqDto.quantity = detailItem.quantity;
    // this.scrapReqDto.quantityUnit = detailItem.baseUnit;
    this.selectedProdOrderId = detailItem.prodOrderId;
   }
    // this.getAlternativeUnitList(detailItem.stockId);

  }
  private getAlternativeUnitList(stockId) {
    this.unitList = null;
    if (stockId) {
      this._stockSvc.metarialActiveUnits(stockId).then((result: any) => {
        this.scrapReqDto.quantityUnit = result.baseUnit;
      }).catch(error => console.log(error));
    }
  }

  onJobOrderChange(event) {

    if (event) {
      this.scrapReqDto.jobOrderId = event.jobOrderId;
      // this.scrapReqDto.quantity = event.quantity;
      this.scrapReqDto.workstationId = this.scrapReqDto.workstationId ? 
                                        this.scrapReqDto.workstationId : 
                                        (event.workStation ? event.workStation.workStationId : null);
      this.selectedProdOrderId = this.selectedProdOrderId ? 
                                        this.selectedProdOrderId : 
                                        (event.prodOrder ? event.prodOrder.prodOrderId : null);
      this.scrapReqDto.materialId = this.scrapReqDto.materialId ? 
                                      this.scrapReqDto.materialId : 
                                      (event.jobOrderStockProduceList && event.jobOrderStockProduceList.length > 0 ?
                                         event.jobOrderStockProduceList[0].stockId : null);
      this.scrapReqDto.quantityUnit = this.scrapReqDto.quantityUnit ? 
                                      this.scrapReqDto.quantityUnit : 
                                      (event.jobOrderStockProduceList && event.jobOrderStockProduceList.length > 0 ?
                                         event.jobOrderStockProduceList[0].unit : null);
      this.scrapReqDto.batch = this.scrapReqDto.batch ? 
                                         this.scrapReqDto.batch : 
                                         (event.batch ? event.batch : null);
    }
    this.jobOrderOperationList = event?.jobOrderOperations;
  }
  onScrapTypeChange(event) {
    this.scrapCauseService.filter({ 
      pageNumber: 1,
      pageSize: 1000, type: 'REWORK',
      scrapTypeId: +event }).then(result => {
      this.scrapCauseList = result['content'];
    }).catch(error => console.log(error));
  }
  setSelectedBatch(batch) {
    if (batch) {
      this.scrapReqDto.batch = batch.batchCode;
    } else {
      this.scrapReqDto.batch = null;
    }
  }
  setSelectedWarehouse(event) {
      if (event && event.hasOwnProperty('wareHouseId')) {
        this.scrapReqDto.wareHouseId = event.wareHouseId;
      } else {
        this.scrapReqDto.wareHouseId = null;
      }
  }
  selectMaterialChanged(event) {
    if (event) {
      this.scrapReqDto.materialId = event.stockId;
      this.scrapReqDto.material = event;
      this.scrapReqDto.quantityUnit = event.baseUnit;
      // this.newRequestOrderDetailCreateDto.stockName = event.stockName;
      // this.newRequestOrderDetailCreateDto.unit = event.baseUnit;
      // this.newRequestOrderDetailCreateDto.batch = event.batch;
    } else {
      this.scrapReqDto.materialId = null;
      this.scrapReqDto.quantityUnit = null;
      // this.newRequestOrderDetailCreateDto.unit = null;
    }
  }

  onScrapCauseChange(event) {
    if (event && this.scrapCauseList) {
      const scrapCause = this.scrapCauseList.find(itm => itm.scrapCauseId === +event);
      if (scrapCause) {
        this.scrapReqDto.scrapTypeId = scrapCause.scrapType ? scrapCause.scrapType.scrapTypeId : null;
      }
    }
  }
  onJobOrderOperationSelected(event) {
    if(this.scrapReqDto.jobOrderOperationId) {
      this.scrapReqDto.referenceId = this.jobOrderOperationList.find(itm => itm.jobOrderOperationId === +this.scrapReqDto.jobOrderOperationId).referenceId;
    } else {
      this.scrapReqDto.referenceId = null;
    }
  }
  reset() {
    this.scrapReqDto = {
      batch: null,
      jobOrderId: null,
      materialId: null,
      description: null,
      material: null,
      referenceId: null,
      operatorId: null,
      plantId: this.scrapReqDto.plantId,
      quantity: null,
      quantityUnit: null,
      jobOrderOperationId: null,
      returnQuantity: null,
      reworkStatus: null,
      returnQuantityUnit: null,
      reworkWorkerId: null,
      scrapCauseId: null,
      scrapTypeId: null,
      wareHouseId: null,
      workstationId: null

    }
  }
  save() {
    this.loaderService.showLoader();
    console.log('@beforeSave', this.scrapReqDto);
    this.scrapService.save(this.scrapReqDto)
      .then(() => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.reset();
          this.saveAction.emit('close');
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

}
