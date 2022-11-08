import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { JobOrderService } from 'app/services/dto-services/job-order/job-order.service';
import { Subscription } from 'rxjs';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
@Component({
  selector: 'job-order-component-new',
  templateUrl: './new.component.html'
})
export class NewJobOrderStockComponent implements OnInit, OnDestroy {


  @Output() saveAction = new EventEmitter<any>();

  @Input() direction;

  plantId: any;
  @Input('plantId') set plx(plantId) {
    if (plantId) {
      this.plantId = plantId;
    }
  }
  @Input('data') set x(data) {
    if (data) {

      if (data.requestJobOrderComponentFeatureList) {
        data.requestJobOrderComponentFeatureList.forEach(item => {
          if (item.productTreeCriteria) {
            item['productTreeCriteriaId'] = item.productTreeCriteria.productTreeCriteriaId;
          }
        })
      }
      this.dataModel = data;
    }
  };


  dataModel = {
    neededQuantity: 1,
    unit: null,
    jobOrderStockId: null,
    stockId: null,
    direction: null,
    stockName: null,
    component: null,
    requestJobOrderComponentFeatureList: []

  };
  tabSubscription: Subscription;

  includeMaterialList = null;
  excludeMaterial = null;
  
  constructor(
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private jobOrderService: JobOrderService) {

  }

  ngOnInit() {
    this.dataModel.direction = this.direction;
    this.setFilterMaterials();
  }

  setFilterMaterials() {
    this.tabSubscription = this.jobOrderService.componentType.subscribe((tab) => {
      console.log('tab========>', tab)
      if (tab === 0) {
        this.excludeMaterial = null;
        this.includeMaterialList = [1,2,4,5,6,7,8,9];
      } else if (tab === 1) {
        this.includeMaterialList = [2,3,9,10];
        this.excludeMaterial = null;
      } else {
        this.includeMaterialList = null;
        this.excludeMaterial = null;
      }
    });
  }

  save() {

    if (this.direction) {
      this.dataModel.direction = this.direction;
    }

    if (!this.dataModel.stockId) {

      this.utilities.showWarningToast('component must be selected');
      return;
    }
    this.loaderService.showLoader();

    this.saveAction.emit(this.dataModel);
    this.loaderService.hideLoader();
    this.utilities.showSuccessToast('saved-success');


  }

  setSelectedStock(stock) {
    if (stock) {
      this.dataModel.stockId = stock.stockId;
      this.dataModel.stockName = stock.stockName;
      this.dataModel.component = stock;
      this.dataModel.unit = stock.baseUnit;
    } else {
      this.dataModel.stockId = null;
      this.dataModel.stockName = null;
      this.dataModel.component = null;
      this.dataModel.unit = null;
    }
  }

  featuresUpdated(event) {
    this.dataModel.requestJobOrderComponentFeatureList = event;
  }

  ngOnDestroy() {
    this.tabSubscription.unsubscribe();
  }
}
