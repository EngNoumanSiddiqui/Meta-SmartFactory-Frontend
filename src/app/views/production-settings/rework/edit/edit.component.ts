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
  selector: 'rework-edit',
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
    material: null,
    operatorId: null,
    plantId: null,
    quantity: null,
    jobOrderOperationId: null,
    quantityUnit: null,
    referenceId: null,
    reworkStatus: null,
    returnQuantity: null,
    returnQuantityUnit: null,
    description: null,
    reworkWorkerId: null,
    scrapCauseId: null,
    scrapId: null,
    scrapTypeId: null,
    wareHouseId: null,
    workstationId: null

  };
  actId: any;
  selectedPlant: any;

  reworkStatusList = ['REQUESTED', 'REPROCESSED', 'PARTIALLY_REPROCESSED', 'CANCELLED'];
  jobOrderOperationList: any = [];

  @Input('id') set setid(id) {
    this.id = id;
    if (this.id) {
      this.initialize(this.id);
    }
  }

  selectedProdOrderId = null;
  unitList = [];
  scrapTypeList = [];
  scrapCauseList = [];
  selectedWorkStation: any;
  workers = [];
  plantId: null;

  constructor(
    private scrapService: ScrapService,
    private scrapTypeService: ScrapTypeService,
    private scrapCauseService: ScrapCauseService,
    private utilities: UtilitiesService,
    private loaderService: LoaderService,
    private _employeeSvc: EmployeeService,
    private _userSvc: UsersService,
    private workstationService: WorkstationService,
    private _jobOrderSvc: JobOrderService,
  ) {
    const setPlant = this._userSvc.getPlant();
    this.selectedPlant = JSON.parse(setPlant);
    this.plantId = this.selectedPlant ? this.selectedPlant.plantId: null;
    // if (this.selectedPlant) {
    //   this.scrapReqDto.plantId = this.selectedPlant.plantId;
    // }
   }

  ngOnInit() {
    // this._stockSvc.filter({ pageNumber: 1, pageSize: 1000 }).then(result => {
    //   this.stockList = result['content'];
    // }).catch(error => console.log(error));
    this.workstationService.getWorkstationUnitList().then((result: any) => {
      this.unitList = result;
    }).catch(error => console.log(error));
   
    this.scrapTypeService.filter({ pageNumber: 1, pageSize: 1000, typeRework: true, typeScrap: false, plantId: this.plantId }).then(result => {
      this.scrapTypeList = result['content'];
    }).catch(error => console.log(error));
    this.scrapCauseService.filter({ pageNumber: 1, pageSize: 1000, type: 'REWORK', plantId: this.plantId }).then(result => {
      this.scrapCauseList = result['content'];
    }).catch(error => console.log(error));
    this._employeeSvc.filter({ pageNumber: 1,  plantId: this.selectedPlant.plantId, pageSize: 1000 }).then(result => {
      this.workers = result['content'];
      this.workers.sort((a, b) => (a.plant.plantId > b.plant.plantId) ? 1 : -1);
    }).catch(error => console.log(error));
  }

  private initialize(id) {
    this.loaderService.showLoader();
    this.scrapService.getUpdateDetail(this.id).then(result => {
      console.log('#onEdit', result);
      this.scrapReqDto = {
        batch: result['batch'],
        jobOrderId: result['jobOrder'] ? result['jobOrder'].jobOrderId : null ,
        materialId: result['material'] ? result['material'].stockId : null,
        material: result['material'] ? result['material'] : null,
        operatorId: result['operator'] ? result['operator'].employeeId : null,
        plantId: result['plant'] ? result['plant'].plantId : null,
        quantity: result['quantity'],
        jobOrderOperationId: result['jobOrderOperation'] ? result['jobOrderOperation'].jobOrderOperationId : null,
        referenceId: result['jobOrderOperation'] ? result['jobOrderOperation'].referenceId : null,
        quantityUnit: result['quantityUnit'],
        returnQuantity: result['returnQuantity'],
        description: result['description'],
        reworkStatus: result['reworkStatus'],
        returnQuantityUnit: result['returnQuantityUnit'],
        reworkWorkerId: result['reworkWorker'] ? result['reworkWorker'].reworkWorkerId : null,
        scrapCauseId: result['scrapCause'] ? result['scrapCause'].scrapCauseId : null,
        scrapId: result['scrapId'],
        scrapTypeId: result['scrapType'] ? result['scrapType'].scrapTypeId : null,
        wareHouseId: result['wareHouse'] ? result['wareHouse'].wareHouseId : null,
        workstationId: result['workstation'] ? result['workstation'].workStationId : null

      };
      this.selectedWorkStation = result['workstation'];
      if (this.scrapReqDto.jobOrderId) {
        this._jobOrderSvc.filter({ 
          pageNumber: 1,
          jobOrderId: this.scrapReqDto.jobOrderId,
          pageSize: 10}).then(res => {
            const joborder = res['content'][0];
            this.selectedProdOrderId = joborder.prodOrder.prodOrderId;
          }).catch(err => console.error(err));
      }
      this.loaderService.hideLoader();
    }).catch(error => {
      this.loaderService.hideLoader();
      console.log(error)
    });
  }
  setSelectedPlant(selectedPlantEvent) {
    if (selectedPlantEvent) {
      this.scrapReqDto.plantId = selectedPlantEvent.plantId;
    } else {
      this.scrapReqDto.plantId = null;
    }
  }
  onProductionOrderChange(event) {
    const detailItem = event;
    if (detailItem) {
      this.actId = detailItem.saleOrder ? detailItem.saleOrder.actId : null;
    }

  }
  onScrapTypeChange(event) {
    this.scrapCauseService.filter({ 
      pageNumber: 1,
      pageSize: 1000, type: 'REWORK',
      scrapTypeId: +event }).then(result => {
      this.scrapCauseList = result['content'];
    }).catch(error => console.log(error));
  }

  onJobOrderOperationSelected(event) {
    if(this.scrapReqDto.jobOrderOperationId) {
      this.scrapReqDto.referenceId = this.jobOrderOperationList.find(itm => itm.jobOrderOperationId === +this.scrapReqDto.jobOrderOperationId).referenceId;
    } else {
      this.scrapReqDto.referenceId = null;
    }
  }
  

  onJobOrderChange(event) {
    const detailItem = event;
    // console.log('selected joboderId', detailItem);
    if (detailItem) {
      this.scrapReqDto.jobOrderId = detailItem.jobOrderId;
    } else {
      this.scrapReqDto.jobOrderId = null;
    }

    this.jobOrderOperationList = event?.jobOrderOperations;
    // this.scrapReqDto.quantity = detailItem.quantity;
    // this.scrapReqDto.returnQuantity = detailItem.plannedQuantity;
  }
  setSelectedBatch(batch) {
    if (batch) {
      this.scrapReqDto.batch = batch.batchCode;
    } else {
      this.scrapReqDto.batch = null;
    }
  }

  setSelectedWorkStation(event) {
    if (event && event.hasOwnProperty('workStationId')) {
      this.scrapReqDto.workstationId = event.workStationId;
    } else {
      this.scrapReqDto.workstationId = null;
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
    } else {
      this.scrapReqDto.materialId = null;
      this.scrapReqDto.material = null;
      this.scrapReqDto.quantityUnit = null;
    }
  }
  reset() {
    this.scrapReqDto = {
      batch: null,
      jobOrderId: null,
      materialId: null,
      referenceId: null,
      description: null,
      material: null,
      reworkStatus:null,
      operatorId: null,
      plantId: this.scrapReqDto.plantId,
      quantity: null,
      quantityUnit: null,
      jobOrderOperationId: null,
      returnQuantity: null,
      returnQuantityUnit: null,
      reworkWorkerId: null,
      scrapCauseId: null,
      scrapId: null,
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
