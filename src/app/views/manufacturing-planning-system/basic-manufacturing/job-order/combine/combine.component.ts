import {Component, EventEmitter, Input, OnInit, Output, ViewChild, OnDestroy} from '@angular/core';
import { AppStateService } from 'app/services/dto-services/app-state.service';

import { Subscription } from 'rxjs';
import { Dialog } from 'primeng';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
import { ProductionOrderService } from 'app/services/dto-services/production-order/production-order.service';
import { CreateJobOrderRequest, JobOrderPositionStatusEnum } from 'app/dto/job-order/job-order.model';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';

@Component({
  selector: 'job-order-join',
  templateUrl: './combine.component.html',
  styleUrls: ['./combine.component.scss']
})
export class JobOrderJoinComponent implements OnInit, OnDestroy {


  @Input() selectedReadyJobOrders;

  @Output() saveAction = new EventEmitter();

  params = {
    numberOfJobs: null, jobList: [], error: ''
  };

  choosedComponents = [];
  prodOrderTypeList: any;

  planningJoin = {
    jobOrderList: [],
    jobOrderOperations: [],
    jobOrderEquipmentList: [],
    workstationProgramList: [],
    jobOrderQuantity: 1,
    operationId: null,
    workstationId: null,
    wareHouseId: null,
    wareHouse: null,
    equipmentId: null,
    stockToUseId: null,
    stockToUseName: null,
    changedStockUseQuantity: 1,
    operationRepeat: 1,
    singleDuration: 0,
    singleStandbyDuration: 0,
    maxSingleStandbyDuration: 0,
    singleSetupDuration: 0,
    expectedSetupDuration: 0,
    startDate: null,
    finishDate: null,
    prodOrderType: null,
    plantId: null,
    batch: null,
    processControlFrequency: 1,
    checkbox: false
  };

  emptyPlanningJoin = {
    jobOrderList: [],
    jobOrderOperations: [],
    jobOrderEquipmentList: [],
    workstationProgramList: [],
    jobOrderQuantity: 1,
    operationId: null,
    workstationId: null,
    wareHouseId: null,
    wareHouse: null,
    equipmentId: null,
    stockToUseId: null,
    stockToUseName: null,
    changedStockUseQuantity: 1,
    operationRepeat: 1,
    singleDuration: 0,
    singleStandbyDuration: 0,
    maxSingleStandbyDuration: 0,
    singleSetupDuration: 0,
    expectedSetupDuration: 0,
    startDate: null,
    finishDate: null,
    prodOrderType: null,
    plantId: null,
    batch: null,
    processControlFrequency: 1,
    checkbox: false
  };
  @ViewChild('dJoin') dJoin: Dialog;
  sub: Subscription;


