import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { environment } from 'environments/environment';
import { ExchangeRateService } from 'app/services/dto-services/exchange-rates/exchange-rates.service';

@Component({
  selector: 'exchange-rate-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();
  payLoadObject = {
    currencyRecordId: null,
    fromCurrencyCode: null,
    rate: null,
    toCurrencyCode: null,
    validFrom: null,
    validTo: null,
  }

  @Input() plantId = null;
  submitted: boolean = false;
  constructor( private exchangeRateService: ExchangeRateService,
    private loaderService: LoaderService,
    private utilities: UtilitiesService, ) {

  }


  ngOnInit() {

    this.payLoadObject.validFrom = new Date();
    let validTo = new Date();
    validTo.setFullYear(validTo.getFullYear() + 5);
    this.payLoadObject.validTo = validTo;
    // this.payLoadObject.plantId = this.plantId;
  }


  reset() {
    this.payLoadObject = {
      currencyRecordId: null,
      fromCurrencyCode: null,
      rate: null,
      toCurrencyCode: null,
      validFrom: null,
      validTo: null,
    }
  
  }

  save() {
    this.loaderService.showLoader();
    this.submitted = true;
    this.exchangeRateService.save(this.payLoadObject)
      .then(result => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          // this.reset();
          this.saveAction.emit(result);
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.submitted = true;
        this.utilities.showErrorToast(error);
      });
  }

}
