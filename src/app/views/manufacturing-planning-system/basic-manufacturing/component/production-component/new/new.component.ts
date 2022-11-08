import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { LoaderService } from 'app/services/shared/loader.service';
import { ProductTreeComponentService } from 'app/services/dto-services/product-tree/prouduct-tree-component.service';
import { UtilitiesService } from 'app/services/utilities.service';
@Component({
  selector: 'product-tree-component-new',
  templateUrl: './new.component.html'
})
export class NewProductTreeComponentComponent implements OnInit {

  @ViewChild('myModal') public myModal: ModalDirective;
  @Output() saveAction = new EventEmitter<any>();

  @Input() productTreeDetailId;
  @Input() productTreeDetailOperationId;
  @Input() plant;
  @Input() position;
  @Input() direction = -1;
  @Input() quantity = null;
  @Input() saleOrderQuantity = null;
  @Input() manualProdOrder = false;
  @Input('data') set x(data) {
    if (data) {
      if (data.component) {
        data.componentId = data.component.stockId;
      }
      if(data.stock) {
        data.componentId = data.stock.stockId;
        data.component = data.stock;
      }
      if (data.productTreeDetailComponentFeatureList) {
        data.productTreeDetailComponentFeatureList.forEach(item => {
          // const d = Object.assign({}, item);
          if (item.productTreeCriteria) {
            item['productTreeCriteriaId'] = item.productTreeCriteria.productTreeCriteriaId;
          }
        })
      } else {
        data.productTreeDetailComponentFeatureList = [];
      }
      this.dataModel = JSON.parse(JSON.stringify(data));
      // this.dataModel = data;
      if(data.unit) {
        this.dataModel.quantityUnit = data.unit;
      }
      if(!data.quantity) {
        this.dataModel.quantity = 1;
      }
      if(!data.extraProductionPercentage) {
        this.dataModel.extraProductionPercentage = 0;
      } else {
        this.dataModel.extraProductionPercentage = parseInt((this.dataModel.extraProductionPercentage * 100).toFixed(1))
      }
    }
  };
  // @Input('openModalType') set onmodal(openModalType) {
  //   if (openModalType) {
  //     this.dataModel.direction = openModalType;
  //   }
  // }


  dataModel = {
    quantity: 1,
    neededQuantity: null,
    baseQuantity: 1,
    quantityUnit: null,
    description: null,
    position : null,
    direction: this.direction,
    productTreeDetailComponentId: null,
    extraProductionPercentage : 0,
    productTreeDetailOperationId: null,
    currency: null,
    productTreeDetailId: null,
    componentId: null,
    scrapCost: null,
    component: null,
    materialCost: null,
    materialCostRate: null,
    auxfeature: null,
    numberOfEdge: null,
    productTreeDetailComponentFeatureList: []

  };
  @Input('openModalType') set onmodal(openModalType) {
    if (openModalType !== null && openModalType !== undefined) {
      this.dataModel.direction = +openModalType;
      setTimeout(() => {
        this.myModal.show();
      }, 1000);
    }
  }
  @Input('materialPresent') set matpre(materialPresent) {
    if (!materialPresent) {
      this.dataModel.direction = 1;
    }
  }

  constructor(private loaderService: LoaderService,
              private _compSvc: ProductTreeComponentService,
              private utilities: UtilitiesService) {

  }

  ngOnInit() {
    this.dataModel.direction = this.direction;
    if(this.manualProdOrder) {
      if(!this.saleOrderQuantity) {
        this.dataModel.quantity = (this.quantity || 1) * this.dataModel.baseQuantity;
      } else {
        this.dataModel.quantity = this.dataModel.neededQuantity;
        this.dataModel.baseQuantity = this.dataModel.quantity / this.saleOrderQuantity;
      }
    }
  }

