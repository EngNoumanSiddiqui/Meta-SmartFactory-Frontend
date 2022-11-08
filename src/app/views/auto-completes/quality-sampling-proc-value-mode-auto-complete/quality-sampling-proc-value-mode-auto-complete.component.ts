import {debounceTime, switchMap} from 'rxjs/operators';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subject} from 'rxjs';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { SamplingProcedureValueModeService } from 'app/services/dto-services/sampling-procedure/sampling-procedure-value-mode.service';
import { UsersService } from 'app/services/users/users.service';


@Component({
  selector: 'quality-sampling-proc-value-mode-auto-complete',
  templateUrl: './quality-sampling-proc-value-mode-auto-complete.component.html',

})

export class QualitySamplingProcedureValueModeAutoCompleteComponent implements OnInit {

  @Output() selectedSamplingProcValueModeEvent = new EventEmitter();

  selectedSamplingProcValueMode;
  selectedSamplingProcValueModeId;
  disabled = false;

  @Input() dropdown=true;
  @Input() required: boolean;
  @Input() addIfMissing = false;
  selectedPlant: any;


  @Input('selectedSamplingProcValueMode')
  set a(selectedSamplingProcValueMode) {
    this.selectedSamplingProcValueMode = selectedSamplingProcValueMode;
  }

  @Input('selectedSamplingProcValueModeId')
  set b(selectedSamplingProcValueModeId) {
    if (this.selectedSamplingProcValueModeId !== selectedSamplingProcValueModeId) {
      this.getSamplingProcValueModeDetail(selectedSamplingProcValueModeId);
      this.selectedSamplingProcValueModeId = selectedSamplingProcValueModeId;
    }

  }

  @Input('disabled')
  set y(disabled) {
    this.disabled = disabled;
  }

  placeholder = 'no-data';
  modal = {active: false};
  filteredSamplingProcValueMode;
  qualitySamplingProcValueModeFilter = {
    createDate: null,
    samplingProcedureId: null,
    samplingProcedureValuationModeCode: null,
    samplingProcedureValuationModeId: null,
    samplingProcedureValuationModeText: null,
    orderByDirection: null,
    orderByProperty: null,
    plantId: null,
    pageNumber: 1,
    pageSize: 100,
    query: null,
    updateDate: null,
  };


  allSamplingProcValueModes;
  private searchTerms = new Subject<any>();

