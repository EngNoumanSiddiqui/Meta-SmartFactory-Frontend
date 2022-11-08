import { Component, Input, Output, EventEmitter } from '@angular/core';

import { LoaderService } from 'app/services/shared/loader.service';
import { PurchaseConditionTypeService } from 'app/services/dto-services/purchase-condition/purchase.condition.type.service';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
import { UtilitiesService } from 'app/services/utilities.service';

@Component({
    selector: 'purchasing-condition-details',
    templateUrl: './purchasing.condition.details.component.html'
})

export class PurchasingConditionDetailsComponent {

    filterDto = {
        createDate: null,
        fixedAmount: null,
        orderByDirection: null,
        orderByProperty: null,
        pageNumber: 1,
        pageSize: 100,
        percentage: null,
        purchaseCalculationType: null,
        purchaseConditionClassName: null,
        purchaseConditionTypeCode: "GROSS_PRICE_QTY",
        purchaseConditionTypeId: null,
        purchaseConditionTypeName: null,
        quantityBased: null,
        query: null,
        updateDate: null
    }

    conditionCodeSelectedList: any;

    conditionTypeCodeList: any;

    purchaseConditionRecord = {
        currencyCode: null,
        description: null,
        effectivePrice: null,
        incoTerm: null,
        netPrice: null,
        plantId: null,
        purchaseConditionDetailDtoList: [],
        purchaseConditionRecordCode: null,
        purchaseConditionRecordId: null,
        purchaseInfoRecordId: null,
        stockId: null,
        stockPurchasingId: null,
        unitFreightCost: null,
        unitInsuranceCost: null,
        unitPackingCost: null,
        unitShippingCost: null,
        unitTaxCost: null,
        validFrom: null,
        validTo: null
    }

    deliveryCost = 0;

    selectedPurchaseConditionDetails = [];
    
    @Input('infoRecord') set iR(infoRecord){
        console.log('@selectedPUrchaseContionDetails', infoRecord)
        if(infoRecord && infoRecord.hasOwnProperty('purchaseConditionRecord')){
            this.selectedPurchaseConditionDetails = infoRecord.purchaseConditionRecord.purchaseConditionDetailDtoList;
        }
    }

    @Output() conditonRecordDetails = new EventEmitter();

    @Output() closeModal = new EventEmitter();

    constructor(
        private _purchaseConditionTypeSvc: PurchaseConditionTypeService,
        private _loaderSvc: LoaderService,
        private _enumSvc: EnumService,
        private _utilitySvc: UtilitiesService
    ) { }

    ngOnInit() {
        this._loaderSvc.showLoader();

        this._enumSvc.getStockPurchaseConditionTypeCode().then((result) => {
            this.conditionTypeCodeList = result;
        })
        this._purchaseConditionTypeSvc.get(this.filterDto).then((result) => {
            this._loaderSvc.hideLoader();
            if (result['content']) {
                result['content'][0].purchaseConditionTypeCode = 'GROSS_PRICE_QTY';
                result['content'][0].purchaseConditionTypeName = 'GROSS_PRICE';
                
            }
            this.conditionCodeSelectedList = result['content'];

            if(this.selectedPurchaseConditionDetails.length > 0 ){
                let quantityBased = this.selectedPurchaseConditionDetails[0];
                this.conditionCodeSelectedList[0]['conditionValue'] = quantityBased.amountValue;
                this.calculateNetPrice(this.selectedPurchaseConditionDetails[0], quantityBased.amountValue, 0);

                for (let index = 1; index < this.selectedPurchaseConditionDetails.length; index++) {
                    const element = this.selectedPurchaseConditionDetails[index];
                    const  value = (element.amountValue)? element.amountValue: element.percentageValue;
                    this.addConditionCodeList(index);
                    this.onChangePurchaseCondition(element.purchaseConditionTypeCode, index, value);
                }
            }

        }).catch(error => this._loaderSvc.hideLoader());
    }

