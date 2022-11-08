import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {LoaderService} from 'app/services/shared/loader.service';
import {UtilitiesService} from 'app/services/utilities.service';
import {environment} from 'environments/environment';
import { CountryService } from 'app/services/dto-services/country/country.service';
import { CityService } from 'app/services/dto-services/city/city.service';
import { IOrganization } from 'app/dto/plant/plant.model';
import { UsersService } from 'app/services/users/users.service';
import { OrganizationService } from 'app/services/dto-services/organization/organization.service';


@Component({
  selector: 'organization-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {
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
  cities;
  countries;
  samesAsPlant;
  selectedPlant;
  id;
  params = {
    dialog: { title: '', inputValue: '' }
  };
  cityDisabled: boolean;

  constructor(
    private organizationService: OrganizationService,
    private loaderService: LoaderService,
    private _userSvc: UsersService,
    private _citySvc: CityService,
    private _countrySvc: CountryService,
    private utilities: UtilitiesService, ) {
      
  }


  ngOnInit() {
    this.selectedPlant = JSON.parse(this._userSvc.getPlant());
    this.organization.plantId = this.selectedPlant ? this.selectedPlant.plantId : null;
    if (this.selectedPlant) {
      this.organization.postcode = this.selectedPlant.postcode;
      this.organization.address = this.selectedPlant.address;
      this.organization.cityId = this.selectedPlant.cityId;
      this.organization.countryId = this.selectedPlant.countryId;
      this.organization.countryName = this.selectedPlant.countryName;
    }
    this._countrySvc.getIdNameList().then(result => this.countries = result).catch(error => console.log(error));
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

  reset() {
    this.organization = {
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
  }

  save() {
    this.loaderService.showLoader();
    this.organization.plantId = this.selectedPlant.plantId;
    this.organizationService.save(this.organization)
      .then(result => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.reset();
          this.saveAction.emit(result);
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }
}
