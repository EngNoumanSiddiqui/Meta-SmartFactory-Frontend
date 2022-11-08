import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'environments/environment';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import {ActivitiesService} from 'app/services/dto-services/quality-notification/item/activities/activities.service';
@Component({
  selector: 'new-item-activity',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewActivity {

  @Input() fromAutoComplete = false;
  @Output() saveAction = new EventEmitter<any>();

  itemActivityType = { 
    itemActivityId: null,
    itemActivityName: null,
    shortText: null, 
  };
  itemActivityNameList = [
    'Name 1',
    'Name 2',
    'Name 3',
  ];
  constructor(
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _activitiesService: ActivitiesService
  ) {}
  
  reset() {
    this.itemActivityType.itemActivityName= '',
    this.itemActivityType.shortText=''
  }

  save() {
    this.loaderService.showLoader();
    this._activitiesService.save(this.itemActivityType).subscribe(
      result => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.saveAction.emit('close');
        }, environment.DELAY);
      },
      error => {
        this.utilities.showErrorToast(error);
        this.loaderService.hideLoader();
      }
    );
  }
}
 