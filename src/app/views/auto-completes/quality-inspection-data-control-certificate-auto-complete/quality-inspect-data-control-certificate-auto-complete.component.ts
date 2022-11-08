import {debounceTime, switchMap} from 'rxjs/operators';
import {Component, EventEmitter, Input, OnInit, Output, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { QualityInspectionControlDataCertificationService } from 'app/services/dto-services/quality-inspection-control-data/quality-inspection-control-data.service';
import { UsersService } from 'app/services/users/users.service';


@Component({
  selector: 'quality-inspect-data-control-certificate-auto-complete',
  templateUrl: './quality-inspect-data-control-certificate-auto-complete.component.html',

})

export class QualityInspectionControlDataCertificationAutoCompleteComponent implements OnInit {

  @Output() selectedinspectionControlDataCertificationEvent = new EventEmitter();

  selectedinspectionControlDataCertification;
  selectedinspectionControlDataCertificationId;
  disabled = false;

  @Input() dropdown=true;
  @Input() required: boolean;
  @Input() addIfMissing = false;
  selectedPlant: any;
  @Input('selectedinspectionControlDataCertification')
  set a(selectedinspectionControlDataCertification) {
    this.selectedinspectionControlDataCertification = selectedinspectionControlDataCertification;
  }

  @Input('selectedinspectionControlDataCertificationId')
  set b(selectedinspectionControlDataCertificationId) {
    if (this.selectedinspectionControlDataCertificationId !== selectedinspectionControlDataCertificationId) {
      this.getinspectionControlDataCertificationDetail(selectedinspectionControlDataCertificationId);
      this.selectedinspectionControlDataCertificationId = selectedinspectionControlDataCertificationId;
    }

  }

  @Input('disabled')
  set y(disabled) {
    this.disabled = disabled;
  }

  placeholder = 'no-data';
  modal = {active: false};
  filteredinspectionControlDataCertification;
  qualityinspectionControlDataCertificationFilter = {
    orderByDirection: null,
    orderByProperty: 'inspectionControlDataCertification',
    createDate : null,
    query : null,
    plantId: null,
    text : null,
    updateDate : null,
    inspectionControlDataCertificationCode : null,
    inspectionControlDataCertification : null,
    pageSize: 1000,
    pageNumber: 1
  };
  allinspectionControlDataCertifications;
  private searchTerms = new Subject<any>();

  inspectionControlDataCertificationNewDto = {
    createDate : null,
    text : null,
    updateDate : null,
    plantId: null,
    inspectionControlDataCertificationCode : null,
    inspectionControlDataCertification : null,
  };

  constructor( private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _userSvc: UsersService,
    private qualityInspectionControlDataCertificationService: QualityInspectionControlDataCertificationService) {

      const setPlant = this._userSvc.getPlant();
      this.selectedPlant = JSON.parse(setPlant);
      if (this.selectedPlant) {
        this.qualityinspectionControlDataCertificationFilter.plantId = this.selectedPlant.plantId;
        this.inspectionControlDataCertificationNewDto.plantId = this.selectedPlant.plantId;
      }
  }

  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.qualityInspectionControlDataCertificationService.filter(this.qualityinspectionControlDataCertificationFilter))).subscribe(
      cats => this.initResult(cats['content']),
      error2 => this.initResult([])
    );

    this.searchTerms.next(this.qualityinspectionControlDataCertificationFilter);
  }

  getinspectionControlDataCertificationDetail(inspectionControlDataCertification) {
    if (inspectionControlDataCertification) {
      this.qualityInspectionControlDataCertificationService.detail(inspectionControlDataCertification).then(rs => {
        this.selectedinspectionControlDataCertification = rs;
        this.checkAndAddSelectedinspectionControlDataCertification();
      });
    }

  }
  modalShow() {
    this.modal.active = true;
  }

  save(mymodal: any) {
    this.loaderService.showLoader();
    this.qualityInspectionControlDataCertificationService.save(this.inspectionControlDataCertificationNewDto).then(
      (result: any) => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        if (result) {
          this.selectedinspectionControlDataCertification = result;
          this.allinspectionControlDataCertifications.push(result);
          this.handleDropdownClickForinspectionControlDataCertification()
          this.onChangeinspectionControlDataCertification(this.selectedinspectionControlDataCertification);
          this.inspectionControlDataCertificationNewDto = {
            createDate : null,
            text : null,
            plantId: this.selectedPlant.plantId,
            updateDate : null,
            inspectionControlDataCertification : null,
            inspectionControlDataCertificationCode : null,
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


  private checkAndAddSelectedinspectionControlDataCertification() {
    const me = this;
    if (this.selectedinspectionControlDataCertification) {
      if (this.filteredinspectionControlDataCertification) {
        const ex = this.filteredinspectionControlDataCertification.find(it => it.inspectionControlDataCertification == me.selectedinspectionControlDataCertification.inspectionControlDataCertification);
        const aex = this.allinspectionControlDataCertifications.find(it => it.inspectionControlDataCertification == me.selectedinspectionControlDataCertification.inspectionControlDataCertification);
        if (!aex) {
          this.filteredinspectionControlDataCertification.push(this.selectedinspectionControlDataCertification);
          this.filteredinspectionControlDataCertification = [...this.filteredinspectionControlDataCertification];
        }
        if (!ex) {
          this.allinspectionControlDataCertifications.push(this.selectedinspectionControlDataCertification);
        }
      }
      this.selectedinspectionControlDataCertificationEvent.next(this.selectedinspectionControlDataCertification);
    }
  }

  private  initResult(res) {
    // this.filteredinspectionControlDataCertification = res;
    this.allinspectionControlDataCertifications = res;
    if (res.length > 0) {
      this.placeholder = 'search-code-group';
    } else {
      this.placeholder = 'no-data';

    }
    this.checkAndAddSelectedinspectionControlDataCertification();

  }


  onChangeinspectionControlDataCertification(event) {
    if (event && event.hasOwnProperty('inspectionControlDataCertification')) {

      this.selectedinspectionControlDataCertificationEvent.next(this.selectedinspectionControlDataCertification);
    } else {
      this.selectedinspectionControlDataCertificationEvent.next(null);
    }
  }


  searchinspectionControlDataCertification(event) {

    this.filteredinspectionControlDataCertification = this.filterMatched(event.query);

  }


  handleDropdownClickForinspectionControlDataCertification() {

    this.filteredinspectionControlDataCertification = [...this.allinspectionControlDataCertifications];

    if (this.filteredinspectionControlDataCertification.length == 0) {
      this.qualityinspectionControlDataCertificationFilter.text = null;
      this.searchTerms.next(this.qualityinspectionControlDataCertificationFilter);
    }

  }


  filterMatched(query): any[] {


    const filtered: any[] = [];
    if (this.allinspectionControlDataCertifications && this.allinspectionControlDataCertifications.length > 0) {
      for (let i = 0; i < this.allinspectionControlDataCertifications.length; i++) {
        const obj = this.allinspectionControlDataCertifications[i];
        if (obj['text'].toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(obj);
        }
      }
    }
    if (filtered.length == 0) {
      this.qualityinspectionControlDataCertificationFilter.text = query;
      this.searchTerms.next(this.qualityinspectionControlDataCertificationFilter);
    }
    return filtered;
  }


}
