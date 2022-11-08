/**
 * Created by reis on 29.10.2018.
 */
import {Component, Input, OnInit} from '@angular/core';

import {ConfirmationService} from 'primeng';
import {ActivatedRoute} from '@angular/router';
import { OrderDetailDto } from 'app/dto/sale-order/sale-order.model';

@Component({
  selector: 'account-transactions',
  templateUrl: './account-transactions.component.html',
  providers: [ConfirmationService]
})
export class AccountTransactionsComponent implements OnInit {

  customerId: string;

  orderDetail: OrderDetailDto;

  @Input('id') set x(id) {
    this.customerId = id;

  };

  constructor(private route: ActivatedRoute) {

  }

  ngOnInit() {
    //
    // this.route.params.subscribe((params) => {
    //   this.customerId = params['id'];
    // });
  }

  setSelectedOrderDetail(orderDetail: OrderDetailDto) {
    this.orderDetail = orderDetail;
  }
}

