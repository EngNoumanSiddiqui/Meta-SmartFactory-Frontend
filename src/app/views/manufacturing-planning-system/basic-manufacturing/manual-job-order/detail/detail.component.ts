import {Component, Input, OnInit, ViewChild, Output, EventEmitter} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ManualJobOrderService } from 'app/services/dto-services/manual-job-order/manual-job-order.service';
import { LoaderService } from 'app/services/shared/loader.service';

@Component({
  selector: 'manual-job-order-detail',
  templateUrl: './detail.component.html'
})
export class DetailManualJobOrderComponent implements OnInit {
  id;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  manualJobOrder;

  @Output() selectedTab = new EventEmitter<any>();

  constructor(private _route: ActivatedRoute,
    private _router: Router,
    private _manualJobOrderSvc: ManualJobOrderService,
    private loaderService: LoaderService) {
  }

  private initialize(id: string) {
    this.loaderService.showLoader();
    this._manualJobOrderSvc.getUpdateDetail(this.id).subscribe(
      result => {
        this.manualJobOrder = result;
        this.loaderService.hideLoader();
      },
      error => {
        console.log(error);
      });
  }

  ngOnInit() {
  }

  handleChange(e) {
    const index = e.index;
    this.selectedTab.emit(index);
  }

}
