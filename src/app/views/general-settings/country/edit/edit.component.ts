import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { environment } from 'environments/environment';
import { CountryService } from 'app/services/dto-services/country/country.service';
@Component({
  selector: 'country-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();
  
  cntReqDto = {
    countryId: null,
    countryName: null,
    countryShortName: null
  };
  @Input('data') set dtcnt(data) {
    if (data) {
      this.cntReqDto = {
        countryId: data.countryId,
        countryName: data.countryName,
        countryShortName: data.countryShortName
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
