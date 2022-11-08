import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UsersService } from 'app/services/users/users.service';
import { PalletService } from 'app/services/dto-services/pallet/pallet.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { environment } from 'environments/environment';
import { PalletSettingsService } from 'app/services/dto-services/pallet/pallet-settings.service';
import { JobOrderOperation } from 'app/dto/porder/porder.model';

@Component({
    selector: 'pallet-record-new',
    templateUrl: 'pallet.new.component.html'
})

export class PalletRecordNewComponent implements OnInit {

    @Output() saveAction = new EventEmitter<any>();

    palletType = 'GOODS';

    quantityUnit: string = null;

    palletDto = {
        batch: null,
        cycleQuantity: null,
        goodQuantity: null,
        jobOrderId: null,
        jobOrderOperationId: null,
        palletId: null,
        variety:null,
    requirementPalletQuantityForForklift: null,
    maxBoxQuantity: null,
        palletPosition: 'SENT',
        palletSettingId: null,
        palletStatus: 'REQUESTED',
        palletType: 'GOOD',
        plantId: null,
        reworkQuantity: null,
        scrapQuantity: null,
        stockId: null,
        wareHouseId: null
    };

    varieties = ["BOX", "PALLET"];

    palletLogDto = {
        createDate: null,
        employeeId: null,
        palletId: null,
        palletLogComponentDtoList: [],
        palletLogId: null,
        quantity: null,
        quantityUnit: null
      }
      palletLogComponentDto = {
        active: null,
        barcode: null,
        batch: null,
        createDate: null,
        dimensionUnit: null,
        direction: null,
        height: null,
        locationNo: null,
        palletLogComponentId: null,
        palletLogId: null,
        quantity: null,
        quantityUnit: null,
        stockId: null,
        stockReservationId: null,
        updateDate: null,
        width: null,
        workstationComponentId: null,
      };

    selectedPlant: any;

    selectedMaterial: any;

    palletSettingList: any;

    jobOrderOperations: JobOrderOperation[] = [];

    includeMaterials = [];

    // selectedStocks = [];

    constructor(
        private _userSvc: UsersService,
        private _palletSvc: PalletService,
        private loaderService: LoaderService,
        private utilities: UtilitiesService,
        private palletSetting: PalletSettingsService,
    ) {
        const setPlant = this._userSvc.getPlant();
        this.selectedPlant = JSON.parse(setPlant);
        this.palletDto.plantId = this.selectedPlant ? this.selectedPlant.plantId : null;
    }

    ngOnInit() {
        this.palletSetting.filter({
            pageNumber: 1,
            pageSize: 99999, plantId: this.selectedPlant?.plantId
        }).then(res => this.palletSettingList = res['content']);
    }
    setSelectedJbOrder(jobOrder) {
        if (jobOrder) {
            // if(jobOrder.jobOrderOperations && jobOrder.jobOrderOperations.length > 0){
            //     let operations = jobOrder.jobOrderOperations;
            //     operations.forEach(opr => {
            //         opr.jobOrderStockProduceList.forEach(stock => {
            //            this.selectedStocks.push(stock.stockId); 
            //         });
            //     });

            //     console.log('@operations', this.selectedStocks)
            // }
            
            this.palletDto.jobOrderId = jobOrder.jobOrderId;
            this.selectedMaterial = jobOrder.jobOrderStockProduceList ? jobOrder.jobOrderStockProduceList[0] : null;
            // this.palletDto.stockId = this.selectedMaterial ? this.selectedMaterial.stockId : null;
            this.onPalletTypeChanged(this.palletType);
            this.jobOrderOperations = jobOrder.jobOrderOperations;
            this.palletDto.batch = jobOrder.batch;
        } else {
            this.palletDto.jobOrderId = null;
            this.selectedMaterial = null;
            this.jobOrderOperations = [];
            this.palletDto.batch = null;
        }
    }

    onPalletTypeChanged(event) {
        if (event && event === 'GOODS') {
            this.palletDto.goodQuantity = this.selectedMaterial ? this.selectedMaterial.quantity : null;
            this.palletDto.scrapQuantity = null;
            this.palletDto.reworkQuantity = null;

        } else if (event && event === 'SCRAP') {
            this.palletDto.goodQuantity = null,
                this.palletDto.scrapQuantity = this.selectedMaterial ? this.selectedMaterial.neededQuantity : null;
            this.palletDto.reworkQuantity = null;

        } else if (event && event === 'REWORK') {

            this.palletDto.goodQuantity = null;
            this.palletDto.scrapQuantity = null;
            this.palletDto.reworkQuantity = this.selectedMaterial ? this.selectedMaterial.reworkQuantity : null;
        }
    }

    reset() {
        this.palletDto = {
            batch: null,
            cycleQuantity: null,
            goodQuantity: null,
            variety:null,
            requirementPalletQuantityForForklift: null,
            maxBoxQuantity: null,
            jobOrderId: null,
            jobOrderOperationId: null,
            palletId: null,
            palletPosition: 'FILLING',
            palletSettingId: null,
            palletStatus: 'REQUESTED',
            palletType: 'GOOD',
            plantId: null,
            reworkQuantity: null,
            scrapQuantity: null,
            stockId: null,
            wareHouseId: null
        };
    }
    save() {

        this.loaderService.showLoader();
        this._palletSvc.save(this.palletDto)
            .then(result => {
                this.loaderService.hideLoader();
                this.utilities.showSuccessToast('saved-success');
                setTimeout(() => {
                    this.reset();
                    this.saveAction.emit(result);
                }, environment.DELAY);
            })
            .catch(error => {
                this.loaderService.hideLoader();
                this.utilities.showErrorToast(error);
            });

    }

    setSelectedStockEvent(event){
        console.log('@setSelectedStockEvent', event)
        if(event){
            this.palletDto.stockId= event.stockId;
            this.quantityUnit = event.baseUnit;
        }else{
            this.palletDto.stockId= null;
            this.quantityUnit = null;
        }
    }
    setSelectedJobOrderOperation(operation: JobOrderOperation) {
        console.log('@operation', operation)
        if (operation) {
            this.palletDto.jobOrderOperationId = operation.jobOrderOperationId;
            this.palletDto.cycleQuantity = operation.currentQuantity;
            let includedMaterials = [];
            if(operation.jobOrderStockProduceList){
                operation.jobOrderStockProduceList.forEach(jS => {
                    includedMaterials.push(jS.stockId);
                })
            }else{
                includedMaterials = [];
            }
            this.includeMaterials = [...includedMaterials];
            console.log('@includedMaterials', this.includeMaterials)

        } else {
            this.palletDto.jobOrderOperationId = null;
            this.palletDto.cycleQuantity = null;
            this.includeMaterials = [];
        }
    }
}
