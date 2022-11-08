import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { environment } from 'environments/environment';
import { ExchangeRateService } from 'app/services/dto-services/exchange-rates/exchange-rates.service';

@Component({
  selector: 'exchange-rate-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
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

  @Input('data') set z(data) {
    if (data) {
      this.payLoadObject = {
        currencyRecordId: data['currencyRecordId'],
        fromCurrencyCode: data['fromCurrencyCode'],
        rate: data['rate'],
        toCurrencyCode: data['toCurrencyCode'],
        validFrom: data['validFrom'] ? new Date(data['validFrom']) : null,
        validTo: data['validTo'] ? new Date(data['validTo']) : null,
      }
    }
  };

  constructor( private exchangeRateService: ExchangeRateService,
    private loaderService: LoaderService,
    private utilities: UtilitiesService, ) {

  }

  ngOnInit() {
    // this.payLoadObject.plantId = this.plantId;
  }

  save() {
    this.loaderService.showLoader();
    // this.payLoadObject.plantId = this.plantId;
    this.exchangeRateService.save(this.payLoadObject)
      .then(() => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('updated-success');
        setTimeout(() => {
          this.saveAction.emit('close');
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });

  }
  reset() {}

}
