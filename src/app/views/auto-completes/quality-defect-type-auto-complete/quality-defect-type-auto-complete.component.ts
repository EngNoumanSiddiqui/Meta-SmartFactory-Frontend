import {debounceTime, switchMap} from 'rxjs/operators';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subject} from 'rxjs';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { DefectTypeService } from 'app/services/dto-services/defect-type/defect-type.service';
import { UsersService } from 'app/services/users/users.service';


@Component({
  selector: 'quality-defect-type-auto-complete',
  templateUrl: './quality-defect-type-auto-complete.component.html',

})

export class QualityDefectTypeAutoCompleteComponent implements OnInit {

  @Output() selectedDefectTypeEvent = new EventEmitter<any>();

  selectedDefectType;
  selectedDefectTypeId;
  disabled = false;

  @Input() dropdown=true;
  @Input() required: boolean;
  @Input() addIfMissing = false;
  selectedPlant: any;


  @Input('selectedDefectType')
  set a(selectedDefectType) {
    this.selectedDefectType = selectedDefectType;
  }

  @Input('selectedDefectTypeId')
  set b(selectedDefectTypeId) {
    if (this.selectedDefectTypeId !== selectedDefectTypeId) {
      this.getDefectTypeDetail(selectedDefectTypeId);
      this.selectedDefectTypeId = selectedDefectTypeId;
    }

  }

  @Input('disabled')
  set y(disabled) {
    this.disabled = disabled;
  }

  placeholder = 'no-data';
  modal = {active: false};
  filteredDefectType;
  qualityDefectTypeFilter = {
    createDate: null,
    defectTypeCode: null,
    defectTypeId: null,
    defectTypeText: null,
    orderByDirection: null,
    orderByProperty: null,
    plantId: null,
    pageNumber: 1,
    pageSize: 100,
    query: null,
    updateDate: null,
  };


  allDefectTypes;
  private searchTerms = new Subject<any>();

  constructor( private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _userSvc: UsersService,
    private qualityDefectTypeService: DefectTypeService) {

      const setPlant = this._userSvc.getPlant();
      this.selectedPlant = JSON.parse(setPlant);
      if (this.selectedPlant) {
        this.qualityDefectTypeFilter.plantId = this.selectedPlant.plantId;
      }
  }


  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.qualityDefectTypeService.filterDefectType(this.qualityDefectTypeFilter))).subscribe(
      cats => this.initResult(cats['content']),
      error2 => this.initResult([])
    );

    this.searchTerms.next(this.qualityDefectTypeFilter);
  }

  getDefectTypeDetail(qualityDefectTypeId) {
    if (qualityDefectTypeId) {
      this.qualityDefectTypeService.detailDefectType(qualityDefectTypeId).then(rs => {
        this.selectedDefectType = rs;
        this.checkAndAddSelectedDefectType();
      });
    }

  }
  modalShow() {
    this.modal.active = true;
  }

  OnSave(event: any) {
    
    if (event) {
      this.selectedDefectType = event;
      this.allDefectTypes.push(event);
      this.handleDropdownClickForDefectType()
      this.onChangeDefectType(this.selectedDefectType);
      this.modal.active = false;
    }
  }


  private checkAndAddSelectedDefectType() {
    const me = this;
    if (this.selectedDefectType) {
      if (this.filteredDefectType) {
        const ex = this.filteredDefectType.find(it => it.defectTypeId == me.selectedDefectType.defectTypeId);
        const aex = this.allDefectTypes.find(it => it.defectTypeId == me.selectedDefectType.defectTypeId);
        if (!aex) {
          this.filteredDefectType.push(this.selectedDefectType);
          this.filteredDefectType = [...this.filteredDefectType];
        }
        if (!ex) {
          this.allDefectTypes.push(this.selectedDefectType);
        }
      }
      this.selectedDefectTypeEvent.next(this.selectedDefectType);
    }
  }

  private  initResult(res) {
    // this.filteredDefectType = res;
    this.allDefectTypes = res;
    if (res.length > 0) {
      this.placeholder = 'search-defect-type';
    } else {
      this.placeholder = 'no-data';

    }
    this.checkAndAddSelectedDefectType();

  }


  onChangeDefectType(event) {
    if (event && event.hasOwnProperty('defectTypeId')) {
      this.selectedDefectTypeEvent.next(this.selectedDefectType);
    } else {
      this.selectedDefectTypeEvent.next(null);
    }
  }


  searchDefectType(event) {

    this.filteredDefectType = this.filterMatched(event.query);

  }


  handleDropdownClickForDefectType() {

    this.filteredDefectType = [...this.allDefectTypes];

    if (this.filteredDefectType.length == 0) {
      this.qualityDefectTypeFilter.defectTypeCode = null;
      this.searchTerms.next(this.qualityDefectTypeFilter);
    }

  }


  filterMatched(query): any[] {
    const filtered: any[] = [];
    if (this.allDefectTypes && this.allDefectTypes.length > 0) {
      for (let i = 0; i < this.allDefectTypes.length; i++) {
        const obj = this.allDefectTypes[i];
        if (obj['defectTypeCode'].toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(obj);
        }
      }
    }
    if (filtered.length == 0) {
      this.qualityDefectTypeFilter.defectTypeCode = query;
      this.searchTerms.next(this.qualityDefectTypeFilter);
    }
    return filtered;
  }


}
