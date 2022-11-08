import { Component, Input, ViewChild } from '@angular/core';
// import { StockPurchasingInfoRecord } from 'app/dto/stock/stock-card.model';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { QualityControlKeyServiceService } from 'app/services/dto-services/quality-control-key/quality-control-key-service.service';
import { QualitySystemsService } from 'app/services/dto-services/quality-systems/quality-systems.service';
import { UsersService } from 'app/services/users/users.service';
import { PalletSettingsService } from 'app/services/dto-services/pallet/pallet-settings.service';
import { PalletStockSettingsService } from 'app/services/dto-services/pallet/pallet-stock-settings.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { ConfirmationService } from 'primeng';
import { TranslateService } from '@ngx-translate/core';
import { UtilitiesService } from 'app/services/utilities.service';

@Component({
    selector: 'pallet-screen-new',
    templateUrl: './new.component.html',
    styleUrls: ['../../new/new.css']
})
export class PalletScreenNewComponent {

    @ViewChild('palletModal') public palletModal: ModalDirective;

    @Input('stock') set st(data) {
        this.stock = data;
        if (this.stock) {
            this.palletSetupDto.stockId = this.stock.stockId;
        }
    }

    varieties = ["BOX", "PALLET"];
    palletSetupDto = {
        createDate: null,
        updateDate:null,
        maxQuantity: null,
        maxQuantityUnit: null,
        minQuantity: null,
        minQuantityUnit: null,
        minPalletQuantity: null,
        palletSettingId: null,
        stockId: null,
        stockPalletId: null,
        variety:null,
        requirementPalletQuantityForForklift: null,
        maxBoxQuantity: null,
    }

    palletFilterDto = {
        orderByDirection: 'desc',
        orderByProperty: 'palletSettingId',
        pageNumber: 1,
        pageSize: 99999,
        palletSettingId: null,
        query:null,
        stockId: null,
        stockName:null,
        stockNo:null,
        stockPalletId: null
      }

    stock: any;

    palletSetupList = [];

    modal = {
        active: false,
        dialog: null
    }

    inspectionTypes = [];

    controlKeys = [];

    qualitySystems = [];

    selectedPallet = {
        createDate: null,
        updateDate: null,
        maxQuantity: null,
        maxQuantityUnit: null,
        minQuantity: null,
        minQuantityUnit: null,
        palletSettingId: null,
        minPalletQuantity: null,
        stockId: null,
        stockPalletId: null,
    };

    newPallet: boolean;

    selectedPlant: any;

    palletSettingList: any;

    constructor(
        private _enumSvc: EnumService,
        private _qualityControlKeySvc: QualityControlKeyServiceService,
        private _qualitySystemSvc: QualitySystemsService,
        private _userSvc: UsersService,
        private _palletSettingSvc: PalletSettingsService,
        private _palletStockSettingSvc: PalletStockSettingsService,
        private _loaderSvc: LoaderService,
        private _confirmationSvc: ConfirmationService,
        private _translateSvc: TranslateService,
        private _utilitySvc: UtilitiesService
    ) {
        const setPlant = this._userSvc.getPlant();
        this.selectedPlant = JSON.parse(setPlant);
    }

    ngOnInit() {
        this._enumSvc.getQualityInspectionTypeEnum().then((res: any) => { this.inspectionTypes = res; });
        this._qualityControlKeySvc.filter({ pageNumber: 1, pageSize: 9999 }).then((res: any) => this.controlKeys = res['content']);
        this._qualitySystemSvc.filter({ pageNumber: 1, pageSize: 9999 }).then((res: any) => this.qualitySystems = res['content']);
        this._palletSettingSvc.filter({pageNumber: 1, pageSize: 99999, plantId: this.selectedPlant?.plantId}).then(res => this.palletSettingList = res['content']);
        // this.getPalletList();
    }

    palletSettingNameChanged(palletSettingId){
        if(palletSettingId){
            let palletSetting = this.palletSettingList.find(item => item.palletSettingId == palletSettingId);
            console.log('@palletSetting', palletSetting)
            if(palletSetting){
                this.palletSetupDto.maxQuantity = palletSetting.maxQuantity;
                this.palletSetupDto.minQuantity = palletSetting.minQuantity;
            }
        }
    }

