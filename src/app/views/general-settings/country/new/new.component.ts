import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { environment } from 'environments/environment';
import { CountryService } from 'app/services/dto-services/country/country.service';
@Component({
  selector: 'country-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();
  
  cntReqDto = {
    countryId: null,
    countryName: null,
    countryShortName: null
  };
  constructor(
              private utilities: UtilitiesService,
              private loaderService: LoaderService,
              private countryService: CountryService
              ) {
              }  

  ngOnInit() {}

  reset() {
    this.cntReqDto = {
      countryId: null,
      countryName: null,
      countryShortName: null
    };
  }

  save() {
    this.loaderService.showLoader();
    this.countryService.save(this.cntReqDto).then(() => {
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
