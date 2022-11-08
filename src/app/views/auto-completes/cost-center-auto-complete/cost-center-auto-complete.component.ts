import {debounceTime, switchMap} from 'rxjs/operators';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subject} from 'rxjs';
import {UtilitiesService} from 'app/services/utilities.service';
import {LoaderService} from 'app/services/shared/loader.service';
import { CostCenterService } from 'app/services/dto-services/cost-center/cost-center.service';
import { UsersService } from 'app/services/users/users.service';

@Component({
  selector: 'cost-center-auto-complete',
  templateUrl: './cost-center-auto-complete.component.html',

})

export class CostCenterAutoCompleteComponent implements OnInit {

  @Output() selectedCostCenterEvent = new EventEmitter<any>();

  selectedCostCenter;

  @Input() required: boolean;

  @Input() dropdown = true;
  @Input() disabled = false;

  requestCostCenterDto = {
    costCenterCode: null,
    costCenterId: null,
    costCenterName: null,
    plantId: null,
  };
  selectedPlant: any;

  @Input('selectedCostCenter') set in(selectedCostCenter) {
    if (selectedCostCenter) {
      this.selectedCostCenter = {CostCenterCode: selectedCostCenter};
    } else {
      this.selectedCostCenter = null;
    }
  }

  @Input('plantId') set inplantId(plantId) {
    if (plantId) {
      this.costCenterFilter.plantId = plantId;
      this.searchTerms.next(this.costCenterFilter);
    } else {
      this.costCenterFilter.plantId = null;
    }
  }

  @Input('costCenterId') set incostCenterId(costCenterId) {
    if (costCenterId) {
      this.getCostCenterDetail(costCenterId);
    }
  }


  placeholder = 'no-data';

  filteredCostCenter: Array<any>;

  costCenterFilter = {
    costCenterCode: null,
    costCenterId: null,
    costCenterName: null,
    orderByDirection: null,
    orderByProperty: null,
    plantId: null,
    pageNumber: 1,
    pageSize: 9999,
    query: null
  };

  @Input() addIfMissing = true;

  modal = {active: false};

  private allCostCenters: Array<any>;

  private searchTerms = new Subject<any>();

  constructor(
    private _costCenterSvc: CostCenterService,
    private loadingService: LoaderService,
    private _userSvc: UsersService,
    private utilities: UtilitiesService) {

    

  }

  modalShow() {
    this.modal.active = true;
  }

  saveCostCenter(myModal) {
    this.loadingService.showLoader();
    this._costCenterSvc.save(this.requestCostCenterDto).then((result) => {
      this.loadingService.hideLoader();
      if (result) {
        this.selectedCostCenter = result;
        this.allCostCenters.unshift(result);
        this.requestCostCenterDto = {
          costCenterCode: null,
          costCenterId: null,
          costCenterName: null,
          plantId: this.selectedPlant?.plantId,
        };
        this.onChangeCostCenter(this.selectedCostCenter);
        myModal.hide();
        this.utilities.showSuccessToast('saved-success');
      }

    }).catch(error => {
      this.loadingService.hideLoader();
      this.utilities.showErrorToast(error);
    });
  }
  

  
  getCostCenterDetail(costCenterId) {
    if (costCenterId) {
      this._costCenterSvc.detail(costCenterId).then((rs: any) => {
        this.selectedCostCenter = rs;
      });
    }

  }
  ngOnInit() {

    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this._costCenterSvc.filterObservable(this.costCenterFilter)))
      .subscribe( res => this.initResult(res['content']),error2 => this.initResult([])
    );

    const setPlant = this._userSvc.getPlant();
    this.selectedPlant = JSON.parse(setPlant);
    if (this.selectedPlant) {
      this.costCenterFilter.plantId = this.selectedPlant.plantId;
      this.requestCostCenterDto.plantId = this.selectedPlant.plantId;

      this.searchTerms.next(this.costCenterFilter);
    }

    
    
  }

  private initResult(res) {
    // this.filteredCostCenter = res;
    this.allCostCenters = res;
    if (res && res.length > 0) {
      this.placeholder = 'search-cost-center';
    } else {
      this.placeholder = 'no-data';
    }
  }


  onChangeCostCenter(event) {
    if (event && event.hasOwnProperty('costCenterId')) {
      this.selectedCostCenterEvent.next(this.selectedCostCenter);
    } else {
      this.selectedCostCenterEvent.next(null);
    }
  }

  searchCostCenter(event) {
    this.filteredCostCenter = this.filterMatched(event.query);
    if (this.filteredCostCenter.length == 0) {
      this.costCenterFilter.costCenterName = event.query;
      this.searchTerms.next(this.costCenterFilter);
    }
  }

  handleDropdownClickForBatch() {
    this.filteredCostCenter = [...this.allCostCenters];

    if (this.filteredCostCenter.length == 0) {
      this.costCenterFilter.costCenterName = null;
      this.costCenterFilter.costCenterCode = null;
      this.searchTerms.next(this.costCenterFilter);
    }
  }

  filterMatched(query): any[] {
    const filtered: any[] = [];
    if (this.allCostCenters && this.allCostCenters.length > 0) {
      for (let i = 0; i < this.allCostCenters.length; i++) {
        const obj = this.allCostCenters[i];
        if (obj['costCenterName'].toLowerCase().indexOf(query.toLowerCase()) >= 0 ||
          obj['costCenterCode'].toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(obj);
        }
      }
    }
    return filtered;
  }

}
