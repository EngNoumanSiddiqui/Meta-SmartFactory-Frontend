import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { environment } from 'environments/environment';
import { WorkcenterTypeService } from 'app/services/dto-services/workcenter-type/workcenter-type.service';
import { NullTemplateVisitor } from '@angular/compiler';
import { UsersService } from 'app/services/users/users.service';

@Component({
  selector: 'workcenter-type-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();
  selectedPlant:any;
  payLoadObject = {
    'workCenterTypeName': '',//NullTemplateVisitor,
    'plantId': null,

  }
  constructor( private wsTypsrv: WorkcenterTypeService,
    private loaderService: LoaderService,
    private _userSvc: UsersService,
    private utilities: UtilitiesService, ) {
      this.selectedPlant = JSON.parse(this._userSvc.getPlant());
      this.payLoadObject.plantId = this.selectedPlant ? this.selectedPlant.plantId : null;

  }


  ngOnInit() {

  }
  setSelectedPlant(event) {
    if (event) {
      this.payLoadObject.plantId = event.plantId;
    } else {
      this.payLoadObject.plantId = null;
    }
  }

  reset() {
    this.payLoadObject = {
      workCenterTypeName: null,
      'plantId':null,
    
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
