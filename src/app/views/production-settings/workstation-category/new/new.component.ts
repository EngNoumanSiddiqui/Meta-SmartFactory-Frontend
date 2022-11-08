import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { environment } from 'environments/environment';
import { WorkstationService } from 'app/services/dto-services/workstation/workstation.service';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();
  payLoadObject = {
    'wsCatCode': null,
    'wsCatDescription': null,
    'wsCatId': 0,
    'wsCatName': null
  };

  constructor(private _workStationSvc: WorkstationService,
    private loaderService: LoaderService,
    private utilities: UtilitiesService, ) {
  }

  ngOnInit() {
  }
  
  save() {
    this.loaderService.showLoader();
    this._workStationSvc.saveWorkstationCategory(this.payLoadObject)
      .then(() => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('updated-success');
        setTimeout(() => {
          this.saveAction.emit('close');
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });

  }
  reset() {
    this.payLoadObject = {
      'wsCatCode': null,
      'wsCatDescription': null,
      'wsCatId': 0,
      'wsCatName': null
    };
  }

}
