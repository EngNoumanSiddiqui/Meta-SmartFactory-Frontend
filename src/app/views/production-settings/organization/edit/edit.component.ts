import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PlantService} from 'app/services/dto-services/plant/plant.service';
import {LoaderService} from 'app/services/shared/loader.service';
import {UtilitiesService} from 'app/services/utilities.service';
 
import {environment} from 'environments/environment';
import { CompanyService } from 'app/services/dto-services/company/company.service';
import { CountryService } from 'app/services/dto-services/country/country.service';
import { CityService } from 'app/services/dto-services/city/city.service';
import { IOrganization } from 'app/dto/plant/plant.model';
import { UsersService } from 'app/services/users/users.service';
import { OrganizationService } from 'app/services/dto-services/organization/organization.service';

@Component({
  selector: 'organization-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();
  organization: IOrganization = {
    address: null,
    checkAvaiableStockForRequestedReservation: 0,
    cityId: null,
    cityName: null,
    countryId: null,
    countryName: null,
    organizationId: null,
    organizationCode: null,
    organizationName: null,
    createAutoProdOrders: 0,
    createdDate: null,
    deliverManualPurchaseOrder: 0,
    getWaitingForMaterialReservationByJobOrder: 0,
    goodsMovementCodTemplete: null,
    materialCode: null,
    plantId: null,
    postcode: null,
    prodOrderCodeTemplete: null,
    purchaseOrderCodeTemplete: null,
    purchaseQuotationCodeTemplete: null,
    recheckJobOrderStockHasUnReristrictedQuantity: 0,
    releaseAllStockFromReservation: 0,
    releaseAllStockFromReservationAfterAutoSchedule: 0,
    salesOrderCodeTemplete: null,
    salesQuotationCodeTemplete: null,
    salesForecastDurationDay : 0
  }
  countries: any;
  cities: any;
  cityDisabled: boolean;
  samesAsPlant: boolean;
  selectedPlant: any;
  @Input('data') set st(data) {
    if (data) {
      const item = Object.assign({}, data);
      this.organization = item;
      if(this.organization.countryId) {
        this.getCountryCites(this.organization.countryId)
      }
    }
  }
  companyList = [];
  constructor(
    private organizationService: OrganizationService,
    private loaderService: LoaderService,
    private _userSvc: UsersService,
    private _citySvc: CityService,
    private _countrySvc: CountryService,
    private utilities: UtilitiesService) {

    this.selectedPlant = JSON.parse(this._userSvc.getPlant());
    this.organization.plantId = this.selectedPlant ? this.selectedPlant.plantId : null;    
  }

  ngOnInit() {
    this._countrySvc.getIdNameList().then(result => this.countries = result).catch(error => console.log(error));
  }

  getCountryCites(countryId: number){
    this._citySvc.getIdNameList(countryId)
    .then(result => { this.cities = result; this.cityDisabled = false;})
    .catch(error => console.log(error));
  }

  onChangeOrganization(event) {
    if(event) {
      if (this.selectedPlant) {
        this.organization.postcode = this.selectedPlant.postcode;
        this.organization.address = this.selectedPlant.address;
        this.organization.cityId = this.selectedPlant.cityId;
        this.organization.countryId = this.selectedPlant.countryId;
        this.organization.countryName = this.selectedPlant.countryName;
      }

    }
  }
  

  countrySelection(event) {
    this.organization.countryId = parseInt(event.target.value);
    if (this.organization.countryId !== null) {
      this.countries.forEach(country => {
        if (this.organization.countryId === country.countryId) {
          this.organization.countryName = country.countryName;
        }
      });
      this._citySvc.getIdNameList(this.organization.countryId)
        .then(result => this.cities = result)
        .catch(error => console.log(error));

      this.cityDisabled = false;
    } else {
      this.cityDisabled = true;
    }

  }

  citySelection(event){
    this.organization.cityId = parseInt(event.target.value);
    this.cities.forEach(element => {
        if(this.organization.cityId === element.cityId) this.organization.cityName = element.cityName
    });

  }
  save() {
    this.loaderService.showLoader();
    this.organization.plantId = this.selectedPlant.plantId;
    this.organizationService.save(this.organization)
      .then(() => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.saveAction.emit(this.organization);
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }
}
