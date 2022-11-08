import { OperationService } from './../../../../services/dto-services/operation/operation.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';

import { environment } from 'environments/environment';
import { UsersService } from 'app/services/users/users.service';

@Component({
  selector: 'operation-type-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class OperationTypeNewComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();
  selectedPlant:any;
  payLoadObject =
    {
      "operationTypeDescription": null,
      "plantId":null,
      "operationTypeId": null,
      "operationTypeName": null,

    }
    
  id;
  params = {
    dialog: { title: '', inputValue: '' }
  };

  constructor(private _router: Router,
    private operationTypeService: OperationService,
    private loaderService: LoaderService,
    private _userSvc: UsersService,
    private utilities: UtilitiesService, ) {
      this.selectedPlant = JSON.parse(this._userSvc.getPlant());
      this.payLoadObject.plantId = this.selectedPlant ? this.selectedPlant.plantId : null;

  }


  ngOnInit() {

  }
  setSelectedPlant(event){
    this.payLoadObject.plantId=event.plantId;
  }

  reset() {
    this.payLoadObject =
      {
        "operationTypeDescription": null,
        "operationTypeId": null,
        "plantId":null,
        "operationTypeName": null,
        
      }
  }

  save() {
    this.loaderService.showLoader();
    this.operationTypeService.operationTypesave(this.payLoadObject)
      .then(result => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          // this.reset();
          this.saveAction.emit('saved');
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }

}
