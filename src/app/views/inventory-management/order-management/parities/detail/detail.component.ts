import { Component, OnInit, Input } from '@angular/core';
import { CostCenterService } from 'app/services/dto-services/cost-center/cost-center.service';
import { ParityService } from 'app/services/dto-services/parity/parity.service';
import { LoaderService } from 'app/services/shared/loader.service';
@Component({
  selector: 'parities-detail',
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

  constructor(private parityService: ParityService, private loaderservice: LoaderService){}

  ngOnInit() {}


  initialize(id) {
    this.loaderservice.showLoader();
    this.parityService.getDetail(id).then((res) => {
      this.data = res;
      this.loaderservice.hideLoader();
    }).catch((err) => {
      console.log(err);
      this.loaderservice.hideLoader();
    })
  }
}
