import { OperationService } from './../../../../services/dto-services/operation/operation.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';

import { environment } from 'environments/environment';

import { PlantService } from 'app/services/dto-services/plant/plant.service';
import { WorkstationTypeService } from 'app/services/dto-services/workstation-type/workstation-type.service';

@Component({
  selector: 'workstation-type-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();
  payLoadObject = {
    plantId: null,
    'workStationTypeName': null
  }

  @Input() plantId = null;
  constructor( private wsTypsrv: WorkstationTypeService,
    private loaderService: LoaderService,
    private utilities: UtilitiesService, ) {

  }


  ngOnInit() {

    this.payLoadObject.plantId = this.plantId;
  }


  reset() {
    this.payLoadObject = {
      plantId: null,
      'workStationTypeName': ''
    }
  }

  save() {
    this.loaderService.showLoader();
    this.wsTypsrv.save(this.payLoadObject)
      .then(result => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.reset();
          this.saveAction.emit(result);
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }

}
