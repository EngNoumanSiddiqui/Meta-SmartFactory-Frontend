import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ScrapService } from 'app/services/dto-services/scrap.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { environment } from 'environments/environment';
import { ScrapTypeService } from 'app/services/dto-services/scrap-type.service';
import { ScrapCauseService } from 'app/services/dto-services/scrap-cause/scrap-cause.service';
import { EmployeeService } from 'app/services/dto-services/employee/employee.service';
import { WorkstationService } from 'app/services/dto-services/workstation/workstation.service';
import { UsersService } from 'app/services/users/users.service';

@Component({
  selector: 'scrap-new',
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
    operatorId: null,
    plantId: null,
    quantity: null,
    description: null,
    jobOrderOperationId: null,
    quantityUnit: null,
    returnQuantity: null,
    returnQuantityUnit: null,
    reworkWorkerId: null,
    scrapCauseId: null,
    referenceId: null,
    scrapTypeId: null,
    wareHouseId: null,
    workstationId: null
  };
  selectedProductionItem: any;
  selectedProductionItemId: any;
  jobOrderOperationList: any = [];

  @Input('materialId') set setmaterialId(materialId) {
    if (materialId) {
      this.scrapReqDto.materialId = materialId;
    }
  }
  @Input('wareHouseId') set setwareHouseId(wareHouseId) {
    if (wareHouseId) {
      this.scrapReqDto.wareHouseId = wareHouseId;
    }
  }
  @Input('batch') set setbatch(batch) {
    if (batch) {
      this.scrapReqDto.batch = batch;
    }
  }
  @Input('quantity') set setquantity(quantity) {
    if (quantity) {
      this.scrapReqDto.quantity = quantity;
    }
  }
  unitList = [];
  stockList = [];
  scrapTypeList = [];
  scrapCauseList = [];
  workers = [];
  actId = null;
  selectedPlant: any;
  constructor(
    private scrapService: ScrapService,
    private scrapTypeService: ScrapTypeService,
    private scrapCauseService: ScrapCauseService,
    private utilities: UtilitiesService,
    private loaderService: LoaderService,
    private userService: UsersService,
    private _employeeSvc: EmployeeService,
    private workstationService: WorkstationService,
  ) {
      const plantjson = this.userService.getPlant();
      let plant ;
      if (plantjson) {
        plant = JSON.parse(plantjson);
      }
      if (plant) {
        this.scrapReqDto.plantId = plant.plantId;
        this.selectedPlant = plant;
      }
   }

  ngOnInit() {
    this.workstationService.getWorkstationUnitList().then((result: any) => {
      this.unitList = result;
    }).catch(error => console.log(error));
  
    this.scrapTypeService.filter({ pageNumber: 1, pageSize: 1000, typeScrap: true, plantId: this.scrapReqDto.plantId }).then(result => {
      this.scrapTypeList = result['content'];
    }).catch(error => console.log(error));
    this.scrapCauseService.filter({ pageNumber: 1, pageSize: 1000, type: 'SCRAP', plantId: this.scrapReqDto.plantId }).then(result => {
      this.scrapCauseList = result['content'];
    }).catch(error => console.log(error));
    this._employeeSvc.filter({ pageNumber: 1, plantId: this.scrapReqDto.plantId , pageSize: 1000 }).then(result => {
      this.workers = result['content'];
      // this.workers.sort((a, b) => (a.plant.plantId > b.plant.plantId) ? 1 : -1);
    }).catch(error => console.log(error));
  }

  setSelectedPlant(selectedPlantEvent) {
    if (selectedPlantEvent) {
      this.scrapReqDto.plantId = selectedPlantEvent.plantId;
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

  onProductionOrderSelected (event) {
    if (event) {
      const detailItem = event;
      this.scrapReqDto.batch = detailItem.batch;
     
      this.actId = detailItem.saleOrder ? detailItem.saleOrder.actId : null;
      this.selectedProductionItem = detailItem;
      this.selectedProductionItemId = detailItem.prodOrderId;
      if (detailItem.jobOrderList && detailItem.jobOrderList.length > 0) {
        this.onSelectJobOrder(detailItem.jobOrderList[0]);
      }
    }
  }
  // private getAlternativeUnitList(stockId) {
  //   this.unitList = null;
  //   if (stockId) {
  //     // this._stockSvc.metarialActiveUnits(stockId).then((result: any) => {
  //     //   this.scrapReqDto.quantityUnit = result.baseUnit;
  //     // }).catch(error => console.log(error));
  //   }
  // }
  onSelectJobOrder(event) {
   if (event) {
    this.scrapReqDto.jobOrderId = event.jobOrderId;
    // this.scrapReqDto.quantity = event.quantity;
    this.scrapReqDto.workstationId = this.scrapReqDto.workstationId ? 
                                      this.scrapReqDto.workstationId : 
                                      (event.workStation ? event.workStation.workStationId : null);
    this.selectedProductionItemId = this.selectedProductionItem ? 
                                      this.selectedProductionItem.prodOrderId : 
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
    // this.scrapReqDto.returnQuantity = detailItem.plannedQuantity;
  }
  onScrapTypeChange(event) {
    this.scrapCauseService.filter({ 
      pageNumber: 1,
      pageSize: 1000,
      scrapTypeId: +event }).then(result => {
      this.scrapCauseList = result['content'];
    }).catch(error => console.log(error));
  }

  onScrapCauseChange(event) {
    if (event && this.scrapCauseList) {
      const scrapCause = this.scrapCauseList.find(itm => itm.scrapCauseId === +event);
      if (scrapCause) {
        this.scrapReqDto.scrapTypeId = scrapCause.scrapType ? scrapCause.scrapType.scrapTypeId : null;
      }
    }
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
      this.scrapReqDto.material = null;
      // this.newRequestOrderDetailCreateDto.unit = null;
    }
  }
  reset() {
    this.scrapReqDto = {
      batch: null,
      jobOrderId: null,
      materialId: null,
      material: null,
      description: null,
      operatorId: null,
      plantId: this.scrapReqDto.plantId,
      referenceId: null,
      quantity: null,
      jobOrderOperationId: null,
      quantityUnit: null,
      returnQuantity: null,
      returnQuantityUnit: null,
      reworkWorkerId: null,
      scrapCauseId: null,
      scrapTypeId: null,
      wareHouseId: null,
      workstationId: null

    }
  }

  onJobOrderOperationSelected(event) {
    if(this.scrapReqDto.jobOrderOperationId) {
      this.scrapReqDto.referenceId = this.jobOrderOperationList.find(itm => itm.jobOrderOperationId === +this.scrapReqDto.jobOrderOperationId).referenceId;
    } else {
      this.scrapReqDto.referenceId = null;
    }
  }
  save() {
    if(!this.scrapReqDto.workstationId) {
      this.utilities.showWarningToast('please-select-workstation');
      return;
    }

    if(!this.scrapReqDto.wareHouseId) {
      this.utilities.showWarningToast('please-select-warehouse');
      return;
    }

    if(!this.scrapReqDto.materialId) {
      this.utilities.showWarningToast('please-select-material');
      return;
    }

    this.loaderService.showLoader();
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
