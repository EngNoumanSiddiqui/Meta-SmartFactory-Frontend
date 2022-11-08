import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { environment } from 'environments/environment';
import { ScrapService } from 'app/services/dto-services/scrap.service';
import { ScrapTypeService } from 'app/services/dto-services/scrap-type.service';
import { ScrapCauseService } from 'app/services/dto-services/scrap-services/scrap-cause.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { EmployeeService } from 'app/services/dto-services/employee/employee.service';
import { WorkstationService } from 'app/services/dto-services/workstation/workstation.service';
import { JobOrderService } from 'app/services/dto-services/job-order/job-order.service';
import { UsersService } from 'app/services/users/users.service';

@Component({
  selector: 'scrap-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class ScrapEditComponent implements OnInit {

  id: number;
  @Output() saveAction = new EventEmitter<any>();
  scrapReqDto = {
    batch: null,
    jobOrderId: null,
    materialId: null,
    referenceId: null,
    material: null,
    operatorId: null,
    plantId: null,
    description: null,
    quantity: null,
    quantityUnit: null,
    returnQuantity: null,
    returnQuantityUnit: null,
    reworkWorkerId: null,
    jobOrderOperationId: null,
    scrapCauseId: null,
    scrapId: null,
    scrapTypeId: null,
    wareHouseId: null,
    workstationId: null

  };
  selectedPlant: any;
  selectedWorkStation: any;
  actId: any;
  selectedProductionItem: any;
  selectedProductionItemId: any;
  jobOrderOperationList: any = [];

  @Input('id') set setid(id) {
    this.id = id;
    if (this.id) {
      this.initialize(this.id);
    }
  }
  productionOrderList = [];
  jobOrderList = [];
  unitList = [];
  scrapTypeList = [];
  scrapCauseList = [];
  workers = [];
  plantId: null;
  constructor(
    private scrapService: ScrapService,
    private scrapTypeService: ScrapTypeService,
    private scrapCauseService: ScrapCauseService,
    private utilities: UtilitiesService,
    private loaderService: LoaderService,
    private jobOrderSvc: JobOrderService,
    private _userSvc: UsersService,
    private _employeeSvc: EmployeeService,
    
    private workstationService: WorkstationService,
  ) { 
    const setPlant = this._userSvc.getPlant();
    this.selectedPlant = JSON.parse(setPlant);
    this.plantId = this.selectedPlant ? this.selectedPlant.plantId: null;

  }

  ngOnInit() {
   
    this.workstationService.getWorkstationUnitList().then((result: any) => {
      this.unitList = result;
    }).catch(error => console.log(error));
    
    this.scrapTypeService.filter({ pageNumber: 1, pageSize: 1000, typeScrap: true, plantId: this.plantId }).then(result => {
      this.scrapTypeList = result['content'];
    }).catch(error => console.log(error));
    this.scrapCauseService.filter({ pageNumber: 1, pageSize: 1000, type: 'SCRAP', plantId: this.plantId }).then(result => {
      this.scrapCauseList = result['content'];
    }).catch(error => console.log(error));
    this._employeeSvc.filter({ pageNumber: 1, plantId: this.selectedPlant.plantId, pageSize: 1000 }).then(result => {
      this.workers = result['content'];
    }).catch(error => console.log(error));
  }

  private initialize(id) {
    this.loaderService.showLoader();
    this.scrapService.getUpdateDetail(this.id).then(result => {
      this.scrapReqDto = {
        batch: result['batch'],
        jobOrderId: result['jobOrder'] ? result['jobOrder'].jobOrderId : null ,
        materialId: result['material'] ? result['material'].stockId : null,
        material: result['material'] ? result['material'] : null,
        operatorId: result['operator'] ? result['operator'].employeeId : null,
        plantId: result['plant'] ? result['plant'].plantId : null,
        quantity: result['quantity'],
        description: result['description'],
        quantityUnit: result['quantityUnit'],
        jobOrderOperationId: result['jobOrderOperation']?.jobOrderOperationId,
        referenceId: result['jobOrderOperation']?.referenceId,
        returnQuantity: result['returnQuantity'],
        returnQuantityUnit: result['returnQuantityUnit'],
        reworkWorkerId: result['reworkWorker'] ? result['reworkWorker'].reworkWorkerId : null,
        scrapCauseId: result['scrapCause'] ? result['scrapCause'].scrapCauseId : null,
        scrapId: result['scrapId'],
        scrapTypeId: result['scrapType'] ? result['scrapType'].scrapTypeId : null,
        wareHouseId: result['wareHouse'] ? result['wareHouse'].wareHouseId : null,
        workstationId: result['workstation'] ? result['workstation'].workStationId : null
      };
      if (this.selectedPlant && result['plant'] && (this.selectedPlant.plantId !== result['plant'].plantId)) {
        this.scrapReqDto.plantId = this.selectedPlant.plantId;
      }

      this.selectedWorkStation = result['workstation'];

      
      this.loaderService.hideLoader();
    }).then(() => {
      if (this.scrapReqDto.jobOrderId) {
        this.jobOrderSvc.getDetail(this.scrapReqDto.jobOrderId).then((res: any) => {
          this.selectedProductionItem = (res && res.prodOrder) ? res.prodOrder : null;
          this.selectedProductionItemId = (res && res.prodOrder) ? res.prodOrder.prodOrderId : null;
          if (this.selectedProductionItemId) {
            this.onProductionOrderSelected(this.selectedProductionItem);
          }
        });
      }
    }).catch(error => {
      this.loaderService.hideLoader();
      console.log(error)
    });
  }

  setSelectedWorkStation(event) {
    if (event && event.hasOwnProperty('workStationId')) {
      this.scrapReqDto.workstationId = event.workStationId;
    } else {
      this.scrapReqDto.workstationId = null;
    }
  }

  setSelectedPlant(selectedPlantEvent) {
    if (selectedPlantEvent) {
      this.scrapReqDto.plantId = selectedPlantEvent.plantId;
    } else {
      this.scrapReqDto.plantId = null;
    }
  }
  
  onProductionOrderSelected (event) {
    if (event) {
      const detailItem = event;
      this.scrapReqDto.batch = detailItem.batch;
      
      this.actId = detailItem.saleOrder ? detailItem.saleOrder.actId : null;
      this.selectedProductionItem = detailItem;
      this.selectedProductionItemId = detailItem.prodOrderId;
    }
  }
  onScrapTypeChange(event) {
    this.scrapCauseService.filter({ 
      pageNumber: 1,
      pageSize: 1000,
      scrapTypeId: +event }).then(result => {
      this.scrapCauseList = result['content'];
    }).catch(error => console.log(error));
  }

 
  onSelectJobOrder(event) {
    if (event) {
      this.scrapReqDto.jobOrderId = event.jobOrderId;
      this.jobOrderOperationList = event.jobOrderOperations;
    } else {
      this.scrapReqDto.jobOrderId = null;
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
      // this.newRequestOrderDetailCreateDto.stockName = event.stockName;
      // this.newRequestOrderDetailCreateDto.unit = event.baseUnit;
      // this.newRequestOrderDetailCreateDto.batch = event.batch;
    } else {
      this.scrapReqDto.materialId = null;
      this.scrapReqDto.material = null;
      // this.newRequestOrderDetailCreateDto.unit = null;
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
      material: null,
      referenceId: null,
      operatorId: null,
      plantId: this.scrapReqDto.plantId,
      quantity: null,
      quantityUnit: null,
      returnQuantity: null,
      jobOrderOperationId: null,
      returnQuantityUnit: null,
      reworkWorkerId: null,
      description: null,
      scrapCauseId: null,
      scrapId: null,
      scrapTypeId: null,
      wareHouseId: null,
      workstationId: null
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
