import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';

import { environment } from 'environments/environment';
import { UsersService } from 'app/services/users/users.service';
import { ActTypeService } from 'app/services/dto-services/act-type/act-type.service';

@Component({
  selector: 'account-type-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class AccountTypeNewComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();
  selectedPlant:any;
  payLoadObject =
    {
      "accountPosition": "SUPPLIER",
      "actTypeId": null,
      "actTypeName": null,
      "actTypeNo": null,
      "plantId": null

    }

  constructor(
    private accountTypeService: ActTypeService,
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
      "accountPosition": "SUPPLIER",
      "actTypeId": null,
      "actTypeName": "string",
      "actTypeNo": "string",
      "plantId": this.selectedPlant?.plantId

    }
  }

  save() {
    this.loaderService.showLoader();
    this.accountTypeService.save(this.payLoadObject)
      .then(result => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          // this.reset();
          this.saveAction.emit(result);
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }

}
