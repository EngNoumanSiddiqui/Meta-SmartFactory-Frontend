import {Component, EventEmitter, Input, Output} from '@angular/core';


import {CountryDto} from '../../dto/country/country';
import {CityDto} from '../../dto/country/city';
import {CountryService} from '../../services/dto-services/country/country.service';
import {CityService} from '../../services/dto-services/city/city.service';

@Component({
  selector: 'country-city',
  templateUrl: './country-city-template.component.html',

})

export class CountryCityTemplateComponent {

  @Output() selectedCityEvent = new EventEmitter();
  @Output() selectedCountryEvent = new EventEmitter();


  private countries: Array<CountryDto>;
  private lasValidSelectedCountry: CountryDto;
  private lasValidSelectedCity: CityDto;


  filteredCities: Array<CityDto>;
  filteredCountries: Array<CountryDto>;
  selectedCountry: CountryDto;
  selectedCity: CityDto;


  @Input('selectedCountry')
  set s(selectedCountry: CountryDto) {
    this.selectedCountry = selectedCountry;
  }


  @Input('selectedCity')
  set y(selectedCity: CityDto) {
    this.selectedCity = selectedCity;
  }


  constructor(private countryService: CountryService, private cityService: CityService) {
    this.countryService.getIdNameList().then(countries => this.initCountry(countries));
  }

  initCountry(countries) {
    this.countries = countries;
  }

  searchCity(event) {
    this.cityService.getIdNameList(this.selectedCountry.countryId)
      .then(response => this.filteredCities = this.filterMatchedCity(event.query, response));
  }

  searchCountry(event) {
    this.filteredCountries = this.filterMatchedCountry(event.query, this.countries);
  }

  private filterMatchedCountry(query, tasks: CountryDto[]): CountryDto[] {
    const filtered: any[] = [];
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      if (task.countryName.toLowerCase().indexOf(query.toLowerCase()) !== -1) {
        filtered.push(task);
      }
    }
    return filtered;
  }

  private filterMatchedCity(query, tasks): CityDto[] {
    const filtered: any[] = [];
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      if (task.cityName.toLowerCase().indexOf(query.toLowerCase()) !== -1) {
        filtered.push(task);
      }
    }
    return filtered;
  }




  onChangeCountry(event) {
    if (event && event.hasOwnProperty('countryId')) {
      this.selectedCountryEvent.next(this.selectedCountry.countryId);
      this.lasValidSelectedCountry = this.selectedCountry;
    } else {
      if (this.lasValidSelectedCountry && this.lasValidSelectedCountry.hasOwnProperty('countryId')) {
        this.selectedCountryEvent.next(null);
      }

    }
    if (this.selectedCity && this.selectedCity.hasOwnProperty('cityId')) {
      this.selectedCity = null;
      this.lasValidSelectedCity = null;
      this.selectedCityEvent.next(null);
    }
  }

  onChangeCity(event) {

    if (event && event.hasOwnProperty('cityId')) {
      this.selectedCityEvent.next(this.selectedCity.cityId);
      this.lasValidSelectedCity = this.selectedCity;
    } else {
      if (this.lasValidSelectedCity && this.lasValidSelectedCity.hasOwnProperty('cityId')) {
        this.selectedCityEvent.next(null);
      }

    }
  }

  selectedCountryValid() {
    return this.selectedCountry && this.selectedCountry.hasOwnProperty('countryId');
  }
}
