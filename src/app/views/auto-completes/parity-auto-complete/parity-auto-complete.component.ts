import {debounceTime, switchMap} from 'rxjs/operators';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subject} from 'rxjs';
import {UtilitiesService} from 'app/services/utilities.service';
import {LoaderService} from 'app/services/shared/loader.service';
import { UsersService } from 'app/services/users/users.service';
import { ParityService } from 'app/services/dto-services/parity/parity.service';

@Component({
  selector: 'parity-auto-complete',
  templateUrl: './parity-auto-complete.component.html',

})

export class ParityAutoCompleteComponent implements OnInit {

  @Output() selectedParityEvent = new EventEmitter<any>();

  selectedParity;

  @Input() required: boolean;

  @Input() dropdown = true;
  @Input() disabled = false;

  requestParityDto = {
    parityCode: null,
    parityId: null,
    parityName: null,
    plantId: null,
  };
  selectedPlant: any;
  selectedParityCode:  any;
  @Input('selectedParity') set in(selectedParity) {
    if (selectedParity) {
      this.selectedParityCode = selectedParity;
      if(this.allParitys && this.allParitys.length) {
        this.selectedParity = this.allParitys.find(x => x.parityCode === selectedParity || x.parityName === selectedParity);
      }
    } else {
      this.selectedParity = null;
    }
  }
  @Input('language') set inLanguage(language) {
    if (language) {
      this.ParityFilter.language = language;
    } else {
      this.selectedParity = null;
    }
    this.searchTerms.next(this.ParityFilter);
  }

  @Input('plantId') set inplantId(plantId) {
    if (plantId) {
      this.ParityFilter.plantId = plantId;
      this.searchTerms.next(this.ParityFilter);
    } else {
      this.ParityFilter.plantId = null;
    }
  }

  @Input('paritId') set inparitId(paritId) {
    if (paritId) {
      this.getParityDetail(paritId);
    }
  }


  placeholder = 'no-data';

  filteredParity: Array<any>;

  ParityFilter = {
    parityCode: null,
    parityId: null,
    parityName: null,
    language: null,
    orderByDirection: null,
    orderByProperty: null,
    plantId: null,
    pageNumber: 1,
    pageSize: 9999,
    query: null
  };

  @Input() addIfMissing = true;

  modal = {active: false};

  private allParitys: Array<any>;

  private searchTerms = new Subject<any>();

  constructor(
    private _paritySvc: ParityService,
    private loadingService: LoaderService,
    private _userSvc: UsersService,
    private utilities: UtilitiesService) {

    

  }

  modalShow() {
    this.modal.active = true;
  }

  saveParity(myModal) {
    this.loadingService.showLoader();
    this._paritySvc.save(this.requestParityDto).then((result) => {
      if (result) {
        this.selectedParity = result;
        this.loadingService.hideLoader();
        this.allParitys.unshift(result);
        this.onChangeParity(this.selectedParity);
        myModal.hide();
        this.utilities.showSuccessToast('saved-success');
      }

    }).catch(error => {
      this.loadingService.hideLoader();
      this.utilities.showErrorToast(error);
    });
  }
  

  
  getParityDetail(ParityId) {
    if (ParityId) {
      this._paritySvc.getDetail(ParityId).then((rs: any) => {
        this.selectedParity = rs;
      });
    }

  }
  ngOnInit() {

    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this._paritySvc.filterObservable(this.ParityFilter)))
      .subscribe( res => this.initResult(res['content']),error2 => this.initResult([])
    );

    const setPlant = this._userSvc.getPlant();
    this.selectedPlant = JSON.parse(setPlant);
    if (this.selectedPlant) {
      this.ParityFilter.plantId = this.selectedPlant.plantId;
      this.requestParityDto.plantId = this.selectedPlant.plantId;

      this.searchTerms.next(this.ParityFilter);
    }

    
    
  }

  private initResult(res) {
    // this.filteredParity = res;
    this.allParitys = res;
    if (res && res.length > 0) {
      if(this.selectedParityCode) {
        this.selectedParity = this.allParitys.find(x => x.parityCode === this.selectedParityCode || x.parityName === this.selectedParityCode);
      }
      this.placeholder = 'search-parity-code';
    } else {
      this.placeholder = 'no-data';
    }
  }


  onChangeParity(event) {
    if (event && event.hasOwnProperty('parityName')) {
      this.selectedParityEvent.next(this.selectedParity);
    } else {
      this.selectedParityEvent.next(null);
    }
  }

  searchParity(event) {
    this.filteredParity = this.filterMatched(event.query);
    if (this.filteredParity.length == 0) {
      this.ParityFilter.parityName = event.query;
      this.searchTerms.next(this.ParityFilter);
    }
  }

  handleDropdownClickForBatch() {
    this.filteredParity = [...this.allParitys];

    if (this.filteredParity.length == 0) {
      this.ParityFilter.parityCode = null;
      this.ParityFilter.parityName = null;
      this.searchTerms.next(this.ParityFilter);
    }
  }

  filterMatched(query): any[] {
    const filtered: any[] = [];
    if (this.allParitys && this.allParitys.length > 0) {
      for (let i = 0; i < this.allParitys.length; i++) {
        const obj = this.allParitys[i];
        if (obj['parityName'].toLowerCase().indexOf(query.toLowerCase()) >= 0 ||
          obj['parityCode'].toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(obj);
        }
      }
    }
    return filtered;
  }

}
