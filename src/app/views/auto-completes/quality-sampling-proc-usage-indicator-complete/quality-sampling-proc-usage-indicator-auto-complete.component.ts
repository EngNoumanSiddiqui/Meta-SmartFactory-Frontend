import {debounceTime, switchMap} from 'rxjs/operators';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subject} from 'rxjs';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { SamplingProcedureUsageIndicatorService } from 'app/services/dto-services/sampling-procedure/sampling-procedure-usage-indicator.service';
import { UsersService } from 'app/services/users/users.service';


@Component({
  selector: 'quality-sampling-proc-usage-indicator-auto-complete',
  templateUrl: './quality-sampling-proc-usage-indicator-auto-complete.component.html',

})

export class QualitySamplingProcUsageIndicatorAutoCompleteComponent implements OnInit {

  @Output() selectedUsageIndicatorEvent = new EventEmitter();

  selectedUsageIndicator;
  selectedUsageIndicatorId;
  disabled = false;

  @Input() dropdown=true;
  @Input() required: boolean;
  @Input() addIfMissing = false;
  selectedPlant: any;


  @Input('selectedUsageIndicator')
  set a(selectedUsageIndicator) {
    this.selectedUsageIndicator = selectedUsageIndicator;
  }

  @Input('selectedUsageIndicatorId')
  set b(selectedUsageIndicatorId) {
    if (this.selectedUsageIndicatorId !== selectedUsageIndicatorId) {
      this.getUsageIndicatorDetail(selectedUsageIndicatorId);
      this.selectedUsageIndicatorId = selectedUsageIndicatorId;
    }

  }

  @Input('disabled')
  set y(disabled) {
    this.disabled = disabled;
  }

  placeholder = 'no-data';
  modal = {active: false};
  filteredUsageIndicator;
  qualityUsageIndicatorFilter = {
    createDate: null,
    samplingProcedureId: null,
    samplingProcedureUsageIndicatorCode: null,
    samplingProcedureUsageIndicatorId: null,
    samplingProcedureUsageIndicatorText: null,
    orderByDirection: null,
    orderByProperty: null,
    plantId: null,
    pageNumber: 1,
    pageSize: 100,
    query: null,
    updateDate: null,
  };


  allUsageIndicators;
  private searchTerms = new Subject<any>();
  samplingProcUsageIndicatorDto = {
    createDate: null,
    samplingProcedureUsageIndicatorCode: null,
    plantId: null,
    samplingProcedureUsageIndicatorId: null,
    samplingProcedureUsageIndicatorText: null,
    updateDate: null
  }
  constructor( private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _userSvc: UsersService,
    private qualityUsageIndicatorService: SamplingProcedureUsageIndicatorService) {

      const setPlant = this._userSvc.getPlant();
      this.selectedPlant = JSON.parse(setPlant);
      if (this.selectedPlant) {
        this.qualityUsageIndicatorFilter.plantId = this.selectedPlant.plantId;
        this.samplingProcUsageIndicatorDto.plantId = this.selectedPlant.plantId;
      }
  }


  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.qualityUsageIndicatorService.filterSamplingProcedureUsageIndicator(this.qualityUsageIndicatorFilter))).subscribe(
      cats => this.initResult(cats['content']),
      error2 => this.initResult([])
    );

    this.searchTerms.next(this.qualityUsageIndicatorFilter);
  }

  getUsageIndicatorDetail(qualityUsageIndicatorId) {
    if (qualityUsageIndicatorId) {
      this.qualityUsageIndicatorService.detailSamplingProcedureUsageIndicator(qualityUsageIndicatorId).then(rs => {
        this.selectedUsageIndicator = rs;
        this.checkAndAddSelectedUsageIndicator();
      });
    }

  }
  modalShow() {
    this.modal.active = true;
  }

  OnSave(event: any) {
    
    if (event) {
      this.selectedUsageIndicator = event;
      this.allUsageIndicators.push(event);
      this.handleDropdownClickForUsageIndicator()
      this.onChangeUsageIndicator(this.selectedUsageIndicator);
      this.modal.active = false;
    }
  }


  private checkAndAddSelectedUsageIndicator() {
    const me = this;
    if (this.selectedUsageIndicator) {
      if (this.filteredUsageIndicator) {
        const ex = this.filteredUsageIndicator.find(it => it.samplingProcedureUsageIndicatorId == me.selectedUsageIndicator.samplingProcedureUsageIndicatorId);
        const aex = this.allUsageIndicators.find(it => it.samplingProcedureUsageIndicatorId == me.selectedUsageIndicator.samplingProcedureUsageIndicatorId);
        if (!aex) {
          this.filteredUsageIndicator.push(this.selectedUsageIndicator);
          this.filteredUsageIndicator = [...this.filteredUsageIndicator];
        }
        if (!ex) {
          this.allUsageIndicators.push(this.selectedUsageIndicator);
        }
      }
      this.selectedUsageIndicatorEvent.next(this.selectedUsageIndicator);
    }
  }

  private  initResult(res) {
    // this.filteredUsageIndicator = res;
    this.allUsageIndicators = res;
    if (res.length > 0) {
      this.placeholder = 'search-sampling-usage-indicator';
    } else {
      this.placeholder = 'no-data';

    }
    this.checkAndAddSelectedUsageIndicator();

  }


  onChangeUsageIndicator(event) {
    if (event && event.hasOwnProperty('samplingProcedureUsageIndicatorId')) {
      this.selectedUsageIndicatorEvent.next(this.selectedUsageIndicator);
    } else {
      this.selectedUsageIndicatorEvent.next(null);
    }
  }


  searchUsageIndicator(event) {

    this.filteredUsageIndicator = this.filterMatched(event.query);

  }


  handleDropdownClickForUsageIndicator() {

    this.filteredUsageIndicator = [...this.allUsageIndicators];

    if (this.filteredUsageIndicator.length == 0) {
      this.qualityUsageIndicatorFilter.samplingProcedureUsageIndicatorCode = null;
      this.searchTerms.next(this.qualityUsageIndicatorFilter);
    }

  }
  save(mymodal: any) {
    this.loaderService.showLoader();
    this.qualityUsageIndicatorService.saveSamplingProcedureUsageIndicator(this.samplingProcUsageIndicatorDto).then(
      (result: any) => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        if (result) {
          this.selectedUsageIndicator = result;
          this.allUsageIndicators.push(result);
          this.handleDropdownClickForUsageIndicator();
          this.onChangeUsageIndicator(this.selectedUsageIndicator);
          this.samplingProcUsageIndicatorDto = {
            createDate: null,
            samplingProcedureUsageIndicatorCode: null,
            samplingProcedureUsageIndicatorId: null,
            samplingProcedureUsageIndicatorText: null,
            plantId: this.selectedPlant.plantId,
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


  filterMatched(query): any[] {
    const filtered: any[] = [];
    if (this.allUsageIndicators && this.allUsageIndicators.length > 0) {
      for (let i = 0; i < this.allUsageIndicators.length; i++) {
        const obj = this.allUsageIndicators[i];
        if (obj['samplingProcedureUsageIndicatorCode'].toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(obj);
        }
      }
    }
    if (filtered.length == 0) {
      this.qualityUsageIndicatorFilter.samplingProcedureUsageIndicatorCode = query;
      this.searchTerms.next(this.qualityUsageIndicatorFilter);
    }
    return filtered;
  }


}
