import { Component, OnInit, Input } from '@angular/core';
import { CostCenterService } from 'app/services/dto-services/cost-center/cost-center.service';
import { LoaderService } from 'app/services/shared/loader.service';
@Component({
  selector: 'cost-center-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  payLoadObject = {
    'workStationTypeId': null,
    'workStationTypeName': null
  }
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

  constructor(private costCenterService: CostCenterService, private loaderservice: LoaderService){}

  ngOnInit() {}


  initialize(id) {
    this.loaderservice.showLoader();
    this.costCenterService.detail(id).then((res) => {
      this.data = res;
      this.loaderservice.hideLoader();
    }).catch((err) => {
      console.log(err);
      this.loaderservice.hideLoader();
    })
  }
}
