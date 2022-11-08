import { Component, OnInit, Input } from '@angular/core';
import { LoaderService } from 'app/services/shared/loader.service';
import { CreatePurchaseQuotationDetailDto } from 'app/dto/purchase-quotation/purchase-quotation.model';
import { PurchaseQuotationService } from 'app/services/dto-services/purchase-quotation/purchase-quotation.service';


@Component({
  selector: 'purchase-quotation-item-details',
  templateUrl: 'item-details.component.html'
})

export class PurchaseQuotationItemDetailsComponent implements OnInit {
  purchaseQuotationDto = {
    baseUnit: null,
    batch: null,
    createDate: null,
    currency: null,
    deliveryCost: null,
    deliveryDate: null,
    effectivePrice: null,
    netPrice: null,
    orderUnit: null,
    plant: null,
    purchaseQuotation: null,
    purchaseQuotationDetailId: null,
    purchaseQuotationDetailStatus: null,
    quotedQuantity: null,
    requestedQuantity: null,
    stock: null,
    unitPrice: null,
    updateDate: null,
    validUntil: null,
  } 
  @Input('id') set setquotationId(id) {
    if (id) {
      this.purchaseQuotationDto.purchaseQuotationDetailId = id;
      this.getPurchaseQuotationDetails(id);
    }
  }


  constructor(
    private loaderService: LoaderService,
    private purchaseQuotationSvc: PurchaseQuotationService) {
  }

  ngOnInit() {
  }

  getPurchaseQuotationDetails(id) {
    this.loaderService.showLoader();
    this.purchaseQuotationSvc.getDetailItem(id).then(res => {
      this.purchaseQuotationDto = <any> res;
      this.loaderService.hideLoader();
    }).catch(err => {
      console.error(err);
      this.loaderService.hideLoader();
    });
  }
}
