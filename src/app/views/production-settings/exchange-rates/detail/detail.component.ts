import { Component, OnInit, Input } from '@angular/core';
import { ExchangeRateService } from 'app/services/dto-services/exchange-rates/exchange-rates.service';
import { LoaderService } from 'app/services/shared/loader.service';
@Component({
  selector: 'exchange-rate-detail',
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

  constructor(private exchangeRateService: ExchangeRateService, private loaderservice: LoaderService){}

  ngOnInit() {}


  initialize(id) {
    this.loaderservice.showLoader();
    this.exchangeRateService.detail(id).then((res) => {
      this.data = res;
      this.loaderservice.hideLoader();
    }).catch((err) => {
      console.log(err);
      this.loaderservice.hideLoader();
    })
  }
}