    palletScreenShow() {
        this.modal.active = true;
    }

    showDialogToAdd() {

        if(!this.palletSetupDto.stockId){
            this._utilitySvc.showWarningToast(this._translateSvc.instant('material_master_should_be_saved_first'));
            return;
        }
        this.newPallet = true;
        this.resetInspection();
        this.modal.active = true;
    }
    getPalletList(){
        this._palletStockSettingSvc.filter(this.palletFilterDto).then((res)=> {
            console.log('@res', res)
            this.palletSetupList = res['content'];
            this.resetInspection();
            this.modal.active = false;
            this._loaderSvc.hideLoader();
        }).catch(error => {
            this._loaderSvc.hideLoader();
        });
    }
    save() {
        this.palletSetupDto.palletSettingId = +this.palletSetupDto.palletSettingId;
        this._loaderSvc.showLoader();
        this._palletStockSettingSvc.save(this.palletSetupDto).then((res:any)=> {
            this._utilitySvc.showSuccessToast('saved-success');
            this.getPalletList();
        }).catch(error => this._loaderSvc.hideLoader());
        // let inspectionSetups = [...this.palletSetupList];
        // if (this.newPallet)
        //     inspectionSetups.push(this.palletSetupDto);
        // else
        //     inspectionSetups[this.palletSetupList.indexOf(this.selectedPallet)] = this.palletSetupDto;

        // this.palletSetupList = inspectionSetups;
        // this.stock.stockQuality.requestCreateStockQualityInspectionSetupDto = this.palletSetupList;
        // this.resetInspection();
        // this.modal.active = false;
    }

    getAllPalletSettings(){

    }

    delete(selectedPallet) {
        this._confirmationSvc.confirm({
            message: this._translateSvc.instant('do-you-want-to-delete'),
            header: this._translateSvc.instant('delete-confirmation'),
            icon: 'fa fa-trash',
            accept: () => {
                this._palletStockSettingSvc.delete(selectedPallet.stockPalletId).then(res => {
                  this._utilitySvc.showSuccessToast('deleted-success');
                  this._loaderSvc.showLoader();
                  this.getPalletList();
                }).catch(error=> this._utilitySvc.showErrorToast(error));
            },
            reject: () => {
              this._utilitySvc.showWarningToast('cancelled-operation');
            }
          })

        // this.selectedPallet = selectedPallet
        // let index = this.palletSetupList.indexOf(this.selectedPallet);
        // this.palletSetupList = this.palletSetupList.filter((val, i) => i != index);
        // this.stock.stockQuality.requestCreateStockQualityInspectionSetupDto = this.palletSetupList;
        // this.resetInspection();
        // this.modal.active = false;
    }

    onRowSelect(inspection) {
        let inspectionDto: any;

        this.selectedPallet.palletSettingId = inspection.palletSetting.palletSettingId;
        this.selectedPallet.createDate = inspection.createDate;
        this.selectedPallet.updateDate = inspection.updateDate;
        this.selectedPallet.maxQuantity = inspection.maxQuantity;
        this.selectedPallet.maxQuantityUnit = inspection.maxQuantityUnit;
        this.selectedPallet.minQuantity = inspection.minQuantity;
        this.selectedPallet.minQuantityUnit = inspection.minQuantityUnit;
        this.selectedPallet.stockId = inspection.stock.stockId;
        this.selectedPallet.stockPalletId = inspection.stockPalletId;
        this.selectedPallet.minPalletQuantity = inspection.minPalletQuantity;

        this.newPallet = false;
        // this.selectedPallet = inspectionDto;
        this.palletSetupDto = this.cloneInspection(this.selectedPallet);
        this.modal.active = true;

    }

    cloneInspection(c: any): any {
        let inspection = {};
        for (let prop in c) {
            inspection[prop] = c[prop];
        }
        return inspection;
    }

    resetInspection() {
        this.palletSetupDto = {
            createDate: null,
            updateDate: null,
            maxQuantity: null,
            maxQuantityUnit: null,
            minQuantity: null,
            minQuantityUnit: null,
            palletSettingId: null,
            stockId: null,
            stockPalletId: null,
            variety: null,
            minPalletQuantity: null,
            requirementPalletQuantityForForklift: null,
            maxBoxQuantity: null,
        }
    }

}
