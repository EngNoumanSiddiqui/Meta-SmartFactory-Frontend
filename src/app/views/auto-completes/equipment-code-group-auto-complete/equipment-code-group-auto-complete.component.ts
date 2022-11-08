import {debounceTime, switchMap} from 'rxjs/operators';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subject} from 'rxjs';
import {EquipmentCodeGroupService} from '../../../services/dto-services/maintenance-equipment/code-group.service';


@Component({
  selector: 'equipment-code-group-auto-complete',
  templateUrl: './equipment-code-group-auto-complete.component.html',

})

export class EquipmentCodeGroupAutoCompleteComponent implements OnInit {

  @Output() selectedCodeGroupEvent = new EventEmitter();

  selectedCodeGroup;
  selectedCodeGroupId;
  disabled = false;

  @Input() dropdown=true;
  @Input() required: boolean;

  @Input('selectedCodeGroup')
  set a(selectedCodeGroup) {
    this.selectedCodeGroup = selectedCodeGroup;
  }

  @Input('selectedCodeGroupId')
  set b(selectedCodeGroupId) {
    if (this.selectedCodeGroupId !== selectedCodeGroupId) {
      this.getCodeGroupDetail(selectedCodeGroupId);
      this.selectedCodeGroupId = selectedCodeGroupId;
    }

  }

  @Input('disabled')
  set y(disabled) {
    this.disabled = disabled;
  }

  @Input('plantId') set setPlantId(plantId) {
    if (plantId) {
      this.equipmentFilter.plantId = plantId;
      this.searchTerms.next(this.equipmentFilter);
    }
  }

  placeholder = 'no-data';
  filteredCodeGroup;
  equipmentFilter = {
    shortText: null,
    pageSize: 1000,
    pageNumber: 1,
    orderByProperty: 'shortText',
    plantId: null,
  };


  allCodeGroups;
  private searchTerms = new Subject<any>();

  constructor(private equipmentService: EquipmentCodeGroupService) {
  }


  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.equipmentService.filterObservable(this.equipmentFilter))).subscribe(
      cats => this.initResult(cats['content']),
      error2 => this.initResult([])
    );

    this.searchTerms.next(this.equipmentFilter);
  }

  getCodeGroupDetail(equipmentCodeGroupId) {
    if (equipmentCodeGroupId) {
      this.equipmentService.getDetail(equipmentCodeGroupId).then(rs => {
        this.selectedCodeGroup = rs;
        this.checkAndAddSelectedCodeGroup();
      });
    }

  }

  private checkAndAddSelectedCodeGroup() {
    const me = this;
    if (this.selectedCodeGroup) {
      if (this.filteredCodeGroup) {
        const ex = this.filteredCodeGroup.find(it => it.equipmentCodeGroupId == me.selectedCodeGroup.equipmentCodeGroupId);
        const aex = this.allCodeGroups.find(it => it.equipmentCodeGroupId == me.selectedCodeGroup.equipmentCodeGroupId);
        if (!aex) {
          this.filteredCodeGroup.push(this.selectedCodeGroup);
          this.filteredCodeGroup = [...this.filteredCodeGroup];
        }
        if (!ex) {
          this.allCodeGroups.push(this.selectedCodeGroup);
        }
      }
      this.selectedCodeGroupEvent.next(this.selectedCodeGroup);
    }
  }

  private  initResult(res) {
    // this.filteredCodeGroup = res;
    this.allCodeGroups = res;
    if (res.length > 0) {
      this.placeholder = 'search-code-group';
    } else {
      this.placeholder = 'no-data';

    }
    this.checkAndAddSelectedCodeGroup();

  }


  onChangeCodeGroup(event) {
    if (event && event.hasOwnProperty('equipmentCodeGroupId')) {

      this.selectedCodeGroupEvent.next(this.selectedCodeGroup);
    } else {
      this.selectedCodeGroupEvent.next(null);
    }
  }


  searchCodeGroup(event) {

    this.filteredCodeGroup = this.filterMatched(event.query);

  }


  handleDropdownClickForCodeGroup() {

    this.filteredCodeGroup = [...this.allCodeGroups];

    if (this.filteredCodeGroup.length == 0) {
      this.equipmentFilter.shortText = null;
      this.searchTerms.next(this.equipmentFilter);
    }

  }


  filterMatched(query): any[] {


    const filtered: any[] = [];
    if (this.allCodeGroups && this.allCodeGroups.length > 0) {
      for (let i = 0; i < this.allCodeGroups.length; i++) {
        const obj = this.allCodeGroups[i];
        if (obj['shortText'].toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(obj);
        }
      }
    }
    if (filtered.length == 0) {
      this.equipmentFilter.shortText = query;
      this.searchTerms.next(this.equipmentFilter);
    }
    return filtered;
  }


}
