import {Component, EventEmitter, Input, Output} from '@angular/core';


import {CountryDto} from '../../../dto/country/country';
import {CountryService} from '../../../services/dto-services/country/country.service';

@Component({
  selector: 'country-auto-complete',
  templateUrl: './country-auto-complete.component.html',

})

export class CountryAutoCompleteComponent {

  @Output() selectedCountryEvent = new EventEmitter();




  private countries: Array<CountryDto>;
  private lasValidSelectedCountry: CountryDto;

  @Input() required;
  @Input() dropdown=true;
  filteredCountries: Array<CountryDto>;
  selectedCountry: CountryDto;


  @Input('selectedCountry')
  set s(selectedCountry: CountryDto) {
    this.selectedCountry = selectedCountry;
  }



  constructor(private countryService: CountryService) {
    this.countryService.getIdNameList().then(countries => this.initCountry(countries));
  }

  initCountry(countries) {
    this.countries = countries;
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






  onChangeCountry(event) {
    if (event && event.hasOwnProperty('countryId')) {
      this.selectedCountryEvent.next(this.selectedCountry.countryId);
      this.lasValidSelectedCountry = this.selectedCountry;
    } else {
      if (this.lasValidSelectedCountry && this.lasValidSelectedCountry.hasOwnProperty('countryId')) {
        this.selectedCountryEvent.next(null);
      }

    }

  }
}
