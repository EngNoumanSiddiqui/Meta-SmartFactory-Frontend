import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { PurchaseInfoRecorListDto } from 'app/dto/stock/stock-card.model';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { ActService } from 'app/services/dto-services/act/act.service';
import { PurchaseGroupService } from 'app/services/dto-services/purchase-group/purchase-group-service';
import { UsersService } from 'app/services/users/users.service';

@Component({
    selector: 'purchasing-new',
    templateUrl: './new.component.html',
    styleUrls: ['../../new/new.css']
})
export class PurchasingNewComponent implements OnInit {

    @ViewChild('myModal') public myModal: ModalDirective;

    stock: any;

    infoRecordsList: PurchaseInfoRecorListDto[] = [];

    @Input('stock') set ps(data) {
        console.log('@PurchasingNewComponentStock', data)
        this.stock = data;
    }

    purchaseInfoRecordList: PurchaseInfoRecorListDto = {
        description: null,
        orderUnit: null,
        plantId: null,
        purchaseConditionRecord: {
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
        },
        purchaseControl: {
          employeeGenericGroupId: null,
          maximumQuantity: null,
          minimumQuantity: null,
          plannedDeliveryTime: null,
          plantId: null,
          purchaseControlCode: null,
          purchaseControlId: null,
          purchaseInfoRecordId: null,
          standardQuantity: null,
          stockId: null
        },
        purchaseInfoRecordCode: null,
        purchaseInfoRecordId: null,
        purchaseInfoRecordStatus: 'ACTIVE',
        stockId: null,
        stockPurchasingId: null,
        vendorId: null,
        vendorName: null,
    } 

    newInforRecord: boolean;

    selectedInfoRecord: PurchaseInfoRecorListDto;

    selectedVendor: any;

    actList: any;

    purchaseGroups: any;

    incoTerms = ['CFR', 'CIF', 'EXW', 'FOB', 'FCA', 'FAS', 'CPT', 'CIP', 'DAF', 'DES', 'DEQ', 'DDU', 'DDP'];

    conditionModal = {
        active: false,
        dialog: null
    }

    selectedPlant: any;

    constructor(
        private _actSvc: ActService,
        private _purchaseGroupSvc: PurchaseGroupService,
        private _userSvc: UsersService
    ) { 
        const setPlant = this._userSvc.getPlant();
        this.selectedPlant = JSON.parse(setPlant);
    }

    ngOnInit() {
        this._actSvc.getActSupplierByPlantId(this.selectedPlant?.plantId).then(result => this.actList = result).catch(error => console.log(error));
        this._purchaseGroupSvc.filter({ plantId: this.stock.stockPurchasing.plantId, pageNumber: 1, pageSize: 100 }).then(res => this.purchaseGroups = res['content']);
    }

    setSelectedWarehouse(event) {
        if (event && event.hasOwnProperty('wareHouseId')) {
            this.stock.purchaseOrderWarehouseId = event.wareHouseId;
            this.stock.stockPurchasing.wareHouseId = event.wareHouseId;
            this.stock.stockPurchasing.wareHouseName = event.wareHouseName;
        } else {
            this.stock.stockPurchasing.wareHouseId = null;
            this.stock.purchaseOrderWarehouseId = null;
        }
    }

    showInfoRecordModal() {
        this.resetInfoRecord();
        this.myModal.show();
        this.newInforRecord = true;
        this.purchaseInfoRecordList.orderUnit = this.stock.stockPurchasing.orderUnit;
        this.purchaseInfoRecordList.plantId = this.stock.stockPurchasing.plantId;
    }

    addInfoRecords() {
        let inspectionSetups = [...this.infoRecordsList];
    
        if (this.newInforRecord)
            inspectionSetups.push(this.purchaseInfoRecordList);
        else
            inspectionSetups[this.infoRecordsList.indexOf(this.selectedInfoRecord)] = this.purchaseInfoRecordList;

        this.infoRecordsList = inspectionSetups;
        console.log('@infoRecordsList', this.infoRecordsList)
        this.myModal.hide();
        this.stock.stockPurchasing.purchaseInfoRecordList = this.infoRecordsList;
    }

    delete(selectedInspection) {
        this.selectedInfoRecord = selectedInspection
        let index = this.infoRecordsList.indexOf(this.selectedInfoRecord);
        this.infoRecordsList = this.infoRecordsList.filter((val, i) => i != index);
        this.stock.stockPurchasing.purchaseInfoRecordList = this.infoRecordsList;
        this.myModal.hide();
    }

    onRowSelect(inspection) {
        this.newInforRecord = false;
        this.selectedInfoRecord = inspection;
        this.purchaseInfoRecordList = this.cloneInspection(inspection);
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
            this.purchaseInfoRecordList.vendorId = vendor.actId;
            this.purchaseInfoRecordList.vendorName = vendor.actName;
        } else {
            this.purchaseInfoRecordList.vendorId = null;
            this.purchaseInfoRecordList.vendorName = null;
        }
    }

    resetInfoRecord() {
        this.purchaseInfoRecordList = {
            description: null,
            orderUnit: null,
            plantId: null,
            purchaseConditionRecord: {
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
            },
            purchaseControl: {
              employeeGenericGroupId: null,
              maximumQuantity: null,
              minimumQuantity: null,
              plannedDeliveryTime: null,
              plantId: null,
              purchaseControlCode: null,
              purchaseControlId: null,
              purchaseInfoRecordId: null,
              standardQuantity: null,
              stockId: null
            },
            purchaseInfoRecordCode: null,
            purchaseInfoRecordId: null,
            purchaseInfoRecordStatus: 'ACTIVE',
            stockId: null,
            stockPurchasingId: null,
            vendorId: null,
            vendorName: null,
        }
    }

    setSelectedCurrencyEvent(currency) {
        if (currency) {
            this.purchaseInfoRecordList.purchaseConditionRecord.currencyCode = currency.currencyCode;
        } else {
            this.purchaseInfoRecordList.purchaseConditionRecord.currencyCode = null;
        }
    }


    conditionAction(){

    }

    conditonRecordDetails(event){
console.log('@afterconditonRecordDetails', event);
        this.purchaseInfoRecordList.purchaseConditionRecord.effectivePrice = event.effectivePrice;
        this.purchaseInfoRecordList.purchaseConditionRecord.netPrice = event.netPrice;
        this.purchaseInfoRecordList.purchaseConditionRecord.unitFreightCost = event.unitFreightCost;
        this.purchaseInfoRecordList.purchaseConditionRecord.unitInsuranceCost = event.unitInsuranceCost;
        this.purchaseInfoRecordList.purchaseConditionRecord.unitPackingCost = event.unitPackingCost;
        this.purchaseInfoRecordList.purchaseConditionRecord.unitShippingCost = event.unitShippingCost;
        this.purchaseInfoRecordList.purchaseConditionRecord.unitTaxCost = event.unitTaxCost;
        this.purchaseInfoRecordList.purchaseConditionRecord.plantId = this.stock.plantId;
        this.purchaseInfoRecordList.purchaseConditionRecord.purchaseConditionDetailDtoList = event.purchaseConditionDetailDtoList;
        this.purchaseInfoRecordList.purchaseConditionRecord.stockId = this.stock.stockId;
        this.conditionModal.active = false;   
    }

    closeModal(event){
        this.conditionModal.active = false;
    }

   
    save() {}
}