  samplingProcValueModeDto = {
    createDate: null,
    samplingProcedureValuationModeCode: null,
    samplingProcedureValuationModeId: null,
    samplingProcedureValuationModeText: null,
    plantId: null,
    updateDate: null
  }
  constructor( private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _userSvc: UsersService,
    private qualitySamplingProcValueModeService: SamplingProcedureValueModeService) {
      const setPlant = this._userSvc.getPlant();
      this.selectedPlant = JSON.parse(setPlant);
      if (this.selectedPlant) {
        this.qualitySamplingProcValueModeFilter.plantId = this.selectedPlant.plantId;
        this.samplingProcValueModeDto.plantId = this.selectedPlant.plantId;
      }
  }


  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.qualitySamplingProcValueModeService.filterSamplingProcedureValueMode(this.qualitySamplingProcValueModeFilter))).subscribe(
      cats => this.initResult(cats['content']),
      error2 => this.initResult([])
    );

    this.searchTerms.next(this.qualitySamplingProcValueModeFilter);
  }

  getSamplingProcValueModeDetail(qualitySamplingProcValueModeId) {
    if (qualitySamplingProcValueModeId) {
      this.qualitySamplingProcValueModeService.detailSamplingProcedureValueMode(qualitySamplingProcValueModeId).then(rs => {
        this.selectedSamplingProcValueMode = rs;
        this.checkAndAddSelectedSamplingProcValueMode();
      });
    }

  }
  modalShow() {
    this.modal.active = true;
  }

  OnSave(event: any) {
    
    if (event) {
      this.selectedSamplingProcValueMode = event;
      this.allSamplingProcValueModes.push(event);
      this.handleDropdownClickForSamplingProcValueMode()
      this.onChangeSamplingProcValueMode(this.selectedSamplingProcValueMode);
      this.modal.active = false;
    }
  }


  private checkAndAddSelectedSamplingProcValueMode() {
    const me = this;
    if (this.selectedSamplingProcValueMode) {
      if (this.filteredSamplingProcValueMode) {
        const ex = this.filteredSamplingProcValueMode.find(it => it.samplingProcedureValuationModeId == me.selectedSamplingProcValueMode.samplingProcedureValuationModeId);
        const aex = this.allSamplingProcValueModes.find(it => it.samplingProcedureValuationModeId == me.selectedSamplingProcValueMode.samplingProcedureValuationModeId);
        if (!aex) {
          this.filteredSamplingProcValueMode.push(this.selectedSamplingProcValueMode);
          this.filteredSamplingProcValueMode = [...this.filteredSamplingProcValueMode];
        }
        if (!ex) {
          this.allSamplingProcValueModes.push(this.selectedSamplingProcValueMode);
        }
      }
      this.selectedSamplingProcValueModeEvent.next(this.selectedSamplingProcValueMode);
    }
  }

  save(mymodal: any) {
    this.loaderService.showLoader();
    this.qualitySamplingProcValueModeService.saveSamplingProcedureValueMode(this.samplingProcValueModeDto).then(
      (result: any) => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        if (result) {
          this.selectedSamplingProcValueMode = result;
          this.allSamplingProcValueModes.push(result);
          this.handleDropdownClickForSamplingProcValueMode()
          this.onChangeSamplingProcValueMode(this.selectedSamplingProcValueMode);
          this.samplingProcValueModeDto = {
            createDate: null,
            samplingProcedureValuationModeCode: null,
            samplingProcedureValuationModeId: null,
            plantId: this.selectedPlant.plantId,
            samplingProcedureValuationModeText: null,
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

  private  initResult(res) {
    // this.filteredSamplingProcValueMode = res;
    this.allSamplingProcValueModes = res;
    if (res.length > 0) {
      this.placeholder = 'search-sampling-valuation-mode';
    } else {
      this.placeholder = 'no-data';

    }
    this.checkAndAddSelectedSamplingProcValueMode();

  }


  onChangeSamplingProcValueMode(event) {
    if (event && event.hasOwnProperty('samplingProcedureValuationModeId')) {
      this.selectedSamplingProcValueModeEvent.next(this.selectedSamplingProcValueMode);
    } else {
      this.selectedSamplingProcValueModeEvent.next(null);
    }
  }


  searchSamplingProcValueMode(event) {

    this.filteredSamplingProcValueMode = this.filterMatched(event.query);

  }


  handleDropdownClickForSamplingProcValueMode() {

    this.filteredSamplingProcValueMode = [...this.allSamplingProcValueModes];

    if (this.filteredSamplingProcValueMode.length == 0) {
      this.qualitySamplingProcValueModeFilter.samplingProcedureValuationModeCode = null;
      this.searchTerms.next(this.qualitySamplingProcValueModeFilter);
    }

  }


  filterMatched(query): any[] {
    const filtered: any[] = [];
    if (this.allSamplingProcValueModes && this.allSamplingProcValueModes.length > 0) {
      for (let i = 0; i < this.allSamplingProcValueModes.length; i++) {
        const obj = this.allSamplingProcValueModes[i];
        if (obj['samplingProcedureValuationModeCode'].toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(obj);
        }
      }
    }
    if (filtered.length == 0) {
      this.qualitySamplingProcValueModeFilter.samplingProcedureValuationModeCode = query;
      this.searchTerms.next(this.qualitySamplingProcValueModeFilter);
    }
    return filtered;
  }


}
