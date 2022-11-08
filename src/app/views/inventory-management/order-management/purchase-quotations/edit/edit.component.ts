import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'environments/environment';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
import { CreatePurchaseQuotationDetailDto } from 'app/dto/purchase-quotation/purchase-quotation.model';
import { PurchaseQuotationService } from 'app/services/dto-services/purchase-quotation/purchase-quotation.service';
import { StockCardService } from 'app/services/dto-services/stock/stock.service';
import { UsersService } from 'app/services/users/users.service';
import { ActTypeService } from 'app/services/dto-services/act-type/act-type.service';

@Component({
  selector: 'purchase-quotation-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})

export class PurchaseQuotationEditComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();
  purchaseQuotationDto = {
    createDate: null,
    costCenterId: null,
    plantId: null,
    description: null,
    purchaseQuotationDetailList: new Array<CreatePurchaseQuotationDetailDto>(),
    purchaseQuotationId: null,
    purchaseQuotationStatus: null,
    requiredDate: null,
    updateDate: null,
    vendorId: null,
    vendorTypeId: null,
    vendorName: null,
  } 
  purchaseQuotationDetaildto = new CreatePurchaseQuotationDetailDto();
  params = {
    dialog: { title: '', inputValue: '', visible: false }
  };
  selectedDetailIndex = -1;
  selectedPlant: any;
  quotationStatusList = [];
  selectedVendor: any;
  unitList = [];
  listActTypes: any;



  @Input('id') set setquotationId(id) {
    if (id) {
      this.purchaseQuotationDto.purchaseQuotationId = id;
      this.getPurchaseQuotationDetails(id);
    }
  }


  constructor(
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _confirmationSvc: ConfirmationService,
    private userSvc: UsersService,
    private _actTypes: ActTypeService,
    private _stockSvc: StockCardService,
    private purchaseQuotationSvc: PurchaseQuotationService,
    private _translateSvc: TranslateService,
    private _enumSvc: EnumService) {
    this.selectedPlant = JSON.parse(this.userSvc.getPlant());
  }

  ngOnInit() {
    this._enumSvc.QuatationStatusEnum().then((result: any) => this.quotationStatusList = result).catch(error => console.log(error));
    // this.purchaseQuotationDto.purchaseQuotationStatus = 'OPENED';
    // this.purchaseQuotationDto.createDate = new Date();
    // this._actTypes.getbyPlantId_AccountPosition(this.selectedPlant?.plantId, 'SUPPLIER').then((result: any) => this.listActTypes = result).catch(error => console.log(error));
  }
  
  onOrderStatusChanged(event) {
    if (event) {
      this.purchaseQuotationDto.purchaseQuotationDetailList.forEach(itm => {
        itm.purchaseQuotationDetailStatus = this.purchaseQuotationDto.purchaseQuotationStatus;
      });
    }
  }

  getPurchaseQuotationDetails(id) {
    this.loaderService.showLoader();
    this.purchaseQuotationSvc.getDetail(id).then(res => {
      this.purchaseQuotationDto = {
        createDate: res['createDate'],
        description: res['description'],
        purchaseQuotationDetailList: res['purchaseQuotationDetailList'].map(itm => (
          {...itm,
            plantName: itm.plant?.plantName,
            plantId: itm.plant?.plantId,
            stockId: itm.stock?.stockId,
            stockNo: itm.stock?.stockNo,
            stockName: itm.stock?.stockName
          })),
        purchaseQuotationId: res['purchaseQuotationId'],
        purchaseQuotationStatus: res['purchaseQuotationStatus'],
        requiredDate: new Date(res['requiredDate']),
        updateDate: res['updateDate'],
        costCenterId: res['costCenter']?.costCenterId,
        plantId: res['plantId'] || res['plant']?.plantId,
        vendorId: res['vendor'] ? res['vendor'].actId : null,
        vendorTypeId: res['vendor'] ? res['vendor'].actTypeId || null : null,
        vendorName: res['vendor'] ? res['vendor'].actName : null,
      };
      this.purchaseQuotationDto['vendorType'] = res['vendor']?.actType;

      this.selectedVendor = res['vendor'];
      this.loaderService.hideLoader();
    }).catch(err => {
      console.error(err);
      this.loaderService.hideLoader();
    });
  }

  setSelectedCustomer(customer) {
    if (customer) {
      this.purchaseQuotationDto.vendorId = customer.actId;
      this.purchaseQuotationDto.vendorName = customer.actName;
      this.selectedVendor = customer;
    } else {
      this.purchaseQuotationDto.vendorId = null;
      this.purchaseQuotationDto.vendorName = null;
      this.selectedVendor = null;
    }
  }

  setSelectedPlant(event) {
    if (event) {
      this.purchaseQuotationDetaildto.plantId = event.plantId;
      this.purchaseQuotationDetaildto.plantName = event.plantName;
    } else {
      this.purchaseQuotationDetaildto.plantId = null;
      this.purchaseQuotationDetaildto.plantName = null;
    }
  }
  
  save() {
    this.loaderService.showLoader();
    this.purchaseQuotationSvc.save(this.purchaseQuotationDto)
      .then(result => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.saveAction.emit('close');
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }

  reset() {
    this.purchaseQuotationDto = {
      createDate: null,
      description: null,
      costCenterId: null,
      vendorTypeId: null,
      purchaseQuotationDetailList: new Array<CreatePurchaseQuotationDetailDto>(),
      purchaseQuotationId: this.purchaseQuotationDto.purchaseQuotationId,
      plantId: this.purchaseQuotationDto.plantId,
      purchaseQuotationStatus: null,
      requiredDate: null,
      updateDate: null,
      vendorId: null,
      vendorName: null,
    }
  }

  setSelectedBatch(batch) {
    if (batch) {
      this.purchaseQuotationDetaildto.batch = batch.batchCode;
    } else {
      this.purchaseQuotationDetaildto.batch = null;
    }
  }
  onSelectMaterial(stock) {
    if (stock) {
      this.purchaseQuotationDetaildto.stockId = stock.stockId;
      this.purchaseQuotationDetaildto.stockNo = stock.stockNo;
      this.purchaseQuotationDetaildto.stockName = stock.stockName;
      this.purchaseQuotationDetaildto.stockName2 = stock.stockName2;
      this.purchaseQuotationDetaildto.baseUnit = stock.baseUnit;
      this.getMaterialunitList(this.purchaseQuotationDetaildto.stockId);
    }
  }


  openPurchaseQuotationDetailsModal(index) {
    this.params.dialog.title = 'purchase-quotation-details';
    this.params.dialog.visible = true;
    this.selectedDetailIndex = index;
    if (this.selectedDetailIndex < 0) {
      // new
      this.resetNewItemDetails();
      if (this.selectedPlant) {
        this.purchaseQuotationDetaildto.plantId = this.selectedPlant.plantId;
        this.purchaseQuotationDetaildto.plantName = this.selectedPlant.plantName;
      }
      this.purchaseQuotationDetaildto.purchaseQuotationDetailStatus = 'OPENED';
    } else {
      // edit
      this.purchaseQuotationDetaildto = Object.assign({}, this.purchaseQuotationDto.purchaseQuotationDetailList[index]);

      if(this.purchaseQuotationDetaildto.discountPrice) {
        this.purchaseQuotationDetaildto.discountPercentage =  parseFloat((this.purchaseQuotationDetaildto.discountPrice / this.purchaseQuotationDetaildto.grossPrice).toFixed(1));
      }
      this.purchaseQuotationDetaildto.deliveryDate = this.purchaseQuotationDetaildto.deliveryDate ? new Date(this.purchaseQuotationDetaildto.deliveryDate) : null;

      this.purchaseQuotationDetaildto.validUntil = this.purchaseQuotationDetaildto.validUntil ? new Date(this.purchaseQuotationDetaildto.validUntil) : null;
      // this.getMaterialunitList(this.purchaseQuotationDetaildto.stockId);
      if(!(this.unitList.length > 0) || (this.unitList.filter(item => item.stockId ===this.purchaseQuotationDetaildto.stockId).length === 0)) {
        this._stockSvc.metarialActiveUnits(this.purchaseQuotationDetaildto.stockId).then((result: any) => {
          this.unitList = result;
        }).catch(error => console.log(error));
      }
    }
  }

  onPlantChange(event) {
    if (event) {
      this.purchaseQuotationDetaildto.plantId = event.plantId;
      this.purchaseQuotationDetaildto.plantName = event.plantName;
    }
  }

  addDetails() {
    // const cloneOfNewOrderDetailListItem = Object.assign({}, this.newRequestOrderDetailCreateDto);
    if (this.selectedDetailIndex < 0) {
      // add
      if  (this.purchaseQuotationDto.purchaseQuotationDetailList) {
        this.purchaseQuotationDto.purchaseQuotationDetailList.push(this.purchaseQuotationDetaildto);
      } else {
        this.purchaseQuotationDto.purchaseQuotationDetailList = [];
        this.purchaseQuotationDto.purchaseQuotationDetailList.push(this.purchaseQuotationDetaildto);
      }
    } else {
      // update
      this.purchaseQuotationDto.purchaseQuotationDetailList[this.selectedDetailIndex] = this.purchaseQuotationDetaildto;
    }
    this.params.dialog.visible = false;
  }

  resetNewItemDetails() {
    this.purchaseQuotationDetaildto = new CreatePurchaseQuotationDetailDto();
  }

  deletePurchaseQuotationDetailsModal(index) {
    const detailItem = this.purchaseQuotationDto.purchaseQuotationDetailList[index];
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        if (detailItem.purchaseQuotationDetailId > 0) {
          this.purchaseQuotationSvc.deleteDetailItem(detailItem.purchaseQuotationDetailId).then(res => {
            // console.log("itemDelete", res);
            this.utilities.showSuccessToast('removed-success');
            this.purchaseQuotationDto.purchaseQuotationDetailList.splice(index, 1);
          });
        } else {
          this.purchaseQuotationDto.purchaseQuotationDetailList.splice(index, 1);
        }
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    })
  }

  getMaterialunitList(stockId) {
    this._stockSvc.metarialActiveUnits(stockId).then((result: any) => {
      this.unitList = result;
    }).catch(error => console.log(error));
  }


  
  onPriceChanges() {
    this.purchaseQuotationDetaildto.discountPrice = this.purchaseQuotationDetaildto.grossPrice * this.purchaseQuotationDetaildto.discountPercentage;
    this.purchaseQuotationDetaildto.netPrice = this.purchaseQuotationDetaildto.grossPrice - (this.purchaseQuotationDetaildto.grossPrice - this.purchaseQuotationDetaildto.discountPrice);
  }
}
