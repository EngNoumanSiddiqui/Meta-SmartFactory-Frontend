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
    selector: 'pallet-screen-edit',
    templateUrl: './edit.component.html',
})

export class PalletScreenEditComponent {
    varieties = ["BOX", "PALLET"];
    cols = [
        { field: 'settingNo', header: 'setting-no' },
        { field: 'palletName', header: 'pallet-setting-name' },
        { field: 'palletCode', header: 'pallet-code' },
        { field: 'maxQuantity', header: 'Maximum Quantity' },
        { field: 'maxQuantityUnit', header: 'max-qty-unit' },
        { field: 'minQuantity', header: 'Minimum Quantity' },
        { field: 'minQuantityUnit', header: 'min-qty-unit' },
        { field: 'minPalletQuantity', header: 'min-pallet-quantity' },
        { field: 'variety', header: 'variety' },
        { field: 'maxBoxQuantity', header: 'max-box-quantity' },
        { field: 'requirementPalletQuantityForForklift', header: 'requirement-pallet-quantity-for-forklift' },
    ];

    palletSetupDto = {
        createDate: null,
        updateDate: null,
        maxQuantity: null,
        maxQuantityUnit: null,
        minQuantity: null,
        minQuantityUnit: null,
        minPalletQuantity: null,
        palletSettingId: null,
        palletCode:null,
        variety: null,
        requirementPalletQuantityForForklift: null,
        maxBoxQuantity: null,
        stockId: null,
        stockPalletId: null,
    }

    palletFilterDto = {
        orderByDirection: 'desc',
        orderByProperty: 'palletSettingId',
        pageNumber: 1,
        pageSize: 10,
        palletSettingId: null,
        palletCode:null,
        query: null,
        stockId: null,
        stockName: null,
        stockNo: null,
        stockPalletId: null
    }

    pagination = {
        totalElements: 0,
        currentPage: 1,
        pageNumber: 1,
        pageSize: 10,
        totalPages: 1,
        TotalPageLinkButtons: 5,
        RowsPerPageOptions: [10, 20, 30, 50, 100, 1000],
        rows: 10,
        tag: ''
    };

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
        minPalletQuantity: null,
        palletSettingId: null,
        palletCode:null,
        variety: null,
        requirementPalletQuantityForForklift: null,
        maxBoxQuantity: null,
        stockId: null,
        stockPalletId: null,
    };

    newPallet: boolean;

    selectedPlant: any;

    palletSettingList: any;

    @ViewChild('palletModal') public palletModal: ModalDirective;

    @Input('stock') set st(data) {
        this.stock = data;
        if (this.stock) {
            this.palletSetupDto.stockId = this.stock.stockId;
            this.palletFilterDto.stockId = this.stock.stockId;

            if (this.palletFilterDto.stockId) {
                this.getPalletList();
            }
        }
    }

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
        this._palletSettingSvc.filter({ pageNumber: 1, pageSize: 99999, plantId: this.selectedPlant?.plantId }).then(res => this.palletSettingList = res['content']);
        // this.getPalletList();
    }

    palletSettingNameChanged(palletSettingId) {
        if (palletSettingId) {
            let palletSetting = this.palletSettingList.find(item => item.palletSettingId == palletSettingId);
            console.log('@palletSetting', palletSetting)
            if (palletSetting) {
                this.palletSetupDto.maxQuantity = palletSetting.maxQuantity;
                this.palletSetupDto.minQuantity = palletSetting.minQuantity;
            }
        }
    }

    palletSettingCodeChanged(palletCode) {
        if (palletCode) {
            let palletSetting = this.palletSettingList.find(item => item.palletCode == palletCode);
            console.log('@palletSetting', palletSetting)
            if (palletSetting) {
                this.palletSetupDto.maxQuantity = palletSetting.maxQuantity;
                this.palletSetupDto.minQuantity = palletSetting.minQuantity;
            }
        }
    }

    palletScreenShow() {
        this.modal.active = true;
    }

    showDialogToAdd() {
        if (!this.palletSetupDto.stockId) {
            this._utilitySvc.showWarningToast(this._translateSvc.instant('material_master_should_be_saved_first'));
            return;
        }
        this.newPallet = true;
        this.resetPallet();
        this.modal.active = true;
    }

    getPalletList() {
        this._loaderSvc.showLoader();
        this._palletStockSettingSvc.filter(this.palletFilterDto).then((res) => {
            this.palletSetupList = res['content'];
            this.pagination.currentPage = res['currentPage'];
            this.pagination.totalElements = res['totalElements'];
            this.pagination.totalPages = res['totalPages'];
            this.resetPallet();
            this.modal.active = false;
            this._loaderSvc.hideLoader();
        }).catch(error => {
            this._loaderSvc.hideLoader();
        });
    }
    save() {
        this.palletSetupDto.palletSettingId = +this.palletSetupDto.palletSettingId;
        this.palletSetupDto.palletCode = +this.palletSetupDto.palletCode;
        this._loaderSvc.showLoader();
        this._palletStockSettingSvc.save(this.palletSetupDto).then((res: any) => {
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
        // this.resetPallet();
        // this.modal.active = false;
    }

    getAllPalletSettings() {

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
                }).catch(error => this._utilitySvc.showErrorToast(error));
            },
            reject: () => {
                this._utilitySvc.showWarningToast('cancelled-operation');
            }
        })

        // this.selectedPallet = selectedPallet
        // let index = this.palletSetupList.indexOf(this.selectedPallet);
        // this.palletSetupList = this.palletSetupList.filter((val, i) => i != index);
        // this.stock.stockQuality.requestCreateStockQualityInspectionSetupDto = this.palletSetupList;
        // this.resetPallet();
        // this.modal.active = false;
    }

    onRowSelect(inspection) {

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

    resetPallet() {
        this.palletSetupDto = {
            createDate: null,
            updateDate: null,
            variety: null,
            requirementPalletQuantityForForklift: null,
            maxBoxQuantity: null,
            maxQuantity: null,
            maxQuantityUnit: null,
            minQuantity: null,
            minPalletQuantity: null,
            minQuantityUnit: null,
            palletSettingId: null,
            palletCode:null,
            stockId: this.palletSetupDto.stockId,
            stockPalletId: null,
        }
    }

    myChanges(event) {
        this.pagination.currentPage = event.currentPage;
        this.pagination.pageNumber = event.pageNumber;
        this.pagination.totalElements = event.totalElements;
        this.pagination.pageSize = event.pageSize;
        this.pagination.TotalPageLinkButtons = event.totalPageLinkButtons;

        if (this.pagination.tag !== event.searchItem) {
            this.pagination.pageNumber = 1;
        }
        this.pagination.tag = event.searchItem;

        this.palletFilterDto.pageNumber = this.pagination.pageNumber;
        this.palletFilterDto.pageSize = this.pagination.pageSize;
        this.palletFilterDto.query = this.pagination.tag;
        this.getPalletList();
    }

}
