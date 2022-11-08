import {debounceTime, switchMap} from 'rxjs/operators';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subject} from 'rxjs';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { SamplingTypeService } from 'app/services/dto-services/sampling-type/sampling-type.service';
import { UsersService } from 'app/services/users/users.service';


@Component({
  selector: 'quality-sampling-type-auto-complete',
  templateUrl: './quality-sampling-type-auto-complete.component.html',

})

export class QualitySamplingTypeAutoCompleteComponent implements OnInit {

  @Output() selectedSamplingTypeEvent = new EventEmitter();

  selectedSamplingType;
  selectedSamplingTypeId;
  disabled = false;

  @Input() dropdown = true;
  @Input() required: boolean;
  @Input() addIfMissing = false;
  selectedPlant: any;


  @Input('selectedSamplingType')
  set a(selectedSamplingType) {
    this.selectedSamplingType = selectedSamplingType;
  }

  @Input('selectedSamplingTypeId')
  set b(selectedSamplingTypeId) {
    if (this.selectedSamplingTypeId !== selectedSamplingTypeId) {
      this.getSamplingTypeDetail(selectedSamplingTypeId);
      this.selectedSamplingTypeId = selectedSamplingTypeId;
    }

  }

  @Input('disabled')
  set y(disabled) {
    this.disabled = disabled;
  }

  placeholder = 'no-data';
  modal = {active: false};
  filteredSamplingType;
  qualitySamplingTypeFilter = {
    createDate: null,
    samplingProcedureId: null,
    samplingTypeCode: null,
    samplingTypeId: null,
    samplingTypeText: null,
    orderByDirection: null,
    orderByProperty: null,
    plantId: null,
    pageNumber: 1,
    pageSize: 100,
    query: null,
    updateDate: null,
  };


  allSamplingTypes;
  private searchTerms = new Subject<any>();

  samplingTypeDto = {
    createDate: null,
    samplingTypeCode: null,
    samplingTypeId: null,
    samplingTypeText: null,
    plantId:null,
    updateDate: null
  }
  constructor( private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _userSvc: UsersService,
    private qualitySamplingTypeService: SamplingTypeService) {

      const setPlant = this._userSvc.getPlant();
      this.selectedPlant = JSON.parse(setPlant);
      if (this.selectedPlant) {
        this.qualitySamplingTypeFilter.plantId = this.selectedPlant.plantId;
        this.samplingTypeDto.plantId = this.selectedPlant.plantId;
      }
  }


  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.qualitySamplingTypeService.filterSamplingType(this.qualitySamplingTypeFilter))).subscribe(
      cats => this.initResult(cats['content']),
      error2 => this.initResult([])
    );

    this.searchTerms.next(this.qualitySamplingTypeFilter);
  }

  getSamplingTypeDetail(qualitySamplingTypeId) {
    if (qualitySamplingTypeId) {
      this.qualitySamplingTypeService.detailSamplingType(qualitySamplingTypeId).then(rs => {
        this.selectedSamplingType = rs;
        this.checkAndAddSelectedSamplingType();
      });
    }

  }
  modalShow() {
    this.modal.active = true;
  }

  save(mymodal: any) {
    this.loaderService.showLoader();
    this.qualitySamplingTypeService.saveSamplingType(this.samplingTypeDto).then(
      (result: any) => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        if (result) {
          this.selectedSamplingType = result;
          this.allSamplingTypes.push(result);
          this.handleDropdownClickForSamplingType()
          this.onChangeSamplingType(this.selectedSamplingType);
          this.samplingTypeDto = {
            createDate: null,
            plantId: this.selectedPlant.plantId,
            samplingTypeCode: null,
            samplingTypeId: null,
            samplingTypeText: null,
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


  private checkAndAddSelectedSamplingType() {
    const me = this;
    if (this.selectedSamplingType) {
      if (this.filteredSamplingType) {
        const ex = this.filteredSamplingType.find(it => it.samplingTypeId == me.selectedSamplingType.samplingTypeId);
        const aex = this.allSamplingTypes.find(it => it.samplingTypeId == me.selectedSamplingType.samplingTypeId);
        if (!aex) {
          this.filteredSamplingType.push(this.selectedSamplingType);
          this.filteredSamplingType = [...this.filteredSamplingType];
        }
        if (!ex) {
          this.allSamplingTypes.push(this.selectedSamplingType);
        }
      }
      this.selectedSamplingTypeEvent.next(this.selectedSamplingType);
    }
  }

  private  initResult(res) {
    // this.filteredSamplingType = res;
    this.allSamplingTypes = res;
    if (res.length > 0) {
      this.placeholder = 'search-sampling-type';
    } else {
      this.placeholder = 'no-data';

    }
    this.checkAndAddSelectedSamplingType();

  }


  onChangeSamplingType(event) {
    if (event && event.hasOwnProperty('samplingTypeId')) {
      this.selectedSamplingTypeEvent.next(this.selectedSamplingType);
    } else {
      this.selectedSamplingTypeEvent.next(null);
    }
  }


  searchSamplingType(event) {

    this.filteredSamplingType = this.filterMatched(event.query);

  }


  handleDropdownClickForSamplingType() {

    this.filteredSamplingType = [...this.allSamplingTypes];

    if (this.filteredSamplingType.length == 0) {
      this.qualitySamplingTypeFilter.samplingTypeCode = null;
      this.searchTerms.next(this.qualitySamplingTypeFilter);
    }

  }


  filterMatched(query): any[] {
    const filtered: any[] = [];
    if (this.allSamplingTypes && this.allSamplingTypes.length > 0) {
      for (let i = 0; i < this.allSamplingTypes.length; i++) {
        const obj = this.allSamplingTypes[i];
        if (obj['samplingTypeCode'].toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(obj);
        }
      }
    }
    if (filtered.length == 0) {
      this.qualitySamplingTypeFilter.samplingTypeCode = query;
      this.searchTerms.next(this.qualitySamplingTypeFilter);
    }
    return filtered;
  }


}
