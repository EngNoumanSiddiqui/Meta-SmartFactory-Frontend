import {Component, EventEmitter, Input, OnInit, Output, AfterViewInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
 
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { environment } from 'environments/environment';
import { ActivitiesService } from 'app/services/dto-services/quality-notification/item/activities/activities.service'
@Component({
  selector: 'edit-item-activity',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditActivity implements OnInit {

  itemActivityType = {
    itemActivityId: null,
    itemActivityName: null,
    shortText: null,
  };

  itemActivityNameList =[
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
    private _activitiesService: ActivitiesService) {
  }

  ngOnInit() {
    this._route.params.subscribe((params) => {
      this.id = params['id'];
      if (this.id) {
        this.itemActivityType.itemActivityId = this.id;
        this.initialize(this.id);
      }
    });
  }

  private initialize(id) {
    this.itemActivityType.itemActivityId = this.id;
    this.loaderService.showLoader();

    this._activitiesService.getUpdateDetail(id).subscribe(
      result => {
        this.loaderService.hideLoader();
        if ((result['itemActivityName'])) {
          this.itemActivityType.itemActivityName = result['itemActivityName'];
        }
        if ((result['shortText'])) {
          this.itemActivityType.shortText = result['shortText'];
        }
      },
      error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }
  reset() {
    this.itemActivityType.itemActivityName='',
    this.itemActivityType.shortText=''
  }

  save() {
    this.loaderService.showLoader();
    this._activitiesService.update(this.itemActivityType.itemActivityId, this.itemActivityType).subscribe(
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
