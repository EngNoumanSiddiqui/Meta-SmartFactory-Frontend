import { Component, OnInit, OnDestroy } from '@angular/core';


import { AppStateService } from 'app/services/dto-services/app-state.service';
import { ResponseJobOrderFollowFilterDto } from 'app/dto/job-order/job-order.model';
import { Subject, Subscription, interval as ObservableInterval } from 'rxjs';
import { JobOrderService } from 'app/services/dto-services/job-order/job-order.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import { ConvertUtil } from 'app/util/convert-util';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';

@Component({
    selector: 'job-order-follow',
    templateUrl: './follow.component.html',
})

export class JobOrderFollowComponent implements OnInit, OnDestroy {

    allJobs: ResponseJobOrderFollowFilterDto[];

    pagination = {
        totalElements: 0,
        currentPage: 1,
        pageNumber: 1,
        pageSize: 500,
        totalPages: 1,
        TotalPageLinkButtons: 5,
        RowsPerPageOptions: [10, 20, 30, 50, 100, 200, 500, 1000],
        rows: 20,
        tag: ''
    };

    pageFilter = {
        pageNumber: 1,
        pageSize: 20,
        operationUseName: null,
        jobOrderStatus: 'PROCESSING',
        position: null,
        workStationName: null,
        workStationId: null,
        stockUseName: null,
        createDate: null,
        description: null,
        plantId: null,
        startDate: null,
        finishDate: null,
        stockToProduceName: null,
        prodOrderId: null,
        batch: null,
        query: null,
        orderByProperty: 'jobOrderId',
        orderByDirection: 'desc',
    };

    classReOrder = ['asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc'];

    dialog = {
        mode: null,
        visible: false,
        uniqueId: null
    };

    workCenterId: number = null;
    // list of selected column
    selectedColumns = [
        { field: 'jobOrderId', header: 'job-order-no' },
        { field: 'workStation.workStationName', header: 'workstation' },
        { field: 'singleSetupDuration', header: 'setup-min' },
        { field: 'actualSetup', header: 'actual-setup-min' },
        { field: 'plannedQuantity', header: 'planned-quantity' },
        { field: 'goodPieces', header: 'good-pieces' },
        { field: 'scrapPieces', header: 'scrap-pieces' },
        { field: 'scrap-per', header: 'scrap-per' },
        { field: 'plannedDuration', header: 'planned-duration' },
        { field: 'plannedStart', header: 'planned-start-hm' },
        { field: 'duration', header: 'duration-min' },
        { field: 'targetCurrently', header: 'target-currently' },
        { field: 'productionState', header: 'production-state' },
    ];

    // list of all columns
    cols = [
        { field: 'jobOrderId', header: 'job-order-no' },
        { field: 'workStation.workStationName', header: 'workstation' },
        { field: 'singleSetupDuration', header: 'setup-min' },
        { field: 'actualSetup', header: 'actual-setup-min' },
        { field: 'plannedQuantity', header: 'planned-quantity' },
        { field: 'goodPieces', header: 'good-pieces' },
        { field: 'scrapPieces', header: 'scrap-pieces' },
        { field: 'scrap-per', header: 'scrap-per' },
        { field: 'plannedDuration', header: 'planned-duration-min' },
        { field: 'plannedStart', header: 'planned-start-hm' },
        { field: 'duration', header: 'duration-min' },
        { field: 'targetCurrently', header: 'target-currently' },
        { field: 'productionState', header: 'production-state' },
    ];

    private searchTerms = new Subject<any>();
    sub: Subscription[] = [];

    constructor(
        private _jobOrderSvc: JobOrderService,
        private utilities: UtilitiesService,
        private appStateService: AppStateService,
        private loaderService: LoaderService) {
        this.sub.push(this.appStateService.plantAnnounced$.subscribe(res => {
            if (!(res)) {
                this.pageFilter.plantId = null;
            } else {
                this.pageFilter.plantId = res.plantId;
                this.filter();
            }
        }));
    }

    public filter() {
        // this.loaderService.showLoader();
        this.searchTerms.next(this.pageFilter);
    }

    ngOnInit() {
        this.searchTerms.pipe(
            debounceTime(400),
            switchMap(term => this._jobOrderSvc.filterObservable(this.pageFilter))).subscribe(
                result => {
                    // console.log("@debugging",result);
                    this.allJobs = this.normalizeValues(result['content'] as ResponseJobOrderFollowFilterDto[]);
                    //this.allJobs = result['content'] as ResponseJobOrderFollowFilterDto[];
                    this.pagination.currentPage = result['currentPage'];
                    this.pagination.totalElements = result['totalElements'];
                    this.pagination.totalPages = result['totalPages'];
                    // this.loaderService.hideLoader();
                    console.log('this.allJobs', this.allJobs)
                },
                error2 => {
                    this.allJobs = ([] as ResponseJobOrderFollowFilterDto[]);
                    // this.loaderService.hideLoader();
                    this.utilities.showErrorToast(error2)
                });
        

        this.sub.push(ObservableInterval( 10 * 1000).subscribe(res => {
            this.filter();
        }));

        this.filter();
    }

