import {debounceTime, switchMap} from 'rxjs/operators';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subject} from 'rxjs';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { SamplingProcedurePointService } from 'app/services/dto-services/sampling-procedure/sampling-procedure-point.service';
import { SamplingProcedureInspectionPoint, SamplingProcedureListItem } from 'app/dto/sampling-procedure/sampling-procedure';
import { ConfirmationService } from 'primeng';
import { TranslateService } from '@ngx-translate/core';
import { UsersService } from 'app/services/users/users.service';


@Component({
  selector: 'quality-sampling-proc-insp-point-auto-complete',
  templateUrl: './quality-sampling-proc-insp-point-auto-complete.component.html',

})

export class QualitySamplingProcedureInspectionPointAutoCompleteComponent implements OnInit {

  @Output() selectedSamplingProcInspPointEvent = new EventEmitter();

  selectedSamplingProcInspPoint;
  selectedSamplingProcInspPointId;
  disabled = false;

  @Input() dropdown=true;
  @Input() required: boolean;
  @Input() addIfMissing = false;
  selectedDetailIndex: number;
  selectedPlant: any;


  @Input('selectedSamplingProcInspPoint')
  set a(selectedSamplingProcInspPoint) {
    this.selectedSamplingProcInspPoint = selectedSamplingProcInspPoint;
  }

  @Input('selectedSamplingProcInspPointId')
  set b(selectedSamplingProcInspPointId) {
    if (this.selectedSamplingProcInspPointId !== selectedSamplingProcInspPointId) {
      this.getSamplingProcInspPointDetail(selectedSamplingProcInspPointId);
      this.selectedSamplingProcInspPointId = selectedSamplingProcInspPointId;
    }

  }

  @Input('disabled')
  set y(disabled) {
    this.disabled = disabled;
  }

  placeholder = 'no-data';
  modal = {active: false};
  params = {
    dialog: {title: '', inputValue: '', visible: false}
  };
  filteredSamplingProcInspPoint;
  qualitySamplingProcInspPointFilter = {
    createDate: null,
    samplingProcedureId: null,
    samplingProcedurePointCode: null,
    samplingProcedurePointId: null,
    samplingProcedurePointText: null,
    plantId: null,
    orderByDirection: null,
    orderByProperty: null,
    pageNumber: 1,
    pageSize: 100,
    query: null,
    updateDate: null,
  };


  allSamplingProcInspPoints;
  private searchTerms = new Subject<any>();

  samplingProcInspPointDto = new SamplingProcedureInspectionPoint();
  samplingProcedureListItem = new SamplingProcedureListItem();

