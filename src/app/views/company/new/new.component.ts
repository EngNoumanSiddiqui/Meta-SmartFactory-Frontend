import {Component, EventEmitter, OnInit, Output, ViewChild, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {LoaderService} from '../../../services/shared/loader.service';
import {environment} from '../../../../environments/environment';
import {UtilitiesService} from '../../../services/utilities.service';
import { Subscription } from 'rxjs';
import { ImageAdderComponent } from '../../image/image-adder/image-adder.component';
import { CompanyService } from 'app/services/dto-services/company/company.service';
import { TableTypeEnum } from 'app/dto/table-type-enum';
import { CityService } from 'app/services/dto-services/city/city.service';
import { CountryService } from 'app/services/dto-services/country/country.service';
@Component({
  selector: 'company-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewCompanyComponent implements OnInit, OnDestroy {
  // company = {
  //   'address': null,
  //   'cityId': null,
  //   'companyAddress': null,
  //   'companyCode': null,
  //   'companyName': null,
  //   'postcode': null
  // };

  company = {
    'address': null,
    'cityId': null,
    'cityName': null,
    'companyAddress': null,
    'companyCode': null,
    'companyName': null,
    'countryId': null,
    'countryName': null,
    'plantList': null,
    'postcode': null
  };
  @Output() saveAction = new EventEmitter<any>();
  // Enum get gelecek
  @ViewChild(ImageAdderComponent) imageAdderComponent: ImageAdderComponent;
  subscription: Subscription;
  countries: any;
  cities: any;
  cityDisabled: boolean;

  constructor(private companyService: CompanyService,
              private _router: Router,
              private loaderService: LoaderService,
              private _citySvc: CityService,
              private _countrySvc: CountryService,
              private utilities: UtilitiesService) {

  }

  ngOnInit() {
    this._countrySvc.getIdNameList().then(result => this.countries = result).catch(error => console.log(error));
    this.subscription = this.companyService.saveAction$.asObservable().subscribe(rs => {
      this.save();
    });
  }
  countrySelection(event) {
    if (this.company.countryId !== null) {
      this.countries.forEach(country => {
        if (this.company.countryId === country.countryId) {
          this.company.countryName = country.countryName;
        }
      });
      this._citySvc.getIdNameList(this.company.countryId)
        .then(result => this.cities = result)
        .catch(error => console.log(error));

      this.cityDisabled = false;
    } else {
      this.cityDisabled = true;
    }

  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  save() {
    this.loaderService.showLoader();
    this.companyService.save(this.company)
      .then((company: any) => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        this.saveImages(company.companyId);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });

  }
  private saveImages(companyId) {
    this.imageAdderComponent.updateMedia(companyId, TableTypeEnum.COMPANY).then(() => {
        setTimeout(() => {
          this.saveAction.emit();
          this.reset();
        }, environment.DELAY);
      }
    ).catch(error => this.utilities.showErrorToast(error));
  }
  

  goPage() {
    this._router.navigate(['/customers']);
  }

  reset() {
    this.company = {
      'address': null,
      'cityId': null,
      'cityName': null,
      'companyAddress': null,
      'companyCode': null,
      'companyName': null,
      'countryId': null,
      'countryName': null,
      'plantList': null,
      'postcode': null
    };
  }

}
