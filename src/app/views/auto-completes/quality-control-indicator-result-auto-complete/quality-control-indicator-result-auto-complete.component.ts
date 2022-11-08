import {debounceTime, switchMap} from 'rxjs/operators';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subject} from 'rxjs';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { ControlIndicatorResultService } from 'app/services/dto-services/inspection-charateristics/control-indicator/control-indicator-result.service';
import { UsersService } from 'app/services/users/users.service';


@Component({
  selector: 'quality-control-indicator-result-auto-complete',
  templateUrl: './quality-control-indicator-result-auto-complete.component.html',

})

export class QualityControlIndicatorResultAutoCompleteComponent implements OnInit {

  @Output() selectedControlIndicatorResultEvent = new EventEmitter();

  selectedControlIndicatorResult;
  selectedControlIndicatorResultId;
  disabled = false;

  @Input() dropdown = true;
  @Input() required: boolean;
  @Input() addIfMissing = false;
  selectedPlant: any;


  @Input('selectedControlIndicatorResult')
  set a(selectedControlIndicatorResult) {
    this.selectedControlIndicatorResult = selectedControlIndicatorResult;
  }

  @Input('selectedControlIndicatorResultId')
  set b(selectedControlIndicatorResultId) {
    if (this.selectedControlIndicatorResultId !== selectedControlIndicatorResultId) {
      this.getControlIndicatorResultDetail(selectedControlIndicatorResultId);
      this.selectedControlIndicatorResultId = selectedControlIndicatorResultId;
    }

  }

  @Input('disabled')
  set y(disabled) {
    this.disabled = disabled;
  }

  placeholder = 'no-data';
  modal = {active: false};
  filteredControlIndicatorResult;
  qualityControlIndicatorResultFilter = {
    controlIndicatorResultCode: null,
    controlIndicatorResultId: null,
    plantId: null,
    controlIndicatorResultText: null,
    orderByDirection: null,
    orderByProperty: null,
    pageNumber: 1,
    pageSize: 100,
    query: null,
  };


  allControlIndicatorResults;
  private searchTerms = new Subject<any>();

  ControlIndicatorResultDto = {
    createDate: null,
    controlIndicatorResultCode: null,
    controlIndicatorResultId: null,
    plantId: null,
    controlIndicatorResultText: null,
    updateDate: null
  }
  constructor( private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _userSvc: UsersService,
    private qualityControlIndicatorResultService: ControlIndicatorResultService) {
      const setPlant = this._userSvc.getPlant();
      this.selectedPlant = JSON.parse(setPlant);
      if (this.selectedPlant) {
        this.qualityControlIndicatorResultFilter.plantId = this.selectedPlant.plantId;
        this.ControlIndicatorResultDto.plantId = this.selectedPlant.plantId;
      }
  }


  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.qualityControlIndicatorResultService.filterControlIndicatorResult(this.qualityControlIndicatorResultFilter))).subscribe(
      cats => this.initResult(cats['content']),
      error2 => this.initResult([])
    );

    this.searchTerms.next(this.qualityControlIndicatorResultFilter);
  }

  getControlIndicatorResultDetail(qualityControlIndicatorResultId) {
    if (qualityControlIndicatorResultId) {
      this.qualityControlIndicatorResultService.detailControlIndicatorResult(qualityControlIndicatorResultId).then(rs => {
        this.selectedControlIndicatorResult = rs;
        this.checkAndAddSelectedControlIndicatorResult();
      });
    }

  }
  modalShow() {
    this.modal.active = true;
  }

  save(mymodal: any) {
    this.loaderService.showLoader();
    this.qualityControlIndicatorResultService.saveControlIndicatorResult(this.ControlIndicatorResultDto).then(
      (result: any) => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        if (result) {
          this.selectedControlIndicatorResult = result;
          this.allControlIndicatorResults.push(result);
          this.handleDropdownClickForControlIndicatorResult()
          this.onChangeControlIndicatorResult(this.selectedControlIndicatorResult);
          this.ControlIndicatorResultDto = {
            createDate: null,
            controlIndicatorResultCode: null,
            plantId: this.selectedPlant?.plantId,
            controlIndicatorResultId: null,
            controlIndicatorResultText: null,
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


  private checkAndAddSelectedControlIndicatorResult() {
    const me = this;
    if (this.selectedControlIndicatorResult) {
      if (this.filteredControlIndicatorResult) {
        const ex = this.filteredControlIndicatorResult.find(it => it.controlIndicatorResultId == me.selectedControlIndicatorResult.controlIndicatorResultId);
        const aex = this.allControlIndicatorResults.find(it => it.controlIndicatorResultId == me.selectedControlIndicatorResult.controlIndicatorResultId);
        if (!aex) {
          this.filteredControlIndicatorResult.push(this.selectedControlIndicatorResult);
          this.filteredControlIndicatorResult = [...this.filteredControlIndicatorResult];
        }
        if (!ex) {
          this.allControlIndicatorResults.push(this.selectedControlIndicatorResult);
        }
      }
      this.selectedControlIndicatorResultEvent.next(this.selectedControlIndicatorResult);
    }
  }

  private  initResult(res) {
    // this.filteredControlIndicatorResult = res;
    this.allControlIndicatorResults = res;
    if (res.length > 0) {
      this.placeholder = 'search-control-indicator-result';
    } else {
      this.placeholder = 'no-data';

    }
    this.checkAndAddSelectedControlIndicatorResult();

  }


  onChangeControlIndicatorResult(event) {
    if (event && event.hasOwnProperty('controlIndicatorResultId')) {
      this.selectedControlIndicatorResultEvent.next(this.selectedControlIndicatorResult);
    } else {
      this.selectedControlIndicatorResultEvent.next(null);
    }
  }


  searchControlIndicatorResult(event) {

    this.filteredControlIndicatorResult = this.filterMatched(event.query);

  }


  handleDropdownClickForControlIndicatorResult() {

    this.filteredControlIndicatorResult = [...this.allControlIndicatorResults];

    if (this.filteredControlIndicatorResult.length == 0) {
      this.qualityControlIndicatorResultFilter.controlIndicatorResultCode = null;
      this.searchTerms.next(this.qualityControlIndicatorResultFilter);
    }

  }


  filterMatched(query): any[] {
    const filtered: any[] = [];
    if (this.allControlIndicatorResults && this.allControlIndicatorResults.length > 0) {
      for (let i = 0; i < this.allControlIndicatorResults.length; i++) {
        const obj = this.allControlIndicatorResults[i];
        if (obj['controlIndicatorResultCode'].toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(obj);
        }
      }
    }
    if (filtered.length == 0) {
      this.qualityControlIndicatorResultFilter.controlIndicatorResultCode = query;
      this.searchTerms.next(this.qualityControlIndicatorResultFilter);
    }
    return filtered;
  }


}
