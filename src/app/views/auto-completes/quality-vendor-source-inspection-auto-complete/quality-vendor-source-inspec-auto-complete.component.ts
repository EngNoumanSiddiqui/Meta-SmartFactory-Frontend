import {debounceTime, switchMap} from 'rxjs/operators';
import {Component, EventEmitter, Input, OnInit, Output, OnDestroy} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { QualityVendorSourceInspectionService } from 'app/services/dto-services/quality-inspection-control-data/quality-vendor-source-inspection.service';
import { UsersService } from 'app/services/users/users.service';


@Component({
  selector: 'quality-vendor-source-inspec-auto-complete',
  templateUrl: './quality-vendor-source-inspec-auto-complete.component.html',

})

export class QualityVendorSourceInspectionAutoCompleteComponent implements OnInit {

  @Output() selectedVendorSourceInspecEvent = new EventEmitter();

  selectedVendorSourceInspec;
  selectedVendorSourceInspecId;
  disabled = false;

  @Input() dropdown=true;
  @Input() required: boolean;
  @Input() addIfMissing = false;
  selectedPlant: any;
  @Input('selectedVendorSourceInspec')
  set a(selectedVendorSourceInspec) {
    this.selectedVendorSourceInspec = selectedVendorSourceInspec;
  }

  @Input('selectedVendorSourceInspecId')
  set b(selectedVendorSourceInspecId) {
    if (this.selectedVendorSourceInspecId !== selectedVendorSourceInspecId) {
      this.getVendorSourceInspecDetail(selectedVendorSourceInspecId);
      this.selectedVendorSourceInspecId = selectedVendorSourceInspecId;
    }

  }

  @Input('disabled')
  set y(disabled) {
    this.disabled = disabled;
  }

  placeholder = 'no-data';
  modal = {active: false};
  filteredVendorSourceInspec;
  qualityVendorSourceInspecFilter = {
    orderByDirection: null,
    orderByProperty: 'vendorSourceInspectionId',
    createDate : null,
    query : null,
    text : null,
    updateDate : null,
    vendorSourceInspectionCode : null,
    vendorSourceInspectionId : null,
    plantId: null,
    pageSize: 1000,
    pageNumber: 1
  };
  allVendorSourceInspecs;
  private searchTerms = new Subject<any>();

  vendorSourceInspecNewDto = {
    createDate : null,
    text : null,
    updateDate : null,
    plantId: null,
    vendorSourceInspectionCode : null,
    vendorSourceInspectionId : null,
  };

  constructor( private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _userSvc: UsersService,
    private qualityVendorSourceInspecService: QualityVendorSourceInspectionService) {
      const setPlant = this._userSvc.getPlant();
      this.selectedPlant = JSON.parse(setPlant);
      if (this.selectedPlant) {
        this.qualityVendorSourceInspecFilter.plantId = this.selectedPlant.plantId;
        this.vendorSourceInspecNewDto.plantId = this.selectedPlant.plantId;
      }
  }

  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.qualityVendorSourceInspecService.filter(this.qualityVendorSourceInspecFilter))).subscribe(
      cats => this.initResult(cats['content']),
      error2 => this.initResult([])
    );

    this.searchTerms.next(this.qualityVendorSourceInspecFilter);
  }

  getVendorSourceInspecDetail(vendorSourceInspectionId) {
    if (vendorSourceInspectionId) {
      this.qualityVendorSourceInspecService.detail(vendorSourceInspectionId).then(rs => {
        this.selectedVendorSourceInspec = rs;
        this.checkAndAddSelectedVendorSourceInspec();
      });
    }

  }
  modalShow() {
    this.modal.active = true;
  }

  save(mymodal: any) {
    this.loaderService.showLoader();
    this.qualityVendorSourceInspecService.save(this.vendorSourceInspecNewDto).then(
      (result: any) => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        if (result) {
          this.selectedVendorSourceInspec = result;
          this.allVendorSourceInspecs.push(result);
          this.handleDropdownClickForVendorSourceInspec()
          this.onChangeVendorSourceInspec(this.selectedVendorSourceInspec);
          this.vendorSourceInspecNewDto = {
            createDate : null,
            plantId: this.selectedPlant.plantId,
            text : null,
            updateDate : null,
            vendorSourceInspectionCode : null,
            vendorSourceInspectionId : null,
          };
          mymodal.hide();
        }
      },
      error => {
        this.utilities.showErrorToast(error);
        this.loaderService.hideLoader();
      }
    );

  }


  private checkAndAddSelectedVendorSourceInspec() {
    const me = this;
    if (this.selectedVendorSourceInspec) {
      if (this.filteredVendorSourceInspec) {
        const ex = this.filteredVendorSourceInspec.find(it => it.vendorSourceInspectionId == me.selectedVendorSourceInspec.vendorSourceInspectionId);
        const aex = this.allVendorSourceInspecs.find(it => it.vendorSourceInspectionId == me.selectedVendorSourceInspec.vendorSourceInspectionId);
        if (!aex) {
          this.filteredVendorSourceInspec.push(this.selectedVendorSourceInspec);
          this.filteredVendorSourceInspec = [...this.filteredVendorSourceInspec];
        }
        if (!ex) {
          this.allVendorSourceInspecs.push(this.selectedVendorSourceInspec);
        }
      }
      this.selectedVendorSourceInspecEvent.next(this.selectedVendorSourceInspec);
    }
  }

  private  initResult(res) {
    // this.filteredVendorSourceInspec = res;
    this.allVendorSourceInspecs = res;
    if (res.length > 0) {
      this.placeholder = 'search-code-group';
    } else {
      this.placeholder = 'no-data';

    }
    this.checkAndAddSelectedVendorSourceInspec();

  }


  onChangeVendorSourceInspec(event) {
    if (event && event.hasOwnProperty('vendorSourceInspectionId')) {

      this.selectedVendorSourceInspecEvent.next(this.selectedVendorSourceInspec);
    } else {
      this.selectedVendorSourceInspecEvent.next(null);
    }
  }


  searchVendorSourceInspec(event) {

    this.filteredVendorSourceInspec = this.filterMatched(event.query);

  }


  handleDropdownClickForVendorSourceInspec() {

    this.filteredVendorSourceInspec = [...this.allVendorSourceInspecs];

    if (this.filteredVendorSourceInspec.length == 0) {
      this.qualityVendorSourceInspecFilter.text = null;
      this.searchTerms.next(this.qualityVendorSourceInspecFilter);
    }

  }


  filterMatched(query): any[] {


    const filtered: any[] = [];
    if (this.allVendorSourceInspecs && this.allVendorSourceInspecs.length > 0) {
      for (let i = 0; i < this.allVendorSourceInspecs.length; i++) {
        const obj = this.allVendorSourceInspecs[i];
        if (obj['text'].toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(obj);
        }
      }
    }
    if (filtered.length == 0) {
      this.qualityVendorSourceInspecFilter.text = query;
      this.searchTerms.next(this.qualityVendorSourceInspecFilter);
    }
    return filtered;
  }


}
