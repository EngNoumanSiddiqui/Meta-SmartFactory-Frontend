import {debounceTime, switchMap} from 'rxjs/operators';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subject} from 'rxjs';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { ControlIndicatorTypeService } from 'app/services/dto-services/inspection-charateristics/control-indicator/control-indicator-type.service';
import { UsersService } from 'app/services/users/users.service';
@Component({
  selector: 'quality-control-indicator-type-auto-complete',
  templateUrl: './quality-control-indicator-type-auto-complete.component.html'
})
export class QualityControlIndicatorTypeAutoCompleteComponent implements OnInit {

  @Output() selectedControlIndicatorTypeEvent = new EventEmitter();

  selectedControlIndicatorType;
  selectedControlIndicatorTypeId;
  disabled = false;

  @Input() dropdown = true;
  @Input() required: boolean;
  @Input() addIfMissing = false;
  selectedPlant: any;


  @Input('selectedControlIndicatorType')
  set a(selectedControlIndicatorType) {
    this.selectedControlIndicatorType = selectedControlIndicatorType;
  }

  @Input('selectedControlIndicatorTypeId')
  set b(selectedControlIndicatorTypeId) {
    if (this.selectedControlIndicatorTypeId !== selectedControlIndicatorTypeId) {
      this.getControlIndicatorTypeDetail(selectedControlIndicatorTypeId);
      this.selectedControlIndicatorTypeId = selectedControlIndicatorTypeId;
    }

  }

  @Input('disabled')
  set y(disabled) {
    this.disabled = disabled;
  }

  placeholder = 'no-data';
  modal = {active: false};
  filteredControlIndicatorType;
  qualityControlIndicatorTypeFilter = {
    controlIndicatorTypeCode: null,
    controlIndicatorTypeId: null,
    controlIndicatorTypeText: null,
    orderByDirection: null,
    orderByProperty: null,
    plantId: null,
    pageNumber: 1,
    pageSize: 100,
    query: null,
  };


  allControlIndicatorTypes;
  private searchTerms = new Subject<any>();

  ControlIndicatorTypeDto = {
    createDate: null,
    controlIndicatorTypeCode: null,
    controlIndicatorTypeId: null,
    plantId: null,
    controlIndicatorTypeText: null,
    updateDate: null
  }
  constructor( private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _userSvc: UsersService,
    private qualityControlIndicatorTypeService: ControlIndicatorTypeService) {

      const setPlant = this._userSvc.getPlant();
      this.selectedPlant = JSON.parse(setPlant);
      if (this.selectedPlant) {
        this.qualityControlIndicatorTypeFilter.plantId = this.selectedPlant.plantId;
        this.ControlIndicatorTypeDto.plantId = this.selectedPlant.plantId;
      }
  }


  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.qualityControlIndicatorTypeService.filterControlIndicatorType(this.qualityControlIndicatorTypeFilter))).subscribe(
      cats => this.initResult(cats['content']),
      error2 => this.initResult([])
    );

    this.searchTerms.next(this.qualityControlIndicatorTypeFilter);
  }

  getControlIndicatorTypeDetail(qualityControlIndicatorTypeId) {
    if (qualityControlIndicatorTypeId) {
      this.qualityControlIndicatorTypeService.detailControlIndicatorType(qualityControlIndicatorTypeId).then(rs => {
        this.selectedControlIndicatorType = rs;
        this.checkAndAddSelectedControlIndicatorType();
      });
    }

  }
  modalShow() {
    this.modal.active = true;
  }

  save(mymodal: any) {
    this.loaderService.showLoader();
    this.qualityControlIndicatorTypeService.saveControlIndicatorType(this.ControlIndicatorTypeDto).then(
      (result: any) => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        if (result) {
          this.selectedControlIndicatorType = result;
          this.allControlIndicatorTypes.push(result);
          this.handleDropdownClickForControlIndicatorType()
          this.onChangeControlIndicatorType(this.selectedControlIndicatorType);
          this.ControlIndicatorTypeDto = {
            createDate: null,
            controlIndicatorTypeCode: null,
            plantId: this.selectedPlant.plantId,
            controlIndicatorTypeId: null,
            controlIndicatorTypeText: null,
            updateDate: null
          }
          mymodal.hide();
        }
      },
      error => {
        this.utilities.showErrorToast(error);
        this.loaderService.hideLoader();
      }
    );

  }


  private checkAndAddSelectedControlIndicatorType() {
    const me = this;
    if (this.selectedControlIndicatorType) {
      if (this.filteredControlIndicatorType) {
        const ex = this.filteredControlIndicatorType.find(it => it.controlIndicatorTypeId == me.selectedControlIndicatorType.controlIndicatorTypeId);
        const aex = this.allControlIndicatorTypes.find(it => it.controlIndicatorTypeId == me.selectedControlIndicatorType.controlIndicatorTypeId);
        if (!aex) {
          this.filteredControlIndicatorType.push(this.selectedControlIndicatorType);
          this.filteredControlIndicatorType = [...this.filteredControlIndicatorType];
        }
        if (!ex) {
          this.allControlIndicatorTypes.push(this.selectedControlIndicatorType);
        }
      }
      this.selectedControlIndicatorTypeEvent.next(this.selectedControlIndicatorType);
    }
  }

  private  initResult(res) {
    // this.filteredControlIndicatorType = res;
    this.allControlIndicatorTypes = res;
    if (res.length > 0) {
      this.placeholder = 'search-control-indicator-type';
    } else {
      this.placeholder = 'no-data';

    }
    this.checkAndAddSelectedControlIndicatorType();

  }


  onChangeControlIndicatorType(event) {
    if (event && event.hasOwnProperty('controlIndicatorTypeId')) {
      this.selectedControlIndicatorTypeEvent.next(this.selectedControlIndicatorType);
    } else {
      this.selectedControlIndicatorTypeEvent.next(null);
    }
  }


  searchControlIndicatorType(event) {

    this.filteredControlIndicatorType = this.filterMatched(event.query);

  }


  handleDropdownClickForControlIndicatorType() {

    this.filteredControlIndicatorType = [...this.allControlIndicatorTypes];

    if (this.filteredControlIndicatorType.length == 0) {
      this.qualityControlIndicatorTypeFilter.controlIndicatorTypeCode = null;
      this.searchTerms.next(this.qualityControlIndicatorTypeFilter);
    }

  }


  filterMatched(query): any[] {
    const filtered: any[] = [];
    if (this.allControlIndicatorTypes && this.allControlIndicatorTypes.length > 0) {
      for (let i = 0; i < this.allControlIndicatorTypes.length; i++) {
        const obj = this.allControlIndicatorTypes[i];
        if (obj['controlIndicatorTypeCode'].toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(obj);
        }
      }
    }
    if (filtered.length == 0) {
      this.qualityControlIndicatorTypeFilter.controlIndicatorTypeCode = query;
      this.searchTerms.next(this.qualityControlIndicatorTypeFilter);
    }
    return filtered;
  }


}
