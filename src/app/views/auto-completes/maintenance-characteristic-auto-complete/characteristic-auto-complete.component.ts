import {debounceTime, switchMap} from 'rxjs/operators';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {Subject} from 'rxjs';
import {CharacteristicService} from '../../../services/dto-services/maintenance-equipment/characteristic.service';


@Component({
  selector: 'characteristic-auto-complete',
  templateUrl: './characteristic-auto-complete.component.html',

})

export class CharacteristicAutoCompleteComponent implements OnInit {

  @Output() selectedCharacteristicEvent = new EventEmitter();

  selectedCharacteristic;
  disabled = false;

  @Input() dropdown=true;
  @Input() required: boolean;

  @Input('selectedCharacteristic')
  set a(selectedCharacteristic) {
    this.selectedCharacteristic = selectedCharacteristic;
  }
  @Input() addIfMissing = false;

  modal = {active: false};

  @Input('disabled')
  set y(disabled) {
    this.disabled = disabled;
  }

  @Input('plantId') set setPlantId(plantId) {
    if (plantId) {
      this.characteristicFilter.plantId = plantId;
      this.searchTerms.next(this.characteristicFilter);
    }
  }

  placeholder = 'no-data';
  filteredCharacteristic;
  characteristicFilter = {
    characteristic: null,
    pageSize: 1000,
    pageNumber: 1,
    orderByProperty: 'characteristic',
    plantId: null
  };


  allCharacteristics;
  private searchTerms = new Subject<any>();

  constructor(private characteristicService: CharacteristicService) {
  }
  modalShow() {
    this.modal.active = true;
  }

  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.characteristicService.filterObservable(this.characteristicFilter))).subscribe(
      cats => this.initResult(cats['content']),
      error2 => this.initResult([])
    );

    this.searchTerms.next(this.characteristicFilter);
  }


  private checkAndAddSelectedCharacteristic() {
    const me = this;
    if (this.selectedCharacteristic) {
      if (this.filteredCharacteristic) {
        const ex = this.filteredCharacteristic.find(it => it.maintenanceCharacteristicId == me.selectedCharacteristic.maintenanceCharacteristicId);
        const aex = this.allCharacteristics.find(it => it.maintenanceCharacteristicId == me.selectedCharacteristic.maintenanceCharacteristicId);
        if (!aex) {
          this.filteredCharacteristic.push(this.selectedCharacteristic);
          this.filteredCharacteristic = [...this.filteredCharacteristic];
        }
        if (!ex) {
          this.allCharacteristics.push(this.selectedCharacteristic);
        }
      }
      this.selectedCharacteristicEvent.next(this.selectedCharacteristic);
    }
  }

  private  initResult(res) {
    // this.filteredCharacteristic = res;
    this.allCharacteristics = res;
    if (res.length > 0) {
      this.placeholder = 'search-characteristic';
    } else {
      this.placeholder = 'no-data';

    }
    this.checkAndAddSelectedCharacteristic();

  }


  onChangeCharacteristic(event) {
    if (event && event.hasOwnProperty('maintenanceCharacteristicId')) {

      this.selectedCharacteristicEvent.next(this.selectedCharacteristic);
    } else {
      this.selectedCharacteristicEvent.next(null);
    }
  }


  searchCharacteristic(event) {

    this.filteredCharacteristic = this.filterMatched(event.query);

  }


  handleDropdownClickForCharacteristic() {

    this.filteredCharacteristic = [...this.allCharacteristics];

    if (this.filteredCharacteristic.length == 0) {
      this.characteristicFilter.characteristic = null;
      this.searchTerms.next(this.characteristicFilter);
    }

  }


  filterMatched(query): any[] {


    const filtered: any[] = [];
    if (this.allCharacteristics && this.allCharacteristics.length > 0) {
      for (let i = 0; i < this.allCharacteristics.length; i++) {
        const obj = this.allCharacteristics[i];
        if (obj['characteristic'].toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(obj);
        }
      }
    }
    if (filtered.length == 0) {
      this.characteristicFilter.characteristic = query;
      this.searchTerms.next(this.characteristicFilter);
    }
    return filtered;
  }

  setCharacteristic(characteristic) {

    if (characteristic) {
      this.selectedCharacteristic = characteristic;
      this.allCharacteristics.push(characteristic);
      this.handleDropdownClickForCharacteristic()
      this.onChangeCharacteristic(this.selectedCharacteristic);
    }
  }
}
