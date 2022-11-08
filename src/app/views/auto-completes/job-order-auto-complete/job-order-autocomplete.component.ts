import { debounceTime, switchMap } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { JobOrderService } from 'app/services/dto-services/job-order/job-order.service';
import { AutoComplete } from 'primeng';

@Component({
    selector: 'job-order-autocomplete',
    templateUrl: './job-order-autocomplete.component.html',

})

export class JobOrderAutoCompleteComponent implements OnInit {

    @ViewChild(AutoComplete) autoComplete: AutoComplete;
    disabled = false;
    @Output() selectedJobOrderEvent = new EventEmitter();
    selectedJobOrder: any;
    @Input() required: boolean;
    @Input() dropdown = true;
    requestSent: boolean = false;

    @Input('plantId') set x(plantId) {
        if (plantId) {
            this.jobOrderFilter.plantId = plantId;
            this.searchTerms.next(this.jobOrderFilter);
        }
    }
    @Input('prodOrderId') set prodOrderId(prodOrderId) {
        if (prodOrderId) {
            this.jobOrderFilter.prodOrderId = prodOrderId;
            this.searchTerms.next(this.jobOrderFilter);
        }
    }
    @Input('jobOrderStatus') set setjobOrderStatus(jobOrderStatus) {
        if (jobOrderStatus) {
            this.jobOrderFilter.jobOrderStatus = jobOrderStatus;
        }
    }

    @Input('disabled') set y(disabled) {
        this.disabled = disabled;
    }
    @Input('selectedJobOrder') set in(selectedJobOrder) {
        this.selectedJobOrder = selectedJobOrder;
    }
    @Input('startDate') set instartDate(startDate) {
        this.jobOrderFilter.startDate = startDate;
        this.searchTerms.next(this.jobOrderFilter);
    }
    @Input('finishDate') set infinishDate(finishDate) {
        this.jobOrderFilter.finishDate = finishDate;
        this.searchTerms.next(this.jobOrderFilter);
    }
    @Input('workStationName') set inworkStationName(workStationName) {
        this.jobOrderFilter.workStationName = workStationName;
        this.searchTerms.next(this.jobOrderFilter);
    }
    @Input('selectedJobOrderId') set inid(selectedJobOrderId) {
        if (this.allJobOrders && selectedJobOrderId) {
            const jobOrder = this.allJobOrders.find(itm => itm.jobOrderId === selectedJobOrderId);
            if (jobOrder) {
                this.selectedJobOrder = jobOrder;
            } else {
                this.getWorkStationDetail(selectedJobOrderId);    
            }
        } else if (selectedJobOrderId) {
            this.getWorkStationDetail(selectedJobOrderId);
        }
        
    }

    placeholder = 'no-data';
    filteredJobOrder: Array<any>;

    jobOrderFilter = {
        pageNumber: 1,
        pageSize: 20,
        operationUseName: null,
        jobOrderStatus: null,
        position: null,
        workStationName: null,
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
        // panelActive: true,
        jobOrderId: null
    }

    private allJobOrders: Array<any>;
    private searchTerms = new Subject<any>();

    constructor(private jobOrderService: JobOrderService) {

    }


    ngOnInit() {
        this.searchTerms.pipe(
            debounceTime(700),
            switchMap(term => this.jobOrderService.filterObservable(this.jobOrderFilter))).subscribe(
                res => this.initResult(res['content']),
                error2 => this.initResult([])
            );
        this.searchTerms.next(this.jobOrderFilter);
    }

    private initResult(res) {
        // this.filteredJobOrder = res;
        this.allJobOrders = res;
        if (res.length > 0) {
            this.placeholder = 'search-job-order';
            if(this.requestSent) {
                this.filteredJobOrder = [...this.allJobOrders];
                this.requestSent = false

                this.autoComplete.show();
            }
        } else {
            this.placeholder = 'no-data';

        }
    }

    onChangeJobOrder(event) {
        if (event && event.hasOwnProperty('jobOrderId')) {
            this.selectedJobOrderEvent.next(this.selectedJobOrder);
        } else {
            this.selectedJobOrderEvent.next(null);
        }
    }

    searchWorkStation(event) {
        this.filteredJobOrder = this.filterMatched(event.query);
    }

    handleDropdownClickForJobOrder() {
        this.filteredJobOrder = [...this.allJobOrders];

        if (this.filteredJobOrder.length == 0) {
            this.jobOrderFilter.jobOrderId = null;
            this.jobOrderFilter.prodOrderId = null;
            this.searchTerms.next(this.jobOrderFilter);
        }
    }
    getWorkStationDetail(jobOrderId) {
        if (jobOrderId) {
            this.jobOrderService.getDetail(jobOrderId).then((rs: any) => {
                this.selectedJobOrder = rs;
                this.onChangeJobOrder(this.selectedJobOrder);
            });
        }

    }
    filterMatched(query): any[] {
        const filtered: any[] = [];
        if (this.allJobOrders && this.allJobOrders.length > 0) {
            for (let i = 0; i < this.allJobOrders.length; i++) {
                const obj = this.allJobOrders[i];
                if ((obj['jobOrderId'] + '').indexOf(query.toLowerCase()) >= 0) {
                    filtered.push(obj);
                }
                
            }
        }
        if (filtered.length == 0) {
            this.jobOrderFilter.jobOrderId = +query;
            this.jobOrderFilter.prodOrderId = null;
            this.requestSent = true;
            this.searchTerms.next(this.jobOrderFilter);
        }
        return filtered;
    }
}