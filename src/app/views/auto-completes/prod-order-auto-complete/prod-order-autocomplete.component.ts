import { debounceTime, switchMap } from 'rxjs/operators';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { ProductionOrderService } from 'app/services/dto-services/production-order/production-order.service';

@Component({
    selector: 'prod-order-autocomplete',
    templateUrl: './prod-order-autocomplete.component.html'

})

export class ProdOrderAutoCompleteComponent implements OnInit {

    @ViewChild('prodAutocomplete') prodAutocomplete;
    disabled = false;
    @Output() selectedProdOrderEvent = new EventEmitter();
    selectedProdOrder: any;
    @Input() required: boolean;
    @Input() dropdown = true;
    requestSent = false;
    totalElement = 0;

    @Input('plantId') set x(plantId) {
        if (plantId) {
            this.prodOrderFilter.plantId = plantId;
            this.searchTerms.next(this.prodOrderFilter);
        }
    }
    // @Input('prodOrderId') set prodOrderId(prodOrderId) {
    //     if (prodOrderId) {
    //         this.prodOrderFilter.prodOrderId = prodOrderId;
    //         this.searchTerms.next(this.prodOrderFilter);
    //     }
    // }

    @Input('disabled') set y(disabled) {
        this.disabled = disabled;
    }
    @Input('selectedProdOrder') set in(selectedProdOrder) {
        this.selectedProdOrder = selectedProdOrder;
    }
    @Input('selectedProdOrderId') set inid(selectedProdOrderId) {
        if (this.allProdOrders) {
            const prodOrder = this.allProdOrders.find(itm => itm.prodOrderId === selectedProdOrderId);
            if (prodOrder) {
                this.selectedProdOrder = prodOrder;
            } else {
                this.getWorkStationDetail(selectedProdOrderId);    
            }
        } else {
            this.getWorkStationDetail(selectedProdOrderId);
        }
    }

    placeholder = 'no-data';
    filteredProdOrder: Array<any>;

    prodOrderFilter = {
        pageNumber: 1,
        pageSize: 20,
        jobOrderStatus: null,
        position: null,
        workStationName: null,
        stockUseName: null,
        description: null,
        stockToProduceName: null,
        prodOrderId: null,
        query: null,
        orderByProperty: 'prodOrderId',
        orderByDirection: 'desc',
        materialName: null,
        orderType: null,
        actualFinish: null,
        actualStart: null,
        baseUnit: null,
        batch: null,
        createDate: null,
        finishDate: null,
        fromDate: null,
        grQuantity: null,
        materialId: null,
        orderDetailId: null,
        orderQuantity: null,
        orderUnit: null,
        plannedQuantity: null,
        plantId: null,
        plantName: null,
        prodOrderStatus: null,
        prodOrderType: null,
        quantity: null,
        receiptNo: null,
        startDate: null,
        stockName: null,
        stockNo: null,
        toDate: null,
        wareHouseId: null,
        wareHouseName: null,
        priority: null
    }

    private allProdOrders: Array<any>;
    private searchTerms = new Subject<any>();

    constructor(private _prodOrderSvc: ProductionOrderService, 
        private cdx: ChangeDetectorRef,
        private renderer: Renderer2) {

    }


    ngOnInit() {
        this.searchTerms.pipe(
            debounceTime(400),
            switchMap(term => this._prodOrderSvc.filterProdObservable(this.prodOrderFilter))).subscribe(
                res => {
                    this.initResult(res['content']);
                    this.totalElement = res['totalElements'];
                },
                error2 => this.initResult([])
            );
        this.searchTerms.next(this.prodOrderFilter);
    }

    private initResult(res) {
        // this.filteredProdOrder = res;
        if (this.prodOrderFilter.pageNumber > 1) {
            this.allProdOrders = this.allProdOrders.concat(res);
            this.filteredProdOrder = [...this.allProdOrders];
            this.cdx.markForCheck();
            setTimeout(() => {
                this.requestSent = false;
            }, 600);
        } else {
            this.allProdOrders = res;
        }
        if (res.length > 0) {
            this.placeholder = 'search-prod-order';
        } else {
            this.placeholder = 'no-data';
            this.prodOrderFilter.pageNumber = 1;

        }
    }

    onChangeProdOrder(event) {
        if (event && event.hasOwnProperty('prodOrderId')) {
            this.selectedProdOrderEvent.next(this.selectedProdOrder);
        } else {
            this.selectedProdOrderEvent.next(null);
        }
    }

    searchWorkStation(eventdata) {
        this.filteredProdOrder = this.filterMatched(eventdata.query);
    }

    handleDropdownClickForProdOrder() {
        this.filteredProdOrder = [...this.allProdOrders];

        if (this.filteredProdOrder.length === 0) {
            this.prodOrderFilter.pageNumber = 1;
            this.prodOrderFilter.prodOrderId = null;
            this.searchTerms.next(this.prodOrderFilter);
        } else {
            setTimeout(() => {        
                const autocompletePanel = this.prodAutocomplete.el.nativeElement.querySelector('.ui-autocomplete-panel');
                if (autocompletePanel) {
                    this.renderer.listen(autocompletePanel, 'scroll', event => {
                        if ((event.target.scrollHeight - event.target.clientHeight) === event.target.scrollTop) {
                            if (!this.requestSent && ((this.prodOrderFilter.pageNumber * this.prodOrderFilter.pageSize) < this.totalElement)) {
                                this.requestSent = true;
                                this.prodOrderFilter.pageNumber = this.prodOrderFilter.pageNumber + 1;
                                this.searchTerms.next(this.prodOrderFilter);
                                
                                
                            }
                        }
                    });
                }
            }, 500);
        }
    }
    getWorkStationDetail(prodOrderId) {
        if (prodOrderId) {
            this._prodOrderSvc.getDetail(prodOrderId).then((rs: any) => {
                this.selectedProdOrder = rs;
                this.onChangeProdOrder(this.selectedProdOrder);
            });
        }

    }
    filterMatched(query): any[] {
        const filtered: any[] = [];
        if (this.allProdOrders && this.allProdOrders.length > 0) {
            for (let i = 0; i < this.allProdOrders.length; i++) {
                const obj = this.allProdOrders[i];
                if ((obj['prodOrderId'] + '').indexOf(query) >= 0) {
                    filtered.push(obj);
                }
            }
        }
        if (filtered.length === 0) {
            this.prodOrderFilter.pageNumber = 1;
            this.prodOrderFilter.prodOrderId = query;
            this.searchTerms.next(this.prodOrderFilter);
        }
        return filtered;
    }
}