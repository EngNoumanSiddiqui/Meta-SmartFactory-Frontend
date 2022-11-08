import {debounceTime, switchMap} from 'rxjs/operators';
import {Component, EventEmitter, Input, OnInit, Output, OnDestroy} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { QualityNotificationService } from 'app/services/dto-services/quality-notification/quality-notification.service';
import { AppStateService } from 'app/services/dto-services/app-state.service';



@Component({
  selector: 'quality-notification-auto-complete',
  templateUrl: './quality-notification-auto-complete.component.html',

})

export class QualityNotificationAutoCompleteComponent implements OnInit, OnDestroy {

  @Output() selectedNotificationEvent = new EventEmitter();

  selectedNotification;
  selectedNotificationId;
  disabled = false;

  @Input() dropdown=true;
  @Input() required: boolean;
  @Input() addIfMissing = false;
  sub: Subscription;


  @Input('selectedNotification')
  set a(selectedNotification) {
    this.selectedNotification = selectedNotification;
  }

  @Input('selectedNotificationId')
  set b(selectedNotificationId) {
    if (this.selectedNotificationId !== selectedNotificationId) {
      this.getNotificationDetail(selectedNotificationId);
      this.selectedNotificationId = selectedNotificationId;
    }

  }

  @Input('disabled')
  set y(disabled) {
    this.disabled = disabled;
  }

  placeholder = 'no-data';
  modal = {active: false};
  filteredNotification;
  qualityNotificationFilter = {
    activityListId: null,
    causeListId: null,
    createDate: null,
    defectRecordingId: null,
    inspectionLotId: null,
    notificationStatus: null,
    orderByDirection: null,
    orderByProperty: 'qualityNotificationCode',
    plantId: null,
    plantName: null,
    purchaseOrderId: null,
    qualityNotificationCode: null,
    qualityNotificationId: null,
    qualityNotificationStatusId: null,
    query: null,
    stockId: null,
    stockName: null,
    stockNo: null,
    taskListId: null,
    updateDate: null,
    pageSize: 1000,
    pageNumber: 1
  };


  allNotifications;
  private searchTerms = new Subject<any>();

  notificationNewDto = {
    createDate: null,
    notificationStatus: null,
    plantId: null,
    plantName: null,
    qualityNotificationCode: null,
    qualityNotificationId: null,
    stockId: null,
    updateDate: null
  };

  constructor( private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private appStateService: AppStateService,
    private qualityNotificationService: QualityNotificationService) {
     
  }


  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.qualityNotificationService.filterNotificationObservable(this.qualityNotificationFilter))).subscribe(
      cats => this.initResult(cats['content']),
      error2 => this.initResult([])
    );


    this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
      if ((res) && res.plantId) {
        this.qualityNotificationFilter.plantId = res.plantId;
        this.qualityNotificationFilter.plantName = res.plantName;
        this.notificationNewDto.plantId = res.plantId;
        this.notificationNewDto.plantName = res.plantName;
        this.searchTerms.next(this.qualityNotificationFilter);
      } else {
        this.qualityNotificationFilter.plantId = null;
        this.qualityNotificationFilter.plantName = null;
      }
      
    });
    // this.searchTerms.next(this.qualityNotificationFilter);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getNotificationDetail(qualityNotificationId) {
    if (qualityNotificationId) {
      this.qualityNotificationService.detailNotification(qualityNotificationId).then(rs => {
        this.selectedNotification = rs;
        this.checkAndAddSelectedNotification();
      });
    }

  }
  modalShow() {
    this.modal.active = true;
  }

  save(mymodal: any) {
    this.loaderService.showLoader();
    this.qualityNotificationService.saveNotification(this.notificationNewDto).then(
      (result: any) => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        if (result) {
          this.selectedNotification = result;
          this.allNotifications.push(result);
          this.handleDropdownClickForNotification()
          this.onChangeNotification(this.selectedNotification);
          this.notificationNewDto = {
            createDate: null,
            notificationStatus: null,
            plantId: this.qualityNotificationFilter.plantId,
            plantName: this.qualityNotificationFilter.plantName,
            qualityNotificationCode: null,
            qualityNotificationId: null,
            stockId: null,
            updateDate: null
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


  private checkAndAddSelectedNotification() {
    const me = this;
    if (this.selectedNotification) {
      if (this.filteredNotification) {
        const ex = this.filteredNotification.find(it => it.qualityNotificationId == me.selectedNotification.qualityNotificationId);
        const aex = this.allNotifications.find(it => it.qualityNotificationId == me.selectedNotification.qualityNotificationId);
        if (!aex) {
          this.filteredNotification.push(this.selectedNotification);
          this.filteredNotification = [...this.filteredNotification];
        }
        if (!ex) {
          this.allNotifications.push(this.selectedNotification);
        }
      }
      this.selectedNotificationEvent.next(this.selectedNotification);
    }
  }

  private  initResult(res) {
    // this.filteredNotification = res;
    this.allNotifications = res;
    if (res.length > 0) {
      this.placeholder = 'search-code-group';
    } else {
      this.placeholder = 'no-data';

    }
    this.checkAndAddSelectedNotification();

  }


  onChangeNotification(event) {
    if (event && event.hasOwnProperty('qualityNotificationId')) {

      this.selectedNotificationEvent.next(this.selectedNotification);
    } else {
      this.selectedNotificationEvent.next(null);
    }
  }


  searchNotification(event) {

    this.filteredNotification = this.filterMatched(event.query);

  }


  handleDropdownClickForNotification() {

    this.filteredNotification = [...this.allNotifications];

    if (this.filteredNotification.length == 0) {
      this.qualityNotificationFilter.qualityNotificationCode = null;
      this.searchTerms.next(this.qualityNotificationFilter);
    }

  }


  filterMatched(query): any[] {


    const filtered: any[] = [];
    if (this.allNotifications && this.allNotifications.length > 0) {
      for (let i = 0; i < this.allNotifications.length; i++) {
        const obj = this.allNotifications[i];
        if (obj['qualityNotificationCode'].toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(obj);
        }
      }
    }
    if (filtered.length == 0) {
      this.qualityNotificationFilter.qualityNotificationCode = query;
      this.searchTerms.next(this.qualityNotificationFilter);
    }
    return filtered;
  }


}
