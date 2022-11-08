import { debounceTime, switchMap } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { InspectionOperationsService } from 'app/services/dto-services/inspection-operations/inspection-operations.service';
import { UsersService } from 'app/services/users/users.service';


@Component({
  selector: 'quality-inspection-operation-auto-complete',
  templateUrl: './quality-inspection-operation-auto-complete.component.html',

})

export class QualityInspectionOperationAutoCompleteComponent implements OnInit {

  @Output() selectedInspectionOperationEvent = new EventEmitter<any>();

  selectedInspectionOperation;

  selectedInspectionOperationId;

  disabled = false;

  @Input() dropdown = true;

  @Input() required: boolean;

  @Input() addIfMissing = false;
  selectedPlant: any;


  @Input('selectedInspectionOperation')
  set a(selectedInspectionOperation) {
    this.selectedInspectionOperation = selectedInspectionOperation;
  }

  @Input('selectedInspectionOperationId') set b(selectedInspectionOperationId) {
    if (this.selectedInspectionOperationId !== selectedInspectionOperationId) {
      this.getNotificationDetail(selectedInspectionOperationId);
      this.selectedInspectionOperationId = selectedInspectionOperationId;
    }
  }

  @Input('disabled')
  set y(disabled) {
    this.disabled = disabled;
  }

  placeholder = 'no-data';

  modal = { active: false };

  filterInspectionOperation;

  InspectionOperationFilter = {
    createDate:  null,
    inspectionOperationCode:  null,
    inspectionOperationId:  null,
    inspectionOperationName:  null,
    inspectionOperationText:  null,
    query:  null,
    plantId: null,
    updateDate:  null,
    orderByProperty: null,
    orderByDirection: 'desc',
    pageNumber: 1,
    pageSize: 1000
  };


  allInspections;

  private searchTerms = new Subject<any>();


  inspectionOperations: [] = [];

  constructor(
    private _inspectionOperationsSvc: InspectionOperationsService, private _userSvc: UsersService) {
      const setPlant = this._userSvc.getPlant();
      this.selectedPlant = JSON.parse(setPlant);
      if (this.selectedPlant) {
        this.InspectionOperationFilter.plantId = this.selectedPlant.plantId;
        // this.inspectionControlDataCertificationNewDto.plantId = this.selectedPlant.plantId;
      }
  }


  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this._inspectionOperationsSvc.filterInspectionOperation(this.InspectionOperationFilter))).subscribe(
        cats => this.initResult(cats['content']),
        error2 => this.initResult([])
      );

    this.searchTerms.next(this.InspectionOperationFilter);
  }

  getNotificationDetail(qualityNotificationId) {
    if (qualityNotificationId) {
      this._inspectionOperationsSvc.detailInspectionOperation(qualityNotificationId).then(rs => {
        this.selectedInspectionOperation = rs;
        this.checkAndAddselectedInspectionOperation();
      });
    }

  }
  modalShow() {
    this.modal.active = true;
  }
  save(result, mymodal: any) {
    
    this.selectedInspectionOperation = result;
    this.allInspections.push(result);
    this.handleDropdownClickForNotification()
    this.onChangeNotification(this.selectedInspectionOperation);
    mymodal.hide();
  }


  private checkAndAddselectedInspectionOperation() {
    const me = this;
    if (this.selectedInspectionOperation) {
      if (this.filterInspectionOperation) {
        const ex = this.filterInspectionOperation.find(it => it.inspectionOperationId == me.selectedInspectionOperation.inspectionOperationId);
        const aex = this.allInspections.find(it => it.inspectionOperationId == me.selectedInspectionOperation.inspectionOperationId);
        if (!aex) {
          this.filterInspectionOperation.push(this.selectedInspectionOperation);
          this.filterInspectionOperation = [...this.filterInspectionOperation];
        }
        if (!ex) {
          this.allInspections.push(this.selectedInspectionOperation);
        }
      }
      this.selectedInspectionOperationEvent.next(this.selectedInspectionOperation);
    }
  }

  private initResult(res) {
    // this.filterInspectionOperation = res;
    this.allInspections = res;
    if (res.length > 0) {
      this.placeholder = 'search-inspection-operation';
    } else {
      this.placeholder = 'no-data';

    }
    this.checkAndAddselectedInspectionOperation();

  }


  onChangeNotification(event) {
    if (event && event.hasOwnProperty('inspectionOperationId')) {

      this.selectedInspectionOperationEvent.next(this.selectedInspectionOperation);
    } else {
      this.selectedInspectionOperationEvent.next(null);
    }
  }


  searchNotification(event) {

    this.filterInspectionOperation = this.filterMatched(event.query);

  }


  handleDropdownClickForNotification() {

    this.filterInspectionOperation = [...this.allInspections];

    if (this.filterInspectionOperation.length == 0) {
      this.InspectionOperationFilter.inspectionOperationName = null;
      this.searchTerms.next(this.InspectionOperationFilter);
    }

  }


  filterMatched(query): any[] {


    const filtered: any[] = [];
    if (this.allInspections && this.allInspections.length > 0) {
      for (let i = 0; i < this.allInspections.length; i++) {
        const obj = this.allInspections[i];
        if (obj['inspectionOperationName'].toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(obj);
        }
      }
    }
    if (filtered.length == 0) {
      this.InspectionOperationFilter.inspectionOperationName = query;
      this.searchTerms.next(this.InspectionOperationFilter);
    }
    return filtered;
  }
}