    normalizeValues(jobs: ResponseJobOrderFollowFilterDto[]) {

        const myItems = jobs.map(obj => ({ ...obj }));
        var currentDate = new Date();

        myItems.map((job: any) => {
            job.singleSetupDuration = ConvertUtil.convertMilisecondsToMinutes(job.singleSetupDuration);
            job.actualSetup = ConvertUtil.convertMilisecondsToMinutes(job.actualSetupDuration);
            job.singleDuration = this.getReadableTime(job.singleDuration * 1000);
            job.duration = this.getDifferenceInTime(currentDate, job.actualStart);
            let plannedDays = 0;
            let plannedMinutes = 0;

            if(job.plannedDuration){
                let plannedDuration = job.plannedDuration.split(',');
                if(plannedDuration[1]){
                    let split = plannedDuration[1].split(':');
                    job.plannedDuration = plannedDuration[0] + ',' + split[0] + ':' + split[1];
                    plannedMinutes = +split[1];
                    plannedDays = +split[0];
                }
            }
            
            let jobOrderStockProduce = job.jobOrderStockProduceList[job.jobOrderStockProduceList.length  - 1];

            if(jobOrderStockProduce){
                let plannedDur = (plannedDays * 24 * 60) + plannedMinutes;
                job.targetCurrently = this.getPercentageVal((jobOrderStockProduce.quantity /  job.plannedQuantity  ) / ( job.duration / plannedDur));
            }else{
                job.targetCurrently = null;
            }

        })

        return myItems;
    }

    getDifferenceInTime(currentDate, startDate){
        let difference = (currentDate.getTime()) - startDate;
        return Math.round(difference / 60000);
    }
    
    checkIllegalNumber(item){ 
        // Scrap Pieces / (Good Pieces + Scrap Pieces)
        let number = (item.defectQuantity / (item.defectQuantity+ item.quantity)) * 100;

        if(!isNaN(number) && number !== 0){
            return number.toFixed(2) + '%';
        }

        return '0';
    }
    getReadableTime(time) {
        return ConvertUtil.longDuration2DHHMMSSTime(time)
    }

    getPercentageVal(val) {
        if (val) {
            return (val * 100).toFixed(2) + '%';
        }
        return 0;
    }
    setSelectedWorkCenter(event) {
        this.pageFilter.workStationId = null;
        if (event) {
            this.workCenterId = event.workCenterId;
        } else {
            this.workCenterId = null;
        }
        this.filter();
    }

    setSelectedWorkStation(event) {
        if (event && event.hasOwnProperty('workStationId')) {
            this.pageFilter.workStationId = event.workStationId;
        } else {
            this.pageFilter.workStationId = null;
        }

        this.filter();
    }

    resetFilter() {
        this.pageFilter = {
            pageNumber: 1,
            pageSize: this.pageFilter.pageSize,
            prodOrderId: null,
            operationUseName: null,
            jobOrderStatus: 'PROCESSING',
            workStationName: null,
            workStationId: null,
            plantId: null,
            stockUseName: null,
            description: null,
            stockToProduceName: null,
            startDate: null,
            createDate: null,
            finishDate: null,
            position: null,
            batch: null,
            query: null,
            orderByProperty: 'jobOrderId',
            orderByDirection: 'desc',
        };
        this.filter();
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
        this.pageFilter.pageNumber = this.pagination.pageNumber;
        this.pageFilter.pageSize = this.pagination.pageSize;
        this.pageFilter.query = this.pagination.tag;
        this.filter()
    }


    showJobOrderDetail(jobOrderId) {
        this.loaderService.showDetailDialog(DialogTypeEnum.JOBORDER, jobOrderId);
    }
    showProdOrderDetail(prodOrderId) {
        this.loaderService.showDetailDialog(DialogTypeEnum.PRODUCTIONORDER, prodOrderId);
    }
    showStockDetail(stockId) {
        this.loaderService.showDetailDialog(DialogTypeEnum.STOCK, stockId);
    }
    showWsDetail(workstationId) {
        this.loaderService.showDetailDialog(DialogTypeEnum.WORKSTATION, workstationId);
    }
    showOperationDetail(opearationId) {
        this.loaderService.showDetailDialog(DialogTypeEnum.OPERATION, opearationId);
    }
    showBatchDetail(batchCode) {
        this.loaderService.showDetailDialog(DialogTypeEnum.BATCH, batchCode);
    }
    showOrderDetail(orderId) {
        this.loaderService.showDetailDialog(DialogTypeEnum.ORDER, orderId);
    }

    ngOnDestroy() {
        this.sub.forEach(s => s.unsubscribe());
    }

}
