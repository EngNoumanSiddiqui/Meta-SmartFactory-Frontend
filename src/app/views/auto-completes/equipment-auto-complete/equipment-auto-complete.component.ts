import {debounceTime, switchMap} from 'rxjs/operators';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import { EquipmentService} from '../../../services/dto-services/equipment/equipment.service';
import {Subject} from 'rxjs';
import { UsersService } from 'app/services/users/users.service';


@Component({
  selector: 'equipment-auto-complete',
  templateUrl: './equipment-auto-complete.component.html',

})

export class EquipmentAutoCompleteComponent implements OnInit {

  @Output() selectedEquipmentEvent = new EventEmitter();

  selectedEquipment;
  disabled = false;

  @Input() dropdown=true;
  @Input() required: boolean;
  selectedPlant: any;

  @Input('selectedEquipment')
  set a(selectedEquipment) {
    this.selectedEquipment = selectedEquipment;
  }

  @Input('selectedEquipmentId')
  set b(selectedEquipmentId) {
    this.getEquipmentDetail(selectedEquipmentId);
  }

  @Input('disabled')
  set y(disabled) {
    this.disabled = disabled;
  }

  @Input('plantId') set setplantId(plantId) {
    if (plantId) {
      this.equipmentFilter.planningPlatId = plantId;
      this.searchTerms.next(this.equipmentFilter);
    }
  }

  @Input('workstationId') set setWorkstationId(workstationId) {
    if (workstationId) {
      this.equipmentFilter.workstationId = workstationId;
    } else {
      this.equipmentFilter.workstationId = null;
    }
    this.searchTerms.next(this.equipmentFilter);
  }

  placeholder = 'no-data';
  filteredEquipment;
  equipmentFilter = {
    equipmentName: null,
    planningPlatId: null,
    workstationId: null,
    pageSize: 1000,
    pageNumber: 1,
    orderByProperty: 'equipmentName'
  };


  allEquipments;
  private searchTerms = new Subject<any>();

  constructor(private equipmentService: EquipmentService, private _userSvc: UsersService) {
    const setPlant = this._userSvc.getPlant();
    this.selectedPlant = JSON.parse(setPlant);
    if (this.selectedPlant) {
      this.equipmentFilter.planningPlatId = this.selectedPlant.plantId;
    }
  }


  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.equipmentService.filterSharedObservable(this.equipmentFilter))).subscribe(
      cats => this.initResult(cats['content']),
      error2 => this.initResult([])
    );

    this.searchTerms.next(this.equipmentFilter);
  }

  getEquipmentDetail(equipmentId) {
    if (equipmentId) {
      this.equipmentService.getDetail(equipmentId).then(rs => {
        this.selectedEquipment = rs;
        this.checkAndAddSelectedEquipment();
      });
    }

  }

  private checkAndAddSelectedEquipment() {
    const me = this;
    if (this.selectedEquipment) {
      if (this.filteredEquipment) {
        const ex = this.filteredEquipment.find(it => it.equipmentId == me.selectedEquipment.equipmentId);
        const aex = this.allEquipments.find(it => it.equipmentId == me.selectedEquipment.equipmentId);
        if (!aex) {
          this.filteredEquipment.push(this.selectedEquipment);
          this.filteredEquipment = [...this.filteredEquipment];
        }
        if (!ex) {
          this.allEquipments.push(this.selectedEquipment);
        }
      }
      // this.selectedEquipmentEvent.next(this.selectedEquipment);
    }
  }

  private  initResult(res) {
    // this.filteredEquipment = res;
    this.allEquipments = res;
    if (res.length > 0) {
      this.placeholder = 'search-equipment';
    } else {
      this.placeholder = 'no-data';

    }
    this.checkAndAddSelectedEquipment();

  }


  onChangeEquipment(event) {
    if (event && event.hasOwnProperty('equipmentId')) {

      this.selectedEquipmentEvent.next(this.selectedEquipment);
    } else {
      this.selectedEquipmentEvent.next(null);
    }
  }


  searchEquipment(event) {

    this.filteredEquipment = this.filterMatched(event.query);

  }


  handleDropdownClickForEquipment() {

    this.filteredEquipment = [...this.allEquipments];

    if (this.filteredEquipment.length == 0) {
      this.equipmentFilter.equipmentName = null;
      this.searchTerms.next(this.equipmentFilter);
    }

  }


  filterMatched(query): any[] {


    const filtered: any[] = [];
    if (this.allEquipments && this.allEquipments.length > 0) {
      for (let i = 0; i < this.allEquipments.length; i++) {
        const obj = this.allEquipments[i];
        if (obj['equipmentName'].toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(obj);
        }
      }
    }
    if (filtered.length === 0) {
      this.equipmentFilter.equipmentName = query;
      this.searchTerms.next(this.equipmentFilter);
    }
    return filtered;
  }


}
