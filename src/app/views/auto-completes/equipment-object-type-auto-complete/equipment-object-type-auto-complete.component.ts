import {debounceTime, switchMap} from 'rxjs/operators';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subject} from 'rxjs';
import {EquipmentObjectTypesService} from '../../../services/dto-services/maintenance-equipment/object-types.service';


@Component({
  selector: 'equipment-object-type-auto-complete',
  templateUrl: './equipment-object-type-auto-complete.component.html',

})

export class EquipmentObjectTypeAutoCompleteComponent implements OnInit {

  @Output() selectedObjectTypeEvent = new EventEmitter();

  selectedObjectType;
  disabled = false;

  @Input() dropdown=true;
  @Input() required: boolean;

  @Input('selectedObjectType')
  set a(selectedObjectType) {
    this.selectedObjectType = selectedObjectType;
  }

  @Input('selectedObjectTypeId')
  set b(selectedObjectTypeId) {
    this.getObjectTypeDetail(selectedObjectTypeId);
  }
  
  @Input('plantId') set setPlantId(plantId) {
    if (plantId) {
      this.objectTypeFilter.plantId = plantId;
      this.searchTerms.next(this.objectTypeFilter);
    } else {
      this.objectTypeFilter.plantId = null;
    }
  }

  @Input('disabled')
  set y(disabled) {
    this.disabled = disabled;
  }

  placeholder = 'no-data';
  filteredObjectType;
  objectTypeFilter = {
    equipmentObjectType: null,
    pageSize: 1000,
    plantId: null,
    pageNumber: 1,
    orderByProperty: 'equipmentObjectType'
  };


  allCategories;
  private searchTerms = new Subject<any>();

  constructor(private objectTypeService: EquipmentObjectTypesService) {
  }


  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.objectTypeService.filterObservable(this.objectTypeFilter))).subscribe(
      cats => this.initResult(cats['content']),
      error2 => this.initResult([])
    );

    this.searchTerms.next(this.objectTypeFilter);
  }

  getObjectTypeDetail(equipmentObjectTypeId) {
    if (equipmentObjectTypeId) {
      this.objectTypeService.getDetail(equipmentObjectTypeId).then(rs => {
        this.selectedObjectType = rs;
        this.checkAndAddSelectedObjectType();
      });
    }

  }

  private checkAndAddSelectedObjectType() {
    const me = this;
    if (this.selectedObjectType) {
      if (this.filteredObjectType) {
        const ex = this.filteredObjectType.find(it => it.equipmentObjectTypeId == me.selectedObjectType.equipmentObjectTypeId);
        const aex = this.allCategories.find(it => it.equipmentObjectTypeId == me.selectedObjectType.equipmentObjectTypeId);
        if (!aex) {
          this.filteredObjectType.push(this.selectedObjectType);
          this.filteredObjectType = [...this.filteredObjectType];
        }
        if (!ex) {
          this.allCategories.push(this.selectedObjectType);
        }
      }
      this.selectedObjectTypeEvent.next(this.selectedObjectType);
    }
  }

  private  initResult(res) {
    // this.filteredObjectType = res;
    this.allCategories = res;
    if (res.length > 0) {
      this.placeholder = 'search-object-Type';
    } else {
      this.placeholder = 'no-data';

    }
    this.checkAndAddSelectedObjectType();

  }

  onChangeObjectType(event) {
    if (event && event.hasOwnProperty('equipmentObjectTypeId')) {

      this.selectedObjectTypeEvent.next(this.selectedObjectType);
    } else {
      this.selectedObjectTypeEvent.next(null);
    }
  }


  searchObjectType(event) {

    this.filteredObjectType = this.filterMatched(event.query);

  }


  handleDropdownClickForObjectType() {

    this.filteredObjectType = [...this.allCategories];
    if ( this.filteredObjectType.length == 0) {
      this.objectTypeFilter.equipmentObjectType = null;
      this.searchTerms.next(this.objectTypeFilter);
    }
  }


  filterMatched(query): any[] {


    const filtered: any[] = [];
    if (this.allCategories && this.allCategories.length > 0) {
      for (let i = 0; i < this.allCategories.length; i++) {
        const obj = this.allCategories[i];
        if (obj['equipmentObjectType'].toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(obj);
        }
      }
    }
    if (filtered.length == 0) {
      this.objectTypeFilter.equipmentObjectType = query;
      this.searchTerms.next(this.objectTypeFilter);
    }

    return filtered;
  }


}
