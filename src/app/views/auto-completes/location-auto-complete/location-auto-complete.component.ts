import {debounceTime, switchMap} from 'rxjs/operators';
import {Component, EventEmitter, Input, OnInit, Output, OnDestroy} from '@angular/core';

import {Subject, Subscription} from 'rxjs';
import {WarehouseService} from '../../../services/dto-services/warehouse/warehouse.service';
import { AppStateService } from 'app/services/dto-services/app-state.service';

import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { LocationService } from 'app/services/dto-services/location/location.service';


@Component({
  selector: 'location-auto-complete',
  templateUrl: './location-auto-complete.component.html',

})

export class LocationAutoCompleteComponent implements OnInit, OnDestroy {

  @Output() selectedLocationEvent = new EventEmitter<any>();
  selectedLocation: any;
  selectedLocationId: any;
  @Input() required: boolean = false;
  @Input() disabled: boolean;
  @Input() dropdown = true;
  sub: Subscription;
  @Input() addIfMissing = false;
  modal = {active: false};
  selectedPlant = null;
  isSetDefaultSelected: boolean = false;

  @Input('selectedLocation')  set in(selectedLocation) {
    this.selectedLocation = selectedLocation;
  }
  @Input('selectedLocationNo')  set inLocationNo(selectedLocationNo) {
    if(selectedLocationNo) {
      this.selectedLocation = {locationNo: selectedLocationNo};
    }
  }
  @Input('selectedLocationId')  set inId(selectedLocationId) {
    if (selectedLocationId) {
      this.selectedLocationId = +selectedLocationId;
      if(this.selectedLocation && this.selectedLocation.locationId === this.selectedLocationId) {

      } else {
        this.getDetailLocation();
      }
    } else {
      this.selectedLocationId = null;
      this.selectedLocation = null;
    }
  }

  @Input('plantId') set x (plantId) {
    if (plantId) {
      this.locationFilter.plantId = plantId;
      this.searchTermLocations.next(this.locationFilter);
    }
  }

  placeholder = 'no-data';
  filteredLocations: Array<any>;

  locationFilter = {
    locationId: null,
    locationName: null,
    locationNo: null,
    plantId: null,
    pageSize: 500,
    pageNumber: 1,
    query: null,
    orderByProperty: 'locationId',
    orderByDirection: 'desc'
  };
  private allLocations: Array<any>;
  private searchTermLocations = new Subject<any>();

  constructor(private locationService: LocationService,
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
     private appStateSvc: AppStateService) {
    
  }

  modalShow() {
    this.modal.active = true;
  }


  ngOnInit() {
    this.searchTermLocations.pipe(
      debounceTime(400),
      switchMap(term => this.locationService.filterObservable(this.locationFilter))).subscribe(
      res => this.initResult(res['content']),
      error2 => this.initResult([])
    );
    
    this.sub = this.appStateSvc.plantAnnounced$.subscribe(res => {
      if ((res) && res.plantId) {
        this.selectedPlant = res;
        this.locationFilter.plantId = res.plantId;
      } else {
        this.locationFilter.plantId = null;
      }
      this.searchTermLocations.next(this.locationFilter);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  private  initResult(res) {
    this.allLocations = res;
    if (res.length > 0) {
      this.placeholder = 'search-location';
    } else {
      this.placeholder = 'no-data';
    }
  }

  getDetailLocation() {
    this.locationService.detail(this.selectedLocationId).then(res => {
      this.selectedLocation = res;
    }).catch(Err => console.error(Err));
  }

  onChangeLocation(event) {
    console.log('@onChangeLocation', event);
    if (event && event.hasOwnProperty('locationId')) {
      this.selectedLocationEvent.next(this.selectedLocation);
    } else {
      this.selectedLocationEvent.next(null);
    }
  }

  searchWareHouse(event) {
    this.filteredLocations = this.filterMatched(event.query);
  }

  onSave(res) {
    if(res) {
      this.selectedLocation = res;
      this.allLocations.unshift({...res});
      this.onChangeLocation(this.selectedLocation);
      this.modal.active = false;
    }
  }


  handleDropdownClickForWareHouse() {
    this.filteredLocations = [...this.allLocations];
    if (this.filteredLocations.length === 0) {
      this.locationFilter.locationName = null;
      this.searchTermLocations.next(this.locationFilter);
    }
  }

  filterMatched(query): any[] {
    const filtered: any[] = [];
    if (this.allLocations && this.allLocations.length > 0) {
      for (let i = 0; i < this.allLocations.length; i++) {
        const obj = this.allLocations[i];
        if (obj['locationName'].toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(obj);
        }
      }
    }
    if (filtered.length === 0) {
      this.locationFilter.locationName = query;
      this.searchTermLocations.next(this.locationFilter);
    }
    return filtered;
  }
}
