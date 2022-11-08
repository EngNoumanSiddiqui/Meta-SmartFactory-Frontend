import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { environment } from 'environments/environment';
import { CountryService } from 'app/services/dto-services/country/country.service';
import { CityService } from 'app/services/dto-services/city/city.service';
@Component({
  selector: 'city-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();
  
  cntReqDto = {
    cityId: null,
    cityName: null,
    countryId: null,
  };
  @Input('selectedCountryId') set dtcnt(id) {
    if (id) {
      this.cntReqDto.countryId = id;
    }
  }
  countries = [] = [];
  constructor(
              private utilities: UtilitiesService,
              private loaderService: LoaderService,
              private countryService: CountryService,
              private cityService: CityService,
              ) {
              }  

  ngOnInit() {
    this.countryService.getIdNameList()
      .then((result: any) => {
        this.countries = result;
      }).catch(error => {
      this.utilities.showErrorToast(error)
    });
  }

  countrySelection(event) {
    if (event) {
      this.cntReqDto.countryId = +event;
    }
  }
  reset() {
    this.cntReqDto = {
      cityId: null,
      cityName: null,
      countryId: null,
    };
  }

  save() {
    this.loaderService.showLoader();
    this.cityService.save(this.cntReqDto).then(() => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.reset();
          this.saveAction.emit('close');
        }, environment.DELAY);
      }).catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
    
  }

}
