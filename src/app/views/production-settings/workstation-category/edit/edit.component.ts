import { OperationService } from './../../../../services/dto-services/operation/operation.service';
import { IndustryService } from './../../../../services/dto-services/industry.service';
import { WorkCenter } from './../../../../dto/equipment-task/equipment-task.model';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { PlantService } from 'app/services/dto-services/plant/plant.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';

import { environment } from '../../../../../environments/environment';
import { WorkstationService } from 'app/services/dto-services/workstation/workstation.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();
  payLoadObject = {
    'wsCatCode': null,
    'wsCatDescription': null,
    'wsCatId': 0,
    'wsCatName': null
  };
  data;
  @Input('data') set z(data) {
    this.data = data;
    if (this.data) {
      this.payLoadObject = {
        'wsCatId': this.data.wsCatId,
        'wsCatCode': this.data.wsCatCode,
        'wsCatDescription': this.data.wsCatDescription,
        'wsCatName': this.data.wsCatName
      };
    }
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
