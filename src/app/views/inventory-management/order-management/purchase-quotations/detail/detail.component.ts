import { Component, OnInit, Input } from '@angular/core';
import { CreatePurchaseQuotationDetailDto } from 'app/dto/purchase-quotation/purchase-quotation.model';
import { LoaderService } from 'app/services/shared/loader.service';
import { PurchaseQuotationService } from 'app/services/dto-services/purchase-quotation/purchase-quotation.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';

@Component({
    selector: 'purchase-quotation-full-details',
    templateUrl: 'detail.component.html'
})

export class PurchaseQuotationFullDetailsComponent implements OnInit {
    purchaseQuotationDto = {
        createDate: null,
        costCenter: null,
        description: null,
        purchaseQuotationDetailList: new Array<CreatePurchaseQuotationDetailDto>(),
        purchaseQuotationId: null,
        purchaseQuotationStatus: null,
        requiredDate: null,
        updateDate: null,
        vendorId: null,
        vendorName: null,
      } 
      @Input('id') set setquotationId(id) {
        if (id) {
          this.purchaseQuotationDto.purchaseQuotationId = id;
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
        this.purchaseQuotationSvc.getDetail(id).then(res => {
          this.purchaseQuotationDto = {
            createDate: res['createDate'],
            description: res['description'],
            purchaseQuotationDetailList: res['purchaseQuotationDetailList'].map(itm => (
              {...itm,
                plantName: itm.plant?.plantName,
                stockNo: itm.stock?.stockNo,
                stockName: itm.stock?.stockName
              })),
            purchaseQuotationId: res['purchaseQuotationId'],
            purchaseQuotationStatus: res['purchaseQuotationStatus'],
            requiredDate: res['requiredDate'],
            costCenter: res['costCenter'],
            updateDate: res['updateDate'],
            vendorId: res['vendor'] ? res['vendor'].actId : null,
            vendorName: res['vendor'] ? res['vendor'].actName : null,
          };
          this.loaderService.hideLoader();
        }).catch(err => {
          console.error(err);
          this.loaderService.hideLoader();
        });
      }


      showCostCenterDetailDialog(id) {
        this.loaderService.showDetailDialog(DialogTypeEnum.COSTCENTER, id);
      }
}
