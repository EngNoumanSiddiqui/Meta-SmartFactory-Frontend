import {debounceTime, switchMap} from 'rxjs/operators';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subject} from 'rxjs';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { DefectLocationsService } from 'app/services/dto-services/defect-location/defect-locations.service';
import { UsersService } from 'app/services/users/users.service';


@Component({
  selector: 'quality-defect-location-auto-complete',
  templateUrl: './quality-defect-location-auto-complete.component.html',

})

export class QualityDefectLocationAutoCompleteComponent implements OnInit {

  @Output() selectedDefectLocationEvent = new EventEmitter<any>();

  selectedDefectLocation;
  selectedDefectLocationId;
  disabled = false;

  @Input() dropdown=true;
  @Input() required: boolean;
  @Input() addIfMissing = false;
  selectedPlant: any;


  @Input('selectedDefectLocation')
  set a(selectedDefectLocation) {
    this.selectedDefectLocation = selectedDefectLocation;
  }

  @Input('selectedDefectLocationId')
  set b(selectedDefectLocationId) {
    if (this.selectedDefectLocationId !== selectedDefectLocationId) {
      this.getDefectLocationDetail(selectedDefectLocationId);
      this.selectedDefectLocationId = selectedDefectLocationId;
    }

  }

  @Input('disabled')
  set y(disabled) {
    this.disabled = disabled;
  }

  placeholder = 'no-data';
  modal = {active: false};
  filteredDefectLocation;
  qualityDefectLocationFilter = {
    createDate: null,
    defectLocationCode: null,
    defectLocationId: null,
    text: null,
    orderByDirection: null,
    orderByProperty: null,
    plantId: null,
    pageNumber: 1,
    pageSize: 100,
    query: null,
    updateDate: null,
  };


  allDefectLocations;
  private searchTerms = new Subject<any>();

  constructor( private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _userSvc: UsersService,
    private qualityDefectLocationService: DefectLocationsService) {

      const setPlant = this._userSvc.getPlant();
      this.selectedPlant = JSON.parse(setPlant);
      if (this.selectedPlant) {
        this.qualityDefectLocationFilter.plantId = this.selectedPlant.plantId;
        // this.ControlIndicatorTypeDto.plantId = this.selectedPlant.plantId;
      }
  }


  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.qualityDefectLocationService.filter(this.qualityDefectLocationFilter))).subscribe(
      cats => this.initResult(cats['content']),
      error2 => this.initResult([])
    );

    this.searchTerms.next(this.qualityDefectLocationFilter);
  }

  getDefectLocationDetail(qualityDefectLocationId) {
    if (qualityDefectLocationId) {
      this.qualityDefectLocationService.detail(qualityDefectLocationId).then(rs => {
        this.selectedDefectLocation = rs;
        this.checkAndAddSelectedDefectLocation();
      });
    }

  }
  modalShow() {
    this.modal.active = true;
  }

  OnSave(event: any) {
    
    if (event) {
      this.selectedDefectLocation = event;
      this.allDefectLocations.push(event);
      this.handleDropdownClickForDefectLocation()
      this.onChangeDefectLocation(this.selectedDefectLocation);
      this.modal.active = false;
    }
  }


  private checkAndAddSelectedDefectLocation() {
    const me = this;
    if (this.selectedDefectLocation) {
      if (this.filteredDefectLocation) {
        const ex = this.filteredDefectLocation.find(it => it.defectLocationId == me.selectedDefectLocation.defectLocationId);
        const aex = this.allDefectLocations.find(it => it.defectLocationId == me.selectedDefectLocation.defectLocationId);
        if (!aex) {
          this.filteredDefectLocation.push(this.selectedDefectLocation);
          this.filteredDefectLocation = [...this.filteredDefectLocation];
        }
        if (!ex) {
          this.allDefectLocations.push(this.selectedDefectLocation);
        }
      }
      this.selectedDefectLocationEvent.next(this.selectedDefectLocation);
    }
  }

  private  initResult(res) {
    // this.filteredDefectLocation = res;
    this.allDefectLocations = res;
    if (res.length > 0) {
      this.placeholder = 'search-defect-location';
    } else {
      this.placeholder = 'no-data';

    }
    this.checkAndAddSelectedDefectLocation();

  }


  onChangeDefectLocation(event) {
    if (event && event.hasOwnProperty('defectLocationId')) {
      this.selectedDefectLocationEvent.next(this.selectedDefectLocation);
    } else {
      this.selectedDefectLocationEvent.next(null);
    }
  }


  searchDefectLocation(event) {

    this.filteredDefectLocation = this.filterMatched(event.query);

  }


  handleDropdownClickForDefectLocation() {

    this.filteredDefectLocation = [...this.allDefectLocations];

    if (this.filteredDefectLocation.length == 0) {
      this.qualityDefectLocationFilter.defectLocationCode = null;
      this.searchTerms.next(this.qualityDefectLocationFilter);
    }

  }


  filterMatched(query): any[] {
    const filtered: any[] = [];
    if (this.allDefectLocations && this.allDefectLocations.length > 0) {
      for (let i = 0; i < this.allDefectLocations.length; i++) {
        const obj = this.allDefectLocations[i];
        if (obj['DefectLocationCode'].toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(obj);
        }
      }
    }
    if (filtered.length == 0) {
      this.qualityDefectLocationFilter.defectLocationCode = query;
      this.searchTerms.next(this.qualityDefectLocationFilter);
    }
    return filtered;
  }


}