  constructor(private loader: LoaderService,
              private utilities: UtilitiesService,
              private _enumSvc: EnumService,
              private appStateService: AppStateService,
              private prodSvc: ProductionOrderService) {

                this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
                  if (!(res)) {
                    this.planningJoin.plantId = null;
                  } else {
                    this.planningJoin.plantId = res.plantId;
                  }
                });
  }



  setSelectedWarehouse(event) {
    this.planningJoin.wareHouse = event;
    if (event && event.hasOwnProperty('wareHouseId')) {
      this.planningJoin.wareHouseId = event.wareHouseId;
    } else {
      this.planningJoin.wareHouseId = null;
    }

  }


  setSelectedJoinPlant(event) {
    this.planningJoin.wareHouse = null;
    this.planningJoin.wareHouseId = null;
    if (event) {
      this.planningJoin.plantId = event.plantId;
    } else {
      this.planningJoin.plantId = null;
    }
  }

  setSelectedBatch(batch) {
    if (batch) {
      this.planningJoin.batch = batch.batchCode;
    } else {
      this.planningJoin.batch = null;
    }
  }

  reset() {
    this.selectedReadyJobOrders = [];
    this.planningJoin = Object.assign({}, this.emptyPlanningJoin);
  }


  ngOnInit() {
    this.planningJoin = Object.assign({}, this.emptyPlanningJoin);

    this.planningJoin.jobOrderList = this.selectedReadyJobOrders;
    this.getProductionOrderTypeList();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }


  saveJoin() {


    const me = this;
    const jobs: CreateJobOrderRequest[] = [];

    const stockUseList = [];
    const stockProduceList = [];


    if (this.planningJoin.checkbox) {
      stockUseList.push(...this.choosedComponents);
      this.planningJoin.jobOrderList.forEach(job => {

        const jb: CreateJobOrderRequest = this.createJob(JobOrderPositionStatusEnum.STANDARD, me.planningJoin.jobOrderQuantity
          , stockUseList, job.jobOrderStockProduceList, job.jobOrderId, job.orderDetailId);
        jobs.push(jb)
        stockProduceList.push(...job.jobOrderStockProduceList)
      });

    } else {
      this.planningJoin.jobOrderList.forEach(job => {

        const jb: CreateJobOrderRequest = this.createJob(JobOrderPositionStatusEnum.STANDARD, me.planningJoin.jobOrderQuantity
          , job.jobOrderStockUseList, job.jobOrderStockProduceList, job.jobOrderId, job.orderDetailId);
        jobs.push(jb)
        stockUseList.push(...job.jobOrderStockUseList);
        stockProduceList.push(...job.jobOrderStockProduceList);
      });


    }


    const comb: CreateJobOrderRequest = this.createJob(JobOrderPositionStatusEnum.JOINED, me.planningJoin.jobOrderQuantity
      , stockUseList, stockProduceList, null, null);

      // comb['expectedSetupDuration'] = comb.singleSetupDuration
    jobs.push(comb);

    const prodOrder = {
      plantId: this.planningJoin.plantId,
      wareHouseId: this.planningJoin.wareHouseId,
      quantity: 0,
      batch: this.planningJoin.batch,
      startDate: this.planningJoin.startDate,
      finishDate: this.planningJoin.finishDate,
      jobOrderList: jobs,
      prodOrderType: this.planningJoin.prodOrderType
    }

    this.prodSvc.join(prodOrder).then(() => {

      this.utilities.showSuccessToast('success-planned');

      setTimeout(() => {

        this.reset();
        this.saveAction.next('close');
      }, 200);

    }).catch(err => {
      this.utilities.showErrorToast(err);
    })
  }


  createJob(position: JobOrderPositionStatusEnum, expectedQuantity, stockUseList, stockProduceList,
            parentId, orderDetailId): CreateJobOrderRequest {
    const comb: CreateJobOrderRequest = {
      position: position,
      expectedQuantity: expectedQuantity,
      workstationId: this.planningJoin.workstationId,
      operationRepeat: this.planningJoin.operationRepeat,
      jobOrderStockUseList: stockUseList,
      jobOrderStockProduceList: stockProduceList,
      jobOrderEquipmentList: this.planningJoin.jobOrderEquipmentList,
      jobOrderOperations: this.planningJoin.jobOrderOperations,
      workstationProgramList: this.planningJoin.workstationProgramList,
      singleDuration: this.planningJoin.singleDuration,
      singleStandbyDuration: this.planningJoin.singleStandbyDuration,
      maxSingleStandbyDuration: this.planningJoin.maxSingleStandbyDuration,
      singleSetupDuration: this.planningJoin.singleSetupDuration,
      parentId: parentId,
      processControlFrequency: this.planningJoin.processControlFrequency,
      orderDetailId: orderDetailId
    };
    return comb;
  }


  moveToJoinTop() {
    this.dJoin.moveOnTop();
  }

  getProductionOrderTypeList() {
    this._enumSvc.getProductionOrderTypeList().then(result => {
      this.prodOrderTypeList = result;
      console.log(result);
    }).catch(error => console.log(error));
    // this.prodSvc.filter({pageSize: 100000, pageNumber: 1}).then(data => {
    //   // console.log('@prOderType', data);
    //   if (data && data['content']) {
    //     this.prodOrderTypeList = data['content'];
    //   }
    // });
  }
  showJobOrderDetail(jobOrderId) {
    this.loader.showDetailDialog(DialogTypeEnum.JOBORDER, jobOrderId);
  }


}