    addConditionCodeList(index) {

        let length = this.conditionCodeSelectedList.length;

        if (this.conditionCodeSelectedList[0] && !this.conditionCodeSelectedList[0].conditionValue) {
            this._utilitySvc.showErrorToast('Please add GROSS_PRICE_QTY value');
            return;
        }
        
        let data = {
            fixedAmount: null,
            quantityBased: null,
            percentage: null,
            purchaseConditionTypeId: null,
            purchaseCalculationType: null,
            purchaseConditionClassName: null,
            purchaseConditionTypeCode: null,
            purchaseConditionTypeName: null,
            conditionValue: null,
            purchaseConditionDetails: []
        }

        if (this.conditionCodeSelectedList) {
            let removepurchaseConditionTypeCode = this.conditionCodeSelectedList.map((item) => item.purchaseConditionTypeCode);
            let selectedList = this.conditionTypeCodeList.filter(value => !removepurchaseConditionTypeCode.includes(value));
            data.purchaseConditionDetails = selectedList;
        }

        this.conditionCodeSelectedList.push(data);
    }

    deleteConditionCodeList(index) {
        if (this.conditionCodeSelectedList) {
            this.conditionCodeSelectedList.splice(index, 1);
        }

        this.conditionCodeSelectedList.forEach((element, index) => {
            this.calculateNetPrice(element, element.purchaseConditionTypeCode, index);
        });
    }

    onChangePurchaseCondition(purchaseConditionTypeCode, index, value=null) {
        console.log('@onChangePurchaseCondition', purchaseConditionTypeCode, index, value)
        if (!purchaseConditionTypeCode) return;

        this.filterDto.purchaseConditionTypeCode = purchaseConditionTypeCode;
        this._loaderSvc.showLoader();
        this._purchaseConditionTypeSvc.get(this.filterDto).then((result) => {
            this._loaderSvc.hideLoader();

            if (result['content']) {
                let purchaseCondition = result['content'][0];
                this.conditionCodeSelectedList[index].fixedAmount = purchaseCondition.fixedAmount;
                this.conditionCodeSelectedList[index].quantityBased = purchaseCondition.quantityBased;
                this.conditionCodeSelectedList[index].percentage = purchaseCondition.percentage;
                this.conditionCodeSelectedList[index].purchaseConditionTypeId = purchaseCondition.purchaseConditionTypeId;
                this.conditionCodeSelectedList[index].purchaseCalculationType = purchaseCondition.purchaseCalculationType;
                this.conditionCodeSelectedList[index].purchaseConditionClassName = purchaseCondition.purchaseConditionClassName;
                this.conditionCodeSelectedList[index].purchaseConditionTypeCode = purchaseConditionTypeCode;
                this.conditionCodeSelectedList[index].purchaseConditionTypeName = purchaseCondition.purchaseConditionTypeName;
                if(value){
                    console.log('@ifVAlue', value)
                    this.conditionCodeSelectedList[index].conditionValue = value;
                    this.calculateNetPrice(this.conditionCodeSelectedList[index], value, index);
                }
            }
            // this.conditionCodeSelectedList = result['content'];
        }).catch(error => console.log(error));
    }

