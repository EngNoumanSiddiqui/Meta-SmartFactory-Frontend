import {Component, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService} from 'primeng';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {UtilitiesService} from 'app/services/utilities.service';
import {LoaderService} from 'app/services/shared/loader.service';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { CountryService } from 'app/services/dto-services/country/country.service';
import { CityService } from 'app/services/dto-services/city/city.service';
@Component({
  selector: 'city-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;
  cityModal = {
    modal: null,
    data: null,
    id: null
  };
  selectedColumns = [
    {field: 'cityId', header: 'city-id'},
    {field: 'cityName', header: 'city-name'},
    {field: 'countryname', header: 'country-name'},
    {field: 'countryshortname', header: 'country-short-name'},
  ];
  cols = [
    {field: 'cityId', header: 'city-id'},
    {field: 'cityName', header: 'city-name'},
    {field: 'countryname', header: 'country-name'},
    {field: 'countryshortname', header: 'country-short-name'},
  ];
  cities = [] = [];
  countries = [] = [];
  selectedcities: any;
  selectedCountryId = null;
  constructor(private _confirmationSvc: ConfirmationService,
              private _router: Router,
              private _translateSvc: TranslateService,
              private countryService: CountryService,
              private cityService: CityService,
              private utilities: UtilitiesService,
              private loaderService: LoaderService) {
  }

  ngOnInit() {
    // this.filter();
    this.countryService.getIdNameList()
      .then((result: any) => {
        this.countries = result;
        this.loaderService.hideLoader();
      }).catch(error => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(error)
    });
  }


  filter(countryId) {
    this.loaderService.showLoader();
    this.cityService.getIdNameList(countryId)
      .then((result: any) => {
        this.cities = result;
        this.loaderService.hideLoader();
      }).catch(error => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(error)
    });
  }

  modalShow(id, mod: string, data?) {
    console.log('@OnEdit', id, mod);
    this.cityModal.id = id;
    this.cityModal.modal = mod;
    this.cityModal.data = data ? data : null;
    this.myModal.show();
  }

  countrySelection(event) {
    if (event) {
      this.filter(+event);
    }
  }
  delete(id) {
    console.log(id);
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this.cityService.delete(id)
          .then(() => {
            this.utilities.showSuccessToast('deleted-success');
            this.filter(this.selectedCountryId);
          })
          .catch(error => this.utilities.showErrorToast(error));
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    });
  }
}
