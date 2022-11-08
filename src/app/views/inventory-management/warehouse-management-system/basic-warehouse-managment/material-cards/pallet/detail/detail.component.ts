import { Component, Input } from '@angular/core';
import { PalletStockSettingsService } from 'app/services/dto-services/pallet/pallet-stock-settings.service';

@Component({
    selector: 'pallet-screen-detail',
    templateUrl: './detail.component.html'
})

export class PalletScreenDetailComponet {

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

    palletSetupList: any;

    palletFilterDto = {
        orderByDirection: 'desc',
        orderByProperty: 'palletSettingId',
        pageNumber: 1,
        pageSize: 8,
        palletSettingId: null,
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

    @Input('stock') set st(stock) {
        if (stock) {
            this.palletFilterDto.stockId = stock.stockId;
            if (this.palletFilterDto.stockId) {
                this.getPalletList();
            }
        }
    }

    constructor(
        private _palletStockSettingSvc: PalletStockSettingsService
    ) { }

    ngOnInit() {

    }

    getPalletList() {
        this._palletStockSettingSvc.filter(this.palletFilterDto).then((result: any) => {
            this.palletSetupList = result['content'];
            this.pagination.currentPage = result['currentPage'];
            this.pagination.totalElements = result['totalElements'];
            this.pagination.totalPages = result['totalPages'];
        }).catch(error => { console.log('error', error) });
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