  constructor( private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _confirmationSvc: ConfirmationService,
    private _translateSvc: TranslateService,
    private _userSvc: UsersService,
    private qualitySamplingProcInspPointService: SamplingProcedurePointService) {

      const setPlant = this._userSvc.getPlant();
      this.selectedPlant = JSON.parse(setPlant);
      if (this.selectedPlant) {
        this.qualitySamplingProcInspPointFilter.plantId = this.selectedPlant.plantId;
        this.samplingProcInspPointDto.plantId = this.selectedPlant.plantId;
      }
  }


  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.qualitySamplingProcInspPointService.filterSamplingProcedurePoint(this.qualitySamplingProcInspPointFilter))).subscribe(
      cats => this.initResult(cats['content']),
      error2 => this.initResult([])
    );

    this.searchTerms.next(this.qualitySamplingProcInspPointFilter);
  }

  getSamplingProcInspPointDetail(qualitySamplingProcInspPointId) {
    if (qualitySamplingProcInspPointId) {
      this.qualitySamplingProcInspPointService.detailSamplingProcedurePoint(qualitySamplingProcInspPointId).then(rs => {
        this.selectedSamplingProcInspPoint = rs;
        this.checkAndAddSelectedSamplingProcInspPoint();
      });
    }

  }
  modalShow() {
    this.modal.active = true;
  }

  openSampleProcedureDetailsModal(index) {
    this.params.dialog.title = 'Sampling Procedure Details';
    this.params.dialog.visible = true;
    this.selectedDetailIndex = index;
    if (index < 0) {
      this.samplingProcedureListItem = new SamplingProcedureListItem();
      this.samplingProcedureListItem.plantId = this.selectedPlant.plantId;
    } else {
      this.samplingProcedureListItem = Object.assign({}, this.samplingProcInspPointDto.samplingProcedureList[index]);
      this.samplingProcedureListItem.plantId = this.selectedPlant.plantId;
    }
  }

  deleteSampleProcedureDetailsFromList(index) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this.samplingProcInspPointDto.samplingProcedureList.splice(index, 1);
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    })
  }
  // OnSave(event: any) {
    
  //   if (event) {
  //     this.selectedSamplingProcInspPoint = event;
  //     this.allSamplingProcInspPoints.push(event);
  //     this.handleDropdownClickForSamplingProcInspPoint()
  //     this.onChangeSamplingProcInspPoint(this.selectedSamplingProcInspPoint);
  //     this.modal.active = false;
  //   }
  // }


  private checkAndAddSelectedSamplingProcInspPoint() {
    const me = this;
    if (this.selectedSamplingProcInspPoint) {
      if (this.filteredSamplingProcInspPoint) {
        const ex = this.filteredSamplingProcInspPoint.find(it => it.samplingProcedurePointId == me.selectedSamplingProcInspPoint.samplingProcedurePointId);
        const aex = this.allSamplingProcInspPoints.find(it => it.samplingProcedurePointId == me.selectedSamplingProcInspPoint.samplingProcedurePointId);
        if (!aex) {
          this.filteredSamplingProcInspPoint.push(this.selectedSamplingProcInspPoint);
          this.filteredSamplingProcInspPoint = [...this.filteredSamplingProcInspPoint];
        }
        if (!ex) {
          this.allSamplingProcInspPoints.push(this.selectedSamplingProcInspPoint);
        }
      }
      this.selectedSamplingProcInspPointEvent.next(this.selectedSamplingProcInspPoint);
    }
  }

  reset() {
    this.samplingProcInspPointDto = new SamplingProcedureInspectionPoint();
    this.samplingProcInspPointDto.plantId = this.selectedPlant.plantId;
  }

  onselectSamplingType(event) {
    if (event) {
      this.samplingProcedureListItem.samplingTypeId = event.samplingTypeId;
      this.samplingProcedureListItem.samplingTypeName = event.samplingTypeCode;
    } else {
      this.samplingProcedureListItem.samplingTypeId = null;
      this.samplingProcedureListItem.samplingTypeName = null;
    }
  }
  onselectSamplingProcValueMode(event) {
    if (event) {
      this.samplingProcedureListItem.samplingProcedureValuationModeId = event.samplingProcedureValuationModeId;
      this.samplingProcedureListItem.samplingProcedureValuationModeName = event.samplingProcedureValuationModeCode;
    } else {
      this.samplingProcedureListItem.samplingProcedureValuationModeId = null;
      this.samplingProcedureListItem.samplingProcedureValuationModeName = null;
    }
  }
  AddInsprocedureSampleItem() {

    const cloneOfNewOrderDetailListItem = Object.assign({}, this.samplingProcedureListItem);
    if (this.selectedDetailIndex < 0) {
      // add
      this.samplingProcInspPointDto.samplingProcedureList.push(cloneOfNewOrderDetailListItem);
    } else {
      // update
      this.samplingProcInspPointDto.samplingProcedureList[this.selectedDetailIndex] = cloneOfNewOrderDetailListItem;
    }

    this.params.dialog.visible = false;

  }

  save(mymodal: any) {
    this.loaderService.showLoader();
    
    this.qualitySamplingProcInspPointService.saveSamplingProcedurePoint(this.samplingProcInspPointDto).then(
      (result: any) => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        if (result) {
          this.selectedSamplingProcInspPoint = result;
          this.allSamplingProcInspPoints.push(result);
          this.handleDropdownClickForSamplingProcInspPoint()
          this.onChangeSamplingProcInspPoint(this.selectedSamplingProcInspPoint);
          this.samplingProcInspPointDto = new SamplingProcedureInspectionPoint();
          this.samplingProcInspPointDto.plantId = this.selectedPlant.plantId;
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
    // this.filteredSamplingProcInspPoint = res;
    this.allSamplingProcInspPoints = res;
    if (res.length > 0) {
      this.placeholder = 'search-sampling-valuation-mode';
    } else {
      this.placeholder = 'no-data';

    }
    this.checkAndAddSelectedSamplingProcInspPoint();

  }


  onChangeSamplingProcInspPoint(event) {
    if (event && event.hasOwnProperty('samplingProcedurePointId')) {
      this.selectedSamplingProcInspPointEvent.next(this.selectedSamplingProcInspPoint);
    } else {
      this.selectedSamplingProcInspPointEvent.next(null);
    }
  }


  searchSamplingProcInspPoint(event) {

    this.filteredSamplingProcInspPoint = this.filterMatched(event.query);

  }


  handleDropdownClickForSamplingProcInspPoint() {

    this.filteredSamplingProcInspPoint = [...this.allSamplingProcInspPoints];

    if (this.filteredSamplingProcInspPoint.length == 0) {
      this.qualitySamplingProcInspPointFilter.samplingProcedurePointCode = null;
      this.searchTerms.next(this.qualitySamplingProcInspPointFilter);
    }

  }


  filterMatched(query): any[] {
    const filtered: any[] = [];
    if (this.allSamplingProcInspPoints && this.allSamplingProcInspPoints.length > 0) {
      for (let i = 0; i < this.allSamplingProcInspPoints.length; i++) {
        const obj = this.allSamplingProcInspPoints[i];
        if (obj['samplingProcedurePointCode'].toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(obj);
        }
      }
    }
    if (filtered.length == 0) {
      this.qualitySamplingProcInspPointFilter.samplingProcedurePointCode = query;
      this.searchTerms.next(this.qualitySamplingProcInspPointFilter);
    }
    return filtered;
  }


}
