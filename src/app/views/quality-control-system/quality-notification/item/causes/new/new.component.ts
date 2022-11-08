import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'environments/environment';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { CausesService } from 'app/services/dto-services/quality-notification/item/causes/causes.service'

@Component({
  selector: 'new-causes',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewCauses {

  @Input() fromAutoComplete = false;
  @Output() saveAction = new EventEmitter<any>();

  itemCausesType = { 
    itemCauseId: null,
    causeName: null,
    shortText: null, 
  };
  causeNameList = [
    'Name 1',
    'Name 2',
    'Name 3',
  ];
  constructor(
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _causesService: CausesService
  ) {}
  
  reset() {
    this.itemCausesType.causeName= '',
    this.itemCausesType.shortText=''
  }

  save() {
    this.loaderService.showLoader();
    this._causesService.save(this.itemCausesType).subscribe(
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
