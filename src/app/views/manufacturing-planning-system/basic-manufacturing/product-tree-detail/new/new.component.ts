import {Component, EventEmitter, Input, OnInit, Output, OnDestroy} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { UsersService } from 'app/services/users/users.service';
import { ProductDetailItemCommunicatingService } from '../../product-detail-item.service';
import { takeWhile } from 'rxjs/operators';
import { LoaderService } from 'app/services/shared/loader.service';
import { ProductTreeDetailService } from 'app/services/dto-services/product-tree/prod-tree-detail.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
@Component({
  selector: 'product-tree-detail-new',
  templateUrl: './new.component.html'
})
export class NewProductTreeDetailComponent implements OnInit, OnDestroy {


  @Output() saveAction = new EventEmitter<any>();

  // tslint:disable-next-line: no-input-rename
  @Input('productTreeId') productTreeId;
  // tslint:disable-next-line: no-input-rename
  @Input('parentDetailId') parentDetailId;
  @Input() isParent = false;

  openModalType: any;
  selectedPlant: any;
  dataModel = {
    productTreeId: null,
    productTreeDetailId: null,
    operationRepeat: 1,
    processControlFrequency: 1,
    parentId: null,
    productionType: null,
    singleDuration: 0,
    singleSetupDuration: 0,
    singleTotalDuration: 0,
    maxSingleStandbyDuration: 0,
    componentList: null,
    operationList: null,
    equipmentList: null,
    workstationProgramList: null,
    workstationId: null,
    workstation: null,
    orderNo: null,
    plannedCycleQuantity : 1
  };
  productionTypeList = [];
  @Input('index') set indexx(modal) {
    if (modal.index) {
     this.index = modal.index;
    }
    if (modal.openModalType !== null && modal.openModalType !== undefined) {
      this.openModalType = modal.openModalType;
    }
  }

  @Input('data') set x(data) {
    if (data) {

    console.log('@productTreeDetailData', data)
      // if (data.componentList && data.componentList.length > 0) {
      //
      //   data.componentList.forEach(item => {
      //     item.productTreeDetailId = data.productTreeDetailId;
      //
      //     if (item.productTreeDetailComponentFeatureList && data.productTreeDetailComponentFeatureList.length > 0) {
      //       item.productTreeDetailComponentFeatureList.forEach(it => {
      //         it.productTreeDetailComponentId = item.productTreeDetailComponentId;
      //       })
      //     }
      //
      //   })
      // }
      // if (data.operationList && data.operationList.length > 0) {
      //
      //   data.operationList.forEach(item => {
      //     item.productTreeDetailId = data.productTreeDetailId;
      //
      //     if (item.workstationProgramList && data.workstationProgramList.length > 0) {
      //       item.productTreeDetailComponentFeatureList.forEach(it => {
      //         it.productTreeDetailComponentId = item.productTreeDetailComponentId;
      //       })
      //     }
      //
      //   })
      // }
      // if (data.workstationProgramList && data.workstationProgramList.length > 0) {
      //
      //   data.workstationProgramList.forEach(item => {
      //     item.productTreeDetailId = data.productTreeDetailId;
      //   })
      // }
      // if (data.equipmentList && data.equipmentList.length > 0) {
      //
      //   data.equipmentList.forEach(item => {
      //     item.productTreeDetailId = data.productTreeDetailId;
      //   })
      // }

      this.dataModel = JSON.parse(JSON.stringify(data));
      if (this.dataModel.workstation) {
        this.dataModel.workstationId = this.dataModel.workstation.workStationId;
      }
      if (this.dataModel.componentList) {
        this.auxMaterialList = this.dataModel.componentList.filter(itm => itm.direction === 0);
        this.componentList = this.dataModel.componentList.filter(itm => itm.direction !== 0);
      } else {
        this.auxMaterialList = [];
        this.componentList = [];
      }
    }
  };

  auxMaterialList: any;
  componentList: any;

  
  index = 0;
  componentAlive = true;
  constructor(private loaderService: LoaderService,
              private _compSvc: ProductTreeDetailService,
              public prodDetailCommunicatingService: ProductDetailItemCommunicatingService,
              private _translateSvc: TranslateService,
              private enumService: EnumService,
              private userSvc: UsersService,
              private utilities: UtilitiesService) {

                this.selectedPlant = JSON.parse(this.userSvc.getPlant());
  }

