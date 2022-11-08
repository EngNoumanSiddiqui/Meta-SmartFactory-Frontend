import { Component, OnInit, Input } from '@angular/core';
import { InvoiceService } from 'app/services/dto-services/invoice/invoice.service';
import { LoaderService } from 'app/services/shared/loader.service';
@Component({
  selector: 'invoice-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  data: any = {};
  @Input('data') set z(data) {
    if (data) {
      this.data = data;  
    }
  };
  @Input('id') set zid(id) {
    if (id) {
      this.initialize(id);
    }
  };

  constructor(private invoiceService: InvoiceService, private loaderservice: LoaderService){}

  ngOnInit() {}


  initialize(id) {
    this.loaderservice.showLoader();
    this.invoiceService.detail(id).then((res) => {
      this.data = res;
      this.loaderservice.hideLoader();
    }).catch((err) => {
      console.log(err);
      this.loaderservice.hideLoader();
    })
  }
}
