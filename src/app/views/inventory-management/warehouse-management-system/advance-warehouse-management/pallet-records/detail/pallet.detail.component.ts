import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { PalletService } from 'app/services/dto-services/pallet/pallet.service';
import { PalletListResponse } from 'app/dto/stock/pallet.model';
import { PalletLogService } from 'app/services/dto-services/pallet/pallet.log.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';

@Component({
    selector: 'pallet-record-detail',
    templateUrl: './pallet.detail.html'
})

export class PalletDetailComponent implements OnInit {

    @Output() printPallet = new EventEmitter<any>();

    palletId: number = null;

    pallet: any;

    palletLogFilter = {
        createDate: null,
        employeeId: null,
        employeeName: null,
        finishDate: null,
        jobOrderId: null,
        orderByDirection: 'desc',
        orderByProperty: 'palletLogId',
        pageNumber: 1,
        pageSize: 99999,
        palletId: null,
        palletLogId: null,
        query: null,
        startDate: null
    };

    palletLogs: any;

    @Input('palletId') set palletData(palletId) {
        if (palletId) {
            this.palletId = palletId;
            this.palletLogFilter.palletId = palletId;
            this.getPalletDetails(palletId);
            this.getPalletLogs();
        }

    };

    constructor(
        private _palletSvc: PalletService,
        private _palletLogSvc: PalletLogService,
        private _loaderSvc: LoaderService
    ) { }

    ngOnInit() {
    }

    getPalletDetails(id) {
        this._loaderSvc.showLoader();
        this._palletSvc.getDetails(id).then((res: PalletListResponse) => {
            this.pallet = res;
            this._loaderSvc.hideLoader();
        }).then(error => {
            this._loaderSvc.hideLoader();
            console.log('@Pallet Detail Response Error', error);
        })
    }

    getPalletLogs() {
        this._palletLogSvc.filter(this.palletLogFilter).then((res: any) => {
            this.palletLogs = res['content'];
        })
    }

    showStaffDetail(id) {
        this._loaderSvc.showDetailDialog(DialogTypeEnum.STAFF, id);
    }

    showDetailModal(field: string, data: any) {
        if (field === 'jobOrderId' || field === 'jobOrderOpeartion') {
            this._loaderSvc.showDetailDialog(DialogTypeEnum.JOBORDER, data.jobOrder.jobOrderId);
        } else if (field === 'stockNo' || field === 'stockName') {
            this._loaderSvc.showDetailDialog(DialogTypeEnum.STOCK, data.stock.stockId)
        } else if (field === 'wareHouseName') {
            this._loaderSvc.showDetailDialog(DialogTypeEnum.WAREHOUSE, data.wareHouse.wareHouseId)
        } else if (field === 'batch') {
            this._loaderSvc.showDetailDialog(DialogTypeEnum.BATCH, data.batch)
        }
    }

    showStockModal(stockId) {
        this._loaderSvc.showDetailDialog(DialogTypeEnum.STOCK, stockId);
    }
    showBatchModal(batch) {
        this._loaderSvc.showDetailDialog(DialogTypeEnum.BATCH, batch);
    }
    showReservationModal(reservationId) {
        this._loaderSvc.showDetailDialog(DialogTypeEnum.RESERVATION, reservationId);
    }

}