  ngOnInit() {
    this.enumService.getProductionTypeEnum().then((res: any) => this.productionTypeList = res);
    this.prodDetailCommunicatingService.onhide.asObservable()
    .pipe(takeWhile(() => this.componentAlive === true)).subscribe(rs => {
      if (this.dataModel.productTreeDetailId) {
        this.save();
      } else {
        this.saveAction.emit(null);
      }
    });

    
  }

  ngOnDestroy() {
    this.componentAlive = false;
  }

  handleChange(e) {
    this.index = e.index;
  }

  save() {
    // if (!this.componentList) {
    //   this.componentList = [];
    // }
    // if (!this.auxMaterialList) {
    //   this.auxMaterialList = [];
    // }
    // this.dataModel.componentList = [...this.componentList, ...this.auxMaterialList];

    // if (!this.validateDuration('single-duration', this.dataModel.singleDuration)) {
    //   return;
    // }
    // if (!this.validateDuration('single-setup-duration', this.dataModel.singleSetupDuration)) {
    //   return;
    // }
    // if (!this.validateDuration('single-total-duration', this.dataModel.singleTotalDuration)) {
    //   return;
    // }
    // if (!this.validateDuration('max-single-standby-duration', this.dataModel.maxSingleStandbyDuration)) {
    //   return;
    // }
    // finding duplicate items in operation list by operationOrder
    // const lookup = this.dataModel.operationList.reduce((a, e) => {
    //   a[e.operationOrder] = ++a[e.operationOrder] || 0;
    //   return a;
    // }, {});
    
    // if (this.dataModel.operationList.filter(e => lookup[e.operationOrder]).length > 0) {
    //   const lbl = this._translateSvc.instant('operaton-order-must-not-be-same');
    //   this.utilities.showWarningToast(lbl);
    //   return;
    // }
    if (this.dataModel.operationList.filter(e => (e.operationOrder === 0) || (e.operationOrder <= 0)  || (e.operationOrder === null)).length > 0) {
      const lbl = this._translateSvc.instant('please-select-operation-order');
      this.utilities.showWarningToast(lbl);
      return;
    }
    if (this.isParent) {
      if (this.dataModel.operationList.filter(e => (e.operationOrder === 1) && (e.parent === false)).length > 0) {
        const lbl = this._translateSvc.instant('please-select-operation-as-parent-for-level-1');
        this.utilities.showWarningToast(lbl);
        return;
      } else {
        const parentData = this.dataModel.operationList.find(e => e.parent === true);
        if (!parentData) {
          const lbl = this._translateSvc.instant('please-select-operation-as-parent-for-level-1');
          this.utilities.showWarningToast(lbl);
          return;
        }
      }

    }


    this.loaderService.showLoader();
    // if productTreeDetailId  is not null, that mean this equipment will be saved  or update standalone
    if (this.dataModel.productTreeDetailId) {
      this.dataModel.productTreeId = this.productTreeId;
      this.dataModel.parentId = this.parentDetailId;
      // this._compSvc.save(this.dataModel)
      //   .then(result => {
      //     this.loaderService.hideLoader();
      //     this.utilities.showSuccessToast('saved-success');
      //     setTimeout(() => {
      //       this.saveAction.emit(result);
      //     }, environment.DELAY);
      //   })
      //   .catch(error => {
      //     this.loaderService.hideLoader();
      //     this.utilities.showErrorToast(error);
      //   });
    } // else { // this mean equipment will be saved after detail saved
      this.saveAction.emit(this.dataModel);
      this.loaderService.hideLoader();
      this.utilities.showSuccessToast('saved-success');
    // }


  }

