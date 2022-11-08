import {Component, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService} from 'primeng';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {UtilitiesService} from 'app/services/utilities.service';
import {LoaderService} from 'app/services/shared/loader.service';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { CountryService } from 'app/services/dto-services/country/country.service';
@Component({
  selector: 'country-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;
  countryModal = {
    modal: null,
    data: null,
    id: null
  };
  selectedColumns = [
    {field: 'countryId', header: 'country-id'},
    {field: 'countryName', header: 'country-name'},
    {field: 'countryShortName', header: 'country-short-name'}
  ];
  cols = [
    {field: 'countryId', header: 'country-id'},
    {field: 'countryName', header: 'country-name'},
    {field: 'countryShortName', header: 'country-short-name'}
  ];
  countries = [] = [];
  selectedCountries: any;
  constructor(private _confirmationSvc: ConfirmationService,
              private _router: Router,
              private _translateSvc: TranslateService,
              private countryService: CountryService,
              private utilities: UtilitiesService,
              private loaderService: LoaderService) {
  }

  ngOnInit() {
    this.filter();
  }


  filter() {
    this.loaderService.showLoader();
    this.countryService.getIdNameList()
      .then((result: any) => {
        this.countries = result;
        this.loaderService.hideLoader();
      }).catch(error => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(error)
    });
  }

  modalShow(id, mod: string, data?) {
    console.log('@OnEdit', id, mod);
    this.countryModal.id = id;
    this.countryModal.modal = mod;
    this.countryModal.data = data ? data : null;
    this.myModal.show();
  }

  delete(id) {
    console.log(id);
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this.countryService.delete(id)
          .then(() => {
            this.utilities.showSuccessToast('deleted-success');
            this.filter();
          })
          .catch(error => this.utilities.showErrorToast(error));
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    });
  }
}
