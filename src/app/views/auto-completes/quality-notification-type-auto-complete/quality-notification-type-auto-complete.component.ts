import {debounceTime, switchMap} from 'rxjs/operators';
import {Component, EventEmitter, Input, OnInit, Output, OnDestroy} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { QualityNotificationTypeService } from 'app/services/dto-services/quality-notification-type/quality-notification-type.service';
import { UsersService } from 'app/services/users/users.service';

@Component({
  selector: 'quality-notification-type-auto-complete',
  templateUrl: './quality-notification-type-auto-complete.component.html',

})

export class QualityNotificationTypeAutoCompleteComponent implements OnInit {

  @Output() selectedNotificationTypeEvent = new EventEmitter<any>();

  selectedNotificationType;
  selectedNotificationTypeId;
  disabled = false;

  @Input() dropdown = true;
  @Input() appendToBody = false;
  @Input() required: boolean;
  @Input() addIfMissing = false;
  selectedPlant: any;


  @Input('selectedNotificationType')
  set a(selectedNotificationType) {
    this.selectedNotificationType = selectedNotificationType;
  }

  @Input('selectedNotificationTypeId')
  set b(selectedNotificationTypeId) {
    if (this.selectedNotificationTypeId !== selectedNotificationTypeId) {
      this.getNotificationTypeDetail(selectedNotificationTypeId);
      this.selectedNotificationTypeId = selectedNotificationTypeId;
    }

  }

  @Input('disabled')
  set y(disabled) {
    this.disabled = disabled;
  }

  placeholder = 'no-data';
  modal = {active: false};
  filteredNotificationType;
  qualityNotificationTypeFilter = {
    qualityNotificationTypeCode: null,
    qualityNotificationTypeId: null,
    query: null,
    text: null,
    orderByDirection: null,
    plantId: null,
    orderByProperty: 'qualityNotificationTypeId',
    pageSize: 1000,
    pageNumber: 1
  };


  allNotificationTypes;
  private searchTerms = new Subject<any>();

  NotificationTypeNewDto = {
    createDate: null,
    qualityNotificationTypeCode: null,
    qualityNotificationTypeId: null,
    plantId: null,
    text: null,
    updateDate: null,
  };

  constructor( private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _userSvc: UsersService,
    private qualityNotificationTypeService: QualityNotificationTypeService) {
      const setPlant = this._userSvc.getPlant();
      this.selectedPlant = JSON.parse(setPlant);
      if (this.selectedPlant) {
        this.qualityNotificationTypeFilter.plantId = this.selectedPlant.plantId;
        this.NotificationTypeNewDto.plantId = this.selectedPlant.plantId;
      }
  }


  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.qualityNotificationTypeService.filterObservable(this.qualityNotificationTypeFilter))).subscribe(
      cats => this.initResult(cats['content']),
      error2 => this.initResult([])
    );

    this.searchTerms.next(this.qualityNotificationTypeFilter);
  }

  getNotificationTypeDetail(qualityNotificationTypeId) {
    if (qualityNotificationTypeId) {
      this.qualityNotificationTypeService.detail(qualityNotificationTypeId).then(rs => {
        this.selectedNotificationType = rs;
        this.checkAndAddSelectedNotificationType();
      });
    }

  }
  modalShow() {
    this.modal.active = true;
  }

  save(mymodal: any) {
    this.loaderService.showLoader();
    this.qualityNotificationTypeService.save(this.NotificationTypeNewDto).then(
      (result: any) => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        if (result) {
          this.selectedNotificationType = result;
          this.allNotificationTypes.push(result);
          this.handleDropdownClickForNotificationType()
          this.onChangeNotificationType(this.selectedNotificationType);
          this.NotificationTypeNewDto = {
            createDate: null,
            qualityNotificationTypeCode: null,
            qualityNotificationTypeId: null,
            plantId: this.selectedPlant.plantId,
            text: null,
            updateDate: null,
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


  private checkAndAddSelectedNotificationType() {
    const me = this;
    if (this.selectedNotificationType) {
      if (this.filteredNotificationType) {
        const ex = this.filteredNotificationType.find(it => it.qualityNotificationTypeId == me.selectedNotificationType.qualityNotificationTypeId);
        const aex = this.allNotificationTypes.find(it => it.qualityNotificationTypeId == me.selectedNotificationType.qualityNotificationTypeId);
        if (!aex) {
          this.filteredNotificationType.push(this.selectedNotificationType);
          this.filteredNotificationType = [...this.filteredNotificationType];
        }
        if (!ex) {
          this.allNotificationTypes.push(this.selectedNotificationType);
        }
      }
      this.selectedNotificationTypeEvent.next(this.selectedNotificationType);
    }
  }

  private  initResult(res) {
    // this.filteredNotificationType = res;
    this.allNotificationTypes = res;
    if (res.length > 0) {
      this.placeholder = 'search-notification-type';
    } else {
      this.placeholder = 'no-data';

    }
    this.checkAndAddSelectedNotificationType();

  }


  onChangeNotificationType(event) {
    if (event && event.hasOwnProperty('qualityNotificationTypeId')) {

      this.selectedNotificationTypeEvent.next(this.selectedNotificationType);
    } else {
      this.selectedNotificationTypeEvent.next(null);
    }
  }


  searchNotificationType(event) {

    this.filteredNotificationType = this.filterMatched(event.query);

  }


  handleDropdownClickForNotificationType() {

    this.filteredNotificationType = [...this.allNotificationTypes];

    if (this.filteredNotificationType.length == 0) {
      this.qualityNotificationTypeFilter.qualityNotificationTypeCode = null;
      this.searchTerms.next(this.qualityNotificationTypeFilter);
    }

  }


  filterMatched(query): any[] {


    const filtered: any[] = [];
    if (this.allNotificationTypes && this.allNotificationTypes.length > 0) {
      for (let i = 0; i < this.allNotificationTypes.length; i++) {
        const obj = this.allNotificationTypes[i];
        if (obj['qualityNotificationTypeCode'].toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(obj);
        }
      }
    }
    if (filtered.length == 0) {
      this.qualityNotificationTypeFilter.qualityNotificationTypeCode = query;
      this.searchTerms.next(this.qualityNotificationTypeFilter);
    }
    return filtered;
  }


}