  // addOrUpdate(itemlist) {
  //   if (this.dataModel.componentList && this.dataModel.componentList.length > 0) {
  //     const dataTable = this.dataModel.componentList.filter(itm => itm.direction !== 0);
  //     if (dataTable && dataTable.length > 0) {
  //       if (itemlist.length > dataTable.length) {
  //        itemlist.forEach(itm => dataTable.forEach(cpm => {
  //         if (cpm.componentId === itm.componentId) {
  //             cpm.quantity = itm.quantity;
  //             cpm.quantityUnit = itm.quantityUnit;
  //             cpm.direction = itm.direction;
  //             cpm.component = itm.component;
  //             cpm.componentId = itm.componentId;
  //             // this.dataModel.componentList.splice(this.dataModel.componentList.findIndex(k => itm.componentId === k.componentId), 1, cpm);
  //         } else {
  //           this.dataModel.componentList.push(itm);
  //         }
  //       }));
  //       } else {
  //         dataTable.forEach(itm => itemlist.forEach(cpm => {
  //           if (cpm.componentId === itm.componentId) {
  //               cpm.quantity = itm.quantity;
  //               cpm.quantityUnit = itm.quantityUnit;
  //               cpm.direction = itm.direction;
  //               cpm.component = itm.component;
  //               cpm.componentId = itm.componentId;
  //               // this.dataModel.componentList.splice(this.dataModel.componentList.findIndex(k => itm.componentId === k.componentId), 1, cpm);
  //           } else {
  //             this.dataModel.componentList.splice(this.dataModel.componentList.findIndex(k => itm.componentId === k.componentId), 1);
  //           }
  //         }));
  //       }
  //     } else {
  //       this.dataModel.componentList = [...this.dataModel.componentList, ...itemlist];
  //     }
  //   } else {
  //     this.dataModel.componentList = itemlist;
  //   }
  // }

  // addOrUpdateAuxMaterial(itemlist) {
  //   if (this.dataModel.componentList && this.dataModel.componentList.length > 0) {
  //     const dataTable = this.dataModel.componentList.filter(itm => itm.direction === 0);
  //     if (dataTable && dataTable.length > 0) {
  //       if (itemlist.length > dataTable.length) {
  //        itemlist.forEach(itm => dataTable.forEach(cpm => {
  //         if (cpm.componentId === itm.componentId) {
  //             cpm.quantity = itm.quantity;
  //             cpm.quantityUnit = itm.quantityUnit;
  //             cpm.direction = itm.direction;
  //             cpm.component = itm.component;
  //             cpm.componentId = itm.componentId;
  //             return 0;
  //             // this.dataModel.componentList.splice(this.dataModel.componentList.findIndex(k => itm.componentId === k.componentId), 1, cpm);
  //         } else {
  //           this.dataModel.componentList.push(itm);
  //         }
  //       }));
  //       } else {
  //         dataTable.forEach(itm => itemlist.forEach(cpm => {
  //           if (cpm.componentId === itm.componentId) {
  //               cpm.quantity = itm.quantity;
  //               cpm.quantityUnit = itm.quantityUnit;
  //               cpm.direction = itm.direction;
  //               cpm.component = itm.component;
  //               cpm.componentId = itm.componentId;
  //               // this.dataModel.componentList.splice(this.dataModel.componentList.findIndex(k => itm.componentId === k.componentId), 1, cpm);
  //           } else {
  //             this.dataModel.componentList.splice(this.dataModel.componentList.findIndex(k => itm.componentId === k.componentId), 1);
  //           }
  //         }));
  //       }
  //     } else {
  //       this.dataModel.componentList = [...this.dataModel.componentList, ...itemlist];
  //     }
  //   } else {
  //     this.dataModel.componentList = itemlist;
  //   }
  // }
  setSelectedWorkstation(equipment) {
    if (equipment) {
      this.dataModel.workstationId = equipment.workStationId;
      this.dataModel.workstation = equipment;
    } else {
      this.dataModel.workstationId = null;
      this.dataModel.workstation = null;
    }
  }

  onDataChange() {
    this.saveAction.emit(this.dataModel);
  }

  validateDuration(label, value) {

    if (!value || value === 0) {
      const lbl = this._translateSvc.instant(label);
      this.utilities.showWarningToast(lbl + ' must be bigger then 0');
      return false;
    }
    return true;


  }

  addsingleDuration(event) {
    this.dataModel.singleDuration = event;
    if (this.dataModel.singleSetupDuration) {
      this.dataModel.singleTotalDuration = this.dataModel.singleDuration + this.dataModel.singleSetupDuration;
    } else {
      this.dataModel.singleTotalDuration = this.dataModel.singleDuration;
    }
  }
  addsingleSetupDuration(event) {
    this.dataModel.singleSetupDuration = event;
    if (this.dataModel.singleDuration) {
      this.dataModel.singleTotalDuration = this.dataModel.singleDuration + this.dataModel.singleSetupDuration;
    } else {
      this.dataModel.singleTotalDuration = this.dataModel.singleSetupDuration;
    }
  }
}
