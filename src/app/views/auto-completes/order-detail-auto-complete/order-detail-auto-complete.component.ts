import {debounceTime, switchMap} from 'rxjs/operators';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {Subject} from 'rxjs';
import {SalesOrderService} from '../../../services/dto-services/sales-order/sales-order.service';


@Component({
  selector: 'order-detail-auto-complete',
  templateUrl: './order-detail-auto-complete.component.html',

})

export class OrderDetailAutoCompleteComponent implements OnInit {

  @Output() selectedOrderDetailEvent = new EventEmitter();
  selectedOrderDetail: any;
  @Input() required: boolean;
  @Input() multiple: boolean;
  @Input() dropdown = true;

  @Input('selectedOrderDetail')

  set in(selectedOrderDetail) {
    this.selectedOrderDetail = selectedOrderDetail;
  }

  placeholder = 'no-data';
  filteredOrderDetail: Array<any>;

  orderDetailFilter = {
    orderDetailId: null,
    pageSize: 500,
    pageNumber: 1,
    orderByProperty: 'orderDetailId'
  };

  private allOrderDetails: Array<any>;
  private searchTerms = new Subject<any>();

  constructor(private orderDetailService: SalesOrderService) {

  }


  ngOnInit() {

    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.orderDetailService.filterOrderDetails(this.orderDetailFilter))).subscribe(
      res => this.initResult(res['content']),
      error2 => this.initResult([])
    );
    this.searchTerms.next(this.orderDetailFilter);
  }

  private initResult(res) {
    // this.filteredOrderDetail = res;
    this.allOrderDetails = res;
    if (res.length > 0) {
      this.placeholder = 'search-order-detail-id';
    } else {
      this.placeholder = 'no-data';

    }
  }

  onChangeOrderDetail(event) {
    if (event) {
      console.log('Event on auto complete', event);
      this.selectedOrderDetailEvent.emit(event);
    } else {
      this.selectedOrderDetailEvent.emit(null);
    }
  }

  searchOrderDetail(event) {
    this.filteredOrderDetail = this.filterMatched(event.query);
  }

  handleDropdownClickForOrderDetail() {
    this.filteredOrderDetail = [...this.allOrderDetails];

    if (this.filteredOrderDetail.length === 0) {
      this.orderDetailFilter.orderDetailId = null;
      this.searchTerms.next(this.orderDetailFilter);
    }
  }

  filterMatched(query): any[] {
    const filtered: any[] = [];
    if (this.allOrderDetails && this.allOrderDetails.length > 0) {
      for (let i = 0; i < this.allOrderDetails.length; i++) {
        const obj = this.allOrderDetails[i];
        if ((obj['orderDetailId'] + '').indexOf(query) >= 0) {
          filtered.push(obj);
        }
      }
    }
    if (filtered.length === 0) {
      this.orderDetailFilter.orderDetailId = query;
      this.searchTerms.next(this.orderDetailFilter);
    }
    return filtered;
  }
}
