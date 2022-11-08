import { UsersService } from 'app/services/users/users.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'environments/environment';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
import { CreatePurchaseQuotationDetailDto } from 'app/dto/purchase-quotation/purchase-quotation.model';
import { PurchaseQuotationService } from 'app/services/dto-services/purchase-quotation/purchase-quotation.service';
import { StockCardService } from 'app/services/dto-services/stock/stock.service';
import { ActTypeService } from 'app/services/dto-services/act-type/act-type.service';

@Component({
  selector: 'purchase-quotation-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class PurchaseQuotationNewComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();
  purchaseQuotationDto = {
    createDate: null,
    description: null,
    costCenterId: null,
    purchaseQuotationDetailList: new Array<CreatePurchaseQuotationDetailDto>(),
    purchaseQuotationId: null,
    purchaseQuotationStatus: null,
    requiredDate: null,
    updateDate: null,
    plantId: null,
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
  submitted: boolean = false;

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
    this.purchaseQuotationDto.purchaseQuotationStatus = 'OPENED';
    this.purchaseQuotationDto.createDate = new Date();
    this.purchaseQuotationDto.plantId = this.selectedPlant?.plantId;

    // this._actTypes.getbyPlantId_AccountPosition(this.selectedPlant?.plantId, 'SUPPLIER').then((result: any) => this.listActTypes = result).catch(error => console.log(error));
  }
  onOrderStatusChanged(event) {
    if (event) {
      this.purchaseQuotationDto.purchaseQuotationDetailList.forEach(itm => {
        itm.purchaseQuotationDetailStatus = this.purchaseQuotationDto.purchaseQuotationStatus;
      });
    }
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
    this.submitted = true;
    this.purchaseQuotationSvc.save(this.purchaseQuotationDto)
      .then(result => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.saveAction.emit('close');
        }, environment.DELAY);
      })
      .catch(error => {
        this.submitted = false;
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }

  reset() {
    this.purchaseQuotationDto = {
      createDate: null,
      description: null,
      costCenterId: null,
      purchaseQuotationDetailList: new Array<CreatePurchaseQuotationDetailDto>(),
      purchaseQuotationId: null,
      vendorTypeId: null,
      purchaseQuotationStatus: null,
      plantId: this.purchaseQuotationDto.plantId,
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
      this.purchaseQuotationDetaildto.orderUnit = stock.baseUnit;
      this.purchaseQuotationDetaildto.currency = stock.stockCosting?.currencyCode || null;
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
      this.purchaseQuotationDetaildto.deliveryDate = this.purchaseQuotationDetaildto.deliveryDate ? new Date(this.purchaseQuotationDetaildto.deliveryDate) : null;
      this.purchaseQuotationDetaildto.validUntil = this.purchaseQuotationDetaildto.validUntil ? new Date(this.purchaseQuotationDetaildto.validUntil) : null;

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
      this.purchaseQuotationDto.purchaseQuotationDetailList.push(this.purchaseQuotationDetaildto);
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
        this.purchaseQuotationDto.purchaseQuotationDetailList.splice(index, 1);
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
