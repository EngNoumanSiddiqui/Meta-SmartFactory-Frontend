import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ConvertUtil } from 'app/util/convert-util';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { JobOrderService } from 'app/services/dto-services/job-order/job-order.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';

@Component({
  selector: 'edit-job-order',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditJobOrderComponent implements OnInit {

  jobDetail: any;
  showLoader = false;
  @Input('jobOrderId') set jobOrder(jobOrderId) {
    if (jobOrderId) {
      this.initialize(jobOrderId);
    } else {
      this.jobDetail = null;
    }
  }

  @Output() saveAction = new EventEmitter<any>();

  constructor(private _jobOrderSvc: JobOrderService,
              private utilities: UtilitiesService,
              private loaderService: LoaderService) {
  }

  showDetail(jobOrderId) {
    this.initialize(jobOrderId);
  }

  showOpenJobOrderDetail(jobOrderId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.JOBORDER, jobOrderId);
  }

  public initialize(jobOrderId) {
    this.loaderService.showLoader();
    this._jobOrderSvc.getDetail(jobOrderId)
      .then(result => {
        this.jobDetail = result;
        this.jobDetail.jobOrderCombinedList.forEach(jbordr => {
          jbordr.jobOrderStockProduceList = jbordr.jobOrderStockProduceList.map(stk => { return {
            currentStockQuantity: stk.currentStockQuantity,
            currentStockReservedQuantity: stk.currentStockReservedQuantity,
            defectName: stk.defectName,
            defectQuantity: stk.defectQuantity,
            direction: stk.direction,
            jobOrderId: stk.jobOrderId,
            jobOrderStockId: stk.jobOrderStockId,
            neededQuantity: stk.neededQuantity,
            quantity: stk.quantity,
            stockId: stk.stockId,
            stockName: stk.stockName,
            totalSetupQuantity: stk.totalSetupQuantity,
            unit: stk.unit,
            previousDefectedQuantity: stk.defectQuantity,
            previousQuantity: stk.quantity
          }});
        });
        this.loaderService.hideLoader();
      })
      .catch(error => {
        this.jobDetail = null;
        this.utilities.showErrorToast(error);
        this.loaderService.hideLoader();
      });
  }
  ngOnInit() {

  }

  isLoading() {
    return this.loaderService.isLoading();
  }

  showStockDetail(stockId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.STOCK, stockId);
  }

  showWsDetail(workstationId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.WORKSTATION, workstationId);
  }

  showCustomerDetail(customerId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.CUSTOMER, customerId);
  }

  showOperationDetail(opearationId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.OPERATION, opearationId);
  }

  getComponentList(itemList) {
    // console.log(itemList);
    if (itemList) {
      const components = itemList.map(o => o.stockName).join(', ');
      return components;
    }
    return '';
  }

  getMaterialList(itemList) {
    // console.log(itemList);
    if (itemList) {
      const materials = itemList.map(o => o.stockName).join(', ');
      return materials;
    }
    return '';
  }

  getOperationList(itemList) {
    // console.log(itemList);
    if (itemList) {
      const operations = itemList.map(o => o.operationName).join(', ');
      return operations;
    }
    return '';
  }

  getReadableTime(time) {
    return ConvertUtil.longDuration2DHHMMSSTime(time)
  }

  checkStockQuantity(event, stockProduceItem) {
    const combineList = this.jobDetail.jobOrderCombinedList;
    let totalStock = 0;
    let totalproduce = 0;
    combineList.forEach(joborder => {
      joborder.jobOrderStockProduceList.forEach(produceItem => {
        if (stockProduceItem.stockId === produceItem.stockId) {
          totalproduce += produceItem.quantity
          totalStock += produceItem.neededQuantity;
        }
      });
    });

    console.log('Total Stock:', totalStock);
    console.log('Total Produce:', totalproduce);
  }
  saveJobDetails() {
    const reqDtolst = [];
    this.jobDetail.jobOrderCombinedList.forEach(jbordr => {
      jbordr.jobOrderStockProduceList.forEach(stk => {
        const dto  = {
          jobOrderId: jbordr.jobOrderId,
          materialId: stk.stockId,
          newDefectedQuantity: stk.defectQuantity,
          newQuantity: stk.quantity,
          previousDefectedQuantity: stk.previousDefectedQuantity,
          previousQuantity: stk.previousQuantity,
          quantityUnit: stk.unit,
          reason: ''
        };
        reqDtolst.push(dto);
      });
    });
    this.loaderService.showLoader();
    this._jobOrderSvc.editJobOrderStockQuantity(reqDtolst).then(res => {
      this.loaderService.hideLoader();
      this.utilities.showSuccessToast('success');
      this.saveAction.next(true);
    }).catch(err => {
      this.loaderService.hideLoader();
      console.error(err);
      this.utilities.showErrorToast(err);
    });
    
  }

}
