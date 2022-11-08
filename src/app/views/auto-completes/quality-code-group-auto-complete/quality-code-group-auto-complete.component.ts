import {debounceTime, switchMap} from 'rxjs/operators';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subject} from 'rxjs';
import { QualityCodeGroupService } from 'app/services/dto-services/quality-code-group/quality-code-group.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { UsersService } from 'app/services/users/users.service';


@Component({
  selector: 'quality-code-group-auto-complete',
  templateUrl: './quality-code-group-auto-complete.component.html',

})

export class QualityCodeGroupAutoCompleteComponent implements OnInit {

  @Output() selectedCodeGroupEvent = new EventEmitter();

  selectedCodeGroup;
  selectedCodeGroupId;
  disabled = false;

  @Input() dropdown=true;
  @Input() required: boolean;
  @Input() addIfMissing = false;
  selectedPlant: any;

  @Input('selectedCodeGroup')
  set a(selectedCodeGroup) {
    this.selectedCodeGroup = selectedCodeGroup;
  }

  @Input('selectedCodeGroupId')
  set b(selectedCodeGroupId) {
    if (this.selectedCodeGroupId !== selectedCodeGroupId) {
      this.getCodeGroupDetail(selectedCodeGroupId);
      this.selectedCodeGroupId = selectedCodeGroupId;
    }

  }

  @Input('disabled')
  set y(disabled) {
    this.disabled = disabled;
  }

  placeholder = 'no-data';
  modal = {active: false};
  filteredCodeGroup;
  qualityCodeGroupFilter = {
    activityId: null,
    plantId: null,
    causeId: null,
    codeGroupCode: null,
    codeGroupId: null,
    codeGroupText: null,
    createDate: null,
    defectRecordingId: null,
    orderByDirection: 'asc',
    orderByProperty: 'codeGroupCode',
    query: null,
    taskId: null,
    updateDate: null,
    pageSize: 1000,
    pageNumber: 1
  };


  allCodeGroups;
  private searchTerms = new Subject<any>();

  codeGroupDto = {
    codeGroupCode: null,
    plantId: null,
    codeGroupId: null,
    codeGroupText: null,
    createDate: null,
    updateDate: null
  };

  constructor(  private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _userSvc: UsersService,
    private qualityCodeGroupService: QualityCodeGroupService) {

      const setPlant = this._userSvc.getPlant();
      this.selectedPlant = JSON.parse(setPlant);
      if (this.selectedPlant) {
        this.qualityCodeGroupFilter.plantId = this.selectedPlant.plantId;
        this.codeGroupDto.plantId = this.selectedPlant.plantId;
      }
  }


  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.qualityCodeGroupService.filterObservable(this.qualityCodeGroupFilter))).subscribe(
      cats => this.initResult(cats['content']),
      error2 => this.initResult([])
    );

    this.searchTerms.next(this.qualityCodeGroupFilter);
  }

  getCodeGroupDetail(qualityCodeGroupId) {
    if (qualityCodeGroupId) {
      this.qualityCodeGroupService.get(qualityCodeGroupId).then(rs => {
        this.selectedCodeGroup = rs;
        this.checkAndAddSelectedCodeGroup();
      });
    }

  }
  modalShow() {
    this.modal.active = true;
  }

  save(mymodal: any) {
    this.loaderService.showLoader();
    this.qualityCodeGroupService.save(this.codeGroupDto).then(
      (result: any) => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        if (result) {
          this.selectedCodeGroup = result;
          this.allCodeGroups.push(result);
          this.handleDropdownClickForCodeGroup()
          this.onChangeCodeGroup(this.selectedCodeGroup);
          this.codeGroupDto = {
            codeGroupCode: null,
            codeGroupId: null,
            plantId: this.selectedPlant?.plantId,
            codeGroupText: null,
            createDate: null,
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


  private checkAndAddSelectedCodeGroup() {
    const me = this;
    if (this.selectedCodeGroup) {
      if (this.filteredCodeGroup) {
        const ex = this.filteredCodeGroup.find(it => it.codeGroupId == me.selectedCodeGroup.codeGroupId);
        const aex = this.allCodeGroups.find(it => it.codeGroupId == me.selectedCodeGroup.codeGroupId);
        if (!aex) {
          this.filteredCodeGroup.push(this.selectedCodeGroup);
          this.filteredCodeGroup = [...this.filteredCodeGroup];
        }
        if (!ex) {
          this.allCodeGroups.push(this.selectedCodeGroup);
        }
      }
      this.selectedCodeGroupEvent.next(this.selectedCodeGroup);
    }
  }

  private  initResult(res) {
    // this.filteredCodeGroup = res;
    this.allCodeGroups = res;
    if (res.length > 0) {
      this.placeholder = 'search-code-group';
    } else {
      this.placeholder = 'no-data';

    }
    this.checkAndAddSelectedCodeGroup();

  }


  onChangeCodeGroup(event) {
    if (event && event.hasOwnProperty('codeGroupId')) {

      this.selectedCodeGroupEvent.next(this.selectedCodeGroup);
    } else {
      this.selectedCodeGroupEvent.next(null);
    }
  }


  searchCodeGroup(event) {

    this.filteredCodeGroup = this.filterMatched(event.query);

  }


  handleDropdownClickForCodeGroup() {

    this.filteredCodeGroup = [...this.allCodeGroups];

    if (this.filteredCodeGroup.length == 0) {
      this.qualityCodeGroupFilter.codeGroupCode = null;
      this.qualityCodeGroupFilter.codeGroupId = null;
      this.qualityCodeGroupFilter.codeGroupText = null;
      this.searchTerms.next(this.qualityCodeGroupFilter);
    }

  }


  filterMatched(query): any[] {


    const filtered: any[] = [];
    if (this.allCodeGroups && this.allCodeGroups.length > 0) {
      for (let i = 0; i < this.allCodeGroups.length; i++) {
        const obj = this.allCodeGroups[i];
        if (obj['codeGroupCode'].toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(obj);
        }
      }
    }
    if (filtered.length == 0) {
      this.qualityCodeGroupFilter.codeGroupCode = query;
      this.searchTerms.next(this.qualityCodeGroupFilter);
    }
    return filtered;
  }


}
