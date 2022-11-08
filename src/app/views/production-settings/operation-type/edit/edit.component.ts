import { OperationService } from './../../../../services/dto-services/operation/operation.service';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { environment } from '../../../../../environments/environment';
import { UsersService } from 'app/services/users/users.service';

@Component({
  selector: 'operation-type-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class OperationTypeEditComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();
  
  workcenters: any[];
  selectedPlant: any;
  payLoadObject =
  {
    'operationTypeDescription': null,
    'operationTypeId': null,
    'operationTypeName': null,
    'plantId': null
  }
  id;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      setTimeout(() => {
        this.initialize(this.id);
      }, 1000);
    }
  };
  @Input('data') set zdata(data) {
    if (data) {
      this.payLoadObject = {
        'operationTypeDescription': data.operationTypeDescription,
        'operationTypeId': data.operationTypeId,
        'operationTypeName': data.operationTypeName,
        'plantId': data.plant ? data.plant.plantId : data.plantId
      };
    }
  };

  constructor(private operationTypeService: OperationService,
    private loaderService: LoaderService,
    private _userSvc: UsersService,
    private utilities: UtilitiesService, ) {
      this.selectedPlant = JSON.parse(this._userSvc.getPlant());
      this.payLoadObject.plantId = this.selectedPlant ? this.selectedPlant.plantId : null;
  }

  ngOnInit() {
  }
  setSelectedPlant(event) {
    this.payLoadObject.plantId = event.plantId;
  }
  initialize(id) {
    
    if (id) {
      const editResult = this.workcenters.filter(industry => industry.operationTypeId === id);
      
      this.payLoadObject.operationTypeName = editResult[0].operationTypeName;
      this.payLoadObject.operationTypeId = editResult[0].operationTypeId;
      this.payLoadObject.operationTypeDescription = editResult[0].operationTypeDescription;
      this.payLoadObject.plantId = editResult[0].plant.plantId;

    }
  }

  save() {
    this.loaderService.showLoader();
    this.operationTypeService.operationTypesave(this.payLoadObject)
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
      'operationTypeDescription': null,
      'operationTypeId': null,
      'operationTypeName': null,
      'plantId': null
    }
    

  }

}
