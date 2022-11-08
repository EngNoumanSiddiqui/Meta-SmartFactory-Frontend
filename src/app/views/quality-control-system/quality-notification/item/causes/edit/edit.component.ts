import {Component, EventEmitter, Input, OnInit, Output, AfterViewInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
 
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { environment } from 'environments/environment';
import { CausesService } from 'app/services/dto-services/quality-notification/item/causes/causes.service'
@Component({
  selector: 'edit-cause',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'] 
})
export class EditCauses implements OnInit {

  itemCausesType = {
    itemCauseId: null,
    causeName: null,
    shortText: null,
  };

  causeNameList =[
    'Name 1',
    'Name 2',
    'Name 3'
  ]

  id;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  myModal;

  params = {
    cityDisabled: true,
    dialog: {
      title: '',
      inputText: '',
      inputValue: ''
    },
    displayDialog: false,
  };

  @Output() saveAction = new EventEmitter<any>();
  lastAccountNos;

  constructor(
    private _route: ActivatedRoute,
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _causesService: CausesService) {
  }

  ngOnInit() {
    this._route.params.subscribe((params) => {
      this.id = params['id'];
      if (this.id) {
        this.itemCausesType.itemCauseId = this.id;
        this.initialize(this.id);
      }
    });
  }

  private initialize(id) {
    this.itemCausesType.itemCauseId = this.id;
    this.loaderService.showLoader();

    this._causesService.getUpdateDetail(id).subscribe(
      result => {
        this.loaderService.hideLoader();
        if ((result['causeName'])) {
          this.itemCausesType.causeName = result['causeName'];
        }
        if ((result['shortText'])) {
          this.itemCausesType.shortText = result['shortText'];
        }
      },
      error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }
  reset() {
    this.itemCausesType.causeName='',
    this.itemCausesType.shortText=''
  }

  save() {
    this.loaderService.showLoader();
    this._causesService.update(this.itemCausesType.itemCauseId, this.itemCausesType).subscribe(
      result => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.saveAction.emit('close');
        }, environment.DELAY);
      },
      error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }

  cancel() {
    this.saveAction.emit('close');
  }

}
