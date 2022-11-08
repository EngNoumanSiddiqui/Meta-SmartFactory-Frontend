import {debounceTime, switchMap} from 'rxjs/operators';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subject} from 'rxjs';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { ControlIndicatorSampleService } from 'app/services/dto-services/inspection-charateristics/control-indicator/control-indicator-sample.service';
import { UsersService } from 'app/services/users/users.service';


@Component({
  selector: 'quality-control-indicator-sample-auto-complete',
  templateUrl: './quality-control-indicator-sample-auto-complete.component.html',

})

export class QualityControlIndicatorSampleAutoCompleteComponent implements OnInit {

  @Output() selectedControlIndicatorSampleEvent = new EventEmitter();

  selectedControlIndicatorSample;
  selectedControlIndicatorSampleId;
  disabled = false;

  @Input() dropdown = true;
  @Input() required: boolean;
  @Input() addIfMissing = false;
  selectedPlant: any;


  @Input('selectedControlIndicatorSample')
  set a(selectedControlIndicatorSample) {
    this.selectedControlIndicatorSample = selectedControlIndicatorSample;
  }

  @Input('selectedControlIndicatorSampleId')
  set b(selectedControlIndicatorSampleId) {
    if (this.selectedControlIndicatorSampleId !== selectedControlIndicatorSampleId) {
      this.getControlIndicatorSampleDetail(selectedControlIndicatorSampleId);
      this.selectedControlIndicatorSampleId = selectedControlIndicatorSampleId;
    }

  }

  @Input('disabled')
  set y(disabled) {
    this.disabled = disabled;
  }

  placeholder = 'no-data';
  modal = {active: false};
  filteredControlIndicatorSample;
  qualityControlIndicatorSampleFilter = {
    controlIndicatorSampleCode: null,
    controlIndicatorSampleId: null,
    controlIndicatorSampleText: null,
    orderByDirection: null,
    orderByProperty: null,
    plantId: null,
    pageNumber: 1,
    pageSize: 100,
    query: null,
  };


  allControlIndicatorSamples;
  private searchTerms = new Subject<any>();

  ControlIndicatorSampleDto = {
    createDate: null,
    controlIndicatorSampleCode: null,
    plantId: null,
    controlIndicatorSampleId: null,
    controlIndicatorSampleText: null,
    updateDate: null
  }
  constructor( private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _userSvc: UsersService,
    private qualityControlIndicatorSampleService: ControlIndicatorSampleService) {

      const setPlant = this._userSvc.getPlant();
      this.selectedPlant = JSON.parse(setPlant);
      if (this.selectedPlant) {
        this.qualityControlIndicatorSampleFilter.plantId = this.selectedPlant.plantId;
        this.ControlIndicatorSampleDto.plantId = this.selectedPlant.plantId;
      }
  }


  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.qualityControlIndicatorSampleService.filterControlIndicatorSample(this.qualityControlIndicatorSampleFilter))).subscribe(
      cats => this.initResult(cats['content']),
      error2 => this.initResult([])
    );

    this.searchTerms.next(this.qualityControlIndicatorSampleFilter);
  }

  getControlIndicatorSampleDetail(qualityControlIndicatorSampleId) {
    if (qualityControlIndicatorSampleId) {
      this.qualityControlIndicatorSampleService.detailControlIndicatorSample(qualityControlIndicatorSampleId).then(rs => {
        this.selectedControlIndicatorSample = rs;
        this.checkAndAddSelectedControlIndicatorSample();
      });
    }

  }
  modalShow() {
    this.modal.active = true;
  }

  save(mymodal: any) {
    this.loaderService.showLoader();
    this.qualityControlIndicatorSampleService.saveControlIndicatorSample(this.ControlIndicatorSampleDto).then(
      (result: any) => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        if (result) {
          this.selectedControlIndicatorSample = result;
          this.allControlIndicatorSamples.push(result);
          this.handleDropdownClickForControlIndicatorSample()
          this.onChangeControlIndicatorSample(this.selectedControlIndicatorSample);
          this.ControlIndicatorSampleDto = {
            createDate: null,
            controlIndicatorSampleCode: null,
            controlIndicatorSampleId: null,
            plantId: this.selectedPlant?.plantId,
            controlIndicatorSampleText: null,
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


  private checkAndAddSelectedControlIndicatorSample() {
    const me = this;
    if (this.selectedControlIndicatorSample) {
      if (this.filteredControlIndicatorSample) {
        const ex = this.filteredControlIndicatorSample.find(it => it.controlIndicatorSampleId == me.selectedControlIndicatorSample.controlIndicatorSampleId);
        const aex = this.allControlIndicatorSamples.find(it => it.controlIndicatorSampleId == me.selectedControlIndicatorSample.controlIndicatorSampleId);
        if (!aex) {
          this.filteredControlIndicatorSample.push(this.selectedControlIndicatorSample);
          this.filteredControlIndicatorSample = [...this.filteredControlIndicatorSample];
        }
        if (!ex) {
          this.allControlIndicatorSamples.push(this.selectedControlIndicatorSample);
        }
      }
      this.selectedControlIndicatorSampleEvent.next(this.selectedControlIndicatorSample);
    }
  }

  private  initResult(res) {
    // this.filteredControlIndicatorSample = res;
    this.allControlIndicatorSamples = res;
    if (res.length > 0) {
      this.placeholder = 'search-indicator-sample-type';
    } else {
      this.placeholder = 'no-data';

    }
    this.checkAndAddSelectedControlIndicatorSample();

  }


  onChangeControlIndicatorSample(event) {
    if (event && event.hasOwnProperty('controlIndicatorSampleId')) {
      this.selectedControlIndicatorSampleEvent.next(this.selectedControlIndicatorSample);
    } else {
      this.selectedControlIndicatorSampleEvent.next(null);
    }
  }


  searchControlIndicatorSample(event) {

    this.filteredControlIndicatorSample = this.filterMatched(event.query);

  }


  handleDropdownClickForControlIndicatorSample() {

    this.filteredControlIndicatorSample = [...this.allControlIndicatorSamples];

    if (this.filteredControlIndicatorSample.length == 0) {
      this.qualityControlIndicatorSampleFilter.controlIndicatorSampleCode = null;
      this.searchTerms.next(this.qualityControlIndicatorSampleFilter);
    }

  }


  filterMatched(query): any[] {
    const filtered: any[] = [];
    if (this.allControlIndicatorSamples && this.allControlIndicatorSamples.length > 0) {
      for (let i = 0; i < this.allControlIndicatorSamples.length; i++) {
        const obj = this.allControlIndicatorSamples[i];
        if (obj['controlIndicatorSampleCode'].toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(obj);
        }
      }
    }
    if (filtered.length == 0) {
      this.qualityControlIndicatorSampleFilter.controlIndicatorSampleCode = query;
      this.searchTerms.next(this.qualityControlIndicatorSampleFilter);
    }
    return filtered;
  }


}