  onMaterialQuantityChangedProd(event) {
    if(this.saleOrderQuantity ) {
      this.dataModel.baseQuantity = parseFloat((this.dataModel.quantity / this.saleOrderQuantity).toFixed(2));
    }
  }
  onMaterialQuantityChanged(event) {
    if(event && this.dataModel.component && this.dataModel.component.stockCostEstimate?.currentPrice ) {
      this.dataModel.materialCost = this.dataModel.component.stockCostEstimate?.currentPrice * this.dataModel.quantity; 
      this.dataModel.scrapCost = this.dataModel.materialCost;
    } else {
      this.dataModel.materialCost = 0; 
      this.dataModel.scrapCost = 0;
    } 

  
  }

  save() {
    if (!this.dataModel.componentId) {

      this.utilities.showWarningToast('component must be selected');
      return;
    }
    this.loaderService.showLoader();
    if (this.productTreeDetailId) {
        this.dataModel.productTreeDetailId = this.productTreeDetailId;
    }
    if (this.productTreeDetailOperationId) {
      this.dataModel.productTreeDetailOperationId = this.productTreeDetailOperationId;
    }

    if(this.saleOrderQuantity) {
      this.dataModel.neededQuantity = this.dataModel.quantity;
    }

    this.dataModel.extraProductionPercentage = parseFloat((this.dataModel.extraProductionPercentage / 100).toFixed(2));
  // if productTreeDetailId  is not null, that mean this component will be saved  or update standalone
    // if (this.productTreeDetailId) {
    //   this.dataModel.productTreeDetailId = this.productTreeDetailId;
    //   this._compSvc.save(this.dataModel)
    //     .then((result: any) => {
    //       this.loaderService.hideLoader();
    //       this.utilities.showSuccessToast('saved-success');
    //       setTimeout(() => {
    //         if (result.component) {
    //           result.componentId = result.component.stockId;
    //         } else {
    //           result.componentId = this.dataModel.componentId;
    //         }
    //         if (result.productTreeDetail) { 
    //           result.productTreeDetailId = result.productTreeDetail.productTreeDetailId;
    //           delete result.productTreeDetail;
    //         }
    //         this.saveAction.emit(result);
    //       }, environment.DELAY);
    //     })
    //     .catch(error => {
    //       this.loaderService.hideLoader();
    //       this.utilities.showErrorToast(error);
    //     });
    // } else { // this mean component will be saved after detail saved
      this.saveAction.emit(this.dataModel);
      this.loaderService.hideLoader();
      // this.utilities.showSuccessToast('saved-success');
    // }


  }
  setSelectedStock(stock) {
    if (stock) {
      this.dataModel.componentId = stock.stockId;
      this.dataModel.component = stock;
      if(this.dataModel['stock']) {
        this.dataModel['stock'] = stock;
        this.dataModel['stockId'] = stock.stockId;
        this.dataModel['stockNo'] = stock.stockNo;
        this.dataModel['stockName'] = stock.stockName;
      }
      
      this.dataModel.quantityUnit = stock.baseUnit;
      this.dataModel.auxfeature = stock.auxfeature;
      this.dataModel.numberOfEdge = stock.numberOfEdge;
      this.dataModel.materialCost = stock.stockCostEstimate?.currentPrice || this.dataModel.materialCost;
      this.dataModel.currency = stock.stockCosting?.currencyCode || this.dataModel.currency;
      this.dataModel.extraProductionPercentage = stock.extraProductionPercentage || 0;
      // this.dataModel.auxfeature = stock.auxfeature;
      // this.dataModel.numberOfEdge = stock.numberOfEdge;

    } else {
      this.dataModel.position = null;
      this.dataModel.componentId = null;
      this.dataModel.component = null;
      this.dataModel.quantityUnit = null;
      this.dataModel.auxfeature = null;
      this.dataModel.numberOfEdge = null;
      this.dataModel.materialCost = null;
      this.dataModel.currency = null;


    }
  }

  onMaterialCostRateChanged(event) {
    this.dataModel.materialCost = parseFloat((this.dataModel.quantity * this.dataModel.materialCostRate).toFixed(2));
    this.dataModel.scrapCost = this.dataModel.materialCost;
  }

  featuresUpdated(event) {
    this.dataModel.productTreeDetailComponentFeatureList = event;
  }
}
