import { Component, Input, ViewChild } from '@angular/core';
// import { StockPurchasingInfoRecord } from 'app/dto/stock/stock-card.model';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ActService } from 'app/services/dto-services/act/act.service';
import { PurchaseGroupService } from 'app/services/dto-services/purchase-group/purchase-group-service';

@Component({
    selector: 'purchasing-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['../../new/new.css']
})
export class PurchasingDetailComponent {

    @ViewChild('myModal') public myModal: ModalDirective;

    purchasingScreen: any;

    infoRecordsList: any[] = [];
    stock: any;

    // purchaseInfoRecordList: StockPurchasingInfoRecord[] = [];

    @Input('purchasingScreen') set ps(data) {
        console.log('@purchasingScreen', data)
        this.purchasingScreen = data;
    }
    @Input('stock') set pstock(data) {
        // console.log('@purchasingScreen', data.stockPurchasing);
        // if(data.stockPurchasing) {
        //     this.purchasingScreen = data.stockPurchasing;
        // }
        this.stock = data;
    }

    infoRecordDto: any = {
        description: null,
        orderUnit: null,
        plantId: null,
        purchaseConditionRecord: {
            amountValue: null,
            currencyCode: null,
            description: null,
            effectivePrice: null,
            incoTerm: 'CFR',
            netPrice: null,
            percentageValue: null,
            plantId: null,
            purchaseConditionRecordCode: null,
            purchaseConditionRecordId: null,
            purchaseConditionTypeId: null,
            purchaseInfoRecordId: null,
            stockId: null,
            stockPurchasingId: null,
            validFrom: null,
            validTo: null
        },
        purchaseControl: {
            maximumQuantity: null,
            minimumQuantity: null,
            plannedDeliveryTime: null,
            plantId: null,
            purchaseControlCode: null,
            purchaseControlId: null,
            purchaseGroupId: null,
            purchaseInfoRecordId: null,
            standardQuantity: null,
            stockId: null
        },
        purchaseInfoRecordCode: null,
        purchaseInfoRecordId: null,
        purchaseInfoRecordStatus: null,
        stockId: null,
        stockPurchasingId: null,
        vendorId: null
    };

    newInforRecord: boolean;

    selectedInfoRecord: any;

    selectedVendor: any;

    actList: any;

    purchaseGroups: any;

    incoTerms = ['CFR', 'CIF', 'EXW', 'FOB', 'FCA', 'FAS', 'CPT', 'CIP', 'DAF', 'DES', 'DEQ', 'DDU', 'DDP'];

    constructor(
        private _actSvc: ActService,
        private _purchaseGroupSvc: PurchaseGroupService
    ) { }

    ngOnInit() {
        this._actSvc.getActSupplier().then(result => this.actList = result).catch(error => console.log(error));
        this._purchaseGroupSvc.filter({ plantId: this.purchasingScreen.plantId, pageNumber: 1, pageSize: 100 }).then(res => this.purchaseGroups = res['content']);
    }

    setSelectedWarehouse(event) {
        if (event && event.hasOwnProperty('wareHouseId')) {
            this.purchasingScreen.wareHouseId = event.wareHouseId;
            this.purchasingScreen.wareHouseName = event.wareHouseName;
        } else {
            this.purchasingScreen.wareHouseId = null;
        }
    }

    showInfoRecordModal() {
        this.resetInfoRecord();
        this.myModal.show();
        this.newInforRecord = true;
        this.infoRecordDto.orderUnit = this.purchasingScreen.orderUnit;
        this.infoRecordDto.plantId = this.purchasingScreen.plantId;
    }

    addInfoRecords() {
        let inspectionSetups = [...this.infoRecordsList];

        if (this.newInforRecord)
            inspectionSetups.push(this.infoRecordDto);
        else
            inspectionSetups[this.infoRecordsList.indexOf(this.selectedInfoRecord)] = this.infoRecordDto;

        this.infoRecordsList = inspectionSetups;
        this.myModal.hide();
        this.purchasingScreen.purchaseInfoRecordList = this.infoRecordsList;
        console.log('@InforRecordsList', this.infoRecordsList)
    }

    delete(selectedInspection) {
        this.selectedInfoRecord = selectedInspection
        let index = this.infoRecordsList.indexOf(this.selectedInfoRecord);
        this.infoRecordsList = this.infoRecordsList.filter((val, i) => i != index);
        this.purchasingScreen.purchaseInfoRecordList = this.infoRecordsList;
        this.myModal.hide();
    }

    onRowSelect(inspection) {
        this.newInforRecord = false;
        this.selectedInfoRecord = inspection;
        this.infoRecordDto = this.cloneInspection(inspection);
        this.myModal.show();

    }

    cloneInspection(c: any): any {
        let inspection = {};
        for (let prop in c) {
            inspection[prop] = c[prop];
        }
        return inspection;
    }

    setSelectedVendor(vendor) {
        if (vendor) {
            this.infoRecordDto.vendorId = vendor.actId;
        } else {
            this.infoRecordDto.vendorId = null;
        }
    }

    resetInfoRecord() {
        this.infoRecordDto = {
            description: null,
            orderUnit: null,
            plantId: null,
            purchaseConditionRecord: {
                amountValue: null,
                currencyCode: null,
                description: null,
                effectivePrice: null,
                incoTerm: 'CFR',
                netPrice: null,
                percentageValue: null,
                plantId: null,
                purchaseConditionRecordCode: null,
                purchaseConditionRecordId: null,
                purchaseConditionTypeId: null,
                purchaseInfoRecordId: null,
                stockId: null,
                stockPurchasingId: null,
                validFrom: null,
                validTo: null
            },
            purchaseControl: {
                maximumQuantity: null,
                minimumQuantity: null,
                plannedDeliveryTime: null,
                plantId: null,
                purchaseControlCode: null,
                purchaseControlId: null,
                purchaseGroupId: null,
                purchaseInfoRecordId: null,
                standardQuantity: null,
                stockId: null
            },
            purchaseInfoRecordCode: null,
            purchaseInfoRecordId: null,
            purchaseInfoRecordStatus: null,
            stockId: null,
            stockPurchasingId: null,
            vendorId: null
        }
    }

    setSelectedCurrencyEvent(currency) {
        if (currency) {
            this.infoRecordDto.purchaseConditionRecord.currencyCode = currency.currencyCode;
        } else {
            this.infoRecordDto.purchaseConditionRecord.currencyCode = null;
        }
    }

    conditionAction(){}
}