    calculateNetPrice(purchaseCondition, value, index) {

        if(!(purchaseCondition.purchaseConditionTypeCode) || !(value)) return;

        console.log('@calculateNetPrice====>', purchaseCondition, value, index)

        let grossPrice = 0;
        let discountQtyAmount = 0;
        let discountPctAmount = 0;
        let discountPrice = 0;
        let taxPercentage = 0;
        let discountFixed = 0;
        let isTaxPctExist: boolean = false;

        //GROSS PRICE
        let grossPriceQty = this.conditionCodeSelectedList.find(item => item.purchaseConditionTypeCode === 'GROSS_PRICE_QTY');
        if ((grossPriceQty) && grossPriceQty.conditionValue) {
            grossPrice = grossPriceQty.conditionValue;
        }

        //DISCOUNT QUANTITY
        let discountQty = this.conditionCodeSelectedList.find(item => item.purchaseConditionTypeCode === 'DISCOUNTS_QTY');
        if ((discountQty) && discountQty.conditionValue) {
            discountQtyAmount = discountQty.conditionValue;
        }

        // DISCOUNT PERCENTAGE
        let discountPct = this.conditionCodeSelectedList.find(item => item.purchaseConditionTypeCode === 'DISCOUNTS_PCT');
        if ((discountPct) && discountPct.conditionValue) {
            discountPctAmount = grossPrice * discountPct.conditionValue / 100;
        }

        //DICSOUNT PRICE

        discountPrice = discountQtyAmount + discountPctAmount;

        // DISCOUNT FX
        let discountFx = this.conditionCodeSelectedList.find(item => item.purchaseConditionTypeCode === 'DISCOUNTS_FX');
        if ((discountFx) && discountFx.conditionValue) {
            discountFixed = discountFx.conditionValue;
        }

        //TAX PCT
        let taxPct = this.conditionCodeSelectedList.find(item => item.purchaseConditionTypeCode === 'TAX_PCT');

        if ((taxPct) && taxPct.conditionValue) {
            isTaxPctExist = true;
            taxPercentage = taxPct.conditionValue;
        }


        //PACKING_PCT
        let packingPct = this.conditionCodeSelectedList.find(item => item.purchaseConditionTypeCode === 'PACKING_PCT');
        if ((packingPct) && packingPct.conditionValue) {
            this.purchaseConditionRecord.unitPackingCost = grossPrice * packingPct.conditionValue / 100;
        }

        //PACKING_QTY
        if (this.purchaseConditionRecord.unitPackingCost === 0) {
            let packingQty = this.conditionCodeSelectedList.find(item => item.purchaseConditionTypeCode === 'PACKING_QTY');
            if ((packingQty) && packingQty.conditionValue) {
                this.purchaseConditionRecord.unitPackingCost = packingQty.conditionValue;
            }
        }

        //FREIGHT_QTY
        let freightQty = this.conditionCodeSelectedList.find(item => item.purchaseConditionTypeCode === 'FREIGHT_QTY');
        if ((freightQty) && freightQty.conditionValue) {
            this.purchaseConditionRecord.unitFreightCost = freightQty.conditionValue;
        }

        //FREIGHT_PCT
        let freightPct = this.conditionCodeSelectedList.find(item => item.purchaseConditionTypeCode === 'FREIGHT_PCT');
        if ((freightPct) && freightPct.conditionValue) {
            this.purchaseConditionRecord.unitFreightCost = grossPrice * freightPct.conditionValue / 100;
        }

        this.purchaseConditionRecord.unitShippingCost = this.purchaseConditionRecord.unitPackingCost + this.purchaseConditionRecord.unitFreightCost;


        //INSURANCE_PCT
        let insurancePct = this.conditionCodeSelectedList.find(item => item.purchaseConditionTypeCode === 'INSURANCE_PCT');
        if ((insurancePct) && insurancePct.conditionValue) {
            this.purchaseConditionRecord.unitInsuranceCost = (this.purchaseConditionRecord.netPrice) * insurancePct.conditionValue / 100;
        }

        //CALCULATE NET PRICE HERE
        if (isTaxPctExist) {
            let unitTaxCost = 0;
            unitTaxCost = (grossPrice - discountPrice) * taxPercentage / 100;
            this.purchaseConditionRecord.netPrice = grossPrice - discountPrice + unitTaxCost;
        } else {
            this.purchaseConditionRecord.netPrice = grossPrice - discountPrice;
        }


        this.purchaseConditionRecord.effectivePrice = this.purchaseConditionRecord.netPrice + this.purchaseConditionRecord.unitShippingCost + this.purchaseConditionRecord.unitInsuranceCost;

        this.deliveryCost = this.purchaseConditionRecord.unitShippingCost + this.purchaseConditionRecord.unitShippingCost;

    }

    save(){
       this.conditionCodeSelectedList.forEach(element => {
           if(element.conditionValue){
            if(element.percentage){
                this.purchaseConditionRecord.purchaseConditionDetailDtoList.push({
                    amountValue: null,
                    percentageValue: element.conditionValue,
                    purchaseConditionTypeCode: element.purchaseConditionTypeCode
                });
            }else if(element.quantityBased || element.fixedAmount){
                this.purchaseConditionRecord.purchaseConditionDetailDtoList.push({
                    amountValue: element.conditionValue,
                    percentageValue: null,
                    purchaseConditionTypeCode: element.purchaseConditionTypeCode
                });
            }
           }
       });

       this.conditonRecordDetails.emit(this.purchaseConditionRecord);
    }

    close(){
        this.closeModal.emit(true);
    }
}