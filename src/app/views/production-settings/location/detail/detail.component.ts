import { Component, OnInit, Input } from '@angular/core';
import { LocationService } from 'app/services/dto-services/location/location.service';
import { LoaderService } from 'app/services/shared/loader.service';
@Component({
  selector: 'location-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class LocationDetailComponent implements OnInit {
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

  constructor(private locationService: LocationService, private loaderservice: LoaderService){}

  ngOnInit() {}


  initialize(id) {
    this.loaderservice.showLoader();
    this.locationService.detail(id).then((res) => {

      this.data = res;
      this.loaderservice.hideLoader();
    }).catch((err) => {
      console.log(err);
      this.loaderservice.hideLoader();
    })
  }
}
