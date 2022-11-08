import {debounceTime, switchMap} from 'rxjs/operators';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {Subject} from 'rxjs';
import {CharacteristicDataTypeService} from '../../../services/dto-services/maintenance-equipment/characteristic-data-type.service';
import {UtilitiesService} from '../../../services/utilities.service';


@Component({
  selector: 'characteristic-data-type-auto-complete',
  templateUrl: './characteristic-data-type-auto-complete.component.html',

})

export class CharacteristicDataTypeAutoCompleteComponent implements OnInit {

  @Output() selectedCharacteristicDataTypeEvent = new EventEmitter();

  selectedCharacteristic;
  disabled = false;

  @Input() dropdown = true;
  @Input() required: boolean;
  @Input() addIfMissing: boolean;

  @Input('selectedCharacteristicDataType')
  set a(selectedCharacteristicDataType) {
    this.selectedCharacteristic = selectedCharacteristicDataType;
  }

  @Input('disabled')
  set y(disabled) {
    this.disabled = disabled;
  }

  @Input('plantId') set setPlantId(plantId) {
    if (plantId) {
      this.characteristicFilter.plantId = plantId;
      this.dataModel.plantId = plantId;
      this.searchTerms.next(this.characteristicFilter);
    } else {
      this.characteristicFilter.plantId = null;
      this.dataModel.plantId = null;
      this.searchTerms.next(this.characteristicFilter);
    }
  }

  placeholder = 'no-data';
  filteredCharacteristic;
  characteristicFilter = {
    dataType: null,
    pageSize: 1000,
    pageNumber: 1,
    orderByProperty: 'dataType',
    plantId: null
  };

  dataModel = {
    'dataType': null,
    'description': null,
    'maintenanceCharacteristicDataTypeId': null,
    plantId: null
  }

  modal = {active: false};
  allCharacteristics;
  private searchTerms = new Subject<any>();

  constructor(private characteristicService: CharacteristicDataTypeService, private utilities: UtilitiesService) {
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
        const ex = this.filteredCharacteristic.find(it => it.maintenanceCharacteristicDataTypeId == me.selectedCharacteristic.maintenanceCharacteristicDataTypeId);
        const aex = this.allCharacteristics.find(it => it.maintenanceCharacteristicDataTypeId == me.selectedCharacteristic.maintenanceCharacteristicDataTypeId);
        if (!aex) {
          this.filteredCharacteristic.push(this.selectedCharacteristic);
          this.filteredCharacteristic = [...this.filteredCharacteristic];
        }
        if (!ex) {
          this.allCharacteristics.push(this.selectedCharacteristic);
        }
      }
      this.selectedCharacteristicDataTypeEvent.next(this.selectedCharacteristic);
    }
  }

  private  initResult(res) {
    // this.filteredCharacteristic = res;
    this.allCharacteristics = res;
    if (res.length > 0) {
      this.placeholder = 'search-characteristic-type';
    } else {
      this.placeholder = 'no-data';

    }
    this.checkAndAddSelectedCharacteristic();

  }


  onChangeCharacteristic(event) {
    if (event && event.hasOwnProperty('maintenanceCharacteristicDataTypeId')) {

      this.selectedCharacteristicDataTypeEvent.next(this.selectedCharacteristic);
    } else {
      this.selectedCharacteristicDataTypeEvent.next(null);
    }
  }


  searchCharacteristic(event) {

    this.filteredCharacteristic = this.filterMatched(event.query);

  }


  handleDropdownClickForCharacteristic() {

    this.filteredCharacteristic = [...this.allCharacteristics];

    if (this.filteredCharacteristic.length == 0) {
      this.characteristicFilter.dataType = null;
      this.searchTerms.next(this.characteristicFilter);
    }

  }


  filterMatched(query): any[] {


    const filtered: any[] = [];
    if (this.allCharacteristics && this.allCharacteristics.length > 0) {
      for (let i = 0; i < this.allCharacteristics.length; i++) {
        const obj = this.allCharacteristics[i];
        if (obj['dataType'].toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(obj);
        }
      }
    }
    if (filtered.length == 0) {
      this.characteristicFilter.dataType = query;
      this.searchTerms.next(this.characteristicFilter);
    }
    return filtered;
  }

  addDataType() {
    this.characteristicService.save(this.dataModel).then(result => {
      this.utilities.showSuccessToast('saved-success');
      this.selectedCharacteristic = Object.assign({}, result);
      this.onChangeCharacteristic(this.selectedCharacteristic);
      this.resetDataType();
    })
      .catch(error => this.utilities.showErrorToast(error));
  }

  resetDataType() {
    this.dataModel.maintenanceCharacteristicDataTypeId = null;
    this.dataModel.description = null;
    this.dataModel.dataType = null;
    this.dataModel.plantId = null;
  }
}
