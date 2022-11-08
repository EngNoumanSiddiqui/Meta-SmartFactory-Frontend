import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { CountryService } from 'app/services/dto-services/country/country.service';

@Component({
  selector: 'city-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class CityDetailComponent implements OnInit {
  cntReqDto = {
    cityId: null,
    cityName: null,
    countryName: null,
    countryId: null,
  };
  countries = [] = [];
  @Input('data') set dtcnt(data) {
    if (data) {
      this.cntReqDto = {
        cityId: data.cityId,
        cityName: data.cityName,
        countryName: (data.country)? data.country.countryName : data.countryName,
        countryId: data.countryId,
      };
    }
  }
  constructor(
              private utilities: UtilitiesService,
              private loaderService: LoaderService,
              private countryService: CountryService
              ) {
              }  

  ngOnInit() {}
}
